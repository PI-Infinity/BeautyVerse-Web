import React, { useContext } from "react";
import styled from "styled-components";
import { useSelector, useDispatch } from "react-redux";
import { doc, updateDoc, serverTimestamp, setDoc } from "firebase/firestore";
import { db, storage } from "../firebase";
import {
  ref,
  uploadBytes,
  listAll,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import { v4 } from "uuid";
import { AuthContext } from "../context/AuthContext";
import { setRerender } from "../redux/main";
import { BsStars, BsLayoutTextSidebarReverse } from "react-icons/bs";

export const ImgUploader = (props) => {
  const dispatch = useDispatch();
  // State to store uploaded file
  const [file, setFile] = React.useState(null);
  const cover = useSelector((state) => state.storeMain.cover);

  const userUnparsed = useSelector((state) => state.storeMain.user);

  let user;
  if (userUnparsed?.length > 0) {
    user = JSON.parse(userUnparsed);
  }

  async function FileUpload() {
    //create id
    let imgId = file?.name + v4();
    // check file
    if (file == null) return;
    // add in cloud
    const imageRef = ref(storage, `images/${user?.id}/feeds/${imgId}/`);
    await uploadBytes(imageRef, file);
    const url = await uploadBytes(imageRef, file).then((snapshot) => {
      getDownloadURL(snapshot.ref).then((url) => {
        setDoc(doc(db, `users`, `${user?.id}`, "feeds", `${imgId}`), {
          id: imgId,
          name: file.name,
          addTime: serverTimestamp(),
          post: "My Image",
          likes: 0,
          url: url,
          ["reviews"]: [],
        });
        updateDoc(doc(db, `users`, `${user?.id}`), {
          lastPost: serverTimestamp(),
        });
      });
    });
    dispatch(setRerender());
  }

  React.useEffect(() => {
    FileUpload();
  }, [file]);

  return (
    <Container>
      <Uploader
        type="file"
        onChange={(event) => setFile(event.target.files[0])}
        title=""
      />
    </Container>
  );
};

const Container = styled.div`
  height: 14vw;
  width: 14vw;
`;

const Uploader = styled.input`
  cursor: pointer;
  height: 14vw;
  width: 14vw;
  position: relative;
  z-index: 6;
  background: red;
  transition: ease-in-out 150ms;
  -moz-opacity: 0;
  filter: alpha(opacity: 0);
  opacity: 0;

  @media only screen and (max-width: 600px) {
    height: 28vw;
    width: 28vw;
    bottom: 7vw;
    right: 7vw;
  }

  ::-webkit-file-upload-button {
  }

  // :hover {
  //   opacity: 0.03;
  // }
`;
