import React, { useState } from 'react';
import { Camera, Upload, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { toast } from 'sonner';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const RoboflowAnalyzer = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState(null);
  const [confidence, setConfidence] = useState(0.5);

  const handleFileSelect = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Por favor selecciona un archivo de imagen válido');
      return;
    }

    // Validate file size (25MB limit)
    if (file.size > 25 * 1024 * 1024) {
      toast.error('La imagen es muy grande (máximo 25MB)');
      return;
    }

    setSelectedFile(file);
    setResults(null);

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview(e.target.result);
    };
    reader.readAsDataURL(file);
  };

  const handleAnalyze = async () => {
    if (!selectedFile) {
      toast.error('Por favor selecciona una imagen primero');
      return;
    }

    setIsAnalyzing(true);
    setResults(null);

    try {
      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('confidence', confidence.toString());

      const response = await axios.post(
        `${BACKEND_URL}/api/roboflow/analyze`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      if (response.data.success) {
        setResults(response.data);
        if (response.data.total_detections === 0) {
          toast.success('No se detectaron problemas. ¡Tu cultivo se ve saludable!');
        } else {
          toast.success(`Análisis completado: ${response.data.total_detections} detección(es)`);
        }
      } else {
        toast.error('Error al analizar la imagen');
      }
    } catch (error) {
      console.error('Error analyzing image:', error);
      if (error.response?.status === 413) {
        toast.error('La imagen es muy grande');
      } else if (error.response?.status === 400) {
        toast.error('Archivo de imagen inválido');
      } else {
        toast.error('Error al analizar la imagen. Por favor intenta nuevamente.');
      }
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getConfidenceBadgeColor = (conf) => {
    if (conf >= 80) return 'bg-green-600 text-white';
    if (conf >= 60) return 'bg-yellow-600 text-white';
    return 'bg-red-600 text-white';
  };

  return (
    <section className="py-20 bg-gradient-to-br from-green-50 via-white to-orange-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-green-100 rounded-full px-4 py-2 mb-6">
              <Camera className="w-5 h-5 text-green-700" />
              <span className="text-green-900 text-sm font-medium">Análisis con IA</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-green-900 mb-4">
              Diagnóstico Inteligente de Cultivos
            </h2>
            <p className="text-xl text-gray-600">
              Sube una foto de tu cultivo y obtén un diagnóstico inmediato con inteligencia artificial
            </p>
          </div>

          {/* Upload Area */}
          <div className="bg-white rounded-3xl p-8 shadow-xl border-2 border-gray-100">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left - Upload/Preview */}
              <div className="space-y-4">
                {preview ? (
                  <div className="relative">
                    <img
                      src={preview}
                      alt="Vista previa"
                      className="w-full h-80 object-cover rounded-2xl border-2 border-green-200"
                    />
                    <Button
                      onClick={() => {
                        setSelectedFile(null);
                        setPreview(null);
                        setResults(null);
                      }}
                      variant="secondary"
                      size="sm"
                      className="absolute top-4 right-4"
                    >
                      Cambiar Imagen
                    </Button>
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-green-300 rounded-2xl p-12 text-center bg-gradient-to-br from-green-50 to-orange-50 hover:border-orange-400 transition-colors duration-300">
                    <Upload className="w-16 h-16 mx-auto mb-4 text-green-600" />
                    <p className="text-gray-600 mb-4">
                      Arrastra y suelta tu imagen aquí
                    </p>
                    <Label htmlFor="image-upload" className="cursor-pointer">
                      <span className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg inline-block font-semibold transition-colors duration-300">
                        Seleccionar Imagen
                      </span>
                    </Label>
                    <Input
                      id="image-upload"
                      type="file"
                      accept="image/*"
                      onChange={handleFileSelect}
                      className="hidden"
                    />
                  </div>
                )}

                {selectedFile && (
                  <div className="space-y-4">
                    <div>
                      <Label className="text-sm font-medium text-gray-700">
                        Umbral de Confianza: {Math.round(confidence * 100)}%
                      </Label>
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.1"
                        value={confidence}
                        onChange={(e) => setConfidence(parseFloat(e.target.value))}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-green-600 mt-2"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Ajusta el nivel de sensibilidad del análisis
                      </p>
                    </div>

                    <Button
                      onClick={handleAnalyze}
                      disabled={isAnalyzing}
                      className="w-full bg-orange-600 hover:bg-orange-700 text-white py-6 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                      {isAnalyzing ? (
                        <>
                          <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                          Analizando...
                        </>
                      ) : (
                        <>
                          <Camera className="w-5 h-5 mr-2" />
                          Analizar Cultivo
                        </>
                      )}
                    </Button>
                  </div>
                )}
              </div>

              {/* Right - Results */}
              <div>
                {isAnalyzing ? (
                  <div className="flex flex-col items-center justify-center h-full space-y-4">
                    <Loader2 className="w-16 h-16 text-green-600 animate-spin" />
                    <p className="text-gray-600 text-center">
                      Analizando tu cultivo con inteligencia artificial...
                    </p>
                  </div>
                ) : results && results.predictions ? (
                  <div className="space-y-4">
                    <h3 className="text-2xl font-bold text-green-900 flex items-center gap-2">
                      <CheckCircle className="w-6 h-6 text-green-600" />
                      Resultados del Análisis
                    </h3>

                    {results.predictions.length === 0 ? (
                      <div className="bg-green-50 border-2 border-green-200 rounded-xl p-6 text-center">
                        <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-3" />
                        <p className="text-green-900 font-semibold text-lg">
                          ¡Excelente!
                        </p>
                        <p className="text-green-700">
                          No se detectaron problemas. Tu cultivo se ve saludable.
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {results.predictions.map((pred, idx) => (
                          <div
                            key={idx}
                            className="border-2 border-gray-200 rounded-xl p-4 hover:border-orange-300 transition-colors duration-300"
                          >
                            <div className="flex items-center justify-between mb-3">
                              <Badge className={getConfidenceBadgeColor(pred.confidence)}>
                                {pred.class}
                              </Badge>
                              <span className="text-sm font-semibold text-gray-700">
                                {pred.confidence.toFixed(1)}% confianza
                              </span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-3 mb-3">
                              <div
                                className={`h-3 rounded-full ${
                                  pred.confidence >= 80 ? 'bg-green-600' :
                                  pred.confidence >= 60 ? 'bg-yellow-600' :
                                  'bg-red-600'
                                }`}
                                style={{ width: `${pred.confidence}%` }}
                              />
                            </div>
                            <p className="text-xs text-gray-500">
                              Ubicación: ({pred.x?.toFixed(0)}, {pred.y?.toFixed(0)}) - Tamaño: {pred.width?.toFixed(0)}x{pred.height?.toFixed(0)}px
                            </p>
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4 text-sm">
                      <p className="font-semibold text-blue-900 mb-1">Resumen del Análisis</p>
                      <p className="text-blue-800">Total de detecciones: {results.total_detections}</p>
                      <p className="text-blue-800">Modelo: {results.model_id}</p>
                      <p className="text-blue-700 text-xs mt-2">
                        Analizado: {new Date(results.analysis_timestamp).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full space-y-4 text-center">
                    <AlertCircle className="w-16 h-16 text-gray-400" />
                    <p className="text-gray-500">
                      Selecciona una imagen y haz clic en "Analizar Cultivo" para obtener resultados
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RoboflowAnalyzer;
