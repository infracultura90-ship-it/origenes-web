import React from 'react';
import { Target, Activity, Leaf, Beaker } from 'lucide-react';
import { servicesData } from '../data/mock';

const iconMap = {
  Target,
  Activity,
  Leaf,
  Beaker
};

const Services = () => {
  return (
    <section id="servicios" className="py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-green-900 mb-4">
            Nuestros Servicios
          </h2>
          <p className="text-xl text-gray-600">
            Soluciones integrales para transformar tu producción agrícola con tecnología de precisión
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {servicesData.map((service) => {
            const Icon = iconMap[service.icon];
            return (
              <div
                key={service.id}
                className="group bg-gradient-to-br from-green-50 to-orange-50 rounded-2xl p-8 border border-green-100 hover:border-orange-300 transition-all duration-300 hover:shadow-xl hover:-translate-y-2"
              >
                <div className="bg-gradient-to-br from-green-600 to-green-700 w-16 h-16 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <Icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-green-900 mb-3">
                  {service.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {service.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Services;
