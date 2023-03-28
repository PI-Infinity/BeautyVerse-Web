import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useSelector, useDispatch } from 'react-redux';
import { MdOutlineCloseFullscreen } from 'react-icons/md';
import { IoMdArrowDropright, IoMdArrowDropleft } from 'react-icons/io';
import { AddReview } from '../../../pages/main/feedCard/addReview';
import { ReviewList } from '../../../pages/main/feedCard/reviewList';
import { setOpenFeed } from '../../../redux/feed';
import useWindowDimensions from '../../../functions/dimensions';
import { IsMobile } from '../../../functions/isMobile';
import { Spinner } from '../../../components/loader';
import { isWebpSupported } from 'react-image-webp/dist/utils';
import Avatar from '@mui/material/Avatar';
import GetTimesAgo from '../../../functions/getTimesAgo';
import { SiGoogletranslate } from 'react-icons/si';
import { SlReload } from 'react-icons/sl';
import { Language } from '../../../context/language';

export const OpenedFeed = (props) => {
  const { height, width } = useWindowDimensions();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isMobile = IsMobile();
  const language = Language();

  const [loading, setLoading] = useState(true);

  const path = window.location.pathname;
  const splited = path.split('/');
  const userId = splited[4];
  const feedId = splited[6];

  const [feed, setFeed] = useState();
  const [user, setUser] = useState();
  // const [state, setState] = useState('');

  const currentUser = JSON.parse(
    localStorage.getItem('Beautyverse:currentUser')
  );

  const rerender = useSelector((state) => state.storeMain.rerender);
  useEffect(() => {
    window.scrollTo(0, 0);
    if (feedId) {
      GetFeed();
    }
    if (userId) {
      GetUser();
    }
  }, [path]);

  const [render, setRender] = useState(false);
  useEffect(() => {
    if (feed?.feed?._id && user?._id) {
      GetStars();
      document.body.style.overflowY = 'hidden';
    }
  }, [path, feed?.feed?._id, user, render]);

  const [stars, setStars] = React.useState([]);

  async function GetStars() {
    const response = await fetch(
      `https://beautyverse.herokuapp.com/api/v1/users/${user?._id}/feeds/${feed?.feed?._id}/stars/check/${currentUser?._id}`
    )
      .then((response) => response.json())
      .then(async (data) => {
        setStars(data.data.stars);
      })
      .catch((error) => {
        console.log('Error fetching data:', error);
      });
  }

  let isStarGiven = stars?.checkIfStared;

  async function GetFeed() {
    const response = await fetch(
      `https://beautyverse.herokuapp.com/api/v1/users/${userId}/feeds/${feedId}`
    )
      .then((response) => response.json())
      .then(async (data) => {
        console.log(data.data);
        setFeed(data.data);
      })
      .catch((error) => {
        console.log('Error fetching data:', error);
      });
  }
  async function GetUser() {
    const response = await fetch(
      `https://beautyverse.herokuapp.com/api/v1/users/${userId}`
    )
      .then((response) => response.json())
      .then((data) => {
        setUser(data.data.user);
      })
      .catch((error) => {
        console.log('Error fetching data:', error);
      });
  }

  //define closing link
  const Closing = () => {
    let navigatePath;
    if (splited[splited?.length - 1] === 'profile') {
      navigatePath = () => navigate(`/api/v1/users/${user?._id}`);
    } else {
      navigatePath = () => navigate('/');
    }
    return navigatePath;
  };

  const closeOpenedFeed = Closing();

  // translate feed
  const [translated, setTranslated] = React.useState('');

  const lang = useSelector((state) => state.storeMain.language);

  // translate feed text
  const GetLanguages = (x) => {
    const API_KEY = 'AIzaSyAuSnUmGlptL0E4m4wP-1XzlqL_iv_y3g8';

    let url = `https://translation.googleapis.com/language/translate/v2?q=${x}&target=${lang}&key=${API_KEY}`;

    fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    })
      .then((res) => res.json())
      .then((response) => {
        setTranslated(response.data.translations[0].translatedText);
      })
      .catch((error) => {
        console.log('There was an error with the translation request: ', error);
      });
  };

  // define post time

  const currentPostTime = GetTimesAgo(
    new Date(feed?.feed?.createdAt)?.getTime(),
    feed?.feed?.createdAt
  );

  let timeTitle;
  if (currentPostTime?.title === 'h') {
    timeTitle = language?.language.Main.feedCard.h;
  } else if (currentPostTime?.title === 'min') {
    timeTitle = language?.language.Main.feedCard.min;
  } else if (currentPostTime?.title.includes('2')) {
    timeTitle = currentPostTime?.title;
  } else {
    timeTitle = language?.language.Main.feedCard.justNow;
  }

  const [imageHeight, setImageHeight] = useState(null);

  useEffect(() => {
    const img = new Image();
    if (isMobile) {
      img.src = feed?.feed?.mobileJpeg;
    } else {
      img.src = feed?.feed?.desktopUrl;
    }
    img.onload = () => {
      setImageHeight(img.height - (img.width - width));
      setTimeout(() => {
        setLoading(false);
      }, 100);
    };
  }, [feed]);

  return (
    <Container height={height}>
      <Wrapper height={height} id="wrapper">
        {loading && (
          <LoaderContainer loading={loading.toString()}>
            <Spinner />
          </LoaderContainer>
        )}
        <ImgContainer loading={loading?.toString()} imageHeight={imageHeight}>
          {feed?.prev && (
            <Arrow
              right="true"
              onClick={() =>
                navigate(`/api/v1/users/${user?._id}/feeds/${feed?.prev}`)
              }
            >
              <IoMdArrowDropleft size={40} color="rgba(255,255,255,0.5)" />
            </Arrow>
          )}

          {feed?.feed?.name?.toLowerCase().endsWith('mp4') ? (
            <Video width="100%" height="auto" controls autoplay muted>
              <source src={feed?.feed?.videoUrl} type="video/mp4" />
            </Video>
          ) : (
            <>
              {isMobile ? (
                isWebpSupported() ? (
                  <MainImg src={feed?.feed?.mobileWebp} active={props.active} />
                ) : (
                  <MainImg src={feed?.feed?.mobileJpeg} active={props.active} />
                )
              ) : (
                <MainImg src={feed?.feed?.desktopUrl} active={props.active} />
              )}
            </>
          )}
          {feed?.next && (
            <Arrow
              left="true"
              onClick={() =>
                navigate(`/api/v1/users/${user?._id}/feeds/${feed?.next}`)
              }
            >
              <IoMdArrowDropright size={40} color="rgba(255,255,255,0.5)" />
            </Arrow>
          )}
        </ImgContainer>

        <PostSide loading={loading.toString()}>
          <UserInfo>
            <Avatar
              onClick={() => navigate(`/api/v1/users/${user?._id}`)}
              alt={user?.name}
              src={user?.cover ? user?.cover : ''}
              sx={{ width: 42, height: 42, cursor: 'pointer' }}
            />

            <UserName onClick={() => navigate(`/api/v1/users/${user?._id}`)}>
              {user?.name}
            </UserName>
            {currentPostTime && (
              <PostTime>{currentPostTime?.numbers + ' ' + timeTitle}</PostTime>
            )}

            <ClosePost onClick={closeOpenedFeed}>
              <MdOutlineCloseFullscreen className="closeIcon" />
            </ClosePost>
          </UserInfo>
          <Post>
            {translated ? translated : feed?.feed?.post}
            {feed?.feed?.post && (
              <div style={{ cursor: 'pointer' }}>
                {translated?.length < 1 ? (
                  <div style={{ padding: '2px' }}>
                    <SiGoogletranslate
                      onClick={() => GetLanguages(feed?.feed?.post)}
                      size={14}
                      color="#ddd"
                      style={{ cursor: 'pointer' }}
                    />
                  </div>
                ) : (
                  <div style={{ padding: '2px' }}>
                    <SlReload
                      onClick={() => setTranslated('')}
                      size={14}
                      color="#ddd"
                      style={{ cursor: 'pointer' }}
                    />
                  </div>
                )}
              </div>
            )}
          </Post>
          <ReviewList
            reviews={feed?.feed?.reviews}
            currentUser={currentUser}
            id={userId}
            currentFeed={feed?.feed}
            setFeed={setFeed}
            targetUser={user}
          />
          <>
            {!isMobile && (
              <AddReview
                opened={true}
                render={render}
                setRender={setRender}
                targetUser={user}
                name={user?.name}
                id={userId}
                cover={user?.cover}
                isStarGiven={isStarGiven}
                stars={stars}
                setStars={setStars}
                setFeed={setFeed}
                currentFeed={feed?.feed}
                setOpenFeed={setOpenFeed}
              />
            )}
          </>
        </PostSide>
      </Wrapper>
      {isMobile && (
        <AddReview
          opened={true}
          render={render}
          setRender={setRender}
          targetUser={user}
          name={user?.name}
          id={userId}
          cover={user?.cover}
          isStarGiven={isStarGiven}
          stars={stars}
          setStars={setStars}
          setFeed={setFeed}
          currentFeed={feed?.feed}
          setOpenFeed={setOpenFeed}
        />
      )}
    </Container>
  );
};

const Container = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  padding: 2.5vw;
  overflow: hidden;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(40px);
  z-index: 10001;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;

  @media only screen and (max-width: 600px) {
    flex-direction: column;
    padding: 0;
    height: auto;
    min-height: ${(props) => props.height}px;
    background: ${(props) => props.theme.background};
    backdrop-filter: blur(40px);
  }
`;

const Wrapper = styled.div`
  background: ${(props) => props.theme.background};
  backdrop-filter: blur(40px);
  width: 80%;
  // padding: 0.5vw;
  height: 100%;
  min-height: 100%;
  display: flex;
  box-sizing: border-box;
  border-radius: 0.5vw;
  overflow: hidden;

  @media only screen and (max-width: 600px) {
    flex-direction: column;
    width: 100vw;
    height: ${(props) => props.height}px;
    min-height: 0%;
    overflow-y: scroll;
    overflow-x: hidden;
    background: none;
  }
`;

const LoaderContainer = styled.div`
  height: 100%;
  width: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${(props) => props.theme.background};
  position: absolute;
  z-index: 10005;
  overflow: hidden;

  @media only screen and (max-width: 600px) {
    width: 100vw;
    height: 100vh;
    align-items: center;
    padding-bottom: 10vh;
    box-sizing: border-box;
  }
`;

const ImgContainer = styled.div`
  height: 100%;
  width: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #050505;

  @media only screen and (max-width: 600px) {
    width: 100vw;
    height: ${(props) => props.imageHeight}px;
    align-items: ${(props) => (props.loading === 'true' ? 'center' : 'start')};
    position: relative;
    background: #050505;
    // border-bottom: 1px solid #f3f3f3;
  }
`;

const MainImg = styled.img`
  max-width: 100%;
  max-height: 100%;
  // transition: opacity 1s;

  @media only screen and (max-width: 600px) {
    width: 100vw;
    height: auto;
    max-width: 100%;
    max-height: auto;
  }
`;
const Video = styled.video`
  max-width: 100%;
  max-height: 100%;
  // transition: opacity 1s;

  @media only screen and (max-width: 600px) {
    width: 100vw;
    height: auto;
    max-width: 100%;
    max-height: auto;
  }
`;

const PostSide = styled.div`
  width: 50%;
  height: 100%;
  padding: 0 3vw;
  box-sizing: border-box;
  background: none;
  border-radius: 0.25vw;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: start;

  @media only screen and (max-width: 600px) {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: ${(props) => (props.loading === 'true' ? '100%' : 'auto')};
    align-items: center;
    padding: 0 5vw;
  }
`;

const UserInfo = styled.div`
  width: 100%;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  gap: 15px;
  margin: 2vw 0 0 0;

  @media only screen and (max-width: 600px) {
    margin: 4vw 0 0 0;
    width: 90vw;
    padding: 0;
  }
`;

const CoverContainer = styled.div`
  width: 3vw;
  height: 3vw;
  border-radius: 50vw;
  overflow: hidden;
  object-fit: cover;
  display: flex;
  align-items: center;
  justify-content: center;

  @media only screen and (max-width: 600px) {
    width: 9vw;
    height: 9vw;
    border: 1px solid #f3f3f3;
  }
`;

const CoverImg = styled.img`
  width: 3vw;
  height: 3vw;

  @media only screen and (max-width: 600px) {
    width: 9vw;
    height: 9vw;
  }
`;

const UserName = styled.h3`
  width: 70%;
  font-size: 18px;
  margin: 0;
  cursor: pointer;
  color: ${(props) => props.theme.font};

  :hover {
    text-decoration: underline;
  }

  @media only screen and (max-width: 600px) {
    font-size: 16px;
  }
`;

const PostTime = styled.div`
  width: 5vw;
  color: #ccc;
  font-size: 12px;

  @media only screen and (max-width: 600px) {
    width: 30vw;
  }
`;

const ClosePost = styled.div`
  padding: 0.25vw;
  margin-left: auto;
  cursor: pointer;

  .closeIcon {
    font-size: 1.2vw;
    position: relative;
    bottom: 1vw;
    left: 1vw;
    color: orange;

    @media only screen and (max-width: 600px) {
      font-size: 6vw;
      // color: rgba(255, 255, 255, 0.8);
    }
  }

  @media only screen and (max-width: 600px) {
    position: absolute;
    top: 5vw;
    right: 5vw;
  }
`;

const UserProfileEmpty = styled.div`
  width: 3vw;
  height: 3vw;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  // background: red;

  @media only screen and (max-width: 600px) {
    width: 6vw;
    height: 6vw;
  }

  .user {
    font-size: 1.5vw;

    @media only screen and (max-width: 600px) {
      font-size: 5vw;
    }
  }
`;

const Post = styled.div`
  display: flex;
  text-alignt: start;
  justify-content: space-between;
  width: 100%;
  height: auto;
  max-height: 30%;
  overflow-y: scroll;
  padding: 30px 20px;
  box-sizing: border-box;
  font-size: 14px;
  color: ${(props) => props.theme.font};

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

  @media only screen and (max-width: 600px) {
    height: auto;
    max-height: 100%;
    overflow: hidden;
    padding: 6vw 5px;
  }
`;

const Arrow = styled.div`
  position: absolute;
  margin-right: ${(props) => (props.right === 'true' ? '43%' : 'auto')};
  margin-left: ${(props) => (props.left === 'true' ? '43%' : 'auto')};
  // opacity: ${(props) => (props.off ? '0' : '0.2')};
  width: 2.5vw;
  height: 2.5vw;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2vw;
  cursor: ${(props) => (props.off ? 'auto' : 'pointer')};
  transition: ease-in-out 150ms;
  color: #444;
  user-select: none;
  -moz-user-select: none;
  -webkit-user-select: none;
  -ms-user-select: none;
  z-index: 1005;
  background: rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(40px);

  @media only screen and (max-width: 600px) {
    position: absolute;
    width: 9vw;
    height: 9vw;
    font-size: 9vw;
    margin-top: 0;
    margin-right: 0;
    margin-left: 0;
    top: calc(50% - 4.5vw);
    left: ${(props) => (props.right === 'true' ? '5vw' : 'auto')};
    right: ${(props) => (props.left === 'true' ? '5vw' : 'auto')};
  }

  :hover {
    opacity: ${(props) => (props.off ? '0' : '0.8')};
  }
`;
