import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import { toast } from 'sonner';
import { culturesData } from '../data/mock';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    department: '',
    culture: '',
    hectares: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const departments = [
    'Antioquia', 'Atlántico', 'Bogotá D.C.', 'Bolívar', 'Boyacá', 'Caldas', 'Caquetá',
    'Cauca', 'Cesar', 'Córdoba', 'Cundinamarca', 'Huila', 'La Guajira', 'Magdalena',
    'Meta', 'Nariño', 'Norte de Santander', 'Quindío', 'Risaralda', 'Santander',
    'Tolima', 'Valle del Cauca', 'Otros'
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.phone || !formData.message) {
      toast.error('Por favor completa los campos obligatorios');
      return;
    }

    setIsSubmitting(true);

    try {
      const dataToSend = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        department: formData.department || 'No especificado',
        culture: formData.culture || 'No especificado',
        hectares: formData.hectares ? parseInt(formData.hectares) : null,
        message: formData.message
      };

      const response = await axios.post(`${BACKEND_URL}/api/contact/`, dataToSend);

      if (response.status === 201) {
        if (window.gtag) {
          window.gtag('event', 'conversion', {
            'event_category': 'Contact',
            'event_label': 'Contact Form Submission'
          });
        }
        
        toast.success('¡Solicitud enviada exitosamente! Nos pondremos en contacto pronto.', {
          duration: 5000,
        });
        
        setFormData({
          name: '',
          email: '',
          phone: '',
          department: '',
          culture: '',
          hectares: '',
          message: ''
        });
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error('Error al enviar la solicitud. Por favor intente nuevamente.', {
        duration: 5000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contacto" className="py-20 bg-gradient-to-br from-green-900 via-green-800 to-orange-900 text-white relative overflow-hidden" data-testid="contact-section">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,.05) 10px, rgba(255,255,255,.05) 20px)'
        }}></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          <div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Solicita una Consultoría
            </h2>
            <p className="text-xl text-green-100 mb-8 leading-relaxed">
              Comienza a optimizar tu producción agrícola hoy. Nuestro equipo de expertos está listo para ayudarte.
            </p>

            <div className="space-y-6 mb-8">
              <div className="flex items-start gap-4">
                <div className="bg-orange-600 w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Mail className="w-6 h-6" />
                </div>
                <div>
                  <div className="font-semibold mb-1">Email</div>
                  <div className="text-green-100" data-testid="contact-email">gerencia@origeneskhachi.org</div>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-orange-600 w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Phone className="w-6 h-6" />
                </div>
                <div>
                  <div className="font-semibold mb-1">Teléfono</div>
                  <div className="text-green-100" data-testid="contact-phone-1">+57 300 558 2757</div>
                  <div className="text-green-100" data-testid="contact-phone-2">+57 310 321 2780</div>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-orange-600 w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-6 h-6" />
                </div>
                <div>
                  <div className="font-semibold mb-1">Dirección</div>
                  <div className="text-green-100" data-testid="contact-address">Finca La Esperanza, Vda La Rambla<br/>San Antonio del Tequendama</div>
                </div>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <div className="text-sm text-green-100 mb-2">Garantía de servicio</div>
              <div className="text-2xl font-bold">17+ años de experiencia</div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-2xl">
            <form onSubmit={handleSubmit} className="space-y-6" data-testid="contact-form">
              <div>
                <Label htmlFor="contact-name" className="text-green-900">Nombre Completo *</Label>
                <Input
                  id="contact-name"
                  data-testid="contact-name-input"
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="mt-2 border-gray-300 focus:border-orange-500"
                  placeholder="Juan Pérez"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="contact-email" className="text-green-900">Email *</Label>
                  <Input
                    id="contact-email"
                    data-testid="contact-email-input"
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    className="mt-2 border-gray-300 focus:border-orange-500"
                    placeholder="juan@ejemplo.com"
                  />
                </div>

                <div>
                  <Label htmlFor="contact-phone" className="text-green-900">Teléfono *</Label>
                  <Input
                    id="contact-phone"
                    data-testid="contact-phone-input"
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                    className="mt-2 border-gray-300 focus:border-orange-500"
                    placeholder="300 123 4567"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="contact-department" className="text-green-900">Departamento</Label>
                  <Select
                    value={formData.department}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, department: value }))}
                  >
                    <SelectTrigger id="contact-department" data-testid="contact-department-select" className="mt-2 border-gray-300 focus:border-orange-500">
                      <SelectValue placeholder="Seleccionar" />
                    </SelectTrigger>
                    <SelectContent>
                      {departments.map((dept) => (
                        <SelectItem key={dept} value={dept} data-testid={`dept-${dept}`}>{dept}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="contact-culture" className="text-green-900">Cultivo Principal</Label>
                  <Select
                    value={formData.culture}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, culture: value }))}
                  >
                    <SelectTrigger id="contact-culture" data-testid="contact-culture-select" className="mt-2 border-gray-300 focus:border-orange-500">
                      <SelectValue placeholder="Seleccionar" />
                    </SelectTrigger>
                    <SelectContent>
                      {culturesData.map((culture) => (
                        <SelectItem key={culture.name} value={culture.name} data-testid={`culture-${culture.name}`}>{culture.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="contact-hectares" className="text-green-900">Hectáreas</Label>
                <Input
                  id="contact-hectares"
                  data-testid="contact-hectares-input"
                  type="number"
                  value={formData.hectares}
                  onChange={(e) => setFormData(prev => ({ ...prev, hectares: e.target.value }))}
                  className="mt-2 border-gray-300 focus:border-orange-500"
                  placeholder="Ej: 50"
                />
              </div>

              <div>
                <Label htmlFor="contact-message" className="text-green-900">Mensaje *</Label>
                <Textarea
                  id="contact-message"
                  data-testid="contact-message-input"
                  required
                  value={formData.message}
                  onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                  className="mt-2 border-gray-300 focus:border-orange-500 min-h-[120px]"
                  placeholder="Cuéntanos sobre tu proyecto y necesidades específicas..."
                />
              </div>

              <Button
                type="submit"
                size="lg"
                disabled={isSubmitting}
                data-testid="contact-submit-btn"
                className="w-full bg-orange-600 hover:bg-orange-700 text-white py-6 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
              >
                {isSubmitting ? 'Enviando...' : 'Enviar Solicitud'}
                <Send className="ml-2 w-5 h-5" />
              </Button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
