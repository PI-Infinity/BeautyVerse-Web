import React from 'react';
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';

function Map(props) {
  // define mobile or desktop
  const [width, setWidth] = React.useState(window.innerWidth);

  function handleWindowSizeChange() {
    setWidth(window.innerWidth);
  }
  React.useEffect(() => {
    window.addEventListener('resize', handleWindowSizeChange);
    return () => {
      window.removeEventListener('resize', handleWindowSizeChange);
    };
  }, []);

  const isMobile = width <= 768;

  let containerStyle;
  if (isMobile) {
    containerStyle = {
      width: '90vw',
      height: '50vw',
    };
  } else {
    containerStyle = {
      width: '35vw',
      height: '20vw',
    };
  }

  let center = {
    lat: parseFloat(props?.latitude?.toFixed(7)),
    lng: parseFloat(props?.longitude?.toFixed(7)),
  };
  //
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    // googleMapsApiKey: process.env.MAP_APIKEY,
  });

  return isLoaded ? (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={center}
      zoom={16}
      options={{
        zoomControl: false,
        streerViewControl: false,
        mapTypeControl: false,
        fullScreenControl: false,
      }}
    >
      <Marker
        position={{
          lat: center.lat,
          lng: center.lng,
        }}
      />
    </GoogleMap>
  ) : (
    <></>
  );
}

export default React.memo(Map);
