import React, { useState } from 'react';
import { Satellite, Map as MapIcon, TrendingUp, Loader2 } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { toast } from 'sonner';

const PlanetMonitoring = () => {
  const [coordinates, setCoordinates] = useState({ lat: '', lng: '' });
  const [loading, setLoading] = useState(false);
  const [vigorMapUrl, setVigorMapUrl] = useState(null);

  const PLANET_API_KEY = process.env.REACT_APP_PLANET_API_KEY || '';

  const handleLoadMap = async () => {
    if (!coordinates.lat || !coordinates.lng) {
      toast.error('Por favor ingresa las coordenadas');
      return;
    }

    setLoading(true);
    
    // Simulate API call - In production, this would fetch actual Planet data
    setTimeout(() => {
      // Demo: Show a placeholder map with coordinates
      setVigorMapUrl(`https://api.mapbox.com/styles/v1/mapbox/satellite-v9/static/${coordinates.lng},${coordinates.lat},14,0/800x600@2x?access_token=pk.eyJ1IjoiZXhhbXBsZSIsImEiOiJjazZqYW5xeTIwMGFrM2xtZ3cwMjF4eTZpIn0.example`);
      setLoading(false);
      toast.success('Mapa de vigor cargado exitosamente');
    }, 2000);
  };

  return (
    <section className="py-20 bg-gradient-to-br from-gray-900 via-green-900 to-gray-900 text-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: 'url("https://images.unsplash.com/photo-1720183093696-f2a999e721a2")',
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-orange-500/20 border border-orange-500/40 rounded-full px-4 py-2 mb-6 backdrop-blur-sm">
              <Satellite className="w-5 h-5 text-orange-400" />
              <span className="text-orange-100 text-sm font-medium">Tecnología Satelital</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Monitoreo con Planet
            </h2>
            <p className="text-xl text-gray-200 max-w-3xl mx-auto">
              Utilizamos imágenes satelitales de alta resolución para calcular el vigor de tu cultivo y detectar problemas antes de que sean visibles
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left - Map Viewer */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
              <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <MapIcon className="w-6 h-6 text-orange-400" />
                Mapa de Vigor
              </h3>

              {/* Coordinates Input */}
              <div className="space-y-4 mb-6">
                <div>
                  <Label htmlFor="lat" className="text-white mb-2">Latitud</Label>
                  <Input
                    id="lat"
                    type="number"
                    step="0.000001"
                    value={coordinates.lat}
                    onChange={(e) => setCoordinates(prev => ({ ...prev, lat: e.target.value }))}
                    placeholder="4.5709"
                    className="bg-white/20 border-white/30 text-white placeholder:text-gray-400"
                  />
                </div>
                <div>
                  <Label htmlFor="lng" className="text-white mb-2">Longitud</Label>
                  <Input
                    id="lng"
                    type="number"
                    step="0.000001"
                    value={coordinates.lng}
                    onChange={(e) => setCoordinates(prev => ({ ...prev, lng: e.target.value }))}
                    placeholder="-74.2973"
                    className="bg-white/20 border-white/30 text-white placeholder:text-gray-400"
                  />
                </div>
                <Button
                  onClick={handleLoadMap}
                  disabled={loading}
                  className="w-full bg-orange-600 hover:bg-orange-700 text-white"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Cargando...
                    </>
                  ) : (
                    <>
                      <Satellite className="w-4 h-4 mr-2" />
                      Cargar Mapa de Vigor
                    </>
                  )}
                </Button>
              </div>

              {/* Map Display */}
              {vigorMapUrl ? (
                <div className="rounded-xl overflow-hidden border-2 border-orange-400">
                  <div className="bg-gradient-to-br from-green-600 to-green-400 p-4 text-center">
                    <p className="text-sm font-semibold">Mapa de Vigor - NDVI</p>
                  </div>
                  <div className="bg-gray-800 p-8 text-center">
                    <MapIcon className="w-16 h-16 mx-auto mb-4 text-orange-400" />
                    <p className="text-sm text-gray-300">Mapa cargado para:</p>
                    <p className="font-mono text-xs text-gray-400 mt-2">
                      Lat: {coordinates.lat}, Lng: {coordinates.lng}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="bg-gray-800/50 rounded-xl p-12 text-center border border-dashed border-gray-600">
                  <MapIcon className="w-16 h-16 mx-auto mb-4 text-gray-500" />
                  <p className="text-gray-400">Ingresa las coordenadas para ver el mapa de vigor</p>
                </div>
              )}
            </div>

            {/* Right - Benefits */}
            <div>
              <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <TrendingUp className="w-6 h-6 text-orange-400" />
                Beneficios del Monitoreo Satelital
              </h3>

              <div className="space-y-4">
                <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
                  <div className="flex items-start gap-4">
                    <div className="w-2 h-2 bg-orange-400 rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <h4 className="font-bold mb-2">Detección Temprana</h4>
                      <p className="text-gray-300 text-sm">Identifica problemas de nutrición, estrés hídrico o plagas antes de que sean visibles a simple vista</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
                  <div className="flex items-start gap-4">
                    <div className="w-2 h-2 bg-orange-400 rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <h4 className="font-bold mb-2">Mapeo de Variabilidad</h4>
                      <p className="text-gray-300 text-sm">Visualiza zonas de alto y bajo vigor para aplicar insumos de manera precisa</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
                  <div className="flex items-start gap-4">
                    <div className="w-2 h-2 bg-orange-400 rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <h4 className="font-bold mb-2">Histórico de Cultivo</h4>
                      <p className="text-gray-300 text-sm">Analiza la evolución del cultivo a lo largo del tiempo y toma decisiones basadas en datos</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
                  <div className="flex items-start gap-4">
                    <div className="w-2 h-2 bg-orange-400 rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <h4 className="font-bold mb-2">Optimización de Recursos</h4>
                      <p className="text-gray-300 text-sm">Reduce costos aplicando solo donde y cuando es necesario</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* CTA */}
              <div className="mt-8 bg-gradient-to-r from-orange-600 to-orange-500 rounded-xl p-6">
                <p className="text-sm font-semibold mb-3">¿Quieres monitorear tu cultivo?</p>
                <Button
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
