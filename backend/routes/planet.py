from fastapi import APIRouter, HTTPException, Query
from fastapi.responses import Response
import httpx
import os
import logging
import math

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/planet", tags=["planet"])

PLANET_API_KEY = os.environ.get('PLANET_API_KEY', '')
PLANET_DATA_URL = "https://api.planet.com/data/v1"
PLANET_TILES_URL = "https://tiles.planet.com/data/v1"


def _auth_headers():
    return {"Authorization": f"api-key {PLANET_API_KEY}"}


def _basic_auth():
    return (PLANET_API_KEY, "")


@router.get("/search")
async def search_scenes(
    lat: float = Query(..., ge=-90, le=90),
    lng: float = Query(..., ge=-180, le=180),
    max_cloud: float = Query(0.3, ge=0, le=1),
    limit: int = Query(10, ge=1, le=25),
):
    """Search Planet satellite scenes near given coordinates."""
    if not PLANET_API_KEY:
        raise HTTPException(status_code=503, detail="Planet API key not configured")

    search_body = {
        "filter": {
            "type": "AndFilter",
            "config": [
                {
                    "type": "GeometryFilter",
                    "field_name": "geometry",
                    "config": {
                        "type": "Point",
                        "coordinates": [lng, lat],
                    },
                },
                {
                    "type": "RangeFilter",
                    "field_name": "cloud_cover",
                    "config": {"lte": max_cloud},
                },
            ],
        },
        "item_types": ["PSScene"],
    }

    async with httpx.AsyncClient(timeout=30) as client:
        try:
            resp = await client.post(
                f"{PLANET_DATA_URL}/quick-search",
                json=search_body,
                headers={**_auth_headers(), "Content-Type": "application/json"},
            )
            if resp.status_code == 401:
                raise HTTPException(status_code=401, detail="Planet API key invalid")
            if resp.status_code != 200:
                logger.error(f"Planet search error: {resp.status_code}")
                raise HTTPException(status_code=502, detail="Error from Planet API")

            data = resp.json()
            features = data.get("features", [])[:limit]

            scenes = []
            for f in features:
                props = f.get("properties", {})
                geom = f.get("geometry", {})
                scenes.append({
                    "id": f.get("id"),
                    "acquired": props.get("acquired"),
                    "cloud_cover": round(props.get("cloud_cover", 0) * 100, 1),
                    "pixel_resolution": props.get("pixel_resolution"),
                    "satellite_id": props.get("satellite_id"),
                    "instrument": props.get("instrument"),
                    "geometry": geom,
                    "thumbnail_url": f"/api/planet/thumbnail/PSScene/{f.get('id')}",
                })

            return {"scenes": scenes, "total": len(scenes), "coordinates": {"lat": lat, "lng": lng}}

        except httpx.RequestError as e:
            logger.error(f"Planet search request failed: {e}")
            raise HTTPException(status_code=502, detail="Cannot reach Planet API")


@router.get("/thumbnail/{item_type}/{item_id}")
async def proxy_thumbnail(item_type: str, item_id: str):
    """Proxy Planet scene thumbnails to hide API key."""
    if not PLANET_API_KEY:
        raise HTTPException(status_code=503, detail="Planet API key not configured")

    thumb_url = f"{PLANET_TILES_URL}/item-types/{item_type}/items/{item_id}/thumb"

    async with httpx.AsyncClient(timeout=15) as client:
        try:
            resp = await client.get(thumb_url, auth=_basic_auth())
            if resp.status_code == 200:
                return Response(
                    content=resp.content,
                    media_type="image/png",
                    headers={"Cache-Control": "public, max-age=86400"},
                )
            raise HTTPException(status_code=resp.status_code, detail="Thumbnail not available")
        except httpx.RequestError as e:
            logger.error(f"Planet thumbnail failed: {e}")
            raise HTTPException(status_code=502, detail="Cannot fetch thumbnail")


@router.get("/health")
async def planet_health():
    """Check Planet API connectivity."""
    if not PLANET_API_KEY:
        return {"status": "not_configured", "message": "Planet API key missing"}

    async with httpx.AsyncClient(timeout=10) as client:
        try:
            resp = await client.get(
                f"{PLANET_DATA_URL}/item-types",
                headers=_auth_headers(),
            )
            if resp.status_code == 200:
                return {"status": "connected", "message": "Planet API accessible"}
            return {"status": "error", "message": f"HTTP {resp.status_code}"}
        except httpx.RequestError:
            return {"status": "unreachable", "message": "Cannot reach Planet API"}
