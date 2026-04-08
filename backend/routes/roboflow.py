from fastapi import APIRouter, File, UploadFile, HTTPException
import requests
import base64
import os
import logging
from datetime import datetime

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/roboflow", tags=["roboflow"])

# Roboflow configuration from environment
ROBOFLOW_API_KEY = os.environ.get('ROBOFLOW_API_KEY', '')
ROBOFLOW_MODEL_ID = os.environ.get('ROBOFLOW_MODEL_ID', 'origenes/4')
ROBOFLOW_API_URL = os.environ.get('ROBOFLOW_API_URL', 'https://detect.roboflow.com')


@router.post("/analyze")
async def analyze_crop_image(
    file: UploadFile = File(...),
    confidence: float = 0.5
):
    """
    Analyze an uploaded crop image using Roboflow computer vision model.
    Returns detected crop diseases/conditions with confidence scores.
    """
    try:
        # Validate file type
        if not file.content_type or not file.content_type.startswith('image/'):
            raise HTTPException(
                status_code=400,
                detail="El archivo debe ser una imagen"
            )
        
        # Read file content
        image_data = await file.read()
        
        # Validate file size (25MB limit)
        if len(image_data) > 25 * 1024 * 1024:
            raise HTTPException(
                status_code=413,
                detail="La imagen es muy grande (máximo 25MB)"
            )
        
        # Convert image to base64
        image_base64 = base64.b64encode(image_data).decode('utf-8')
        
        # Call Roboflow API
        roboflow_url = f"{ROBOFLOW_API_URL}/{ROBOFLOW_MODEL_ID}"
        
        response = requests.post(
            roboflow_url,
            params={
                "api_key": ROBOFLOW_API_KEY,
                "confidence": confidence * 100,  # Roboflow expects 0-100
            },
            data=image_base64,
            headers={
                "Content-Type": "application/x-www-form-urlencoded"
            },
            timeout=30
        )
        
        if response.status_code != 200:
            logger.error(f"Roboflow API error: {response.status_code} - {response.text}")
            raise HTTPException(
                status_code=500,
                detail="Error al comunicarse con el servicio de análisis"
            )
        
        result = response.json()
        
        # Process predictions
        predictions = []
        if 'predictions' in result:
            for pred in result['predictions']:
                predictions.append({
                    'class': pred.get('class', 'Unknown'),
                    'confidence': round(pred.get('confidence', 0), 2),
                    'x': pred.get('x', 0),
                    'y': pred.get('y', 0),
                    'width': pred.get('width', 0),
                    'height': pred.get('height', 0)
                })
        
        logger.info(f"Roboflow analysis completed: {len(predictions)} detections")
        
        return {
            'success': True,
            'predictions': predictions,
            'total_detections': len(predictions),
            'model_id': ROBOFLOW_MODEL_ID,
            'analysis_timestamp': datetime.utcnow().isoformat(),
            'image_info': {
                'width': result.get('image', {}).get('width'),
                'height': result.get('image', {}).get('height')
            }
        }
    
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error during image analysis: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail="Error interno al procesar la imagen"
        )
