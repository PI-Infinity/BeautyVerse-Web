import React, { useRef, useState } from 'react';
import styled from 'styled-components';
import { useLoadScript, Autocomplete } from '@react-google-maps/api';
import { setMap, setAddress } from '../redux/register';
import { useDispatch, useSelector } from 'react-redux';

const apiKey = 'AIzaSyBxx8CORlQQBBkbGc-F0yu95DMZaiJkMmo';
const libraries = ['places'];

function AddressAutocomplete() {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: apiKey,
    libraries,
  });
  const dispatch = useDispatch();

  const autocompleteRef = useRef(null);

  const [address, setAddress] = useState({
    country: '',
    region: '',
    city: '',
    district: '',
    street: '',
    streetNumber: '',
  });

  const handlePlaceChanged = () => {
    const place = autocompleteRef.current.getPlace();
    const components = {};

    for (const component of place.address_components) {
      if (component.types.includes('country')) {
        components.country = component.long_name;
      } else if (component.types.includes('administrative_area_level_1')) {
        components.region = component.long_name;
      } else if (component.types.includes('locality')) {
        components.city = component.long_name;
      } else if (component.types.includes('sublocality_level_1')) {
        components.district = component.long_name;
      } else if (component.types.includes('route')) {
        components.street = component.long_name;
      } else if (component.types.includes('street_number')) {
        components.streetNumber = component.long_name;
      }
    }

    const latitude = place.geometry.location.lat();
    const longitude = place.geometry.location.lng();

    setAddress({ ...address, ...components });

    dispatch(
      setMap({
        country: components.country,
        region: components.region,
        city: components.city,
        district: components.district,
        street: components.street,
        number: components.streetNumber,
        latitude: latitude,
        longitude: longitude,
        address: place.formatted_address,
      })
    );
  };

  if (loadError) {
    return <div>Error loading Google Maps API</div>;
  }

  if (!isLoaded) {
    return <div></div>;
  }

  return (
    <Cont>
      <Autocomplete
        onLoad={(ref) => (autocompleteRef.current = ref)}
        onPlaceChanged={handlePlaceChanged}
        options={{ language: 'en' }}
      >
        <Container>
          <Input type="text" placeholder="Enter an address" />
        </Container>
      </Autocomplete>
    </Cont>
  );
}

export default AddressAutocomplete;

const Cont = styled.div`
  width: 100%;
  .pac-container {
    z-index: 10001;
    color: ${(props) => props.theme.font} !important;
    background-color: ${(props) => props.theme.background} !important;
  }
`;

const Container = styled.div`
  width: 100%;
  height: 2vw;
  border-radius: 0.5vw;
  font-size: 0.8vw;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  box-sizing: border-box;
  overflow: hidden;
  color: ${(props) => props.theme.font};
  background: none;

  @media only screen and (max-width: 600px) {
    width: 100%;
    // width: ${(props) => (props.userMobile === 'true' ? '70vw' : '45vw')};
    height: ${(props) => (props.userMobile === 'true' ? '8vw' : '8vw')};
    justify-content: ${(props) =>
      props.userMobile === 'true' ? 'start' : 'space-between'};
    border-radius: 1.5vw;
    font-size: 16px;
  }
`;

const Input = styled.input`
  width: 100%;
  height: 100%;
  border: none;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.5vw;
  padding-left: 0.5vw;
  transition: ease-in 200ms;
  box-sizing: border-box;
  color: ${(props) => props.theme.font};
  background: none;

  @media only screen and (max-width: 600px) {
    border-radius: 1.5vw;
    padding-left: 2vw;
    font-size: 16px;
  }

  :focus {
    outline: none;
  }

  :hover {
    box-shadow: 0 0.2vw 0.5vw rgba(2, 2, 2, 0.2);
  }

  ::placeholder {
    font-size: 12px;
    color: #888;
  }
`;
