import React from "react";
import PlacesAutocomplete from "react-places-autocomplete";
import { geocodeByAddress, getLatLng } from "react-places-autocomplete";
import { setMap } from "../redux/register";
import styled from "styled-components";
import { useDispatch } from "react-redux";

const MapAutocomplete = ({ language, userMobile, address, setAddress }) => {
  const dispatch = useDispatch();
  const handleSelect = async (value) => {
    const result = await geocodeByAddress(value);
    const ll = await getLatLng(result[0]);
    setAddress(value);
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
        (item) =>
          item?.types[0] == "street_number" || item?.types[0] == "premise"
      ) !== undefined
    ) {
      nmb = result[0]?.address_components?.find(
        (item) =>
          item?.types[0] == "street_number" || item?.types[0] == "premise"
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
        district: destr,
        street: str,
        number: nmb,
        latitude: lat,
        longitude: lng,
      })
    );
  };

  return (
    <MainContainer userMobile={userMobile}>
      <PlacesAutocomplete
        value={address}
        onChange={setAddress}
        onSelect={handleSelect}
        googleCallbackName="myCallbackFunc"
      >
        {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
          <>
            <Container userMobile={userMobile}>
              <Input
                requred
                value={address}
                {...getInputProps({
                  placeholder: language?.language.User.userPage.findAddress,
                  className: "location-search-input",
                })}
              />
            </Container>
            <div className="autocomplete-dropdown-container">
              {loading && <div>Loading...</div>}
              {suggestions?.map((suggestion, index) => {
                const className = suggestion.active
                  ? "suggestion-item--active"
                  : "suggestion-item";
                // inline style for demonstration purpose
                // const style = suggestion?.active
                //   ? { backgroundColor: "#fafafa", cursor: "pointer" }
                //   : { backgroundColor: "#ffffff", cursor: "pointer" };
                return (
                  <div
                    key={index}
                    {...getSuggestionItemProps(suggestion, {
                      className,
                      // style,
                    })}
                  >
                    <span>{suggestion?.description}</span>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </PlacesAutocomplete>
    </MainContainer>
  );
};

export default MapAutocomplete;

const MainContainer = styled.div`
  .autocomplete-dropdown-container {
    z-index: 100000;
    position: absolute;
    width: 18.5vw;
    overflow-y: scroll;
    margin-top: 1vw;
    font-size: 14px;
    text-align: start;
    box-sizing: border-box;
    border-radius: 0 0.5vw;
    box-shadow: 0 0.1vw 0.3vw ${(props) => props.theme.shadowColor};
    display: flex;
    flex-direction: column;
    gap: 0.5vw;
    color: auto;
    background: ${(props) => props.theme.categoryItem};

    @media only screen and (max-width: 600px) {
      position: ${(props) =>
        props.userMobile === "true" ? "relative" : "absolute"};
      box-shadow: 0 0.2vw 0.6vw rgba(2, 2, 2, 0.1);
      width: ${(props) => (props.userMobile === "true" ? "100%" : "45vw")};
      height: auto;
      margin-top: ${(props) => (props.userMobile === "true" ? "1vw" : "3vw")};
      border-radius: 1vw;
    }
  }

  .suggestion-item {
    margin: 0.25vw 0.5vw;
    border-bottom: 1px solid ${(props) => props.theme.font};
    color: ${(props) => props.theme.font};
    cursor: pointer;

    @media only screen and (max-width: 600px) {
      padding: 1vw 0;
    }
  }
  .suggestion-item--active {
    cursor: pointer;
    margin: 0.25vw 0.5vw;
    border-bottom: 1px solid ${(props) => props.theme.font};
    background: ${(props) => props.theme.categoryItem};

    @media only screen and (max-width: 600px) {
      padding: 1vw 0;
    }
  }
`;

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
  color: ${(props) => props.theme.font};
  background: ${(props) => props.theme.categoryItem};

  @media only screen and (max-width: 600px) {
    width: ${(props) => (props.userMobile === "true" ? "70vw" : "45vw")};
    height: ${(props) => (props.userMobile === "true" ? "8vw" : "10vw")};
    justify-content: ${(props) =>
      props.userMobile === "true" ? "start" : "space-between"};
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
  background: ${(props) => props.theme.categoryItem};

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
    color: ${(props) => props.theme.font};
  }
`;
