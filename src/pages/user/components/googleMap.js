import React, { useEffect, useRef } from 'react';
import { Map, GoogleApiWrapper, Marker } from 'google-maps-react';

const MapContainer = (props) => {
  const mapRef = useRef(null);

  useEffect(() => {
    if (props.address && mapRef.current) {
      const newCenter = new props.google.maps.LatLng(
        props.address.latitude,
        props.address.longitude
      );
      mapRef.current.map.setCenter(newCenter);
    }
  }, [props.address, props.google.maps.LatLng]);

  return (
    <div style={{ width: '40vw', overflow: 'hidden' }}>
      {props.address && (
        <Map
          google={props.google}
          zoom={14}
          style={props?.mapStyles}
          initialCenter={{
            lat: props.address.latitude,
            lng: props.address.longitude,
          }}
          ref={mapRef}
        >
          <Marker
            position={{
              lat: props.address.latitude,
              lng: props.address.longitude,
            }}
          />
        </Map>
      )}
    </div>
  );
};

export default GoogleApiWrapper({
  apiKey: 'AIzaSyA61_a1cztE7_ygTRUdET6qN62cnYrOMvY',
})(MapContainer);
