import React, { useContext } from "react";
import styled from "styled-components";
import { useSelector, useDispatch } from "react-redux";
import { doc, updateDoc, serverTimestamp, setDoc } from "firebase/firestore";
import { updateProfile } from "firebase/auth";
import { db, storage, auth } from "../firebase";
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
import { FaUser } from "react-icons/fa";
import { BsStars, BsLayoutTextSidebarReverse } from "react-icons/bs";

export const CoverUploader = (props) => {
  const currentUser = auth.currentUser;

  const dispatch = useDispatch();
  // State to store uploaded file
  const [file, setFile] = React.useState(null);

  const cov = useSelector((state) => state.storeMain.coverInfo);
  let cover;
  if (cov?.length > 0) {
    cover = JSON.parse(cov);
  }
  // import current user from redux state
  const userUnparsed = useSelector((state) => state.storeMain.user);

  let user;
  if (userUnparsed?.length > 0) {
    user = JSON.parse(userUnparsed);
  }
  // loader animation for adding cover
  const [loading, setLoading] = React.useState(false);

  async function FileUpload() {
    /* after delete last cover, add new cover
     */

    if (file == null) return;
    // add in storage
    const imageRef = ref(storage, `images/${currentUser?.uid}/cover`);
    // const snapshot = await uploadBytes(imageRef, file);
    const url = await uploadBytes(imageRef, file).then((snapshot) => {
      getDownloadURL(snapshot.ref).then((url) => {
        updateDoc(doc(db, `users`, currentUser.uid), {
          cover: url,
        });
        updateProfile(auth.currentUser, {
          photoURL: url,
        })
          .then(() => {
            // Profile updated!
            dispatch(setRerender());
            // ...
          })
          .catch((error) => {
            // An error occurred
            // ...
          });
      });
    });
    dispatch(setRerender());
    // window.location.reload();
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
      {props.loadingCover ? (
        <Loader>
          <BsStars className="logo" />
          Uploading...
        </Loader>
      ) : null}
    </Container>
  );
};

const Container = styled.div`
  height: 10vw;
  width: 10vw;
  border-radius: 50%;

  @media only screen and (max-width: 600px) {
    height: 20vw;
    width: 20vw;
  }
`;

const Uploader = styled.input`
  cursor: pointer;
  height: 10vw;
  width: 10vw;
  position: relative;
  border-radius: 50%;
  z-index: 6;
  background: red;
  transition: ease-in-out 150ms;
  -moz-opacity: 0;
  filter: alpha(opacity: 0);
  opacity: 0;

  @media only screen and (max-width: 600px) {
    height: 20vw;
    width: 20vw;
    bottom: 0.5vw;
  }

  ::-webkit-file-upload-button {
  }

  // :hover {
  //   opacity: 0.03;
  // }
`;

const Loader = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  width: 100%;
  height: 1000%;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(2, 2, 2, 0.1);
  z-index: 10000;

  .logo {
    font-size: 1.5vw;
    margin-right: 0.25vw;
  }
`;
