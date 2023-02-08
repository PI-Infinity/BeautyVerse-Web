import React from "react";
import { useSelector, useDispatch } from "react-redux";
import styled from "styled-components";
import {
  getDoc,
  doc,
  serverTimestamp,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { db } from "../../firebase";
import { setRerender, SetCurrentChat } from "../../redux/chat";
import { useNavigate } from "react-router-dom";
import { Spinner } from "../../components/loader";
import { FaUser } from "react-icons/fa";

export const Favourites = (props) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading, setLoading] = React.useState(true);
  // import current user & parse it
  const userUnparsed = useSelector((state) => state.storeMain.user);
  let currentuser;
  if (userUnparsed?.length > 0) {
    currentuser = JSON.parse(userUnparsed);
  }

  const followings = useSelector((state) => state.storeMain.followings);

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

  React.useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 500);
  }, []);

  return (
    <>
      {loading ? (
        <LoadingContainer>
          <Spinner />
        </LoadingContainer>
      ) : (
        <Container>
          {followings
            ?.filter((item, index) => {
              if (
                item?.name?.toLowerCase()?.includes(props.search?.toLowerCase())
              ) {
                return item;
              }
            })
            ?.map((item, index) => {
              return (
                <UserItem onClick={() => handleSelect(item)} key={index}>
                  {item?.cover != undefined ? (
                    <Img src={item?.cover} alt="" />
                  ) : (
                    <UserProfileEmpty>
                      <FaUser className="user" />
                    </UserProfileEmpty>
                  )}
                  <span>{item?.name}</span>
                </UserItem>
              );
            })}
        </Container>
      )}
    </>
  );
};

const LoadingContainer = styled.div`
  height: 60vh;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  gap: 10px;
  padding: 10px 0;
  width: 70%;
  // background: #fff;

  @media only screen and (max-width: 600px) {
    height: 70vh;
    overflow-y: scroll;
    overflow-x: hidden;
    gap: 3vw;
    width: 100%;
    padding: 0 5%;
  }
`;

const Img = styled.img`
  width: 2vw;
  height: 2vw;
  border-radius: 50%;
  object-fit: cover;

  @media only screen and (max-width: 600px) {
    width: 10vw;
    height: 10vw;
  }
`;

const UserItem = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  width: 100%;
  padding: 0 20px;

  p {
    font-size: 0.7vw;
    color: #ccc;

    @media only screen and (max-width: 600px) {
      font-size: 2.5vw;
    }
  }

  :hover {
    filter: brightness(0.95);
  }

  @media only screen and (max-width: 600px) {
    border-radius: 50vw;
    padding: 0;
  }
`;

const UserProfileEmpty = styled.div`
  width: 2.2vw;
  height: 2.2vw;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;

  @media only screen and (max-width: 600px) {
    width: 9vw;
    height: 9vw;
  }

  .user {
    font-size: 1.2vw;

    @media only screen and (max-width: 600px) {
      font-size: 5vw;
    }
  }
`;
