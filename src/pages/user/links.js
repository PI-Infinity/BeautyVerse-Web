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

  const [changeEmail, setChangeEmail] = React.useState("");
  const [changeWeb, setChangeWeb] = React.useState("");
  const [changeInstagram, setChangeInstagram] = React.useState("");
  const [changeFacebook, setChangeFacebook] = React.useState("");
  const [changeTiktok, setChangeTiktok] = React.useState("");
  const [changeYoutube, setChangeYoutube] = React.useState("");
  const [changeOtherMedia, setChangeOtherMedia] = React.useState("");

  const UpdateLink = (newValue) => {
    const base = doc(db, "users", `${user?.id}`);
    if (changeEmail?.length > 0) {
      updateDoc(base, {
        email: changeEmail,
      });
      setChangeEmail("");
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
      id: "phone",
      placeholder: user?.phone,
      icon: <FaPhoneAlt />,
    },
    {
      id: "email",
      placeholder: user?.email,
      icon: <AiOutlineMail />,
      onChange: (e) => setChangeEmail(e.target.value),
      value: changeEmail,
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
            name: user?.name,
            cover: user?.cover != undefined ? user?.cover : null,
          },
          ["date"]: serverTimestamp(),
        });
        await setDoc(doc(db, "users", user?.id, "chats", currentuser?.id), {
          chatId: combinedId,
          ["userInfo"]: {
            id: currentuser?.id,
            name: currentuser?.name,
            cover: currentuser?.cover != undefined ? currentuser?.cover : null,
          },
          ["date"]: serverTimestamp(),
        });
        // if chat already exists
      } else if (res.exists() && (!chatId.exists() || !chatIdT.exists())) {
        await setDoc(doc(db, "users", currentuser?.id, "chats", user?.id), {
          chatId: combinedId,
          ["userInfo"]: {
            id: user?.id,
            name: user?.name,
            cover: user?.cover != undefined ? user?.cover : null,
          },
          ["date"]: serverTimestamp(),
        });
        await setDoc(doc(db, "users", user?.id, "chats", currentuser?.id), {
          chatId: combinedId,
          ["userInfo"]: {
            id: currentuser?.id,
            name: currentuser?.name,
            cover: currentuser?.cover != undefined ? currentuser?.cover : null,
          },
          ["date"]: serverTimestamp(),
        });
      } else {
        await updateDoc(doc(db, "users", currentuser?.id, "chats", user?.id), {
          chatId: combinedId,
          ["userInfo"]: {
            id: user?.id,
            name: user?.name,
            cover: user?.cover != undefined ? user?.cover : null,
          },
          ["date"]: serverTimestamp(),
        });
        await updateDoc(doc(db, "users", user?.id, "chats", currentuser?.id), {
          chatId: combinedId,
          ["userInfo"]: {
            id: currentuser?.id,
            name: currentuser?.name,
            cover: currentuser?.cover != undefined ? currentuser?.cover : null,
          },
          ["date"]: serverTimestamp(),
        });
      }
      await dispatch(
        SetCurrentChat([
          {
            chatId: combinedId,
            cover: user?.cover != undefined ? user?.cover : null,
            name: user?.name,
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
                          color: user?.socMedia?.whatsapp ? "inherit" : "gray",
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
                          color: user?.socMedia?.telegram ? "inherit" : "gray",
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
              {user?.id === currentuser?.id && item.id != "phone" && (
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
    font-size: 3vw;
    max-width: 90vw;
  }

  .editIcon {
    color: ${(props) => props.theme.disabled};
    cursor: pointer;
    font-size: 1vw;

    @media only screen and (max-width: 600px) {
      font-size: 4vw;
    }
  }

  .confirmIcon {
    color: green;
    cursor: pointer;
    font-size: 1vw;

    @media only screen and (max-width: 600px) {
      font-size: 4vw;
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
  font-size: 1.2vw;
  height: 3vw;
  color: ${(props) => props.theme.filterFontActive};
  width: auto;
  max-width: 18vw;
  border-bottom: 1px solid ${(props) => props.theme.lineColor};

  @media only screen and (max-width: 600px) {
    width: 100vw;
    height: 9vw;
    box-sizing: border-box;
    font-size: 4vw;
    max-width: 100vw;
  }
`;

const LinkInput = styled.input`
  border: none;
  background: none;
  width: auto;
  height: 1.5vw;
  margin: 0;
  background: white;
  border-radius: 0.5vw;
  text-align: start;

  @media only screen and (max-width: 600px) {
    font-size: 16px;
  }

  :placeholder {
    text-align: start;
    font-size: 1vw;
    font-weight: bold;
    padding-left: 0.5vw;
    color: green;
  }

  :focus {
    outline: none;
  }
`;

const Link = styled.span`
  font-size: 1vw;
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
    font-size: 3vw;
    height: 5vw;
    max-width: 80vw;
    position: relative;
    left: 3vw;
    margin-right: 3vw;
    gap: 7vw;
  }

  .icons {
    font-size: 1.2vw;
    margin-top: 0.25vw;
    @media only screen and (max-width: 600px) {
      font-size: 4vw;
    }
  }
`;
