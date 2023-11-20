import axios from 'axios';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import React, { useEffect, useState } from 'react';
import { FaUser } from 'react-icons/fa';
import Resizer from 'react-image-file-resizer';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import styled from 'styled-components';
import SimpleBackdrop from '../../../components/backDrop';
import { storage } from '../../../firebase';
import { BounceLoader } from 'react-spinners';
import { setCurrentUser } from '../../../redux/user';
import logo from '../../../assets/logo.png';
import { Language } from '../../../context/language';

export const CoverSection = ({ user }) => {
  // redux dispatch
  const dispatch = useDispatch();

  // location
  const location = useLocation();

  // language
  const language = Language();

  const [loading, setLoading] = useState(false);
  const [loadingUploader, setLoadingUploader] = useState(false);

  useEffect(() => {
    if (user?.cover?.length < 1) {
      setLoading(false);
    } else {
      setLoading(true);
    }
  }, [user?.cover]);

  // capitalize first letters function
  function capitalizeFirstLetter(string) {
    return string?.charAt(0).toUpperCase() + string?.slice(1);
  }

  // capitalize and define user's type
  const t = capitalizeFirstLetter(user?.type);

  // let type;
  // if (user?.type === 'specialist') {
  //   type = t;
  // } else if (user?.type === 'shop') {
  //   type = t;
  // } else if (user?.type === 'beautycenter') {
  //   type = 'Beauty Salon';
  // } else if (user?.type === 'user') {
  //   type = 'User';
  // }

  let type;
  if (user?.type === 'specialist') {
    type = language?.language?.Main?.feedCard?.specialist;
  } else if (user?.type === 'shop') {
    type = language?.language?.Marketplace?.marketplace?.shop;
  } else if (user?.type === 'beautycenter') {
    type = language?.language?.Auth?.auth?.beautySalon;
  } else {
    type = language?.language?.Auth?.auth?.user;
  }

  // image loading opacity
  const [opacity, setOpacity] = useState(true);

  // current user
  const currentUser = useSelector((state) => state.storeUser.currentUser);

  /**
   * cover upload
   */
  const [file, setFile] = useState(null);

  const resizeFile = (file) =>
    new Promise(async (resolve) => {
      Resizer.imageFileResizer(
        file,
        400,
        400,
        file.type.split('/')[1],
        100,
        0,
        async (uri) => {
          // Convert base64 string to blob
          const byteCharacters = atob(uri.split(',')[1]);
          const byteNumbers = new Array(byteCharacters.length);
          for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
          }
          const byteArray = new Uint8Array(byteNumbers);
          const blob = new Blob([byteArray], { type: file.type });
          resolve(blob);
        },
        'base64'
      );
    });

  const backendUrl = useSelector((state) => state.storeApp.backendUrl);

  async function FileUpload(blob) {
    if (blob == null) return;
    if (blob) {
      setLoadingUploader(true);
      // Add in storage
      const imageRef = ref(storage, `images/${user?._id}/cover`);

      await uploadBytesResumable(imageRef, blob).then((snapshot) => {
        getDownloadURL(snapshot.ref)
          .then((url) => {
            const UploadCover = async () => {
              try {
                await axios.patch(`${backendUrl}/api/v1/users/${user?._id}`, {
                  cover: url,
                });
                localStorage.setItem(
                  'Beautyverse:currentUser',
                  JSON.stringify(updatedCoverUser)
                );
                dispatch(setCurrentUser(updatedCoverUser));
              } catch (error) {
                console.log(error.response.data.message);
              }
            };
            const updatedCoverUser = { ...user, cover: url };
            if (url) {
              UploadCover();
            }
            setFile(null);
            setLoadingUploader(false);
          })
          .catch((error) => {
            console.log(error);
          });
      });
    }
  }

  useEffect(() => {
    if (file) {
      FileUpload(file);
    }
  }, [file]);

  return (
    <>
      <SimpleBackdrop open={loadingUploader} setOpen={setLoadingUploader} />

      <Container>
        <CoverImageContainer>
          {loading && (
            <div
              style={{
                width: '25vw',
                height: '25vw',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'absolute',
                background: 'rgba(1, 2, 12, 0.2)',
                backdropFilter: 'blur(10px)',
                WebkitBackdropFilter: 'blur(10px)',
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  opacity: '1',
                  width: '100%',
                  height: '100%',
                  background: 'rgba(255,255,255,0.1)',
                  borderRadius: '50px',
                }}
              >
                {/* <BounceLoader size="25vw" loading={loading} color="#f866b1" /> */}
              </div>
            </div>
          )}

          {user?.cover?.length > 0 ? (
            <>
              <CoverImage
                key={user?.cover}
                src={user?.cover}
                opacity={opacity ? 'true' : 'false'}
                onLoad={() => {
                  setOpacity(false);
                  setLoading(false);
                }}
              />
            </>
          ) : (
            <FaUser size={40} color="#aaa" />
          )}

          {currentUser?._id === user?._id && (
            <input
              type="file"
              // value={file}
              onChange={async (event) => {
                try {
                  const file = event.target.files[0];
                  const image = await resizeFile(file);
                  setFile(image);
                } catch (err) {
                  console.log(err);
                }
              }}
              style={{
                position: 'absolute',
                zIndex: 1000,
                width: '25vw',
                height: '25vw',
                background: 'red',
                borderRadius: '50px',
                opacity: 0,
              }}
            />
          )}
        </CoverImageContainer>
        <InfoContainer>
          <h3 style={{ color: '#ccc', margin: 0, letterSpacing: '0.5px' }}>
            {user?.username ? user?.username : type}
          </h3>
          <p style={{ color: '#ccc', margin: 0, letterSpacing: '0.5px' }}>
            {user?.about}
          </p>
        </InfoContainer>
      </Container>
    </>
  );
};

const Container = styled.div`
  padding: 25px 20px 10px 20px;
  display: flex;
  gap: 10vw;
`;

const CoverImageContainer = styled.div`
  width: 25vw;
  height: 25vw;
  border-radius: 50vw;
  background: rgba(255, 255, 255, 0.05);
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const CoverImage = styled.img`
  width: 100%;
  aspect-ratio: 1;
  object-fit: cover;
  border-radius: 50vw;
  opacity: ${(props) => (props.opacity === 'true' ? '0' : '1')};
  transition: ease-in 200ms;
`;

const InfoContainer = styled.div`
  width: 50vw;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 8px;
`;
