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
import { collection, doc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase";
import { useOutletContext } from "react-router-dom";

export const Contact = () => {
  const [user] = useOutletContext();
  // get user by params id
  const { Id } = useParams();
  const { height, width } = useWindowDimensions();

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

  // edit adress
  const map = useSelector((state) => state.storeRegister.map);
  const [editAdress, SetEditAdress] = React.useState("");
  const [adress, SetAdress] = React.useState("");

  const UpdateAdress = () => {
    updateDoc(doc(db, "users", `${user.id}`), {
      adress: {
        country: map.country,
        region: map.region,
        city: map.city,
        destrict: map.destrict,
        adress: map.street,
        streetNumber: map.number,
        latitude: map.latitude,
        longitude: map.longitude,
      },
    });
  };

  return (
    <Container style={{ padding: "3vw 0" }} height={height}>
      <Links user={user} />
      <span style={{ fontWeight: "bold" }}>მისამართი:</span>

      {editAdress ? (
        <div style={{ display: "flex", alignItems: "start", gap: "5px" }}>
          <MapAutocomplete />
          <GiConfirmed
            className="confirm"
            onClick={async (e) => {
              e.preventDefault();
              await UpdateAdress();
              SetEditAdress(false);
            }}
          />
        </div>
      ) : (
        <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
          <MdLocationPin className="location" />
          <div style={{ width: "80vw", textAlign: "center", fontSize: "3vw" }}>
            {user?.adress?.country}, {user?.adress?.city},{" "}
            {user?.adress?.destrict}
            {user?.adress?.destrict?.length > 0 ? "," : ""}{" "}
            {user?.adress?.adress}
            {user?.adress?.streetNumber?.length > 0 ? " N" : ""}
            {user?.adress?.streetNumber}
          </div>
          <FiEdit
            className="edit"
            onClick={() => {
              SetEditAdress(true);
            }}
          />
        </div>
      )}

      <div>
        <Map
          latitude={user?.adress?.latitude}
          longitude={user?.adress?.longitude}
        />
      </div>
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
