import React from 'react';
import { Map, Droplets, FlaskConical, Thermometer, Leaf, Sun, Plane, CloudRain, Zap, Gauge, TestTube } from 'lucide-react';
import { technologiesData } from '../data/mock';

const iconMap = {
  Map, Droplets, FlaskConical, Thermometer, Leaf, Sun, Plane, CloudRain, Zap, Gauge, TestTube
};

const Technologies = () => {
  const categories = [...new Set(technologiesData.map(tech => tech.category))];

  return (
    <section className="py-20 bg-gradient-to-br from-green-50 via-white to-orange-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-green-900 mb-4">
            Tecnologías Avanzadas
          </h2>
          <p className="text-xl text-gray-600">
            Equipos de última generación para medición y análisis de parámetros críticos en tiempo real
          </p>
        </div>

        {/* Technologies Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {technologiesData.map((tech, index) => {
            const Icon = iconMap[tech.icon];
            return (
              <div
                key={index}
                className="bg-white rounded-xl p-6 border border-gray-200 hover:border-orange-400 hover:shadow-lg transition-all duration-300 flex items-start gap-4 group"
              >
                <div className="bg-gradient-to-br from-orange-100 to-orange-200 w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                  <Icon className="w-6 h-6 text-orange-700" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-orange-600 mb-1">{tech.category}</div>
                  <h3 className="text-base font-bold text-green-900">{tech.name}</h3>
                </div>
              </div>
            );
          })}
        </div>

        {/* Image Section */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          <div className="rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
            <img
              src="https://images.unsplash.com/photo-1662601618863-183cb68b07bf"
              alt="Equipos de monitoreo"
              className="w-full h-64 object-cover"
            />
          </div>
          <div className="rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
            <img
              src="https://images.unsplash.com/photo-1738598665806-7ecc32c3594c"
              alt="Sistema de riego"
              className="w-full h-64 object-cover"
            />
          </div>
          <div className="rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
            <img
              src="https://images.pexels.com/photos/35426382/pexels-photo-35426382.jpeg"
              alt="Herramientas de medición"
              className="w-full h-64 object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Technologies;
