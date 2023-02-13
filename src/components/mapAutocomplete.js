import React from "react";
import PlacesAutocomplete from "react-places-autocomplete";
import {
  geocodeByAddress,
  geocodeByPlaceId,
  getLatLng,
} from "react-places-autocomplete";
import { setMap } from "../redux/register";
import styled from "styled-components";
import { useSelector, useDispatch } from "react-redux";

const MapAutocomplete = () => {
  const dispatch = useDispatch();
  const [adress, setAdress] = React.useState("");
  const handleSelect = async (value) => {
    const result = await geocodeByAddress(value);
    const ll = await getLatLng(result[0]);
    setAdress(value);
    // country
    let countr;
    if (
      result[0]?.address_components?.find(
        (item) => item?.types[0] == "country"
      ) != undefined
    ) {
      countr = result[0]?.address_components?.find(
        (item) => item?.types[0] == "country"
      )?.long_name;
    } else {
      countr = "";
    }

    //region
    let reg;
    if (
      result[0]?.address_components?.find(
        (item) => item?.types[0] == "administrative_area_level_1"
      ) != undefined
    ) {
      reg = result[0]?.address_components?.find(
        (item) => item?.types[0] == "administrative_area_level_1"
      )?.long_name;
    } else {
      reg = "";
    }

    // city
    let cit;
    if (
      result[0]?.address_components?.find(
        (item) => item?.types[0] == "locality"
      ) != undefined
    ) {
      cit = result[0]?.address_components?.find(
        (item) => item?.types[0] == "locality"
      )?.long_name;
    } else {
      cit = "";
    }

    // ubani
    let destr;
    if (
      result[0]?.address_components?.find((item) =>
        item.types?.includes("sublocality_level_1")
      ) != undefined
    ) {
      destr = result[0]?.address_components?.find((item) =>
        item.types?.includes("sublocality_level_1")
      )?.long_name;
    } else {
      destr = "";
    }

    // street
    let str;
    if (
      result[0]?.address_components?.find(
        (item) => item?.types[0] == "route"
      ) != undefined
    ) {
      str = result[0]?.address_components?.find(
        (item) => item?.types[0] == "route"
      )?.long_name;
    } else {
      str = "";
    }

    // street number
    let nmb;
    if (
      result[0]?.address_components?.find(
        (item) => item?.types[0] == "street_number"
      ) != undefined
    ) {
      nmb = result[0]?.address_components?.find(
        (item) => item?.types[0] == "street_number"
      )?.long_name;
    } else {
      nmb = "";
    }

    // lantitude && logitude
    const lat = ll.lat;
    const lng = ll.lng;

    dispatch(
      setMap({
        country: countr,
        region: reg,
        city: cit,
        destrict: destr,
        street: str,
        number: nmb,
        latitude: lat,
        longitude: lng,
      })
    );
  };

  return (
    <div>
      <PlacesAutocomplete
        value={adress}
        onChange={setAdress}
        onSelect={handleSelect}
        googleCallbackName="myCallbackFunc"
      >
        {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
          <Container>
            <Input
              {...getInputProps({
                placeholder: "მოძებნე მისამართი ...",
                className: "location-search-input",
              })}
            />
            <div className="autocomplete-dropdown-container">
              {loading && <div>Loading...</div>}
              {suggestions?.map((suggestion, index) => {
                const className = suggestion.active
                  ? "suggestion-item--active"
                  : "suggestion-item";
                // inline style for demonstration purpose
                const style = suggestion?.active
                  ? { backgroundColor: "#fafafa", cursor: "pointer" }
                  : { backgroundColor: "#ffffff", cursor: "pointer" };
                return (
                  <div
                    key={index}
                    {...getSuggestionItemProps(suggestion, {
                      className,
                      style,
                    })}
                  >
                    <span>{suggestion?.description}</span>
                  </div>
                );
              })}
            </div>
          </Container>
        )}
      </PlacesAutocomplete>
    </div>
  );
};

export default MapAutocomplete;

const Container = styled.div`
  width: 18.5vw;
  height: 2.5vw;
  border-radius: 0.5vw;
  font-size: 0.8vw;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  box-sizing: border-box;
  box-shadow: 0 0.1vw 0.3vw rgba(2, 2, 2, 0.1);
  overflow: hidden;

  @media only screen and (max-width: 600px) {
    width: 45vw;
    height: 10vw;
    border-radius: 1.5vw;
    font-size: 16px;
  }

  .autocomplete-dropdown-container {
    z-index: 1000;
    position: absolute;
    width: 18.5vw;
    max-height: 10vw;
    overflow-y: scroll;
    margin-top: 2vw;
    font-size: 14px;
    text-align: start;
    box-sizing: border-box;
    border-radius: 0 0.5vw;
    box-shadow: 0 0.1vw 0.3vw rgba(0, 0, 0, 0.1);
    display: flex;
    flex-direction: column;
    gap: 0.5vw;
    background: #fff;

    @media only screen and (max-width: 600px) {
      box-shadow: 0 0.2vw 0.6vw rgba(2, 2, 2, 0.1);
      width: 45vw;
      height: auto;
      margin-top: 8vw;
      border-radius: 1vw;
      max-height: 40vw;
    }
  }

  .suggestion-item {
    margin: 0.25vw 0.5vw;
    border-bottom: 1px solid #050505;
  }
  .suggestion-item--active {
    margin: 0.25vw 0.5vw;
    border-bottom: 1px solid #050505;
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
  }
`;
