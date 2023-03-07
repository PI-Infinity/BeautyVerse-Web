import React from "react";
import styled from "styled-components";
import { Links } from "../../pages/user/links";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import MapAutocomplete from "../../components/mapAutocomplete";
import Map from "../../components/map";
import useWindowDimensions from "../../functions/dimensions";
import { GiConfirmed } from "react-icons/gi";
import { FiEdit } from "react-icons/fi";
import { MdLocationPin } from "react-icons/md";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase";
import { useOutletContext } from "react-router-dom";
import { BsArrowRightCircleFill, BsArrowLeftCircleFill } from "react-icons/bs";
import AddAddress from "../../pages/user/addAddressPopup";
import { setMap } from "../../redux/register";

export const Contact = () => {
  const [user, language] = useOutletContext();
  // get user by params id
  const { Id } = useParams();
  const { height, width } = useWindowDimensions();

  const dispatch = useDispatch();

  // import users
  const usersList = useSelector((state) => state.storeMain.userList);
  let users;
  if (usersList?.length > 0) {
    users = JSON.parse(usersList);
  }
  const userVis = users?.find((item) => item.id === Id);

  const userUnparsed = useSelector((state) => state.storeMain.user);
  let currentuser;
  if (userUnparsed?.length > 0) {
    currentuser = JSON.parse(userUnparsed);
  }

  // edit address
  const map = useSelector((state) => state.storeRegister.map);
  const [editAddress, SetEditAddress] = React.useState("");
  const [address, setAddress] = React.useState("");

  // get all addresses
  function findValueByPrefix(object, prefix) {
    let addressesList = [];
    for (var property in object) {
      if (
        object.hasOwnProperty(property) &&
        property.toString().startsWith(prefix)
      ) {
        addressesList?.push(object[property]);
      }
    }
    return addressesList?.sort((a, b) => a?.number - b?.number);
  }

  const addresses = findValueByPrefix(user, "address");

  /**
   * change addresses list on cover
   */

  const [currentAddress, setCurrentAddress] = React.useState(0);

  let latitude;
  let longitude;
  let addressDefined;
  if (currentAddress !== undefined) {
    latitude = addresses[currentAddress]?.latitude;
    longitude = addresses[currentAddress]?.longitude;
    addressDefined = (
      <div
        style={{
          width: "80vw",
          textAlign: "center",
          fontSize: "12px",
        }}
      >
        {addresses[currentAddress]?.city === "T'bilisi"
          ? "Tbilisi"
          : addresses[currentAddress]?.city}
        {addresses[currentAddress]?.district?.length > 0 &&
          ", " + addresses[currentAddress]?.district}
        {addresses[currentAddress]?.address?.length > 0 &&
          ", " + addresses[currentAddress]?.address + " "}
        {addresses[currentAddress]?.streetNumber}
      </div>
    );
  }

  const UpdateAddress = () => {
    if (address?.length > 0) {
      updateDoc(doc(db, "users", `${user.id}`), {
        address: {
          number: 1,
          country: map.country,
          region: map.region,
          city: map.city,
          district: map.district,
          address: map.street,
          streetNumber: map.number,
          latitude: map.latitude,
          longitude: map.longitude,
        },
      });
      setAddress("");
      dispatch(setMap(""));
    } else {
      alert("Add address...");
    }
  };

  return (
    <Container style={{ padding: "3vw 0" }} height={height}>
      <Links user={user} />
      <span
        style={{
          fontWeight: "bold",
          display: "flex",
          alignItems: "center",
          gap: "50px",
        }}
      >
        {/* <BsArrowLeftCircleFill /> */}
        {language?.language.User.userPage.address}:
        {/* <BsArrowRightCircleFill /> */}
      </span>
      <>
        {
          <>
            {editAddress ? (
              <div style={{ display: "flex", alignItems: "start", gap: "5px" }}>
                <MapAutocomplete
                  language={language}
                  userMobile="true"
                  address={address}
                  setAddress={setAddress}
                />
                <GiConfirmed
                  className="confirm"
                  onClick={async (e) => {
                    e.preventDefault();
                    await UpdateAddress();
                    SetEditAddress(false);
                  }}
                />
              </div>
            ) : (
              <div
                style={{ display: "flex", alignItems: "center", gap: "5px" }}
              >
                <MdLocationPin className="location" />
                {addressDefined}
                {user?.id === currentuser?.id && currentAddress === 0 && (
                  <FiEdit
                    className="edit"
                    onClick={() => {
                      SetEditAddress(true);
                    }}
                  />
                )}
              </div>
            )}

            <div>
              <Map latitude={latitude} longitude={longitude} />
            </div>
            <div
              style={{
                display: "flex",
                width: "100%",
                alignItems: "center",
                justifyContent: "space-evenly",
              }}
            >
              <div>
                {addresses?.length > 1 && (
                  <BsArrowLeftCircleFill
                    size={24}
                    color={"#ccc"}
                    style={{
                      cursor: currentAddress === 0 ? "auto" : "pointer",
                      opacity: currentAddress === 0 ? "0.5" : 1,
                    }}
                    onClick={
                      currentAddress !== 0
                        ? () => setCurrentAddress(currentAddress - 1)
                        : false
                    }
                  />
                )}
              </div>
              {user?.id === currentuser?.id && (
                <AddAddress
                  language={language}
                  currentuser={currentuser}
                  type="true"
                  address={address}
                  setAddress={setAddress}
                />
              )}
              <div>
                {addresses?.length > 1 && (
                  <BsArrowRightCircleFill
                    size={24}
                    color={"#ccc"}
                    style={{
                      cursor:
                        currentAddress < addresses?.length - 1
                          ? "pointer"
                          : "auto",
                      opacity: currentAddress < addresses?.length - 1 ? 1 : 0.5,
                    }}
                    onClick={
                      currentAddress < addresses?.length - 1
                        ? () => setCurrentAddress(currentAddress + 1)
                        : undefined
                    }
                  />
                )}
              </div>
            </div>
          </>
        }
      </>
    </Container>
  );
};

const Container = styled.div`
  display: none;

  @media only screen and (max-width: 600px) {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 5vw;
    overflow-x: hidden;
    overflow-y: scroll;
    height: calc(${(props) => props.height}px - 70vw);
    color: ${(props) => props.theme.font};
  }

  .location {
    color: red;
    font-size: 4vw;
  }

  .confirm {
    color: green;
    cursor: pointer;
    font-size: 5vw;
    position: relative;
    top: 2vw;
  }
  .edit {
    color: orange;
    cursor: pointer;
    font-size: 4vw;
  }
`;
