import React from 'react';
import { Factory, FlaskConical, Sprout, Microscope, Leaf, Beaker } from 'lucide-react';
import { Button } from './ui/button';

const BiofactoryPortfolio = () => {
  const capabilities = [
    {
      icon: Factory,
      title: 'Diseño de Biofábricas',
      description: 'Montaje completo de instalaciones para producción de insumos biológicos adaptados a tu escala y necesidades'
    },
    {
      icon: FlaskConical,
      title: 'Fórmulas Sinérgicas',
      description: 'Desarrollo de mezclas nutricionales que maximizan la eficiencia por interacción de componentes'
    },
    {
      icon: Microscope,
      title: 'Control de Calidad',
      description: 'Análisis microbiológico y químico para garantizar efectividad de los productos biológicos'
    },
    {
      icon: Sprout,
      title: 'Bioinsumos Personalizados',
      description: 'Producción de microorganismos benéficos, bioestimulantes y controladores biológicos'
    }
  ];

  const projects = [
    {
      title: 'Biofábrica de Trichoderma',
      scale: 'Producción: 500 kg/mes',
      description: 'Sistema de fermentación sólida para control biológico de patógenos del suelo',
      impact: 'Reducción 40% en uso de fungicidas químicos'
    },
    {
      title: 'Laboratorio de Biofertilizantes',
      scale: 'Producción: 1000 L/mes',
      description: 'Multiplicación de bacterias fijadoras de nitrógeno y solubilizadoras de fósforo',
      impact: 'Ahorro 30% en fertilización química'
    },
    {
      title: 'Planta de Compost Enriquecido',
      scale: 'Producción: 10 ton/mes',
      description: 'Compostaje acelerado con inoculación de consorcios microbianos',
      impact: 'Mejora 25% en rendimiento de cultivos'
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-green-100 rounded-full px-4 py-2 mb-6">
              <Factory className="w-5 h-5 text-green-700" />
              <span className="text-green-900 text-sm font-medium">Tecnología Biológica</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-green-900 mb-4">
              Portafolio de Biofábricas
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Diseñamos e implementamos biofábricas completas para producción de insumos biológicos de alta calidad, combinando tecnología y conocimiento agronómico
            </p>
          </div>

          {/* Capabilities Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {capabilities.map((capability, index) => {
              const Icon = capability.icon;
              return (
                <div
                  key={index}
                  className="bg-gradient-to-br from-green-50 to-orange-50 rounded-2xl p-6 border border-green-100 hover:border-orange-300 hover:shadow-lg transition-all duration-300"
                >
                  <div className="bg-gradient-to-br from-green-600 to-green-700 w-14 h-14 rounded-xl flex items-center justify-center mb-4 shadow-md">
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-green-900 mb-2">{capability.title}</h3>
                  <p className="text-sm text-gray-600">{capability.description}</p>
                </div>
              );
            })}
          </div>

          {/* Synergistic Formulas Section */}
          <div className="bg-gradient-to-br from-orange-50 via-white to-green-50 rounded-3xl p-8 md:p-12 mb-16 border border-orange-200">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <Beaker className="w-8 h-8 text-orange-600" />
                  <h3 className="text-3xl font-bold text-green-900">Fórmulas Nutricionales Sinérgicas</h3>
                </div>
                <p className="text-lg text-gray-600 mb-6">
                  Desarrollamos mezclas especializadas donde los componentes interactúan para potenciar su efectividad, logrando resultados superiores a la suma de sus partes.
                </p>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 bg-white rounded-lg p-4 border border-green-100">
                    <Leaf className="w-5 h-5 text-green-600 flex-shrink-0" />
                    <span className="text-sm text-gray-700"><strong>Sinergia 1:</strong> Microorganismos + Aminoácidos → Mayor absorción nutricional</span>
                  </div>
                  <div className="flex items-center gap-3 bg-white rounded-lg p-4 border border-green-100">
                    <Leaf className="w-5 h-5 text-green-600 flex-shrink-0" />
                    <span className="text-sm text-gray-700"><strong>Sinergia 2:</strong> Materia orgánica + Microelementos → Disponibilidad prolongada</span>
                  </div>
                  <div className="flex items-center gap-3 bg-white rounded-lg p-4 border border-green-100">
                    <Leaf className="w-5 h-5 text-green-600 flex-shrink-0" />
                    <span className="text-sm text-gray-700"><strong>Sinergia 3:</strong> Bioestimulantes + NPK → Respuesta inmediata + efecto residual</span>
                  </div>
                </div>
              </div>
              <div className="relative">
                <div className="bg-gradient-to-br from-green-600 to-orange-600 rounded-2xl p-8 text-white shadow-xl">
                  <h4 className="text-2xl font-bold mb-4">Ventajas de la Sinergia</h4>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-2">
                      <span className="text-orange-300 text-2xl">+</span>
                      <span>Reducción de dosis hasta 40%</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-orange-300 text-2xl">+</span>
                      <span>Mayor persistencia en suelo</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-orange-300 text-2xl">+</span>
                      <span>Menos aplicaciones necesarias</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-orange-300 text-2xl">+</span>
                      <span>Resultados medibles en 2-3 semanas</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Projects Portfolio */}
          <div>
            <h3 className="text-3xl font-bold text-green-900 mb-8 text-center">Proyectos Implementados</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {projects.map((project, index) => (
                <div
                  key={index}
                  className="bg-white rounded-2xl p-6 border-2 border-green-200 hover:border-orange-400 hover:shadow-xl transition-all duration-300"
                >
                  <div className="bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg p-4 mb-4">
                    <h4 className="text-lg font-bold">{project.title}</h4>
                    <p className="text-sm text-green-100 mt-1">{project.scale}</p>
                  </div>
                  <p className="text-gray-600 text-sm mb-4">{project.description}</p>
                  <div className="bg-orange-50 rounded-lg p-3 border border-orange-200">
                    <p className="text-xs font-semibold text-orange-900">Impacto:</p>
                    <p className="text-sm text-orange-800">{project.impact}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="mt-16 bg-gradient-to-r from-green-900 to-green-800 rounded-3xl p-8 md:p-12 text-center text-white">
            <h3 className="text-3xl font-bold mb-4">¿Listo para tu propia Biofábrica?</h3>
            <p className="text-xl text-green-100 mb-8 max-w-2xl mx-auto">
              Te acompañamos desde el diseño hasta la producción, asegurando productos de calidad y rentabilidad comprobada
            </p>
            <Button
              size="lg"
              onClick={() => document.getElementById('contacto')?.scrollIntoView({ behavior: 'smooth' })}
              className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-6 text-lg font-semibold shadow-lg hover:shadow-xl"
            >
              Solicitar Asesoría para Biofábrica
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BiofactoryPortfolio;
