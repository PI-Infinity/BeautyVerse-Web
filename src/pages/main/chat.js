import React from "react";
import styled from "styled-components";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { storage, db } from "../../firebase";
import { ref, uploadBytes, listAll, getDownloadURL } from "firebase/storage";
import {
  collection,
  doc,
  setDoc,
  addDoc,
  updateDoc,
  removeDoc,
  serverTimestamp,
} from "firebase/firestore";
import { MdOutlineDragIndicator } from "react-icons/md";
import { AuthContext } from "../../context/AuthContext";

export const Chat = () => {
  const { currentUser } = React.useContext(AuthContext);

  // define chat position: open ro hide
  const [position, setPosition] = React.useState("-9.5vw");
  const targetUser = useSelector((state) => state.storeChat.targetUser);

  //enter user cover from storage//
  const [cover, setCover] = React.useState([]);

  const coverRef = ref(storage, `image/${targetUser?.id}/`);

  React.useEffect(() => {
    listAll(coverRef).then((response) => {
      response.items.forEach((item) => {
        getDownloadURL(item).then((url) => {
          if (url?.length < 1) {
            setCover("");
          } else {
            setCover(url);
          }
        });
      });
    });
  }, [targetUser?.id]);

  // create chat after write and text message
  // const [text, setText] = React.useState("");
  // const SendMessage = () => {
  //   AddDoc(
  //     doc(
  //       db,
  //       "users",
  //       `${currentUser.uid}`,
  //       "chat",
  //       `${targetUser?.id}`,
  //       "messages"
  //     ),
  //     {
  //       time: serverTimestamp(),
  //       text: text,
  //     }
  //   );
  //   AddDoc(
  //     doc(
  //       db,
  //       "users",
  //       `${targetUser?.id}`,
  //       "chat",
  //       `${currentUser.uid}`,
  //       "messages"
  //     ),
  //     {
  //       time: serverTimestamp(),
  //       text: text,
  //     }
  //   );
  // };

  // // import chat

  // React.useEffect(() => {
  //   const base = collection(
  //     db,
  //     "users",
  //     `${currentUser.uid}`,
  //     "chat",
  //     `${targetUser?.id}`,
  //     "messages"
  //   );
  // }, []);

  return (
    <>
      {targetUser?.id?.length > 0 && (
        <Container
          position={position}
          onClick={
            position == "-9.5vw"
              ? () => setPosition("8.5vw")
              : () => setPosition("-9.5vw")
          }
        >
          <User>
            <Link
              to={`/user/${targetUser?.id}`}
              style={{
                color: "inherit",
                textDecoration: "none",
                display: "flex",
                alignItems: "center",
                gap: "0.5vw",
              }}
            >
              <Profile>
                {cover?.length < 1 ? <div></div> : <Img src={cover} />}
              </Profile>
              <Name>{targetUser?.name}</Name>
            </Link>
            <MdOutlineDragIndicator
              color="#ccc"
              style={{
                transform: "rotate(90deg)",
                fontSize: "1.2vw",
                marginRight: "1vw",
              }}
            />
          </User>
          <ChatContent>Chat</ChatContent>
          <TypeSection>
            <Input type="text" placeholder="Write Text Here..." />
            {/* <div onClick={SendMessage}>Send</div> */}
          </TypeSection>
        </Container>
      )}
    </>
  );
};

const Container = styled.div`
  position: absolute;
  bottom: ${(props) => props.position};
  margin-left: 1.5vw;
  width: 80%;
  background: #fff;
  height: 20vw;
  border-radius: 0.5vw 0.5vw 0 0;
  padding: 0.7vw;
  transition: ease-in-out 200ms;
  display: flex;
  flex-direction: column;
  align-items: start;
  justify-content: space-between;
  box-shadow: 0 1vw 3vw rgba(2, 2, 2, 0.2);
`;

const User = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #f7f7f7;
  width: 100%;
  border-radius: 50vw;
  cursor: pointer;
`;

const Profile = styled.div`
  width: 1.8vw;
  height: 1.8vw;
  border-radius: 50%;
  overflow: hidden;
  cursor: pointer;
  z-index: 7;
`;

const Img = styled.img`
  width: 1.8vw;
  height: 1.8vw;
  cursor: pointer;
  object-fit: cover;
`;

const Name = styled.span`
  font-size: 0.9vw;
  margin-left: 0.5vw;
  letter-spacing: 0.03vw;
  cursor: pointer;
  color: #222;
  padding-bottom: 0.1vw;
  width: auto;

  :hover {
    text-decoration: underline;
  }
`;

const ChatContent = styled.div``;

const TypeSection = styled.div`
  width: 100%;
  padding: 0.5vw 0;
  border-top: 1px solid #ccc;
  display: flex;
`;

const Input = styled.input`
  border: none;
  height: 100%;

  :focus {
    outline: none;
  }

  :placeholder {
  }
`;
