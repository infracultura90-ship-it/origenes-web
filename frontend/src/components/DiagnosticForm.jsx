import React, { useState } from 'react';
import { MapPin, Send, Loader2, CheckCircle } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog';
import { toast } from 'sonner';
import axios from 'axios';
import { culturesData } from '../data/mock';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const DiagnosticForm = ({ trigger }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    culture: '',
    hectares: '',
    latitude: '',
    longitude: '',
    problem_description: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.latitude || !formData.longitude) {
      toast.error('Por favor ingresa las coordenadas de tu cultivo');
      return;
    }

    setIsSubmitting(true);

    try {
      // Format data for backend (using contact endpoint with coordinates in message)
      const diagnosticData = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        department: 'Diagnóstico',
        culture: formData.culture,
        hectares: formData.hectares ? parseInt(formData.hectares) : null,
        message: `SOLICITUD DE DIAGNÓSTICO\n\nCoordenadas:\nLatitud: ${formData.latitude}\nLongitud: ${formData.longitude}\n\nDescripción del Problema:\n${formData.problem_description || 'No especificado'}`
      };

      const response = await axios.post(`${BACKEND_URL}/api/contact/`, diagnosticData);

      if (response.status === 201) {
        toast.success('¡Solicitud de diagnóstico enviada exitosamente! Te contactaremos pronto.', {
          duration: 5000,
        });
        
        // Reset form and close dialog
        setFormData({
          name: '',
          email: '',
          phone: '',
          culture: '',
          hectares: '',
          latitude: '',
          longitude: '',
          problem_description: ''
        });
        setIsOpen(false);
      }
    } catch (error) {
      console.error('Error submitting diagnostic request:', error);
      toast.error('Error al enviar la solicitud. Por favor intente nuevamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button
            size="lg"
            className="bg-orange-600 hover:bg-orange-700 text-white shadow-lg hover:shadow-xl"
          >
            <MapPin className="w-5 h-5 mr-2" />
            Solicitar Diagnóstico
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-green-900 flex items-center gap-2">
            <MapPin className="w-6 h-6 text-orange-600" />
            Solicitud de Diagnóstico
          </DialogTitle>
          <DialogDescription>
            Envíanos las coordenadas de tu cultivo y realizaremos un diagnóstico satelital completo
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          {/* Personal Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="diag-name">Nombre Completo *</Label>
              <Input
                id="diag-name"
                type="text"
                required
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                placeholder="Juan Pérez"
              />
            </div>
            <div>
              <Label htmlFor="diag-phone">Teléfono *</Label>
              <Input
                id="diag-phone"
                type="tel"
                required
                value={formData.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
                placeholder="300 558 2757"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="diag-email">Email *</Label>
            <Input
              id="diag-email"
              type="email"
              required
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
              placeholder="juan@ejemplo.com"
            />
          </div>

          {/* Crop Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="diag-culture">Cultivo *</Label>
              <Select 
                value={formData.culture} 
                onValueChange={(value) => handleChange('culture', value)}
                required
              >
                <SelectTrigger id="diag-culture">
                  <SelectValue placeholder="Seleccionar" />
                </SelectTrigger>
                <SelectContent>
                  {culturesData.map((culture) => (
                    <SelectItem key={culture.name} value={culture.name}>{culture.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="diag-hectares">Hectáreas</Label>
              <Input
                id="diag-hectares"
                type="number"
                value={formData.hectares}
                onChange={(e) => handleChange('hectares', e.target.value)}
                placeholder="50"
              />
            </div>
          </div>

          {/* Coordinates */}
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
            <h4 className="font-semibold text-green-900 mb-3 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-orange-600" />
              Coordenadas del Cultivo *
            </h4>
            <p className="text-sm text-gray-600 mb-3">
              Puedes obtener las coordenadas desde Google Maps: clic derecho sobre el lote → copiar coordenadas
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="diag-lat">Latitud *</Label>
                <Input
                  id="diag-lat"
                  type="number"
                  step="0.000001"
                  required
                  value={formData.latitude}
                  onChange={(e) => handleChange('latitude', e.target.value)}
                  placeholder="4.5709"
                />
              </div>
              <div>
                <Label htmlFor="diag-lng">Longitud *</Label>
                <Input
                  id="diag-lng"
                  type="number"
                  step="0.000001"
                  required
                  value={formData.longitude}
                  onChange={(e) => handleChange('longitude', e.target.value)}
                  placeholder="-74.2973"
                />
              </div>
            </div>
          </div>

          {/* Problem Description */}
          <div>
            <Label htmlFor="diag-problem">Descripción del Problema (opcional)</Label>
            <Textarea
              id="diag-problem"
              value={formData.problem_description}
              onChange={(e) => handleChange('problem_description', e.target.value)}
              placeholder="Describe cualquier problema que hayas observado en tu cultivo..."
              className="min-h-[100px]"
            />
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-orange-600 hover:bg-orange-700 text-white py-6 text-lg"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Enviando...
              </>
            ) : (
              <>
                <Send className="w-5 h-5 mr-2" />
                Enviar Solicitud
              </>
            )}
          </Button>

          {/* Info Footer */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-sm">
            <div className="flex items-start gap-2">
              <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <p className="text-gray-700">
                Recibirás un análisis completo con mapas de vigor, recomendaciones nutricionales y plan de acción en 24-48 horas
              </p>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default DiagnosticForm;
