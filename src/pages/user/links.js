import React from "react";
import styled from "styled-components";
import { MdAddBusiness, MdLocationPin, MdLibraryAdd } from "react-icons/md";
import { FcBusinessContact } from "react-icons/fc";
import { RiEdit2Fill } from "react-icons/ri";
import { ImCheckmark } from "react-icons/im";
import {
  FaFacebook,
  FaInstagram,
  FaYoutube,
  FaTiktok,
  FaPhoneAlt,
  FaChrome,
} from "react-icons/fa";
import { AiOutlineMail, AiOutlineDelete } from "react-icons/ai";
import { useSelector, useDispatch } from "react-redux";
import { db } from "../../firebase";
import {
  getDoc,
  doc,
  serverTimestamp,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { setRerender, SetCurrentChat } from "../../redux/chat";
import { useNavigate } from "react-router-dom";

export const Links = (props) => {
  const [edit, setEdit] = React.useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  // import current user & parse it
  const userUnparsed = useSelector((state) => state.storeMain.user);
  let currentuser;
  if (userUnparsed?.length > 0) {
    currentuser = JSON.parse(userUnparsed);
  }

  const [changePhone, setChangePhone] = React.useState("");
  const [changeWeb, setChangeWeb] = React.useState("");
  const [changeInstagram, setChangeInstagram] = React.useState("");
  const [changeFacebook, setChangeFacebook] = React.useState("");
  const [changeTiktok, setChangeTiktok] = React.useState("");
  const [changeYoutube, setChangeYoutube] = React.useState("");
  const [changeEmail, setChangeEmail] = React.useState("");
  const [changeOtherMedia, setChangeOtherMedia] = React.useState("");

  const UpdateLink = (newValue) => {
    const base = doc(db, "users", `${props?.user.id}`);
    if (changePhone?.length > 0) {
      updateDoc(base, {
        phone: changePhone,
      });
      setChangePhone("");
    }
    if (changeWeb?.length > 0) {
      updateDoc(base, {
        socMedia: {
          web: changeWeb,
          facebook: props.user?.socMedia?.facebook,
          instagram: props.user?.socMedia?.instagram,
          tiktok: props.user?.socMedia?.tiktok,
          youtube: props.user?.socMedia?.youtube,
          otherMedia: props.user?.socMedia?.otherMedia,
        },
      });
      setChangeWeb("");
    }
    if (changeInstagram?.length > 0) {
      updateDoc(base, {
        socMedia: {
          web: props.user?.socMedia?.web,
          facebook: props.user?.socMedia?.facebook,
          instagram: changeInstagram,
          tiktok: props.user?.socMedia?.tiktok,
          youtube: props.user?.socMedia?.youtube,
          otherMedia: props.user?.socMedia?.otherMedia,
        },
      });
      setChangeInstagram("");
    }
    if (changeFacebook?.length > 0) {
      updateDoc(base, {
        socMedia: {
          web: props.user?.socMedia?.web,
          facebook: changeFacebook,
          instagram: props.user?.socMedia?.instagram,
          tiktok: props.user?.socMedia?.tiktok,
          youtube: props.user?.socMedia?.youtube,
          otherMedia: props.user?.socMedia?.otherMedia,
        },
      });
      setChangeFacebook("");
    }
    if (changeTiktok?.length > 0) {
      updateDoc(base, {
        socMedia: {
          web: props.user?.socMedia?.web,
          facebook: props.user?.socMedia?.facebook,
          instagram: props.user?.socMedia?.instagram,
          tiktok: changeTiktok,
          youtube: props.user?.socMedia?.youtube,
          otherMedia: props.user?.socMedia?.otherMedia,
        },
      });
      setChangeTiktok("");
    }
    if (changeYoutube?.length > 0) {
      updateDoc(base, {
        socMedia: {
          web: props.user?.socMedia?.web,
          facebook: props.user?.socMedia?.facebook,
          instagram: props.user?.socMedia?.instagram,
          tiktok: props.user?.socMedia?.tiktok,
          youtube: changeYoutube,
          otherMedia: props.user?.socMedia?.otherMedia,
        },
      });
      setChangeYoutube("");
    }
    if (changeOtherMedia?.length > 0) {
      updateDoc(base, {
        socMedia: {
          web: props.user?.socMedia?.web,
          facebook: props.user?.socMedia?.facebook,
          instagram: props.user?.socMedia?.instagram,
          tiktok: props.user?.socMedia?.tiktok,
          youtube: props.user?.socMedia?.youtube,
          otherMedia: props.user?.socMedia?.changeOtherMedia,
        },
      });
      setChangeOtherMedia("");
    }
    setEdit("");
  };

  const LinkList = [
    {
      id: "email",
      placeholder: props.user?.email,
      icon: <AiOutlineMail />,
    },
    {
      id: "phone",
      placeholder: props.user?.phone,
      icon: <FaPhoneAlt />,
      value: changePhone,
      onChange: (e) => setChangePhone(e.target.value),
    },
    {
      id: "web",
      placeholder: props.user?.socMedia?.web,
      icon: <FaChrome />,
      value: changeWeb,
      onChange: (e) => setChangeWeb(e.target.value),
    },
    {
      id: "facebook",
      placeholder: props.user?.socMedia?.facebook,
      icon: <FaFacebook />,
      value: changeFacebook,
      onChange: (e) => setChangeFacebook(e.target.value),
    },
    {
      id: "instagram",
      placeholder: props.user?.socMedia?.instagram,
      icon: <FaInstagram />,
      value: changeInstagram,
      onChange: (e) => setChangeInstagram(e.target.value),
    },

    {
      id: "tiktok",
      placeholder: props.user?.socMedia?.tiktok,
      icon: <FaTiktok />,
      value: changeTiktok,
      onChange: (e) => setChangeTiktok(e.target.value),
    },
    {
      id: "youtube",
      placeholder: props.user?.socMedia?.youtube,
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
      dispatch(setRerender());
    } catch (err) {
      alert(err);
    }
  };

  return (
    <LinksContainer>
      {props.userVisit && (
        <SendMessage
          onClick={
            currentuser !== undefined
              ? () => handleSelect(props?.user)
              : () => navigate("/login")
          }
        >
          Send Message
        </SendMessage>
      )}
      {LinkList?.map((item, index) => {
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
              <Link>
                {item.id == "phone" ? (
                  <a
                    style={{ color: "inherit", textDecoration: "none" }}
                    href={`tel://+995${item.placeholder}`}
                  >
                    {item.placeholder}
                  </a>
                ) : (
                  item.placeholder
                )}
              </Link>
            )}
            {!props.userVisit && item.id != "email" && (
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
  background: #fff;
  border-radius: 0.5vw;
  cursor: pointer;
  font-weight: bold;

  @media only screen and (max-width: 600px) {
    margin: 0 0 15px 0;
    padding: 12px;
    border-radius: 1.5vw;
    width: 100%;
  }

  :hover {
    background: none;
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
  border-bottom: 1px solid #e5e5e5;

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
  height: 1.5vw;
  margin: 0;
  overflow: hidden;
  cursor: pointer;

  @media only screen and (max-width: 600px) {
    font-size: 3vw;
    height: 5vw;
    max-width: 80vw;
    position: relative;
    left: 3vw;
    margin-right: 3vw;
  }
`;
