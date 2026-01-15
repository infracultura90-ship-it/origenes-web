import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { Button } from './ui/button';
import DiagnosticForm from './DiagnosticForm';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const scrollToSection = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setIsMenuOpen(false);
  };

  const menuItems = [
    { label: 'Inicio', id: 'hero' },
    { label: 'Servicios', id: 'servicios' },
    { label: 'Tecnología', id: 'tecnologias' },
    { label: 'Experiencia', id: 'experiencia' },
    { label: 'Cultivos', id: 'cultivos' },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md shadow-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div className="flex items-center cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <div className="flex flex-col">
              <span className="text-2xl font-bold text-green-900">ORÍGENES</span>
              <span className="text-sm text-orange-600 font-semibold -mt-1">NUTRICIÓN Y PRECISIÓN</span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className="text-gray-700 hover:text-orange-600 font-medium transition-colors duration-200"
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* CTA Buttons */}
          <div className="hidden lg:flex items-center gap-3">
            <DiagnosticForm 
              trigger={
                <Button
                  variant="outline"
                  className="border-2 border-orange-600 text-orange-600 hover:bg-orange-50"
                >
                  Solicitar Diagnóstico
                </Button>
              }
            />
            <Button
              onClick={() => scrollToSection('contacto')}
              className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-5 font-semibold shadow-md hover:shadow-lg transition-all duration-300"
            >
              Contáctanos
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden text-green-900 p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden py-4 border-t border-gray-200">
            <nav className="flex flex-col gap-4">
              {menuItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className="text-left text-gray-700 hover:text-orange-600 font-medium py-2 transition-colors duration-200"
                >
                  {item.label}
                </button>
              ))}
              <DiagnosticForm 
                trigger={
                  <Button
                    variant="outline"
                    className="border-2 border-orange-600 text-orange-600 w-full"
                  >
                    Solicitar Diagnóstico
                  </Button>
                }
              />
              <Button
                onClick={() => scrollToSection('contacto')}
                className="bg-orange-600 hover:bg-orange-700 text-white w-full"
              >
                Contáctanos
              </Button>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
