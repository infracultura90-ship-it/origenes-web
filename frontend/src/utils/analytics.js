import { useEffect } from 'react';

const GA_MEASUREMENT_ID = process.env.REACT_APP_GA_MEASUREMENT_ID;

export const initGA = () => {
  if (!GA_MEASUREMENT_ID) {
    console.warn('Google Analytics Measurement ID not configured');
    return;
  }

  // Load Google Analytics script
  const script1 = document.createElement('script');
  script1.async = true;
  script1.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
  document.head.appendChild(script1);

  // Initialize gtag
  window.dataLayer = window.dataLayer || [];
  function gtag() {
    window.dataLayer.push(arguments);
  }
  gtag('js', new Date());
  gtag('config', GA_MEASUREMENT_ID, {
    page_path: window.location.pathname,
  });

  window.gtag = gtag;
};

export const logPageView = (url) => {
  if (window.gtag && GA_MEASUREMENT_ID) {
    window.gtag('config', GA_MEASUREMENT_ID, {
      page_path: url,
    });
  }
};

export const logEvent = (action, category, label, value) => {
  if (window.gtag && GA_MEASUREMENT_ID) {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    });
  }
};

// Custom hook for Google Analytics
export const useGoogleAnalytics = () => {
  useEffect(() => {
    initGA();
  }, []);
};

// Track specific conversion events
export const trackContactFormSubmission = () => {
  logEvent('submit', 'Contact Form', 'Contact Form Submission', 1);
};

export const trackCTAClick = (ctaName) => {
  logEvent('click', 'CTA', `CTA Click - ${ctaName}`, 1);
};

export const trackSectionView = (sectionName) => {
  logEvent('view', 'Section', `Section View - ${sectionName}`, 1);
};
