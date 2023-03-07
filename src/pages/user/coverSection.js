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
import AddAddress from "../../pages/user/addAddressPopup";
import { IsMobile } from "../../functions/isMobile";
import { setMap } from "../../redux/register";
import TextField from "@mui/material/TextField";

const CoverSection = React.memo(function ({ user, language }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isMobile = IsMobile();
  // import current user from redux state
  const userUnparsed = useSelector((state) => state.storeMain.user);
  let currentuser;
  if (userUnparsed?.length > 0) {
    currentuser = JSON.parse(userUnparsed);
  }

  // define user type
  const rerender = useSelector((state) => state.storeMain.rerender);
  const theme = useSelector((state) => state.storeMain.theme);
  // edit name
  const [edit, setEdit] = React.useState(false);

  const [editName, setEditName] = React.useState("");

  const UpdateName = () => {
    const base = doc(db, "users", `${user?.id}`);
    if (editName?.length > 0) {
      updateDoc(base, {
        name: editName,
      });
      setEditName("");
      setTimeout(() => {
        setEdit(false);
      }, 300);
    }
    setEdit(false);
  };
  // edit type
  const [editUsername, setEditUsername] = React.useState(false);

  const [username, setUsername] = React.useState("");

  const UpdateUsername = () => {
    const base = doc(db, "users", `${user?.id}`);
    if (username?.length > 0) {
      updateDoc(base, {
        username: username,
      });
      setEditName("");
      setTimeout(() => {
        setEditUsername(false);
      }, 300);
    }
    setEditUsername(false);
  };
  // edit about
  const [editAbout, setEditAbout] = React.useState(false);

  const [about, setAbout] = React.useState(user?.about);

  const UpdateAbout = async () => {
    const base = doc(db, "users", `${user?.id}`);
    await updateDoc(base, {
      about: about,
    });
    setAbout("");
    setTimeout(() => {
      setEditAbout(false);
    }, 300);

    setEditAbout(false);
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

  // edit address
  const map = useSelector((state) => state.storeRegister.map);
  const [editAddress, SetEditAddress] = React.useState("");
  const [addressInput, SetAddressInput] = React.useState("");

  /// address for autocomplete
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
      <div>
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

  // update main address

  const UpdateAddress = () => {
    if (map?.country?.length > 0) {
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
      dispatch(setMap(""));
      setAddress("");
    } else {
      alert("Add Address..");
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
        date: serverTimestamp(),
      }
    );
    await setDoc(
      doc(db, `users`, `${user?.id}`, "followers", `${currentuser?.id}`),
      {
        id: currentuser?.id,
        date: serverTimestamp(),
      }
    );
    if (user?.id !== currentuser?.id) {
      setDoc(doc(db, `users`, `${user?.id}`, "notifications", `${actionId}`), {
        id: actionId,
        senderId: currentuser?.id,
        text: `ჩაინიშნა თქვენი პერსონალური გვერდი!`,
        date: serverTimestamp(),
        type: "following",
        status: "unread",
      });
    }
  };

  // function to unfollow user
  const UnFollowToUser = async () => {
    await deleteDoc(
      doc(db, `users`, `${currentuser?.id}`, "followings", `${user?.id}`)
    );
  };

  return (
    <InfoSide>
      <CoverUploader cover="cover" user={user} />
      <TitleContainer>
        {editUsername ? (
          <Wrapper1>
            <Wrapper2>
              <div
                style={{
                  position: "fixed",
                  height: "1.5vw",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <WhiteBorderTextField
                  onChange={(e) => setUsername(e.target.value)}
                  size="small"
                  autoFocus
                  placeholder={`Max. 30 letters`}
                  value={username}
                  sx={{
                    input: { color: theme ? "#fff" : "#151515" },
                    fontSize: "16px",
                    fontWeight: "bold",
                  }}
                  id="standard-basic"
                  label={`${username?.length}`}
                  variant="outlined"
                />
              </div>
            </Wrapper2>
            <ImCheckmark
              className="uploaderIcon"
              color="green"
              onClick={
                username?.length < 31
                  ? () => UpdateUsername()
                  : () => alert("Max length 30 letters")
              }
            />
          </Wrapper1>
        ) : (
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <Type>{user?.username != undefined ? user?.username : type}</Type>
            {currentuser?.id === user?.id && (
              <RiEdit2Fill
                className="editIcon"
                onClick={() => setEditUsername(true)}
              />
            )}
          </div>
        )}
        <Title edit={edit} following={following?.id?.length?.toString()}>
          {coverIcon}
          {edit ? (
            <>
              <Wrapper1>
                <Wrapper2>
                  <div>
                    <WhiteBorderTextField
                      size="small"
                      autoFocus
                      placeholder={`Max. 30 letters`}
                      label={`${name?.length}`}
                      value={editName}
                      sx={{
                        input: { color: theme ? "#fff" : "#151515" },
                        fontSize: "16px",
                        fontWeight: "bold",
                      }}
                      onChange={(e) => setEditName(e.target.value)}
                      id="standard-basic"
                      variant="outlined"
                    />
                  </div>
                </Wrapper2>
                <ImCheckmark
                  className="uploaderIcon"
                  color="green"
                  onClick={
                    name?.length < 31
                      ? () => UpdateName()
                      : () => alert("Max length 30 letters")
                  }
                />
              </Wrapper1>
            </>
          ) : (
            <>
              <div
                style={{
                  height: "1.5vw",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <h3 style={{ margin: 0 }}>{name}</h3>{" "}
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

        <About>
          {editAbout ? (
            <>
              <Wrapper1>
                <Wrapper2>
                  <WhiteBorderTextField
                    editAbout={editAbout?.toString()}
                    id="standard-basic"
                    multiline
                    rows={2}
                    autoFocus
                    placeholder={`Max. 100 letters`}
                    label={`${about?.length}`}
                    value={about}
                    sx={{
                      inputStyle: { color: theme ? "#fff" : "#151515" },
                      input: { color: theme ? "#fff" : "#151515" },
                      fontSize: "16px",
                      fontWeight: "normal",
                      background: editAbout ? "#151515" : "none",
                      width: isMobile ? "100%" : "300px",
                    }}
                    onChange={(e) => setAbout(e.target.value)}
                    variant="outlined"
                  />
                </Wrapper2>
              </Wrapper1>
              <ImCheckmark
                className="followIcon"
                color="green"
                onClick={
                  about?.length < 101
                    ? () => UpdateAbout()
                    : () => alert("Max length 100 letters")
                }
              />
            </>
          ) : (
            <div style={{ display: "flex" }}>
              <div
                style={{
                  height: "1.5vw",
                  display: "flex",
                  alignItems: "center",
                  whiteSpace: "normal",
                  width: "100%",
                }}
              >
                {user?.about?.length > 0 && (
                  <div
                    style={{
                      margin: 0,
                      whiteSpace: "normal",
                      lineBreak: "auto",
                    }}
                  >
                    {user?.about?.length < 1 ? (
                      <span style={{ width: "80px" }}>About you</span>
                    ) : (
                      <span>{user?.about}</span>
                    )}
                  </div>
                )}
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
                  onClick={() => setEditAbout(true)}
                />
              )}
            </div>
          )}
        </About>
      </TitleContainer>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "1.5vw",
          width: "50%",
          minWidth: "50%",
        }}
      >
        {!isMobile && user?.id === currentuser?.id && (
          <AddAddress
            language={language}
            currentuser={currentuser}
            type="dekstop"
            address={address}
            setAddress={setAddress}
          />
        )}
        {addresses?.length > 1 && !isMobile && (
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
                : undefined
            }
          />
        )}
        <WorkingInfo>
          <div style={{ zIndex: 4 }}>
            <div style={{ position: "relative", top: "8vw" }}>
              <Map latitude={latitude} longitude={longitude} />
            </div>
          </div>

          <StaticInfo>
            <Location>
              <MdLocationPin className="location" />{" "}
              {editAddress ? (
                <>
                  <MapAutocomplete
                    language={language}
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
                </>
              ) : (
                <>
                  {addressDefined}
                  <>
                    {currentuser?.id === user?.id && currentAddress === 0 && (
                      <FiEdit
                        className="edit"
                        onClick={() => {
                          SetEditAddress(true);
                        }}
                      />
                    )}
                  </>
                </>
              )}
            </Location>
          </StaticInfo>
        </WorkingInfo>
        {addresses?.length > 1 && !isMobile && (
          <BsArrowRightCircleFill
            size={24}
            color={"#ccc"}
            style={{
              cursor:
                currentAddress < addresses?.length - 1 ? "pointer" : "auto",
              opacity: currentAddress < addresses?.length - 1 ? 1 : 0.5,
            }}
            onClick={
              currentAddress < addresses?.length - 1
                ? () => setCurrentAddress(currentAddress + 1)
                : false
            }
          />
        )}
      </div>
    </InfoSide>
  );
});

export default CoverSection;

const InfoSide = styled.div`
  width: 70%;
  box-shadow: 0 0.1vw 0.3vw ${(props) => props.theme.shadowColor};
  border-radius: 0 0 5px 5px;
  padding: 15px;
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
      font-size: 5vw;
    }
  }
`;

const TitleContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: start;
  justify-content: start;
  padding-left: 2vw;
  width: 30vw;
  white-space: nowrap;
  max-width: 60vw;
  min-height: 130px;

  @media only screen and (max-width: 600px) {
    position: relative;
    top: 6vw;
    min-width: auto;
    width: auto;
    height: auto;
    padding-left: 6vw;
  }

  .editIcon {
    font-size: 1.1vw;
    color: ${(props) => (props.following > 0 ? "#2bdfd9" : "#ddd")};
    margin-left: 0.5vw;
    cursor: pointer;

    @media only screen and (max-width: 600px) {
      font-size: 3.5vw;
      margin-left: 15px;
    }
  }
`;

const Title = styled.h2`
  font-size: 18px;
  font-weight: bold;
  letter-spacing: 0.03vw;
  margin: 10px 0 0 0;
  height: 1.5vw;
  display: flex;
  align-items: center;
  justify-content: start;
  gap: 0.5vw;
  width: 100%;
  color: ${(props) => props.theme.font};
  transition: ease 200ms;

  @media only screen and (max-width: 600px) {
    font-size: 16px;
    margin: 20px 0 0 10px;
    gap: 15px;
    letter-spacing: 0.2vw;
  }

  .editIcon {
    font-size: 1.1vw;
    color: ${(props) => (props.following > 0 ? "#2bdfd9" : "#ddd")};
    margin-left: 0.5vw;
    cursor: pointer;

    @media only screen and (max-width: 600px) {
      font-size: 4.5vw;
    }
  }

  .followIcon {
    font-size: 1.1vw;
    color: ${(props) => (props.following > 0 ? "#2bdfd9" : "#ddd")};
    margin-left: 0.5vw;
    cursor: pointer;

    @media only screen and (max-width: 600px) {
      font-size: 4.5vw;
      margin-left: 15px;
    }
  }
`;

const Wrapper1 = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;

  .uploaderIcon {
    font-size: 1vw;
    color: color: ${(props) => props.theme.disabled};
    cursor: pointer;

    @media only screen and (max-width: 600px) {
      font-size: 5vw;
    }
  }
`;
const Wrapper2 = styled.div`
  width: 350px;
  height: 1.5vw;

  @media only screen and (max-width: 600px) {
    width: 60vw;
  }
`;

const WhiteBorderTextField = styled(TextField)`
  & label.Mui-focused {
    color: ${(props) => props.theme.font};
  }
  & .MuiOutlinedInput-root {
    color: ${(props) => props.theme.font};
    &.Mui-focused fieldset {
      width: 300px;
      @media only screen and (max-width: 600px) {
        width: 55vw;
      }
      border-color: ${(props) => props.theme.secondLevel};
    }
  }
  & multilineccolor: {
    color: red;
  }
`;

const Name = styled.h2`
  font-size: 18px;
  font-weight: bold;
  border: none;
  background: none;
  width: auto;
  max-width: 15vw;
  height: 1.5vw;
  margin: 0;
  overflow: hidden;
  cursor: pointer;
  display: flex;
  align-items: center;

  @media only screen and (max-width: 600px) {
    font-size: 16px;
  }
`;

const Type = styled.p`
  color: ${(props) => props.theme.font};
  font-size: 14px;
  font-weight: bold;
  letter-spacing: 0.03vw;
  height: 1.5vw;
  margin: 0;
  display: flex;
  align-items: center;
`;

const About = styled.div`
  margin: 1vw 0 0 0;
  width: 400px;
  height: auto;
  white-space: normal;
  color: ${(props) => props.theme.font};
  font-size: 14px;
  font-weight: normal;
  letter-spacing: 0.03vw;
  gap: 10px;
  display: flex;
  justify-content: start;
  align-items: start;

  .editIcon {
    font-size: 1.1vw;
    color: ${(props) => (props.following > 0 ? "#2bdfd9" : "#ddd")};
    margin-left: 0.5vw;
    cursor: pointer;

    @media only screen and (max-width: 600px) {
      font-size: 3.5vw;
      margin-left: 15px;
    }
  }

  @media only screen and (max-width: 600px) {
    width: 68vw;
    margin-top: 5vw;
  }
`;

const WorkingInfo = styled.div`
  display: flex;
  flex-direction: column;
  align-items: start;
  justify-content: flex-end;
  width: 100%;
  height: 10vw;
  box-shadow: 0 0.1vw 0.3vw rgba(2, 2, 2, 0.1);
  overflow: hidden;
  border-radius: 0.5vw;
  z-index: 9;
  gap: 15px;

  @media only screen and (max-width: 600px) {
    font-size: 14px;
    letter-spacing: 0.1vw;
    display: none;
  }

  .workingInfoIcon {
    font-size: 15px;

    @media only screen and (max-width: 600px) {
      font-size: 14px;
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
  font-size: 14px;
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
