import React, { useContext } from "react";
import styled from "styled-components";
import { useSelector, useDispatch } from "react-redux";
import { doc, updateDoc } from "firebase/firestore";
import { updateProfile } from "firebase/auth";
import { db, storage, auth } from "../firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { AuthContext } from "../context/AuthContext";
import { setRerender } from "../redux/main";
import { BsStars } from "react-icons/bs";
import Avatar from "@mui/material/Avatar";
import { useNavigate } from "react-router-dom";
import { setBackdropOpen } from "../redux/main";

export const CoverUploader = (props) => {
  const { currentUser } = useContext(AuthContext);

  const navigate = useNavigate();
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
    if (file != null) {
      dispatch(setBackdropOpen(true));
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
      await dispatch(setRerender());
      dispatch(setBackdropOpen(false));
    }
  }

  React.useEffect(() => {
    FileUpload();
  }, [file]);

  return (
    <Container>
      {user?.id === props?.user?.id && (
        <Uploader
          id="cover"
          type="file"
          onChange={(event) => setFile(event.target.files[0])}
          title=""
        />
      )}
      <label htmlFor="cover">
        <Avatar
          alt={user?.name}
          src={props?.user?.cover !== undefined ? props?.user?.cover : ""}
          sx={{
            width: 155,
            height: 155,
            cursor: "pointer",
            "@media only screen and (max-width: 1200px)": {
              width: 100,
              height: 100,
            },
          }}
        />
      </label>
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
  display: flex;
  align-items: center;
  justify-content: center;

  @media only screen and (max-width: 600px) {
    height: 20vw;
    width: 20vw;
  }
`;

const Uploader = styled.input`
  display: none;
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
