import React from "react";
import styled from "styled-components";
import { useSelector, useDispatch } from "react-redux";
import { FaUser } from "react-icons/fa";
import { Result } from "../../pages/addFeed/result";
import { MdOutlineVideoLibrary } from "react-icons/md";
import { AiOutlineDesktop, AiOutlineMobile } from "react-icons/ai";
import {
  setDoc,
  getDocs,
  doc,
  collection,
  deleteDoc,
  onSnapshot,
  serverTimestamp,
  deleteField,
  getDoc,
  updateDoc,
  arrayUnion,
  arrayRemove,
  getCountFromServer,
  orderBy,
  query,
  limit,
} from "firebase/firestore";
import { db, storage } from "../../firebase";
import {
  ref,
  uploadBytes,
  listAll,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import { setRerender } from "../../redux/main";
import { v4 } from "uuid";
import Loader from "react-js-loader";
import useWindowDimensions from "../../functions/dimensions";

const AddFeed = () => {
  const { height, width } = useWindowDimensions();
  const dispatch = useDispatch();
  // import current user from redux state
  const rerender = useSelector((state) => state.storeMain.user);
  const userUnparsed = useSelector((state) => state.storeMain.user);
  const [active, setActive] = React.useState("Mobile");
  let user;
  if (userUnparsed?.length > 0) {
    user = JSON.parse(userUnparsed);
  }

  // add text

  const [text, setText] = React.useState("");

  // add file

  const [file, setFile] = React.useState(null);

  const onImageChange = async (event) => {
    await setFile(null);
    if (event.target.files && event.target.files[0]) {
      setFile(event.target.files[0]);
    }
  };

  const [uploading, setUploading] = React.useState(false);

  // add feed in firebase
  async function FileUpload() {
    await setUploading(true);
    //create id
    let id = file?.name + v4();
    // check file
    if (file !== null) {
      // add in cloud
      let refs;
      if (file?.type?.endsWith("mp4")) {
        refs = ref(storage, `videos/${user?.id}/feeds/${id}/`);
      } else if (file?.type?.endsWith("jpeg")) {
        refs = ref(storage, `images/${user?.id}/feeds/${id}/`);
      } else if (file?.type?.endsWith("png")) {
        refs = ref(storage, `images/${user?.id}/feeds/${id}/`);
      } else if (file?.type?.endsWith("webp")) {
        refs = ref(storage, `images/${user?.id}/feeds/${id}/`);
      } else {
        alert("Unsuported file type");
      }
      if (refs != undefined) {
        await uploadBytes(refs, file);
        const url = await uploadBytes(refs, file).then((snapshot) => {
          getDownloadURL(snapshot.ref).then((url) => {
            setDoc(doc(db, `users`, `${user?.id}`, "feeds", `${id}`), {
              id: id,
              name: file.name,
              addTime: serverTimestamp(),
              post: text,
              url: url,
            });
            updateDoc(doc(db, `users`, `${user?.id}`), {
              lastPost: serverTimestamp(),
            });
          });
        });
      }
    } else {
      setDoc(doc(db, `users`, `${user?.id}`, "feeds", `${id}`), {
        id: id,
        name: "",
        addTime: serverTimestamp(),
        post: text,
        url: "",
      });
      updateDoc(doc(db, `users`, `${user?.id}`), {
        lastPost: serverTimestamp(),
      });
    }
    await dispatch(setRerender());
    setUploading(false);
  }

  return (
    <Container height={height}>
      {uploading && (
        <div
          style={{
            position: "absolute",
            width: "100%",
            height: "100%",
            zIndex: 900,
            top: 0,
            left: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "rgba(0,0,0,0.1)",
          }}
        >
          <Loader
            type="rectangular-ping"
            bgColor={"#222"}
            color={"#222"}
            size={100}
          />
        </div>
      )}
      <SecondLevelContainer>
        <Wrapper>
          <Title>Add Feed</Title>
          <Info>
            <Profile>
              {user?.cover == undefined ? (
                <FaUser className="user" />
              ) : (
                <Img src={user?.cover} alt="cover" />
              )}
            </Profile>
            <Name>{user?.name}</Name>
          </Info>
          <Text onChange={(e) => setText(e.target.value)} />
        </Wrapper>
        <Result
          file={file}
          {...user}
          active={active}
          text={text}
          onImageChange={onImageChange}
          setRerender={setRerender}
          FileUpload={FileUpload}
        />
      </SecondLevelContainer>
    </Container>
  );
};

export default AddFeed;

const Container = styled.div`
  width: 100%;
  height: calc(100vh - 2vw);
  min-height: auto;
  padding-top: 5vw;
  padding-bottom: 2vw;
  box-sizing: border-box;
  background: #f3f3f3;
  display: flex;
  align-items: start;
  justify-content: center;
  gap: 15px;
  overflow-y: scroll;

  @media only screen and (max-width: 600px) {
    height: calc(${(props) => props.height}px - 10vw);
    max-hiehgt: calc(${(props) => props.height}px - 10vw);
    align-items: start;
    margin-top: 11vw;
    padding-top: 0;
    padding-bottom: 60px;
    box-sizing: border-box;
  }
`;

const SecondLevelContainer = styled.div`
  display: flex;
  gap: 15px;

  @media only screen and (max-width: 600px) {
    flex-direction: column;
  }
`;

const Wrapper = styled.div`
  width: 40vw;
  height: 50vh;
  vmin-height: 65vh;
  border-radius: 0.5vw;
  box-shadow: 0 0.1vw 0.3vw rgba(0, 0, 0, 0.1);
  background: ${(props) => props.theme.background};
  padding: 10px 30px;
  box-sizing: border-box;

  @media only screen and (max-width: 600px) {
    width: 100vw;
    margin-top: 30px;
    height: auto;
    padding-bottom: 5vw;
  }
`;

const Title = styled.h3`
  color: #333;
`;

const Info = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
`;

const Profile = styled.div`
  width2vw;
  height2vw;
  border-radius: 50%;
  overflow: hidden;
  cursor: pointer;
  z-index: 7;
  margin-right: 0.5vw;
  margin-top: 0.1vw;
  display: flex;
  align-items: center;
  justify-content: center;
  filter: brightness(0.9);
  transition: ease-in-out 200ms;



  animation: fadeIn 0.5s;
  -webkit-animation: fadeIn 0.5s;
  -moz-animation: fadeIn 0.5s;
  -o-animation: fadeIn 0.5s;
  -ms-animation: fadeIn 0.5s;

  @keyframes fadeIn {
    0% {
      opacity: 0;
    }
    100% {
      opacity: 1;
    }
  }

  @-moz-keyframes fadeIn {
    0% {
      opacity: 0;
    }
    100% {
      opacity: 1;
    }
  }

  @-webkit-keyframes fadeIn {
    0% {
      opacity: 0;
    }
    100% {
      opacity: 1;
    }
  }

  @-o-keyframes fadeIn {
    0% {
      opacity: 0;
    }
    100% {
      opacity: 1;
    }
  }

  @-ms-keyframes fadeIn {
    0% {
      opacity: 0;
    }
    100% {
      opacity: 1;
    }
  }

  @media only screen and (max-width: 600px) {
    // display: none;
  }

  .user {
    border: 1px solid #ccc;
    padding: 0.3vw;
    border-radius: 50%;
    color: #ccc;
    font-size: 1.5vw;

    @media only screen and (max-width: 600px) {
      font-size: 5vw;
      border: 2px solid #ccc;
      padding: 0.6vw;
    }
  }

  :hover {
    filter: brightness(1);
  }
`;

const Img = styled.img`
  width: 2vw;
  height: 2vw;
  cursor: pointer;
  object-fit: cover;

  @media only screen and (max-width: 600px) {
    width: 7vw;
    height: 7vw;
  }
`;

const Name = styled.div`
  font-weight: bold;
`;
const Text = styled.textarea`
  margin-top: 20px;
  width: 100%;
  height: 45%;
  border: 1px solid #ccc;
  border-radius: 10px;
  padding: 15px;
  font-size: 16px;
  box-sizing: border-box;
  white-space: pre-wrap;

  @media only screen and (max-width: 600px) {
    height: 20vw;
  }

  :focus {
    outline: none;
  }
`;
const Files = styled.div`
  margin: 40px 0 40px 0;
  display: flex;
  align-items: center;
  gap: 15px;

  .icon {
    font-size: 1.75vw;
    margin-right: 5px;
    cursor: pointer;

    @media only screen and (max-width: 600px) {
      font-size: 5vw;
    }
  }

  @media only screen and (max-width: 600px) {
    margin: 5vw 0;
  }
`;
