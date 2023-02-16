import React from "react";
import styled from "styled-components";
import { ImProfile } from "react-icons/im";
import { BiShoppingBag } from "react-icons/bi";
import { FcBusinessContact } from "react-icons/fc";
import { useSelector, useDispatch } from "react-redux";
import { CoverUploader } from "../../components/coverUploader";
import { MdLocationPin } from "react-icons/md";
import { BsBrush } from "react-icons/bs";
import { ImCheckmark } from "react-icons/im";
import { RiEdit2Fill, RiHomeHeartLine } from "react-icons/ri";
import { setCover } from "../../redux/main";
import { ref, uploadBytes, listAll, getDownloadURL } from "firebase/storage";
import { db, storage, auth } from "../../firebase";
import { collection, doc, updateDoc } from "firebase/firestore";
import GoogleMapReact from "google-map-react";
import Map from "../../components/map";
import { FaUser } from "react-icons/fa";
import { GiConfirmed } from "react-icons/gi";
import { FiEdit } from "react-icons/fi";
import MapAutocomplete from "../../components/mapAutocomplete";
import Avatar from "@mui/material/Avatar";
import { useNavigate } from "react-router-dom";

const CoverSection = React.memo(function ({ user, latitude, longitude }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  // import current user from redux state
  const userUnparsed = useSelector((state) => state.storeMain.user);
  let currentUser;
  if (userUnparsed?.length > 0) {
    currentUser = JSON.parse(userUnparsed);
  }

  // define user type
  const rerender = useSelector((state) => state.storeMain.rerender);

  // edit name
  const [edit, setEdit] = React.useState(false);

  const [editName, setEditName] = React.useState("");

  const UpdateLink = () => {
    const base = doc(db, "users", `${user?.id}`);
    if (editName?.length > 0) {
      updateDoc(base, {
        name: editName,
      });
      setEditName("");
    }
    setEdit(false);
  };

  // capitilize firs letter
  function capitalizeFirstLetter(string) {
    return string?.charAt(0).toUpperCase() + string?.slice(1);
  }

  const name = capitalizeFirstLetter(user?.name);
  const userType = capitalizeFirstLetter(user?.type);

  // define cover icon

  let coverIcon;
  if (user?.type == "shop") {
    coverIcon = <BiShoppingBag />;
  } else if (user?.type == "beautyCenter") {
    coverIcon = <RiHomeHeartLine />;
  } else if (user?.type == "specialist") {
    coverIcon = <BsBrush />;
  } else {
    coverIcon = <ImProfile />;
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
    <InfoSide>
      <ProfileImg>
        <CoverUploader cover="cover" user={user} />
      </ProfileImg>
      <TitleContainer>
        <Type>{userType}</Type>
        <Title edit={edit}>
          {coverIcon}
          {edit ? (
            <>
              <div>
                <NameInput
                  placeholder={user?.name}
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                />
              </div>
              <ImCheckmark className="editIcon" onClick={UpdateLink} />
            </>
          ) : (
            <>
              <div>
                <span>{name}</span>
              </div>
              {currentUser?.id === user?.id && (
                <RiEdit2Fill
                  className="editIcon"
                  onClick={() => setEdit(true)}
                />
              )}
            </>
          )}
        </Title>
      </TitleContainer>
      <WorkingInfo>
        <div style={{ zIndex: 4 }}>
          <div style={{ position: "relative", top: "8vw" }}>
            <Map latitude={latitude} longitude={longitude} />
          </div>
        </div>
        <StaticInfo>
          <Location>
            <MdLocationPin className="location" />{" "}
            {editAdress ? (
              <>
                <MapAutocomplete />
                <GiConfirmed
                  className="confirm"
                  onClick={async (e) => {
                    e.preventDefault();
                    await UpdateAdress();
                    SetEditAdress(false);
                  }}
                />
              </>
            ) : (
              <>
                <div>
                  {user?.adress.country}, {user?.adress.city},{" "}
                  {user?.adress.destrict}
                  {user?.adress.destrict?.length > 0 ? "," : ""}{" "}
                  {user?.adress.adress}
                  {user?.adress.streetNumber?.length > 0 ? " N" : ""}
                  {user?.adress.streetNumber}
                </div>
                <FiEdit
                  className="edit"
                  onClick={() => {
                    SetEditAdress(true);
                  }}
                />
              </>
            )}
          </Location>
        </StaticInfo>
      </WorkingInfo>
    </InfoSide>
  );
});

export default CoverSection;

const InfoSide = styled.div`
  width: 70%;
  box-shadow: 0 0.1vw 0.3vw ${(props) => props.theme.shadowColor};
  border-radius: 0 0 5px 5px;
  padding: 1.5vw;
  display: flex;
  align-items: center;
  justify-content: start;

  @media only screen and (max-width: 600px) {
    width: 100%;
    box-sizing: border-box;
    padding: 3vw 4vw;
  }
`;

const ProfileImg = styled.div`
  background: #fff;
  width: 8vw;
  height: 8vw;
  border-radius: 50vw;
  box-shadow: 0 0 0 0.3vw rgba(2, 2, 2, 0.05);
  overflow: hidden;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;

  @media only screen and (max-width: 600px) {
    box-shadow: 0 0 0 1vw rgba(2, 2, 2, 0.05);
    width: 20vw;
    height: 20vw;
    border-radius: 50vw;
    padding: 0;
  }

  .undefinedUserIcon {
    font-size: 4vw;
    color: ${(props) => props.theme.disabled};
    position: relative;
    left: 3vw;

    @media only screen and (max-width: 600px) {
      font-size: 10vw;
      left: 5vw;
    }
  }

  .undefinedLogo {
    font-size: 1.5vw;
    font-weight: bold;
    color: ${(props) => props.theme.disabled};
    position: relative;
    left: 3vw;

    @media only screen and (max-width: 600px) {
      font-size: 5vw;
    }
  }
`;

const CoverImg = styled.img`
  object-fit: cover;
  width: 9vw;
  height: 9vw;
  z-index: 5;

  @media only screen and (max-width: 600px) {
    width: 22vw;
    height: 22vw;
    position: relative;
    border-radius: 50vw;
  }
`;

const AddImg = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 15vw;
  height: 15vw;
  border: 0.25vw solid #fff;
  border-radius: 0.5vw;

  @media only screen and (max-width: 600px) {
    width: 22vw;
    height: 22vw;
    border-radius: 50vw;
    position: relative;
  }

  .uploaderIcon {
    font-size: 5vw;
    color: color: ${(props) => props.theme.disabled};
    position: relative;
    left: 5vw;

    @media only screen and (max-width: 600px) {
      font-size: 15vw;
    }
  }
`;

const TitleContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: start;
  justify-content: space-between;
  padding-left: 2vw;
  width: 30vw;

  @media only screen and (max-width: 600px) {
    min-width: 50vw;
    width: auto;
    padding-left: 6vw;
  }
`;

const Title = styled.span`
  font-size: 1.2vw;
  font-weight: bold;
  letter-spacing: 0.03vw;
  margin: 0.5vw 0;
  display: flex;
  align-items: center;
  justify-content: start;
  gap: 0.5vw;
  width: 100%;
  color: ${(props) => props.theme.font};

  @media only screen and (max-width: 600px) {
    font-size: 4vw;
    margin: 1.5vw 0;
    gap: 1.5vw;
    letter-spacing: 0.2vw;
  }

  & > div {
    width: auto;
    height: 2vw;

    @media only screen and (max-width: 600px) {
      height: 6vw;
    }
  }

  .editIcon {
    color: ${(props) => (props.edit ? "green" : "#ddd")};
    cursor: pointer;
  }
`;

const NameInput = styled.input`
  border: none;
  width: 15vw;
  margin: 0;
  background: white;
  border-radius: 0.5vw;
  font-size: 1.2vw;
  font-weight: bold;
  letter-spacing: 0.03vw;
  padding: 0;

  @media only screen and (max-width: 600px) {
    width: 35vw;
    border-radisu: 1.5vw;
    font-size: 16px;
  }

  :placeholder {
    font-size: 1.2vw;
    font-weight: bold;
    letter-spacing: 0.03vw;
    width: 100%;
    color: #e5e5e5;

    @media only screen and (max-width: 600px) {
      font-size: 3.5vw;
    }
  }

  :focus {
    outline: none;

    @media only screen and (max-width: 600px) {
      box-shadow: 0 0.3vw 0.6vw #ccc;
    }
  }
`;

const Name = styled.span`
  font-size: 1vw;
  font-weight: bold;
  border: none;
  background: none;
  width: auto;
  max-width: 15vw;
  height: 1.5vw;
  margin: 0;
  overflow: hidden;
  cursor: pointer;

  @media only screen and (max-width: 600px) {
    font-size: 3vw;
  }
`;

const Type = styled.span`
  color: ${(props) => props.theme.secondLevel};
  font-size: 1.1vw;
  font-weight: bold;
  letter-spacing: 0.03vw;

  @media only screen and (max-width: 600px) {
    font-size: 3.5vw;
  }
`;

const Services = styled.span`
  color: ${(props) => props.theme.filterFontActive};
  font-size: 0.9vw;
  letter-spacing: 0.03vw;

  @media only screen and (max-width: 600px) {
    font-size: 3.5vw;
    letter-spacing: 0.1vw;
  }
`;
const WorkingInfo = styled.div`
  display: flex;
  flex-direction: column;
  align-items: start;
  justify-content: flex-end;
  width: 40%;
  height: 10vw;
  box-shadow: 0 0.1vw 0.3vw rgba(2, 2, 2, 0.1);
  overflow: hidden;
  border-radius: 0.5vw;
  z-index: 9;

  @media only screen and (max-width: 600px) {
    font-size: 3.5vw;
    letter-spacing: 0.1vw;
    display: none;
  }

  .workingInfoIcon {
    font-size: 1.5vw;

    @media only screen and (max-width: 600px) {
      font-size: 3.5vw;
      letter-spacing: 0.1vw;
    }
  }
`;

const StaticInfo = styled.div`
  z-index: 5;
  background: rgba(255, 255, 255, 0.9);
  padding: 1vw;
  margin: 0 0 0.5vw 0.5vw;
  border-radius: 0.5vw;
  display: flex;
  flex-direction: column;
  align-items: start;
  justify-content: start;
  gap: 0.5vw;

  @media only screen and (max-width: 600px) {
    display: none;
  }
`;

const Location = styled.div`
  color: #444;
  font-size: 0.75vw;
  letter-spacing: 0.03vw;
  display: flex;
  align-items: center;
  justify-content: start;
  gap: 0.25vw;
  text-align: end;

  .location {
    color: red;
  }

  .confirm {
    color: green;
    cursor: pointer;
  }
  .edit {
    color: orange;
    cursor: pointer;
  }
`;
