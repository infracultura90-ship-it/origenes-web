import React from 'react';
import { culturesData } from '../data/mock';

const Cultures = () => {
  const groupedByType = culturesData.reduce((acc, culture) => {
    if (!acc[culture.type]) acc[culture.type] = [];
    acc[culture.type].push(culture.name);
    return acc;
  }, {});

  return (
    <section className="py-20 bg-gradient-to-br from-orange-50 via-white to-green-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-green-900 mb-4">
            Cultivos Especializados
          </h2>
          <p className="text-xl text-gray-600">
            Experiencia comprobada en todos los tipos de cultivos de Colombia
          </p>
        </div>

        {/* Cultures by Type */}
        <div className="max-w-5xl mx-auto space-y-8">
          {Object.entries(groupedByType).map(([type, cultures]) => (
            <div key={type} className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
              <h3 className="text-2xl font-bold text-orange-700 mb-6 flex items-center gap-2">
                <div className="w-2 h-8 bg-green-600 rounded-full"></div>
                {type}
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {cultures.map((culture, index) => (
                  <div
                    key={index}
                    className="bg-gradient-to-br from-green-50 to-orange-50 rounded-xl p-4 text-center border border-green-100 hover:border-orange-300 hover:shadow-md transition-all duration-300 hover:-translate-y-1"
                  >
                    <span className="text-green-900 font-semibold">{culture}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Image */}
        <div className="mt-16 max-w-4xl mx-auto rounded-2xl overflow-hidden shadow-2xl">
          <img
            src="https://images.pexels.com/photos/5946051/pexels-photo-5946051.jpeg"
            alt="Cosecha exitosa"
            className="w-full h-96 object-cover"
          />
        </div>
      </div>
    </section>
  );
};

export default Cultures;
