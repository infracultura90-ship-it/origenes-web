import React from 'react';

const PHONE = '573005582757';
const MESSAGE = encodeURIComponent(
  'Hola ORÍGENES, necesito asistencia técnica. Escribo desde el departamento de ________ para el cultivo de ________.'
);

const WhatsAppButton = () => {
  return (
    <a
      href={`https://wa.me/${PHONE}?text=${MESSAGE}`}
      target="_blank"
      rel="noopener noreferrer"
      data-testid="whatsapp-float-btn"
      className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-[#25D366] hover:bg-[#1da851] rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 group"
      aria-label="Contactar por WhatsApp"
    >
      <svg viewBox="0 0 32 32" className="w-7 h-7 fill-white">
        <path d="M16.004 0h-.008C7.174 0 0 7.176 0 16c0 3.5 1.132 6.744 3.052 9.38L1.056 31.2l6.012-1.932A15.905 15.905 0 0016.004 32C24.826 32 32 24.822 32 16S24.826 0 16.004 0zm9.32 22.608c-.39 1.1-1.932 2.014-3.148 2.28-.832.178-1.918.32-5.574-1.198-4.676-1.94-7.688-6.688-7.922-6.998-.224-.31-1.884-2.51-1.884-4.786s1.192-3.396 1.616-3.862c.424-.466.926-.582 1.234-.582.308 0 .616.002.886.016.284.014.666-.108.942.718.39 1.1 1.042 2.994 1.134 3.21.092.214.154.466.03.752-.122.286-.184.466-.366.718-.184.252-.386.562-.55.754-.184.214-.376.446-.162.876.214.428.952 1.572 2.044 2.546 1.404 1.254 2.588 1.644 2.954 1.826.366.184.58.154.794-.092.214-.246.918-1.068 1.162-1.436.246-.366.49-.308.826-.184.336.122 2.13 1.006 2.496 1.188.366.184.61.274.702.428.092.154.092.886-.298 1.986z"/>
      </svg>
      <span className="absolute right-full mr-3 bg-white text-gray-800 text-sm font-medium px-3 py-1.5 rounded-lg shadow-md whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
        Escríbenos por WhatsApp
      </span>
    </a>
  );
};

export default WhatsAppButton;
