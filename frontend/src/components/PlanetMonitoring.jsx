import React, { useState } from 'react';
import { Satellite, TrendingUp, Loader2, Layers, Search, Cloud, Calendar, Maximize2 } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { toast } from 'sonner';
import { MapContainer, TileLayer, Polygon, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const MapUpdater = ({ center, zoom }) => {
  const map = useMap();
  React.useEffect(() => {
    if (center) map.setView(center, zoom);
  }, [center, zoom, map]);
  return null;
};

const PlanetMonitoring = () => {
  const [coordinates, setCoordinates] = useState({ lat: '4.5709', lng: '-74.2973' });
  const [loading, setLoading] = useState(false);
  const [scenes, setScenes] = useState([]);
  const [selectedScene, setSelectedScene] = useState(null);
  const [mapCenter, setMapCenter] = useState([4.5709, -74.2973]);
  const [maxCloud, setMaxCloud] = useState(30);

  const handleSearch = async () => {
    const lat = parseFloat(coordinates.lat);
    const lng = parseFloat(coordinates.lng);
    if (isNaN(lat) || isNaN(lng) || lat < -90 || lat > 90 || lng < -180 || lng > 180) {
      toast.error('Coordenadas inválidas');
      return;
    }

    setLoading(true);
    setScenes([]);
    setSelectedScene(null);

    try {
      const resp = await axios.get(`${BACKEND_URL}/api/planet/search`, {
        params: { lat, lng, max_cloud: maxCloud / 100, limit: 8 }
      });
      const data = resp.data;
      setScenes(data.scenes || []);
      setMapCenter([lat, lng]);

      if (data.scenes.length === 0) {
        toast.info('No se encontraron escenas con esos filtros. Intenta aumentar la cobertura de nubes.');
      } else {
        toast.success(`${data.scenes.length} escenas satelitales encontradas`);
        setSelectedScene(data.scenes[0]);
      }
    } catch (err) {
      console.error('Planet search error:', err);
      toast.error(err.response?.data?.detail || 'Error al buscar imágenes satelitales');
    } finally {
      setLoading(false);
    }
  };

  const getPolygonCoords = (geometry) => {
    if (!geometry || geometry.type !== 'Polygon' || !geometry.coordinates) return null;
    return geometry.coordinates[0].map(([lng, lat]) => [lat, lng]);
  };

  const formatDate = (isoDate) => {
    if (!isoDate) return '—';
    return new Date(isoDate).toLocaleDateString('es-CO', {
      year: 'numeric', month: 'short', day: 'numeric'
    });
  };

  return (
    <section id="planet-monitoring" className="py-20 bg-gradient-to-br from-gray-900 via-green-900 to-gray-900 text-white relative overflow-hidden" data-testid="planet-monitoring-section">
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 20px, rgba(255,255,255,.03) 20px, rgba(255,255,255,.03) 40px)'
        }}></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-orange-500/20 border border-orange-500/40 rounded-full px-4 py-2 mb-6 backdrop-blur-sm">
              <Satellite className="w-5 h-5 text-orange-400" />
              <span className="text-orange-100 text-sm font-medium">Tecnología Satelital Planet</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Monitoreo Satelital en Vivo</h2>
            <p className="text-xl text-gray-200 max-w-3xl mx-auto">
              Búsqueda de imágenes PlanetScope de alta resolución (3m/px) para tu zona de cultivo
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left - Search & Map */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
              <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <Search className="w-6 h-6 text-orange-400" />
                Buscar Imágenes Satelitales
              </h3>

              <div className="space-y-4 mb-6">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="planet-lat" className="text-white mb-1 text-sm">Latitud</Label>
                    <Input
                      id="planet-lat"
                      data-testid="planet-lat-input"
                      type="number"
                      step="0.0001"
                      value={coordinates.lat}
                      onChange={(e) => setCoordinates(prev => ({ ...prev, lat: e.target.value }))}
                      placeholder="4.5709"
                      className="bg-white/20 border-white/30 text-white placeholder:text-gray-400"
                    />
                  </div>
                  <div>
                    <Label htmlFor="planet-lng" className="text-white mb-1 text-sm">Longitud</Label>
                    <Input
                      id="planet-lng"
                      data-testid="planet-lng-input"
                      type="number"
                      step="0.0001"
                      value={coordinates.lng}
                      onChange={(e) => setCoordinates(prev => ({ ...prev, lng: e.target.value }))}
                      placeholder="-74.2973"
                      className="bg-white/20 border-white/30 text-white placeholder:text-gray-400"
                    />
                  </div>
                </div>
                <div>
                  <Label className="text-white mb-1 text-sm flex items-center gap-1">
                    <Cloud className="w-3 h-3" /> Nubosidad máx: {maxCloud}%
                  </Label>
                  <input
                    type="range" min="5" max="80" step="5" value={maxCloud}
                    onChange={(e) => setMaxCloud(parseInt(e.target.value))}
                    className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer accent-orange-500"
                    data-testid="planet-cloud-slider"
                  />
                </div>
                <Button
                  data-testid="planet-search-btn"
                  onClick={handleSearch}
                  disabled={loading}
                  className="w-full bg-orange-600 hover:bg-orange-700 text-white"
                >
                  {loading ? (
                    <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Buscando...</>
                  ) : (
                    <><Satellite className="w-4 h-4 mr-2" />Buscar Escenas Planet</>
                  )}
                </Button>
              </div>

              {/* Map */}
              <div className="rounded-xl overflow-hidden border-2 border-white/20" style={{ height: '300px' }}>
                <MapContainer center={mapCenter} zoom={12} style={{ height: '100%', width: '100%' }} scrollWheelZoom={true}>
                  <MapUpdater center={mapCenter} zoom={12} />
                  <TileLayer
                    url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                    attribution="Esri Satellite"
                  />
                  {selectedScene && getPolygonCoords(selectedScene.geometry) && (
                    <Polygon
                      positions={getPolygonCoords(selectedScene.geometry)}
                      pathOptions={{ color: '#d97706', weight: 2, fillColor: '#d97706', fillOpacity: 0.15 }}
                    />
                  )}
                </MapContainer>
              </div>
            </div>

            {/* Right - Results */}
            <div>
              <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <Layers className="w-6 h-6 text-orange-400" />
                Escenas Disponibles
              </h3>

              {scenes.length > 0 ? (
                <div className="space-y-3 max-h-[550px] overflow-y-auto pr-1">
                  {scenes.map((scene) => (
                    <div
                      key={scene.id}
                      data-testid={`planet-scene-${scene.id}`}
                      onClick={() => setSelectedScene(scene)}
                      className={`rounded-xl border transition-all duration-200 cursor-pointer ${
                        selectedScene?.id === scene.id
                          ? 'border-orange-400 bg-orange-500/20'
                          : 'border-white/20 bg-white/5 hover:bg-white/10'
                      }`}
                    >
                      <div className="flex gap-3 p-3">
                        <img
                          src={`${BACKEND_URL}${scene.thumbnail_url}`}
                          alt={`Escena ${scene.id}`}
                          className="w-24 h-20 rounded-lg object-cover bg-gray-800 flex-shrink-0"
                          onError={(e) => { e.target.style.display = 'none'; }}
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-mono text-orange-300 truncate">{scene.id}</p>
                          <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1 text-xs text-gray-300">
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />{formatDate(scene.acquired)}
                            </span>
                            <span className="flex items-center gap-1">
                              <Cloud className="w-3 h-3" />{scene.cloud_cover}%
                            </span>
                            <span className="flex items-center gap-1">
                              <Maximize2 className="w-3 h-3" />{scene.pixel_resolution}m/px
                            </span>
                          </div>
                          <p className="text-xs text-gray-400 mt-1">Sat: {scene.satellite_id}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="bg-white/5 border border-dashed border-white/20 rounded-xl p-8 text-center">
                    <Satellite className="w-12 h-12 mx-auto mb-3 text-gray-500" />
                    <p className="text-gray-400 text-sm">
                      Ingresa coordenadas y busca para ver las escenas satelitales disponibles de Planet Labs
                    </p>
                  </div>

                  {/* Benefits */}
                  <div className="space-y-3 mt-4">
                    {[
                      { title: "Detección Temprana", desc: "Identifica estrés hídrico o plagas antes de ser visibles" },
                      { title: "Alta Resolución", desc: "Imágenes PlanetScope de 3 metros por píxel" },
                      { title: "Cobertura Diaria", desc: "Planet captura imágenes de toda la Tierra cada día" },
                      { title: "Optimización de Recursos", desc: "Aplica insumos solo donde y cuando es necesario" },
                    ].map((item, i) => (
                      <div key={i} className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20">
                        <div className="flex items-start gap-3">
                          <div className="w-2 h-2 bg-orange-400 rounded-full mt-1.5 flex-shrink-0"></div>
                          <div>
                            <h4 className="font-bold text-sm mb-1">{item.title}</h4>
                            <p className="text-gray-300 text-xs">{item.desc}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="mt-6 bg-gradient-to-r from-orange-600 to-orange-500 rounded-xl p-6">
                <p className="text-sm font-semibold mb-3">¿Necesitas análisis profesional de tu cultivo?</p>
                <Button
                  data-testid="planet-cta-btn"
                  onClick={() => document.getElementById('contacto')?.scrollIntoView({ behavior: 'smooth' })}
                  variant="outline"
                  className="border-2 border-white text-white hover:bg-white hover:text-orange-600 w-full"
                >
                  Solicitar Diagnóstico
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PlanetMonitoring;
