import React from "react";
import styled from "styled-components";
import { ImProfile } from "react-icons/im";
import { BiShoppingBag } from "react-icons/bi";
import { useSelector, useDispatch } from "react-redux";
import { CoverUploader } from "../../components/coverUploader";
import { MdLocationPin } from "react-icons/md";
import { BsBrush } from "react-icons/bs";
import { ImCheckmark } from "react-icons/im";
import { RiEdit2Fill, RiHomeHeartLine } from "react-icons/ri";
import { db } from "../../firebase";
import Map from "../../components/map";
import { GiConfirmed } from "react-icons/gi";
import { FiEdit } from "react-icons/fi";
import MapAutocomplete from "../../components/mapAutocomplete";
import { useNavigate } from "react-router-dom";
import {
  setDoc,
  doc,
  deleteDoc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { v4 } from "uuid";
import { BsArrowRightCircleFill, BsArrowLeftCircleFill } from "react-icons/bs";

const CoverSection = React.memo(function ({ user, language }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  // import current user from redux state
  const userUnparsed = useSelector((state) => state.storeMain.user);
  let currentuser;
  if (userUnparsed?.length > 0) {
    currentuser = JSON.parse(userUnparsed);
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
    if (map?.country?.length > 0) {
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
    } else {
      alert("Add Adress..");
    }
  };

  const [type, setType] = React.useState("");

  React.useEffect(() => {
    setType("");
    if (userType === "Specialist") {
      setType(language?.language.User.userPage.specialist);
    } else if (userType === "BeautyCenter") {
      setType(language?.language.User.userPage.beautySalon);
    } else {
      setType(language?.language.User.userPage.user);
    }
  }, [language]);

  // import followings
  const folls = useSelector((state) => state.storeMain.followings);
  let followings;
  if (folls?.length > 0) {
    followings = JSON.parse(folls);
  }

  // define if props user is in your followings list
  const following = followings.find((item) => item?.id == user?.id);
  const userToFollow = user;

  // function to follow user
  const FollowToUser = async () => {
    var actionId = v4();
    await setDoc(
      doc(db, `users`, `${currentuser?.id}`, "followings", `${user?.id}`),
      {
        id: user?.id,
        cover: user?.cover ? user?.cover : "",
        name: user?.name,
        date: serverTimestamp(),
      }
    );
    await setDoc(
      doc(db, `users`, `${user?.id}`, "followers", `${currentuser?.id}`),
      {
        id: currentuser?.id,
        cover: currentuser?.cover ? currentuser?.cover : "",
        name: currentuser?.name,
        date: serverTimestamp(),
      }
    );
    if (user?.id !== currentuser?.id) {
      setDoc(doc(db, `users`, `${user?.id}`, "notifications", `${actionId}`), {
        id: actionId,
        senderId: currentuser?.id,
        senderName: currentuser?.name,
        senderCover: currentuser?.cover?.length > 0 ? currentuser?.cover : "",
        text: `ჩაინიშნა თქვენი პერსონალური გვერდი!`,
        date: serverTimestamp(),
        type: "following",
        status: "unread",
      });
    }
  };

  // function to unfollow user
  const UnFollowToUser = async () => {
    console.log("click");
    await deleteDoc(
      doc(db, `users`, `${currentuser?.id}`, "followings", `${user?.id}`)
    );
  };

  /**
   * change addresses
   */

  const [shownAddress, setShownAddress] = React.useState(0);
  let latitude;
  let longitude;
  let address;
  if (shownAddress === 0) {
    latitude = user?.adress?.latitude;
    longitude = user?.adress?.longitude;
    address = (
      <div>
        {user?.adress.city}, {user?.adress.destrict}
        {user?.adress.destrict?.length > 0 ? "," : ""} {user?.adress.adress}
        {user?.adress.streetNumber?.length > 0 ? " N" : ""}
        {user?.adress.streetNumber}
      </div>
    );
  }

  return (
    <InfoSide>
      <CoverUploader cover="cover" user={user} />
      <TitleContainer>
        <Type>{type}</Type>
        <Title edit={edit} following={following?.id?.length?.toString()}>
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
                <span>{name}</span>{" "}
                {currentuser?.id !== user?.id && (
                  <>
                    {following?.id?.length > 0 ? (
                      <ImCheckmark
                        className="followIcon"
                        following="true"
                        onClick={UnFollowToUser}
                      />
                    ) : (
                      <ImCheckmark
                        className="followIcon"
                        onClick={
                          currentuser != undefined
                            ? FollowToUser
                            : () => navigate("/login")
                        }
                      />
                    )}
                  </>
                )}
              </div>
              {currentuser?.id === user?.id && (
                <RiEdit2Fill
                  className="editIcon"
                  onClick={() => setEdit(true)}
                />
              )}
            </>
          )}
        </Title>
      </TitleContainer>
      {/* <div
        style={{
          display: "none",
          alignItems: "center",
          gap: "15px",
          width: "45%",
        }}
      > */}
      {/* {user?.address2 !== undefined && (
        <BsArrowLeftCircleFill
          size={24}
          color={"#ccc"}
          style={{ cursor: "pointer" }}
        />
      )} */}
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
                <MapAutocomplete language={language} />
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
                {address}
                <>
                  {currentuser?.id === user?.id && (
                    <FiEdit
                      className="edit"
                      onClick={() => {
                        SetEditAdress(true);
                      }}
                    />
                  )}
                </>
              </>
            )}
          </Location>
        </StaticInfo>
      </WorkingInfo>
      {/* <BsArrowRightCircleFill
        size={24}
        color={"#ccc"}
        style={{ cursor: "pointer" }}
      /> */}
      {/* </div> */}
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
  box-sizing: border-box;

  @media only screen and (max-width: 600px) {
    width: 100%;
    padding: 3vw 4vw;
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

  // & > div {
  //   width: auto;
  //   height: 2vw;

  //   @media only screen and (max-width: 600px) {
  //     height: 6vw;
  //   }
  // }

  .editIcon {
    color: ${(props) => (props.edit ? "green" : "#ddd")};
    cursor: pointer;
  }

  .followIcon {
    font-size: 1.1vw;
    color: ${(props) => (props.following > 0 ? "#2bdfd9" : "#ddd")};
    margin-left: 0.5vw;
    cursor: pointer;

    @media only screen and (max-width: 600px) {
      font-size: 4.5vw;
      margin-left: 1.5vw;
    }
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
  gap: 15px;

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
