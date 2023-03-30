import React from 'react';
import styled from 'styled-components';
import { useSelector, useDispatch } from 'react-redux';
import { storage } from '../firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import Avatar from '../components/avatar';
import { useNavigate } from 'react-router-dom';
import { setBackdropOpen, setCoverUrl } from '../redux/main';
import Resizer from 'react-image-file-resizer';
import axios from 'axios';
import { setRerenderCurrentUser } from '../redux/rerenders';
import { ProfileCoverLoader } from '../components/loader';

export const CoverUploader = ({ targetUser, loadingProfile }) => {
  const currentUser = JSON.parse(
    localStorage.getItem('Beautyverse:currentUser')
  );

  const rerenderCurrentUser = useSelector(
    (state) => state.storeRerenders.rerenderCurrentUser
  );

  const coverUrl = useSelector((state) => state.storeMain.coverUrl);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  // State to store uploaded file
  const [file, setFile] = React.useState(null);
  const [resizedObj, setResizedObj] = React.useState(null);
  const ResizeCover = (file) =>
    new Promise((resolve) => {
      Resizer.imageFileResizer(
        file,
        240,
        240,
        'JPEG',
        100,
        0,
        (uri) => {
          resolve(uri);
        },
        'file'
      );
    });

  const DefineResized = async () => {
    if (file !== null) {
      const newObj = await ResizeCover(file);
      setResizedObj(newObj);
    }
  };
  const imageObj = React.useMemo(() => DefineResized(), [file]);

  // loader animation for adding cover
  const [loading, setLoading] = React.useState(false);

  async function FileUpload() {
    /* aadd cover
     */
    if (resizedObj == null) return;
    if (resizedObj != null) {
      dispatch(setBackdropOpen(true));
      // add in storage
      const imageRef = ref(storage, `images/${currentUser?._id}/cover`);
      // const snapshot = await uploadBytes(imageRef, resizedObj);
      const url = await uploadBytes(imageRef, resizedObj).then((snapshot) => {
        getDownloadURL(snapshot.ref)
          .then((url) => {
            dispatch(setCoverUrl(url));
          })
          .catch((error) => {
            console.log(error);
          });
      });
    }
  }

  React.useEffect(() => {
    FileUpload();
  }, [resizedObj]);

  React.useEffect(() => {
    const UploadCover = async () => {
      const response = await axios.patch(
        `https://beautyverse.herokuapp.com/api/v1/users/${currentUser?._id}`,
        {
          cover: coverUrl,
        }
      );
      await dispatch(setRerenderCurrentUser());
      dispatch(setBackdropOpen(false));
    };
    if (coverUrl) {
      UploadCover();
    }
  }, [coverUrl]);

  return (
    <Container>
      {targetUser?._id === currentUser?._id && (
        <Uploader
          id="cover"
          type="file"
          onChange={(event) => setFile(event.target.files[0])}
          title=""
        />
      )}
      <label
        htmlFor="cover"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {loadingProfile ? (
          <ProfileCoverLoader />
        ) : (
          <Avatar
            alt={currentUser?.name}
            link={coverUrl ? coverUrl : targetUser.cover}
            size="large"
          />
        )}
      </label>
    </Container>
  );
};

const Container = styled.div`
  height: 150px;
  width: 150px;
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
`;
