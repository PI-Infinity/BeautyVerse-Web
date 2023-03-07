import React from "react";
import styled from "styled-components";
import { RiEdit2Fill } from "react-icons/ri";
import { ImCheckmark } from "react-icons/im";
import {
  FaFacebook,
  FaInstagram,
  FaYoutube,
  FaTiktok,
  FaPhoneAlt,
  FaChrome,
  FaWhatsapp,
  FaTelegram,
} from "react-icons/fa";
import { AiOutlineMail } from "react-icons/ai";
import { useSelector, useDispatch } from "react-redux";
import { db } from "../../firebase";
import {
  getDoc,
  doc,
  serverTimestamp,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { SetCurrentChat } from "../../redux/chat";
import { useNavigate } from "react-router-dom";
import Select from "react-select";
import { countries } from "../../data/countryCodes";

export const Links = ({ user }) => {
  const [edit, setEdit] = React.useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  // import current user & parse it
  const userUnparsed = useSelector((state) => state.storeMain.user);
  let currentuser;
  if (userUnparsed?.length > 0) {
    currentuser = JSON.parse(userUnparsed);
  }

  const [countryCode, setCountryCode] = React.useState({
    value: "+995",
    label: "Georgia",
  });
  const [changePhone, setChangePhone] = React.useState("");
  const [changeWeb, setChangeWeb] = React.useState("");
  const [changeInstagram, setChangeInstagram] = React.useState("");
  const [changeFacebook, setChangeFacebook] = React.useState("");
  const [changeTiktok, setChangeTiktok] = React.useState("");
  const [changeYoutube, setChangeYoutube] = React.useState("");
  const [changeOtherMedia, setChangeOtherMedia] = React.useState("");

  const UpdateLink = (newValue) => {
    const base = doc(db, "users", `${user?.id}`);
    if (changePhone?.length > 0) {
      updateDoc(base, {
        phone: countryCode?.value + changePhone,
      });
      setCountryCode({ value: "+995", label: "Georgia" });
      setChangePhone("");
    }
    if (changeWeb?.length > 0) {
      updateDoc(base, {
        socMedia: {
          web: changeWeb,
          facebook:
            user?.socMedia?.facebook?.length > 0
              ? user?.socMedia?.facebook
              : "",
          instagram:
            user?.socMedia?.instagram?.length > 0
              ? user?.socMedia?.instagram
              : "",
          tiktok:
            user?.socMedia?.tiktok?.length > 0 ? user?.socMedia?.tiktok : "",
          youtube:
            user?.socMedia?.youtube?.length > 0 ? user?.socMedia?.youtube : "",
          telegram:
            user?.socMedia?.telegram === true
              ? user?.socMedia?.telegram
              : false,
          whatsapp:
            user?.socMedia?.whatsapp === true
              ? user?.socMedia?.whatsapp
              : false,
        },
      });
      setChangeWeb("");
    }
    if (changeInstagram?.length > 0) {
      updateDoc(base, {
        socMedia: {
          web: user?.socMedia?.web?.length > 0 ? user?.socMedia?.web : "",
          facebook:
            user?.socMedia?.facebook?.length > 0
              ? user?.socMedia?.facebook
              : "",
          instagram: changeInstagram,
          tiktok:
            user?.socMedia?.tiktok?.length > 0 ? user?.socMedia?.tiktok : "",
          youtube:
            user?.socMedia?.youtube?.length > 0 ? user?.socMedia?.youtube : "",
          telegram:
            user?.socMedia?.telegram === true
              ? user?.socMedia?.telegram
              : false,
          whatsapp:
            user?.socMedia?.whatsapp === true
              ? user?.socMedia?.whatsapp
              : false,
        },
      });
      setChangeInstagram("");
    }
    if (changeFacebook?.length > 0) {
      updateDoc(base, {
        socMedia: {
          web: user?.socMedia?.web?.length > 0 ? user?.socMedia?.web : "",
          facebook: changeFacebook,
          instagram:
            user?.socMedia?.instagram?.length > 0
              ? user?.socMedia?.instagram
              : "",
          tiktok:
            user?.socMedia?.tiktok?.length > 0 ? user?.socMedia?.tiktok : "",
          youtube:
            user?.socMedia?.youtube?.length > 0 ? user?.socMedia?.youtube : "",
          telegram:
            user?.socMedia?.telegram === true
              ? user?.socMedia?.telegram
              : false,
          whatsapp:
            user?.socMedia?.whatsapp === true
              ? user?.socMedia?.whatsapp
              : false,
        },
      });
      setChangeFacebook("");
    }
    if (changeTiktok?.length > 0) {
      updateDoc(base, {
        socMedia: {
          web: user?.socMedia?.web?.length > 0 ? user?.socMedia?.web : "",
          facebook:
            user?.socMedia?.facebook?.length > 0
              ? user?.socMedia?.facebook
              : "",
          instagram:
            user?.socMedia?.instagram?.length > 0
              ? user?.socMedia?.instagram
              : "",
          tiktok: changeTiktok,
          youtube:
            user?.socMedia?.youtube?.length > 0 ? user?.socMedia?.youtube : "",
          telegram:
            user?.socMedia?.telegram === true
              ? user?.socMedia?.telegram
              : false,
          whatsapp:
            user?.socMedia?.whatsapp === true
              ? user?.socMedia?.whatsapp
              : false,
        },
      });
      setChangeTiktok("");
    }
    if (changeYoutube?.length > 0) {
      updateDoc(base, {
        socMedia: {
          web: user?.socMedia?.web?.length > 0 ? user?.socMedia?.web : "",
          facebook:
            user?.socMedia?.facebook?.length > 0
              ? user?.socMedia?.facebook
              : "",
          instagram:
            user?.socMedia?.instagram?.length > 0
              ? user?.socMedia?.instagram
              : "",
          tiktok:
            user?.socMedia?.tiktok?.length > 0 ? user?.socMedia?.tiktok : "",
          youtube:
            user?.socMedia?.youtube?.length > 0 ? user?.socMedia?.youtube : "",
          telegram:
            user?.socMedia?.telegram === true
              ? user?.socMedia?.telegram
              : false,
          whatsapp:
            user?.socMedia?.whatsapp === true
              ? user?.socMedia?.whatsapp
              : false,
        },
      });
      setChangeYoutube("");
    }
    if (changeOtherMedia?.length > 0) {
      updateDoc(base, {
        socMedia: {
          web: user?.socMedia?.web?.length > 0 ? user?.socMedia?.web : "",
          facebook:
            user?.socMedia?.facebook?.length > 0
              ? user?.socMedia?.facebook
              : "",
          instagram:
            user?.socMedia?.instagram?.length > 0
              ? user?.socMedia?.instagram
              : "",
          tiktok:
            user?.socMedia?.tiktok?.length > 0 ? user?.socMedia?.tiktok : "",
          youtube:
            user?.socMedia?.youtube?.length > 0 ? user?.socMedia?.youtube : "",
          otherMedia: user?.socMedia?.changeOtherMedia,
        },
      });
      setChangeOtherMedia("");
    }
    setEdit("");
  };

  const LinkList = [
    {
      id: "email",
      placeholder: user?.email,
      icon: <AiOutlineMail />,
      value: changePhone,
    },
    {
      id: "phone",
      placeholder: user?.phone,
      icon: <FaPhoneAlt />,
      onChange: (e) => setChangePhone(e.target.value),
    },
    {
      id: "web",
      placeholder: user?.socMedia?.web,
      icon: <FaChrome />,
      value: changeWeb,
      onChange: (e) => setChangeWeb(e.target.value),
    },
    {
      id: "facebook",
      placeholder:
        user?.socMedia?.facebook?.length > 0 ? user?.socMedia?.facebook : "",
      icon: <FaFacebook />,
      value: changeFacebook,
      onChange: (e) => setChangeFacebook(e.target.value),
    },
    {
      id: "instagram",
      placeholder: user?.socMedia?.instagram,
      icon: <FaInstagram />,
      value: changeInstagram,
      onChange: (e) => setChangeInstagram(e.target.value),
    },

    {
      id: "tiktok",
      placeholder: user?.socMedia?.tiktok,
      icon: <FaTiktok />,
      value: changeTiktok,
      onChange: (e) => setChangeTiktok(e.target.value),
    },
    {
      id: "youtube",
      placeholder: user?.socMedia?.youtube,
      icon: <FaYoutube />,
      value: changeYoutube,
      onChange: (e) => setChangeYoutube(e.target.value),
    },
  ];

  // send message and navigate to chat
  const handleSelect = async (user) => {
    const combinedId =
      currentuser?.id > user?.id
        ? currentuser?.id + user?.id
        : user?.id + currentuser?.id;

    try {
      const res = await getDoc(doc(db, "chats", combinedId));
      const chatId = await getDoc(
        doc(db, "users", currentuser?.id, "chats", combinedId)
      );
      const chatIdT = await getDoc(
        doc(db, "users", user?.id, "chats", combinedId)
      );
      // if chat not exists
      if (!res.exists() && !chatId.exists() && !chatIdT.exists()) {
        await setDoc(doc(db, "chats", combinedId), { messages: [] });
        await setDoc(doc(db, "users", currentuser?.id, "chats", user?.id), {
          chatId: combinedId,
          ["userInfo"]: {
            id: user?.id,
            // name: user?.name,
            // cover: user?.cover != undefined ? user?.cover : null,
          },
          ["date"]: serverTimestamp(),
        });
        await setDoc(doc(db, "users", user?.id, "chats", currentuser?.id), {
          chatId: combinedId,
          ["userInfo"]: {
            id: currentuser?.id,
            // name: currentuser?.name,
            // cover: currentuser?.cover != undefined ? currentuser?.cover : null,
          },
          ["date"]: serverTimestamp(),
        });
        // if chat already exists
      } else if (res.exists() && (!chatId.exists() || !chatIdT.exists())) {
        await setDoc(doc(db, "users", currentuser?.id, "chats", user?.id), {
          chatId: combinedId,
          ["userInfo"]: {
            id: user?.id,
            // name: user?.name,
            // cover: user?.cover != undefined ? user?.cover : null,
          },
          ["date"]: serverTimestamp(),
        });
        await setDoc(doc(db, "users", user?.id, "chats", currentuser?.id), {
          chatId: combinedId,
          ["userInfo"]: {
            id: currentuser?.id,
            // name: currentuser?.name,
            // cover: currentuser?.cover != undefined ? currentuser?.cover : null,
          },
          ["date"]: serverTimestamp(),
        });
      } else {
        await updateDoc(doc(db, "users", currentuser?.id, "chats", user?.id), {
          chatId: combinedId,
          ["userInfo"]: {
            id: user?.id,
            // name: user?.name,
            // cover: user?.cover != undefined ? user?.cover : null,
          },
          ["date"]: serverTimestamp(),
        });
        await updateDoc(doc(db, "users", user?.id, "chats", currentuser?.id), {
          chatId: combinedId,
          ["userInfo"]: {
            id: currentuser?.id,
            // name: currentuser?.name,
            // cover: currentuser?.cover != undefined ? currentuser?.cover : null,
          },
          ["date"]: serverTimestamp(),
        });
      }
      await dispatch(
        SetCurrentChat([
          {
            chatId: combinedId,
            // cover: user?.cover != undefined ? user?.cover : null,
            // name: user?.name,
            userId: user?.id,
          },
        ])
      );
      navigate(`/chat/${combinedId}`);
    } catch (err) {
      alert(err);
    }
  };

  /// add whatsapp and telegram

  const AddWhatsapp = () => {
    const base = doc(db, "users", `${user?.id}`);
    if (user?.socMedia?.whatsapp === true) {
      updateDoc(base, {
        socMedia: {
          web: user?.socMedia?.web?.length > 0 ? user?.socMedia?.web : "",
          facebook:
            user?.socMedia?.facebook?.length > 0
              ? user?.socMedia?.facebook
              : "",
          instagram:
            user?.socMedia?.instagram?.length > 0
              ? user?.socMedia?.instagram
              : "",
          tiktok:
            user?.socMedia?.tiktok?.length > 0 ? user?.socMedia?.tiktok : "",
          youtube:
            user?.socMedia?.youtube?.length > 0 ? user?.socMedia?.youtube : "",
          telegram:
            user?.socMedia?.telegram === true
              ? user?.socMedia?.telegram
              : false,
          whatsapp: false,
        },
      });
    } else {
      updateDoc(base, {
        socMedia: {
          web: user?.socMedia?.web?.length > 0 ? user?.socMedia?.web : "",
          facebook:
            user?.socMedia?.facebook?.length > 0
              ? user?.socMedia?.facebook
              : "",
          instagram:
            user?.socMedia?.instagram?.length > 0
              ? user?.socMedia?.instagram
              : "",
          tiktok:
            user?.socMedia?.tiktok?.length > 0 ? user?.socMedia?.tiktok : "",
          youtube:
            user?.socMedia?.youtube?.length > 0 ? user?.socMedia?.youtube : "",
          telegram:
            user?.socMedia?.telegram === true
              ? user?.socMedia?.telegram
              : false,
          whatsapp: true,
        },
      });
    }
  };
  const AddTelegram = () => {
    const base = doc(db, "users", `${user?.id}`);
    if (user?.socMedia?.telegram === true) {
      updateDoc(base, {
        socMedia: {
          web: user?.socMedia?.web?.length > 0 ? user?.socMedia?.web : "",
          facebook:
            user?.socMedia?.facebook?.length > 0
              ? user?.socMedia?.facebook
              : "",
          instagram:
            user?.socMedia?.instagram?.length > 0
              ? user?.socMedia?.instagram
              : "",
          tiktok:
            user?.socMedia?.tiktok?.length > 0 ? user?.socMedia?.tiktok : "",
          youtube:
            user?.socMedia?.youtube?.length > 0 ? user?.socMedia?.youtube : "",
          telegram: false,
          whatsapp:
            user?.socMedia?.whatsapp == true ? user?.socMedia?.whatsapp : false,
        },
      });
    } else {
      updateDoc(base, {
        socMedia: {
          web: user?.socMedia?.web?.length > 0 ? user?.socMedia?.web : "",
          facebook:
            user?.socMedia?.facebook?.length > 0
              ? user?.socMedia?.facebook
              : "",
          instagram:
            user?.socMedia?.instagram?.length > 0
              ? user?.socMedia?.instagram
              : "",
          tiktok:
            user?.socMedia?.tiktok?.length > 0 ? user?.socMedia?.tiktok : "",
          youtube:
            user?.socMedia?.youtube?.length > 0 ? user?.socMedia?.youtube : "",
          telegram: true,
          whatsapp:
            user?.socMedia?.whatsapp === true
              ? user?.socMedia?.whatsapp
              : false,
        },
      });
    }
  };

  // define who can see whatsapp
  let whatsapp;
  if (user?.socMedia?.whatsapp) {
    whatsapp = true;
  } else if (
    user?.socMedia?.whatsapp !== true &&
    user?.id === currentuser?.id
  ) {
    whatsapp = true;
  } else {
    whatsapp = false;
  }
  // define who can see telegram
  let telegram;
  if (user?.socMedia?.telegram) {
    telegram = true;
  } else if (
    user?.socMedia?.telegram !== true &&
    user?.id === currentuser?.id
  ) {
    telegram = true;
  } else {
    telegram = false;
  }

  // color mode
  const theme = useSelector((state) => state.storeMain.theme);
  const CustomStyle = {
    singleValue: (base, state) => ({
      ...base,
      color: state.isSelected
        ? theme
          ? "#333"
          : "#f3f3f3"
        : theme
        ? "#f3f3f3"
        : "#333",
    }),
    placeholder: (base, state) => ({
      ...base,
      // height: "1000px",
      color: state.isSelected
        ? theme
          ? "#333"
          : "#f3f3f3"
        : theme
        ? "#f3f3f3"
        : "#333",
      maxHeight: "50px",
    }),
    input: (base, state) => ({
      ...base,
      color: theme ? "#f3f3f3" : "#333",
      fontSize: "16px",
      maxHeight: "100px",
    }),
    multiValue: (base, state) => ({
      ...base,
      backgroundColor: state.isDisabled ? null : "lightblue",
      borderRadius: "20px",
    }),
    multiValueLabel: (base, state) => ({
      ...base,
    }),
    menuList: (base, state) => ({
      ...base,
      backgroundColor: theme ? "#333" : "#f3f3f3",
      zIndex: 1000,
    }),
    option: (base, state) => ({
      ...base,
      backgroundColor: state.isSelected
        ? theme
          ? "#f3f3f3"
          : "#333"
        : theme
        ? "#333"
        : "#f3f3f3",
      color: state.isSelected
        ? theme
          ? "#333"
          : "#f3f3f3"
        : theme
        ? "#f3f3f3"
        : "#333",
    }),
    control: (baseStyles, state) => ({
      ...baseStyles,
      backgroundColor: theme ? "#333" : "#fff",
      borderColor: state.isFocused ? "rgba(0,0,0,0)" : "rgba(0,0,0,0.1)",
      width: "5vw",
      minHeight: "2vw",
      cursor: "pointer",
      "@media only screen and (max-width: 1200px)": {
        width: "23vw",
        fontSize: "16px",
      },
    }),
  };

  return (
    <LinksContainer>
      {user?.id !== currentuser?.id && (
        <SendMessage
          onClick={
            currentuser !== undefined
              ? () => handleSelect(user)
              : () => navigate("/login")
          }
        >
          Send Message
        </SendMessage>
      )}
      {LinkList?.map((item, index) => {
        if (item.id === "phone") {
          if (user?.type !== "user") {
            return (
              <LinkContainer>
                {item.icon}
                {edit == item.id ? (
                  <>
                    <Select
                      // placeholder={language?.language.Auth.auth.workingDays}
                      defaultValue="+995"
                      defaultInputValue="+995"
                      placeholder="+995"
                      value={countryCode}
                      onChange={(value) => {
                        setCountryCode(value);
                      }}
                      styles={CustomStyle}
                      options={countries}
                    />
                    <LinkInput
                      placeholder="Add phone number"
                      type="tel"
                      value={item.value}
                      onChange={item.onChange}
                    />
                  </>
                ) : (
                  <Link>
                    <a
                      style={{ color: "inherit", textDecoration: "none" }}
                      href={`tel://${item.placeholder}`}
                    >
                      {item.placeholder}
                    </a>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "15px",
                      }}
                    >
                      {whatsapp && (
                        <a
                          style={{
                            color: user?.socMedia?.whatsapp
                              ? "inherit"
                              : "gray",
                            textDecoration: "none",
                          }}
                          onClick={
                            user?.id === currentuser?.id
                              ? () => AddWhatsapp()
                              : false
                          }
                          href={
                            user?.id !== currentuser?.id &&
                            `https://wa.me/${item.placeholder}`
                          }
                        >
                          <FaWhatsapp className="icons" />
                        </a>
                      )}
                      {telegram && (
                        <a
                          style={{
                            color: user?.socMedia?.telegram
                              ? "inherit"
                              : "gray",
                            textDecoration: "none",
                          }}
                          onClick={
                            user?.id === currentuser?.id
                              ? () => AddTelegram()
                              : false
                          }
                          href={
                            user?.id !== currentuser?.id &&
                            ` https://t.me/${item.placeholder}`
                          }
                        >
                          <FaTelegram className="icons" />
                        </a>
                      )}
                      {/* <a
                  style={{
                      color: "inherit",
                      textDecoration: "none",
                    }}
                    href={`https://wa.me/${item.placeholder}`}
                  >
                    <FaViber className="icons" />
                  </a> */}
                    </div>
                  </Link>
                )}
                {user?.id === currentuser?.id && (
                  <>
                    {edit == item.id ? (
                      <ImCheckmark
                        className="confirmIcon"
                        onClick={UpdateLink}
                      />
                    ) : (
                      <RiEdit2Fill
                        className="editIcon"
                        onClick={() => setEdit(item.id)}
                      />
                    )}
                  </>
                )}
              </LinkContainer>
            );
          }
        } else {
          return (
            <LinkContainer key={index} edit={edit}>
              {item.icon}
              {edit == item.id ? (
                <LinkInput
                  placeholder={
                    item.placeholder?.length > 0 ? item.placeholder : item.id
                  }
                  value={item.value}
                  onChange={item.onChange}
                />
              ) : (
                <Link>{item?.placeholder}</Link>
              )}
              {user?.id === currentuser?.id && item.id != "email" && (
                <>
                  {edit == item.id ? (
                    <ImCheckmark className="confirmIcon" onClick={UpdateLink} />
                  ) : (
                    <RiEdit2Fill
                      className="editIcon"
                      onClick={() => setEdit(item.id)}
                    />
                  )}
                </>
              )}
            </LinkContainer>
          );
        }
      })}
    </LinksContainer>
  );
};

const LinksContainer = styled.div`
  width: auto;
  min-width: 20vw;
  max-width: 25vw;
  display: flex;
  flex-direction: column;
  align-items: start;
  justify-content: start;
  padding-top: 1vw;
  padding-left: 1vw;
  color: ${(props) => props.theme.font};

  @media only screen and (max-width: 600px) {
    width: 90vw;
    box-sizing: border-box;
    max-width: 90vw;
  }

  .editIcon {
    color: ${(props) => props.theme.disabled};
    cursor: pointer;
    font-size: 1vw;

    @media only screen and (max-width: 600px) {
      font-size: 4vw;
      margin-left: 10px;
    }
  }

  .confirmIcon {
    color: green;
    cursor: pointer;
    font-size: 1vw;

    @media only screen and (max-width: 600px) {
      font-size: 4vw;
      margin-left: 10px;
    }
  }
`;

const SendMessage = styled.div`
  width: 15vw;
  padding: 7px 15px;
  box-sizing: border-box;
  text-align: center;
  margin: 15px 0;
  box-shadow: 0 0.1vw 0.3vw rgba(0, 0, 0, 0.1);
  background: ${(props) => props.theme.categoryItem};
  border-radius: 0.5vw;
  cursor: pointer;
  font-weight: bold;
  color: ${(props) => props.theme.font};
  font-size: 14px;

  @media only screen and (max-width: 600px) {
    margin: 0 0 15px 0;
    padding: 12px;
    border-radius: 1.5vw;
    width: 100%;
  }

  :hover {
    filter: brightness(0.98);
  }
`;

const LinkContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 1vw;
  font-size: 14px;
  height: 2vw;
  color: ${(props) => props.theme.filterFontActive};
  width: auto;
  max-width: 20vw;
  border-bottom: 1px solid ${(props) => props.theme.lineColor};

  @media only screen and (max-width: 600px) {
    width: 100vw;
    height: 9vw;
    box-sizing: border-box;
    max-width: 100vw;
  }
`;

const LinkInput = styled.input`
  border: none;
  background: none;
  width: auto;
  max-width: 8vw;
  height: 90%;
  margin: 0;
  border-radius: 0.5vw;
  text-align: start;
  color: ${(props) => props.theme.font};
  font-size: 16px;

  :placeholder {
    text-align: start;
    font-size: 14px;
    font-weight: bold;
    padding-left: 0.5vw;
    color: green;
  }

  :focus {
    outline: none;
  }
`;

const Link = styled.span`
  font-size: 14px;
  font-weight: bold;
  border: none;
  background: none;
  width: auto;
  max-width: 15vw;
  height: 100%;
  margin: 0;
  overflow: hidden;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 1vw;

  @media only screen and (max-width: 600px) {
    height: 5vw;
    max-width: 80vw;
    position: relative;
    left: 3vw;
    margin-right: 3vw;
    gap: 7vw;
  }

  .icons {
    font-size: 16px;
    margin-top: 0.25vw;
  }
`;
