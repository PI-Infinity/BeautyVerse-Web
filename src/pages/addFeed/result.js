import React from 'react';
import styled from 'styled-components';
import { BiStar } from 'react-icons/bi';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { TopSection } from '../../pages/main/feedCard/topSection';
import { IsMobile } from '../../functions/isMobile';
import { IoMdImages } from 'react-icons/io';
import Resizer from 'react-image-file-resizer';
import { isWebpSupported } from 'react-image-webp/dist/utils';
import { setRerenderUserList } from '../../redux/rerenders';

export const Result = (props) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  // capitalize first letters

  const isMobile = IsMobile();

  function capitalizeFirstLetter(string) {
    return string?.charAt(0).toUpperCase() + string?.slice(1);
  }

  const name = capitalizeFirstLetter(props?.name);
  const userType = capitalizeFirstLetter(props?.type);

  // reize image
  const resizeFileDekstop = (file) =>
    new Promise((resolve) => {
      Resizer.imageFileResizer(
        file,
        1080,
        1080,
        'JPEG',
        100,
        0,
        (uri) => {
          resolve(uri);
        },
        'file'
      );
    });

  const resizeFileMobileJpeg = (file) =>
    new Promise((resolve) => {
      Resizer.imageFileResizer(
        file,
        640,
        640,
        'JPEG',
        100,
        0,
        (uri) => {
          resolve(uri);
        },
        'file'
      );
    });

  const DefineUrl = async () => {
    try {
      if (props?.file?.name?.length > 0) {
        if (props?.file?.type.endsWith('mp4')) {
          props?.setResizedObj(props?.file);
        } else if (
          props?.file?.type?.endsWith('jpeg') ||
          props?.file?.type?.endsWith('png') ||
          props?.file?.type?.endsWith('jpg')
        ) {
          const imageDesktop = await resizeFileDekstop(props?.file);
          const imageMobileJPEG = await resizeFileMobileJpeg(props?.file);
          if (props?.file) {
            props?.setResizedObj({
              desktop: imageDesktop,
              mobile: imageMobileJPEG,
            });
          }
        } else {
          alert('File Not Suported');
        }
        return;
      }
    } catch (err) {
      console.log(err);
    }
  };

  const url = React.useMemo(
    props?.file?.type?.endsWith('mp4')
      ? () => {
          alert('Upload video not supported, we work to fix this issue');
          props?.setFile(null);
        }
      : () => DefineUrl(),
    [props?.file]
  );

  return (
    <div
      style={{
        overfloY: 'scroll',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <Container active={props.active}>
        <TopSection
          cover={props.cover}
          name={name}
          userType={userType}
          testFeed={true}
          id={props?.id}
        />
        <div
          style={{
            width: '100%',
            heght: '100%',
            // padding: "0px 15px",
            // margin: "0 0 25px 0",
            overflowY: 'scroll',
            // maxHeight: "15vw",
          }}
        >
          {props.text?.length > 0 && (
            <p
              style={{
                whiteSpace: 'pre-line',
                margin: '0',
                padding: '10px 25px 20px 25px',
                boxSizing: 'border-box',
              }}
            >
              {props.text}
            </p>
          )}
        </div>
        <di style={{ zIndex: 1000 }}>
          {props.file ? (
            <div
              style={{
                // height: "100%",
                // width: "100%",
                position: 'relative',
              }}
            >
              {props.file?.type?.endsWith('mp4') ? (
                <>
                  <input
                    type="file"
                    id="img"
                    accept=".mp4"
                    style={{ display: 'none' }}
                    onChange={props.onImageChange}
                  />
                  <label
                    htmlFor="img"
                    style={{ display: 'flex', alignItems: 'center' }}
                  >
                    <Video width="100%" height="auto" controls autoplay muted>
                      <source
                        src={URL?.createObjectURL(props?.file)}
                        type="video/mp4"
                      />
                    </Video>
                  </label>
                </>
              ) : (
                <>
                  <input
                    type="file"
                    id="img"
                    style={{ display: 'none' }}
                    accept=".jpg, .jpeg, .png"
                    onChange={props.onImageChange}
                  />
                  <label
                    htmlFor="img"
                    style={{ display: 'flex', alignItems: 'center' }}
                  >
                    {isMobile ? (
                      <Cover
                        src={
                          props?.resizedObj &&
                          URL?.createObjectURL(props?.resizedObj.mobile)
                        }
                        active={props.active}
                      />
                    ) : (
                      <Cover
                        src={
                          props?.resizedObj &&
                          URL?.createObjectURL(props?.resizedObj.desktop)
                        }
                        active={props.active}
                      />
                    )}
                  </label>
                </>
              )}
            </div>
          ) : (
            <div
              style={{
                width: '100%',
                height: 'auto',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '150px 0',
              }}
            >
              <input
                type="file"
                id="img"
                style={{ display: 'none' }}
                onChange={props.onImageChange}
              />
              <label
                htmlFor="img"
                style={{ display: 'flex', alignItems: 'center' }}
              >
                <IoMdImages className="icon" />
                <span style={{ color: '#ccc' }}>(JPG / JPEG / PNG)</span>
              </label>
            </div>
          )}
        </di>

        <Review>
          <div style={{ flex: 1 }}>
            <Likes>
              <BiStar className="likedIcon" /> 0
            </Likes>
          </div>

          <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
            <TextReview>
              0 {props?.language?.language.User.addFeed.reviews}
            </TextReview>
          </div>
          <PostTime>
            <span>Just now</span>
          </PostTime>
        </Review>
      </Container>
      <Button
        onClick={
          props.file != null
            ? async () => {
                await props.FileUpload();
                dispatch(setRerenderUserList());
              }
            : () => alert('Add File')
        }
      >
        {props?.language?.language.User.addFeed.addFeed}
      </Button>
    </div>
  );
};

const Divider = styled.div`
  display: none;
  @media only screen and (max-width: 600px) {
    display: flex;
    height: 1.5vw;
    background: rgba(0, 10, 61, 0.15);
    width: 100%;
  }
`;

const Container = styled.div`
  width: 35vw;
  height: auto;
  max-height: auto;
  max-width: 35vw;
  border-radius: 0.5vw;
  display: flex;
  flex-direction: column;
  justify-content: start;
  box-shadow: 0 0.1vw 0.3vw ${(props) => props.theme.shadowColor};
  background: rgba(0, 0, 0, 0.9);
  transition: ease 250ms;
  margin-bottom: 1vw;

  @media only screen and (max-width: 600px) {
    width: 100vw;
    height: auto;
    max-height: auto;
    max-width: 100vw;
    border-radius: 0;
    box-sizing: border-box;
    margin-bottom: 0;
    background: #f7e6ff;
  }

  & > div {
    /* width */
    ::-webkit-scrollbar {
      width: 0vw;
    }

    /* Track */
    ::-webkit-scrollbar-track {
      background-color: white;
    }

    /* Handle */
    ::-webkit-scrollbar-thumb {
      background-color: #222;
    }

    /* Handle on hover */
    ::-webkit-scrollbar-thumb:hover {
      background-color: #1e1e1e;
    }
  }

  & > div > p {
    background: ${(props) => props.theme.background};
    color: ${(props) => props.theme.font};
    font-size: 14px;
  }
`;

const PostContainer = styled.div`
  padding: 0 20px 10px 20px;
  margin: 0;
  max-height: ${(props) => (props.openPost ? '100%' : '55px')};
  height: auto,
  overflow: ${(props) => (props.openPost ? 'visible' : 'hidden')};
  cursor: pointer;
  background: ${(props) => props.theme.background};

  & > p {
    background: ${(props) => props.theme.background};
  }
`;

const FileContainer = styled.div`
  width: 100%;
  height: 100%;
  min-height: 400px;
  display: flex;
  aling-items: center;
  justify-content: center;

  @media only screen and (max-width: 600px) {
    min-height: 300px;
  }
`;

const Cover = styled.img`
  max-width: 100%;
  max-height: 35vw;
  display: block;
  margin-left: auto;
  margin-right: auto;
  object-fit: cover;
  cursor: pointer;
  animation: fadeIn ease 0.3s;
  -webkit-animation: fadeIn ease 0.3s;
  -moz-animation: fadeIn ease 0.3s;
  -o-animation: fadeIn ease 0.3s;
  -ms-animation: fadeIn ease 0.3s;

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
    max-width: 100%;
    max-height: 100%;
  }
`;

const Video = styled.video`
  max-width: 100%;
  max-height: 35vw;
  display: block;
  margin-left: auto;
  margin-right: auto;
  animation: fadeIn ease 0.5s;
  -webkit-animation: fadeIn ease 0.5s;
  -moz-animation: fadeIn ease 0.5s;
  -o-animation: fadeIn ease 0.5s;
  -ms-animation: fadeIn ease 0.5s;

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
    max-width: 100%;
    max-height: 100%;
  }
`;

const UserCont = styled.div`
  width: 24vw;
  height: 24vw;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-sizing: border-box;

  @media only screen and (max-width: 600px) {
    width: 100%;
    height: 100%;
  }

  .user {
    color: #ccc;
    font-size: 12vw;

    @media only screen and (max-width: 600px) {
      font-size: 40vw;
    }
  }
`;

const Review = styled.div`
  height: 2.5vw;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-left: 1vw;
  padding-right: 1vw;
  box-sizing: border-box;
  background: ${(props) => props.theme.background};
  color: ${(props) => props.theme.font};
  font-size: 12px;

  @media only screen and (max-width: 600px) {
    height: 10vw;
    padding-left: 3vw;
    padding-right: 3vw;
    // padding-top: 1vw;
  }

  .unlikedIcon {
    color: #ddd;
    font-size: 1.5vw;
    transform: scale(0.9);
    margin-right: 0.25vw;
    cursor: pointer;

    @media only screen and (max-width: 600px) {
      font-size: 6vw;
      transform: scale(0.9);
      margin-right: 1vw;
    }
  }
  .likedIcon {
    color: #bb3394;
    transform: scale(1);
    font-size: 1.5vw;
    margin-right: 0.25vw;
    cursor: pointer;

    @media only screen and (max-width: 600px) {
      font-size: 6vw;
      transform: scale(1);
      margin-right: 1vw;
    }
  }
`;

const Likes = styled.div`
  display: flex;
  align-items: center;
  font-size: 14px;
`;

const PostTime = styled.div`
  flex: 1;
  display: flex;
  justify-content: flex-end;

  span {
    color: #ddd;
    font-size: 14px;
  }
`;

const TextReview = styled.span`
  cursor: pointer;
  color: ${(props) => props.theme.font};
  transition: ease-in-out 200ms;
  font-size: 14px;
  letter-spacing: 0;
  margin-bottom: 0.1vw;

  @media only screen and (max-width: 600px) {
    margin-bottom: 0.2vw;
  }

  :hover {
    color: #444;
    text-decoration: underline;
  }
`;

const Button = styled.div`
  width: 20vw;
  height: 2.5vw;
  border-radius: 0.5vw;
  box-shadow: 0 0.1vw 0.3vw rgba(2, 2, 2, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: ease-in 200ms;
  color: ${(props) => (props.back ? '#ccc' : 'green')};
  font-weight: bold;
  background: ${(props) => props.theme.secondLevel};
  margin-top: 0.5vw;
  font-size: 14px;

  @media only screen and (max-width: 600px) {
    width: 45vw;
    height: 8vw;
    border-radius: 1.5vw;
    box-shadow: 0 0.3vw 0.6vw rgba(2, 2, 2, 0.2);
    margin: 6vw 0 4vw 0;
  }

  :hover {
    box-shadow: 0 0.1vw 0.3vw rgba(2, 2, 2, 0.2);
  }
`;
