import { useState, useContext, useRef } from "react";
import styled from "styled-components";
import { AuthContext } from "../../context/AuthContext";
import { useSelector, useDispatch } from "react-redux";
import {
  updateDoc,
  doc,
  arrayUnion,
  Timestamp,
  serverTimestamp,
} from "firebase/firestore";
import { db, storage } from "../../firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { v4 as uuid } from "uuid";
import { ImFilePicture } from "react-icons/im";
import { FiSend } from "react-icons/fi";
import { setBackdropOpen } from "../../redux/main";
import { Language } from "../../context/language";

export const Input = () => {
  const language = Language();
  const dispatch = useDispatch();
  // import current user & parse it
  const userUnparsed = useSelector((state) => state.storeMain.user);
  let currentuser;
  if (userUnparsed?.length > 0) {
    currentuser = JSON.parse(userUnparsed);
  }

  const chatUser = useSelector((state) => state.storeChat.currentChat);
  //
  const [text, setText] = useState("");
  const [img, setImg] = useState(null);
  const { currentUser } = useContext(AuthContext);
  //

  const handleSend = async (e) => {
    if (img != null) {
      if (
        img?.type?.endsWith("jpeg") ||
        img?.type?.endsWith("png") ||
        img?.type?.endsWith("jpg")
      ) {
        await dispatch(setBackdropOpen(true));
        const storageRef = ref(
          storage,
          `images/chats/${chatUser[0]?.chatId}/${img?.name}`
        );

        const url = await uploadBytes(storageRef, img).then((snapshot) => {
          getDownloadURL(snapshot.ref).then((downloadURL) => {
            updateDoc(doc(db, "chats", chatUser[0]?.chatId), {
              messages: arrayUnion({
                id: uuid(),
                text: text,
                senderId: currentUser.uid,
                date: Timestamp.now(),
                img: downloadURL,
                imgName: img?.name,
              }),
            })
              .then(() => {
                // Profile updated!
                // dispatch(setRerender());
                // ...
                setImg(null);
                setText("");
              })
              .catch((error) => {
                // An error occurred
                // ...
              });
          });
        });
        dispatch(setBackdropOpen(false));
      } else {
        alert("Unsuported File Format");
      }
    } else {
      setImg(null);
      setText("");
      await updateDoc(doc(db, "chats", chatUser[0]?.chatId), {
        messages: arrayUnion({
          id: uuid(),
          text,
          senderId: currentUser.uid,
          date: Timestamp.now(),
        }),
      });

      await updateDoc(
        doc(db, "users", currentUser?.uid, "chats", chatUser[0].userId),
        {
          lastMessage: text,
          date: serverTimestamp(),
          opened: false,
          senderId: currentUser?.uid,
          userInfo: {
            id: chatUser[0]?.userId,
          },
        }
      );
      await updateDoc(
        doc(db, "users", chatUser[0]?.userId, "chats", currentUser.uid),
        {
          lastMessage: text,
          date: serverTimestamp(),
          opened: false,
          senderId: currentUser?.uid,
          userInfo: {
            id: currentUser?.uid,
          },
        }
      );
    }
  };

  const handleKey = (e) => {
    if (text?.length > 0 || img != null) {
      e.code === "Enter" && handleSend();
    }
  };

  // open messig on focus
  // open message
  const searchInput = useRef(null);

  const Opening = async () => {
    await updateDoc(
      doc(db, "users", currentuser?.id, "chats", chatUser[0].userId),
      {
        opened: true,
      }
    );
  };

  if (document.activeElement === searchInput.current) {
    Opening();
  }

  return (
    <InputContainer>
      <InputField
        placeholder={language?.language.Chat.chat.typeText}
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={handleKey}
        onFocus={Opening}
        ref={searchInput}
      />
      <File>
        <input
          type="file"
          //   style={{ display: "none" }}
          id="file"
          onChange={(e) => setImg(e.target.files[0])}
        />
        <label htmlFor="file">
          <ImFilePicture id="label" />
        </label>
        <FiSend
          className="send"
          onClick={(text?.length > 0 || img != null) && handleSend}
        />
      </File>
    </InputContainer>
  );
};

const InputContainer = styled.div`
  height: 70px;
  width: 100%;
  display: flex;
  align-items: center;
  background: ${(props) => props.theme.secondLevel};
  box-sizing: border-box;
  padding: 10px 20px 10px 10px;
  border-top: 1px solid ${(props) => props.theme.lineColor};

  @media only screen and (max-width: 600px) {
    width: 100%;
    height: 10vh;
    min-height: 10vh;
    position: relative;
    width: 100%;
    left: 0;
  }
`;

const InputField = styled.input`
  width: 100%;
  border: none;
  outline: none;
  background: none;
  font-size: 16px;
  color: ${(props) => props.theme.font};

  @media only screen and (max-width: 600px) {
    padding-left: 3vw;
  }
`;

const File = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;

  .send {
    font-size: 1.3vw;
    color: green;
    margin: 0 2vw;
    cursor: pointer;

    @media only screen and (max-width: 600px) {
      font-size: 7vw;
    }
  }

  #file {
    display: none;
  }
  #label {
    font-size: 1.2vw;
    cursor: pointer;
    color: ${(props) => props.theme.font};

    @media only screen and (max-width: 600px) {
      font-size: 4vw;
    }

    :hover {
      filter: brightness(1.1);
    }
  }
`;
