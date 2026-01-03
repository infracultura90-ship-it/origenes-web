import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import { toast } from 'sonner';
import { contactFormFields, culturesData } from '../data/mock';

const Contact = () => {
  const [formData, setFormData] = useState(contactFormFields);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const departments = [
    'Antioquia', 'Atlántico', 'Bogotá D.C.', 'Bolívar', 'Boyacá', 'Caldas', 'Caquetá',
    'Cauca', 'Cesar', 'Córdoba', 'Cundinamarca', 'Huila', 'La Guajira', 'Magdalena',
    'Meta', 'Nariño', 'Norte de Santander', 'Quindío', 'Risaralda', 'Santander',
    'Tolima', 'Valle del Cauca', 'Otros'
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission (will be replaced with actual API call)
    setTimeout(() => {
      console.log('Form submitted:', formData);
      toast.success('¡Solicitud enviada exitosamente! Nos pondremos en contacto pronto.', {
        duration: 5000,
      });
      setFormData(contactFormFields);
      setIsSubmitting(false);
    }, 1500);
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <section id="contacto" className="py-20 bg-gradient-to-br from-green-900 via-green-800 to-orange-900 text-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,.05) 10px, rgba(255,255,255,.05) 20px)'
        }}></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* Left - Contact Info */}
          <div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Solicita una Consultoría
            </h2>
            <p className="text-xl text-green-100 mb-8 leading-relaxed">
              Comienza a optimizar tu producción agrícola hoy. Nuestro equipo de expertos está listo para ayudarte.
            </p>

            {/* Contact Details */}
            <div className="space-y-6 mb-8">
              <div className="flex items-start gap-4">
                <div className="bg-orange-600 w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Mail className="w-6 h-6" />
                </div>
                <div>
                  <div className="font-semibold mb-1">Email</div>
                  <div className="text-green-100">infracultura90@gmail.com</div>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-orange-600 w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Phone className="w-6 h-6" />
                </div>
                <div>
                  <div className="font-semibold mb-1">Teléfono</div>
                  <div className="text-green-100">+57 310 321 2780</div>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-orange-600 w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-6 h-6" />
                </div>
                <div>
                  <div className="font-semibold mb-1">Dirección</div>
                  <div className="text-green-100">Finca La Esperanza, Vda La Rambla<br/>San Antonio del Tequendama</div>
                </div>
              </div>
            </div>

            {/* Trust Badges */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <div className="text-sm text-green-100 mb-2">Garantía de servicio</div>
              <div className="text-2xl font-bold">17+ años de experiencia</div>
            </div>
          </div>

          {/* Right - Form */}
          <div className="bg-white rounded-2xl p-8 shadow-2xl">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="name" className="text-green-900">Nombre Completo *</Label>
                <Input
                  id="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  className="mt-2 border-gray-300 focus:border-orange-500"
                  placeholder="Juan Pérez"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="email" className="text-green-900">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    className="mt-2 border-gray-300 focus:border-orange-500"
                    placeholder="juan@ejemplo.com"
                  />
                </div>

                <div>
                  <Label htmlFor="phone" className="text-green-900">Teléfono *</Label>
                  <Input
                    id="phone"
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => handleChange('phone', e.target.value)}
                    className="mt-2 border-gray-300 focus:border-orange-500"
                    placeholder="300 123 4567"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="department" className="text-green-900">Departamento *</Label>
                  <Select value={formData.department} onValueChange={(value) => handleChange('department', value)}>
                    <SelectTrigger id="department" className="mt-2 border-gray-300 focus:border-orange-500">
                      <SelectValue placeholder="Seleccionar" />
                    </SelectTrigger>
                    <SelectContent>
                      {departments.map((dept) => (
                        <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="culture" className="text-green-900">Cultivo Principal *</Label>
                  <Select value={formData.culture} onValueChange={(value) => handleChange('culture', value)}>
                    <SelectTrigger id="culture" className="mt-2 border-gray-300 focus:border-orange-500">
                      <SelectValue placeholder="Seleccionar" />
                    </SelectTrigger>
                    <SelectContent>
                      {culturesData.map((culture) => (
                        <SelectItem key={culture.name} value={culture.name}>{culture.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="hectares" className="text-green-900">Hectáreas</Label>
                <Input
                  id="hectares"
                  type="number"
                  value={formData.hectares}
                  onChange={(e) => handleChange('hectares', e.target.value)}
                  className="mt-2 border-gray-300 focus:border-orange-500"
                  placeholder="Ej: 50"
                />
              </div>

              <div>
                <Label htmlFor="message" className="text-green-900">Mensaje *</Label>
                <Textarea
                  id="message"
                  required
                  value={formData.message}
                  onChange={(e) => handleChange('message', e.target.value)}
                  className="mt-2 border-gray-300 focus:border-orange-500 min-h-[120px]"
                  placeholder="Cuéntanos sobre tu proyecto y necesidades específicas..."
                />
              </div>

              <Button
                type="submit"
                size="lg"
                disabled={isSubmitting}
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
