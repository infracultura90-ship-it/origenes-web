import React from 'react';
import { CheckCircle2 } from 'lucide-react';
import { experienceData } from '../data/mock';

const Experience = () => {
  return (
    <section className="py-20 bg-gradient-to-br from-green-900 via-green-800 to-green-900 text-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: 'url("https://images.unsplash.com/photo-1720183093696-f2a999e721a2")',
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              {experienceData.title}
            </h2>
            <p className="text-xl text-green-100 mb-8 leading-relaxed">
              {experienceData.description}
            </p>

            {/* Highlights */}
            <div className="space-y-4 mb-8">
              {experienceData.highlights.map((highlight, index) => (
                <div key={index} className="flex items-start gap-3">
                  <CheckCircle2 className="w-6 h-6 text-orange-400 flex-shrink-0 mt-1" />
                  <p className="text-lg text-green-50">{highlight}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right - Achievements */}
          <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-1 gap-6">
            {experienceData.achievements.map((achievement, index) => (
              <div
                key={index}
                className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 hover:bg-white/15 transition-all duration-300 text-center"
              >
                <div className="text-5xl md:text-6xl font-bold text-orange-400 mb-3">
                  {achievement.metric}
                </div>
                <div className="text-lg text-green-100 font-medium">
                  {achievement.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Experience;
