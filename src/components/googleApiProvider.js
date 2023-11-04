import React, { createContext, useContext, useEffect, useState } from 'react';

const GoogleMapsContext = createContext(null);

export const GoogleMapsProvider = ({ children, apiKey }) => {
  const [googleMaps, setGoogleMaps] = useState(null);

  useEffect(() => {
    const loadGoogleMaps = () => {
      if (!window.google) {
        const script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}`;
        script.async = true;
        script.defer = true;
        document.head.appendChild(script);
        script.onload = () => {
          console.log('Google Maps Script Loaded', window.google.maps);

          setGoogleMaps(window.google.maps);
        };
      } else {
        setGoogleMaps(window.google.maps);
      }
    };

    loadGoogleMaps();
  }, [apiKey]);

  return (
    <GoogleMapsContext.Provider value={googleMaps}>
      {children}
    </GoogleMapsContext.Provider>
  );
};

export const useGoogleMaps = () => {
  const context = useContext(GoogleMapsContext);
  if (context === undefined) {
    throw new Error('useGoogleMaps must be used within a GoogleMapsProvider');
  }
  return context;
};
