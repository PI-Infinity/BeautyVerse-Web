import React from 'react';
import { Map, GoogleApiWrapper, Marker } from 'google-maps-react';

const MapContainer = (props) => {
  const mapStyles = {
    width: '90%',
    height: '40%',
    borderRadius: '20px',
    margin: '0 0 30px 0',
  };

  return (
    <div style={{ width: '90vw', overflow: 'hidden' }}>
      <Map
        google={props.google}
        zoom={14}
        style={mapStyles}
        initialCenter={{
          lat: -1.2884,
          lng: 36.8233,
        }}
      >
        <Marker position={{ lat: -1.2884, lng: 36.8233 }} />
      </Map>
    </div>
  );
};

export default GoogleApiWrapper({
  apiKey: 'AIzaSyA61_a1cztE7_ygTRUdET6qN62cnYrOMvY',
})(MapContainer);
