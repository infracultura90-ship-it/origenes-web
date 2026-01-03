import React from 'react';
import { Beaker, Sparkles } from 'lucide-react';
import { Button } from './ui/button';

const MagistralFormulation = () => {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left - Image */}
            <div className="relative">
              <div className="rounded-2xl overflow-hidden shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1649620537042-77f0f361d773"
                  alt="Cultivos saludables"
                  className="w-full h-[500px] object-cover"
                />
              </div>
              {/* Floating Badge */}
              <div className="absolute -top-6 -right-6 bg-gradient-to-br from-orange-500 to-orange-600 text-white rounded-2xl p-6 shadow-xl">
                <Sparkles className="w-8 h-8 mb-2" />
                <div className="text-2xl font-bold">100%</div>
                <div className="text-sm">Personalizado</div>
              </div>
            </div>

            {/* Right - Content */}
            <div>
              <div className="inline-flex items-center gap-2 bg-orange-100 rounded-full px-4 py-2 mb-6">
                <Beaker className="w-5 h-5 text-orange-700" />
                <span className="text-orange-900 font-semibold">Exclusivo</span>
              </div>

              <h2 className="text-4xl md:text-5xl font-bold text-green-900 mb-6">
                Formulación Magistral
              </h2>

              <p className="text-xl text-gray-600 mb-6 leading-relaxed">
                Desarrollamos fórmulas nutricionales específicas adaptadas a las necesidades únicas de tu cultivo, suelo y condiciones climáticas.
              </p>

              <div className="space-y-4 mb-8">
                <div className="flex items-start gap-3 p-4 bg-green-50 rounded-xl border border-green-100">
                  <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <h4 className="font-bold text-green-900 mb-1">Análisis Detallado</h4>
                    <p className="text-gray-600">Estudio completo de suelo, agua y tejido vegetal para diagnóstico preciso.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 bg-green-50 rounded-xl border border-green-100">
                  <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <h4 className="font-bold text-green-900 mb-1">Mezcla Personalizada</h4>
                    <p className="text-gray-600">Formulación exacta de macro y micronutrientes según requerimientos específicos.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 bg-green-50 rounded-xl border border-green-100">
                  <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <h4 className="font-bold text-green-900 mb-1">Monitoreo Continuo</h4>
                    <p className="text-gray-600">Ajustes dinámicos basados en respuesta del cultivo y condiciones cambiantes.</p>
                  </div>
                </div>
              </div>

              <Button
                size="lg"
                className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-6 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                onClick={() => document.getElementById('contacto')?.scrollIntoView({ behavior: 'smooth' })}
              >
                Solicitar Fórmula Personalizada
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MagistralFormulation;
