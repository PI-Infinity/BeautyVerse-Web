import React from 'react';
import styled from 'styled-components';
import { useSelector, useDispatch } from 'react-redux';
import { Result } from '../../pages/addFeed/result';
import { AiOutlineCloseSquare } from 'react-icons/ai';
import { storage } from '../../firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useNavigate } from 'react-router-dom';
import { setRerender, setBackdropOpen, UpdateUserList } from '../../redux/main';
import { v4 } from 'uuid';
import useWindowDimensions from '../../functions/dimensions';
import Success from '../../snackBars/success';
import Avatar from '@mui/material/Avatar';
import { Language } from '../../context/language';
import EmojiPicker from 'emoji-picker-react';
import { FaRegSmileBeam } from 'react-icons/fa';
import { IsMobile } from '../../functions/isMobile';
import axios from 'axios';

const AddFeed = () => {
  const language = Language();
  const { height, width } = useWindowDimensions();
  const isMobile = IsMobile();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // user list and currentUser
  const userList = useSelector((state) => state.storeMain.userList);

  const currentUser = JSON.parse(
    localStorage.getItem('Beautyverse:currentUser')
  );
  const [active, setActive] = React.useState('Mobile');

  document.body.style.overflowY = 'hidden';

  // add text
  const [text, setText] = React.useState('');

  // add file
  const [file, setFile] = React.useState(null);

  const onImageChange = async (event) => {
    await setFile(null);
    if (event.target.files && event.target.files[0]) {
      setFile(event.target.files[0]);
    }
  };

  const [uploading, setUploading] = React.useState(false);

  const [openSuccess, setOpenSuccess] = React.useState(false);

  // resized image
  const [resizedObj, setResizedObj] = React.useState('');

  // add feed in firebase
  async function FileUpload() {
    await dispatch(setBackdropOpen(true));
    //create id
    let folderId = resizedObj.desktopJPEG?.name + v4();
    let imageId = resizedObj.desktopJPEG?.name + v4();
    let imageId2 = resizedObj.mobileJPEG?.name + v4();
    let imageId3 = resizedObj.mobileWEBP?.name + v4();
    // check file
    if (resizedObj !== null && !resizedObj?.name?.endsWith('mp4')) {
      let desktopRefs = ref(
        storage,
        `images/${currentUser?._id}/feeds/${folderId}/${imageId}/`
      );
      let mobileJpegRef = ref(
        storage,
        `images/${currentUser?._id}/feeds/${folderId}/${imageId2}/`
      );
      let mobileWebpRef = ref(
        storage,
        `images/${currentUser?._id}/feeds/${folderId}/${imageId3}/`
      );
      if (desktopRefs) {
        // add desktop version

        await uploadBytes(desktopRefs, resizedObj.desktopJPEG).then(
          (snapshot) => {
            getDownloadURL(snapshot.ref).then(async (url) => {
              await uploadBytes(mobileJpegRef, resizedObj.mobileJPEG).then(
                (snapshot2) => {
                  getDownloadURL(snapshot2.ref).then(async (url2) => {
                    await uploadBytes(
                      mobileWebpRef,
                      resizedObj.mobileWEBP
                    ).then((snapshot3) => {
                      getDownloadURL(snapshot3.ref).then(async (url3) => {
                        try {
                          const newFeed = {
                            desktopUrl: url,
                            mobileJpeg: url2,
                            mobileWebp: url3,
                            name: folderId,
                            createdAt: new Date().toISOString(),
                            post: text,
                            fileFormat: 'img',
                          };
                          const response = await axios.post(
                            `https://beautyverse.herokuapp.com/api/v1/users/${currentUser?._id}/feeds`,
                            newFeed
                          );
                          await axios.patch(
                            `https://beautyverse.herokuapp.com/api/v1/users/${currentUser?._id}`,
                            {
                              lastPostCreatedAt: new Date(),
                            }
                          );
                          dispatch(
                            UpdateUserList({ ...currentUser, feed: newFeed })
                          );
                        } catch (error) {
                          console.error(error);
                        }
                      });
                    });
                  });
                }
              );
            });
          }
        );
      }
    } else if (resizedObj?.name?.endsWith('mp4')) {
      let videoId = resizedObj?.name + v4();
      let videosRef = ref(
        storage,
        `videos/${currentUser?._id}/feeds/${videoId}/`
      );
      await uploadBytes(videosRef, resizedObj).then((snapshot) => {
        getDownloadURL(snapshot.ref).then(async (url) => {
          try {
            const newFeed = {
              videoUrl: url,
              name: videoId,
              name: folderId,
              createdAt: new Date().toISOString(),
              post: text,
              fileFormat: 'video',
            };
            const response = await axios.post(
              `https://beautyverse.herokuapp.com/api/v1/users/${currentUser?._id}/feeds`,
              newFeed
            );
            await axios.patch(
              `https://beautyverse.herokuapp.com/api/v1/users/${currentUser?._id}`,
              {
                lastPostCreatedAt: new Date(),
              }
            );
            dispatch(UpdateUserList({ ...currentUser, feed: newFeed }));
          } catch (error) {
            console.error(error);
          }
        });
      });
    }
    setTimeout(async () => {
      await setFile(null);
      await setResizedObj('');
      await setText('');
      await setOpenSuccess(true);
      await dispatch(setBackdropOpen(false));
      navigate('/');
    }, 3000);
  }

  // emojies
  const [open, setOpen] = React.useState(false);

  return (
    <Container height={height}>
      <SecondLevelContainer>
        <div style={{ marginLeft: 'auto' }} onClick={() => navigate('/')}>
          <AiOutlineCloseSquare className="icon" />
        </div>
        <Wrapper>
          <Title>{language?.language.User.addFeed.addFeed}</Title>
          <Info>
            <Profile>
              <Avatar
                onClick={() => navigate(`/user/${currentUser?._id}`)}
                alt={currentUser?.name}
                src={currentUser?.cover ? currentUser?.cover : ''}
                sx={{
                  width: 42,
                  height: 42,
                  cursor: 'pointer',
                  '@media only screen and (max-width: 1200px)': {
                    width: 40,
                    height: 40,
                  },
                }}
              />
            </Profile>
            <Name>{currentUser?.name}</Name>
          </Info>
          <Text
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={language?.language.User.addFeed.addText}
          />
          {open && (
            <Emojies>
              <EmojiPicker
                Theme="dark"
                onEmojiClick={(emoji) => setText((old) => old + emoji.emoji)}
              />
            </Emojies>
          )}
          {!isMobile && (
            <FaRegSmileBeam
              onClick={() => setOpen(!open)}
              className="label"
              color="yellow"
              size={20}
              style={{ marginTop: '10px', cursor: 'pointer' }}
            />
          )}
        </Wrapper>
        <Result
          file={file}
          {...currentUser}
          id={currentUser?._id}
          active={active}
          text={text}
          onImageChange={onImageChange}
          setRerender={setRerender}
          FileUpload={FileUpload}
          resizedObj={resizedObj}
          setResizedObj={setResizedObj}
          language={language}
        />
      </SecondLevelContainer>
      <Success
        open={openSuccess}
        setOpen={setOpenSuccess}
        title={language?.language.User.addFeed.feedAdded}
        type="success"
      />
    </Container>
  );
};

export default AddFeed;

const Emojies = styled.div`
  zindex: 100000;
  margin-left: 4vw;
  position: absolute;
`;

const Container = styled.div`
  width: 100%;
  height: calc(${(props) => props.height}px - 9vw);
  min-height: auto;
  padding-top: 1.5vw;
  padding-bottom: 3vw;
  box-sizing: border-box;
  display: flex;
  align-items: start;
  justify-content: center;
  gap: 15px;
  overflow-y: scroll;

  @media only screen and (max-width: 600px) {
    height: calc(${(props) => props.height}px - 10vw);
    max-hiehgt: calc(${(props) => props.height}px - 10vw);
    width: 100vw;
    align-items: start;
    margin-top: 5vw;
    padding-top: 0;
    padding-bottom: 60px;
    box-sizing: border-box;
  }

  ::-webkit-scrollbar {
    width: 0.3vw;
  }

  /* Track */
  ::-webkit-scrollbar-track {
    background-color: white;
  }

  /* Handle */
  ::-webkit-scrollbar-thumb {
    background-color: #e5e5e5;
  }

  /* Handle on hover */
  ::-webkit-scrollbar-thumb:hover {
    background-color: #1e1e1e;
  }
`;

const SecondLevelContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;

  @media only screen and (max-width: 600px) {
  }

  .icon {
    font-size: 1.75vw;
    cursor: pointer;
    color: #ccc;

    @media only screen and (max-width: 600px) {
      display: none;
    }
  }
`;

const Wrapper = styled.div`
  width: 35vw;
  height: 32vh;
  border-radius: 0.5vw;
  box-shadow: 0 0.1vw 0.3vw ${(props) => props.theme.shadowColor};
  background: ${(props) => props.theme.background};
  padding: 10px 30px;
  box-sizing: border-box;

  @media only screen and (max-width: 600px) {
    width: 100%;
    margin-top: 30px;
    height: auto;
    padding-bottom: 5vw;
  }
`;

const Title = styled.h3`
  font-size: 18px;
  color: ${(props) => props.theme.font};

  @media only screen and (max-width: 600px) {
    font-size: 16px;
  }
`;

const Info = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
`;

const Profile = styled.div`
  width: 2vw;
  height: 2vw;
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
    width: 6vw;
    height: 6vw;
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
  font-size: 14px;
  color: ${(props) => props.theme.font};
  font-weight: bold;
`;
const Text = styled.textarea`
  margin-top: 20px;
  width: 100%;
  height: 45%;
  border: 1px solid #ccc;
  border-radius: 10px;
  padding: 15px;
  font-size: 14px;
  box-sizing: border-box;
  white-space: pre-wrap;

  @media only screen and (max-width: 600px) {
    font-size: 16px;
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
