import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { BiStar } from 'react-icons/bi';
import { useSelector, useDispatch } from 'react-redux';
import { setFeedScrollY } from '../../../redux/scroll';
import { TopSection } from '../../../pages/main/feedCard/topSection';
import { Reports } from '../../../pages/main/feedCard/reports';
import { useNavigate } from 'react-router-dom';
import useWindowDimensions from '../../../functions/dimensions';
import { ImgLoader, TextLoader, LineLoader } from '../../../components/loader';
import { IsMobile } from '../../../functions/isMobile';
import { isWebpSupported } from 'react-image-webp/dist/utils';
import { Language } from '../../../context/language';
import { SiGoogletranslate } from 'react-icons/si';
import { SlReload } from 'react-icons/sl';
import axios from 'axios';
import { format } from 'timeago.js';

export const FeedCard = (props) => {
  const currentUser = JSON.parse(
    localStorage.getItem('Beautyverse:currentUser')
  );
  const { height, width } = useWindowDimensions();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isMobile = IsMobile();
  const language = Language();

  const [render, setRender] = useState(false);

  const [starObj, setStarObj] = useState({
    check: props.feed.checkIfStared,
    starsLength: props.feed.starsLength,
  });

  // loading feeds
  const [loading, setLoading] = React.useState(true);

  const rerenderUserList = useSelector(
    (state) => state.storeRerenders.rerenderUserList
  );
  const country = useSelector((state) => state.storeMain.country);

  const cityFilter = useSelector((state) => state.storeFilter.cityFilter);
  const districtFilter = useSelector(
    (state) => state.storeFilter.districtFilter
  );

  // capitalize first letters

  function capitalizeFirstLetter(string) {
    return string?.charAt(0).toUpperCase() + string?.slice(1);
  }

  // reviews
  const [openReview, setOpenReview] = React.useState(false);

  React.useEffect(() => {
    setLoading(true);
    setOpenReview(false);
  }, [props?._id, rerenderUserList]);

  // give heart to user
  const SetStar = async () => {
    try {
      await axios.post(
        `https://beautyverse.herokuapp.com/api/v1/users/${props?._id}/feeds/${props?.feed?._id}/stars`,
        {
          staredBy: currentUser?._id,
          createdAt: new Date(),
        }
      );
      if (currentUser?.uid !== props?._id) {
        await axios.post(
          `https://beautyverse.herokuapp.com/api/v1/users/${props?._id}/notifications`,
          {
            senderId: currentUser?._id,
            text: `მიანიჭა ვარსკვლავი თქვენ პოსტს!`,
            date: new Date(),
            type: 'star',
            status: 'unread',
            feed: `/api/v1/users/${props?._id}/feeds/${props.feed?._id}`,
          }
        );
        // await props.socket.emit('sendNotification', {
        //   senderName: currentUser.name,
        //   senderId: currentUser._Id,
        //   recieverName: props.name,
        //   recieverId: props._id,
        //   text: `მიანიჭა ვარსკვლავი თქვენ პოსტს!`,
        //   date: new Date(),
        //   type: 'star',
        //   status: 'unread',
        //   feed: `/api/v1/users/${props?._id}/feeds/${props.feed?._id}`,
        // });
      }
      setStarObj({ check: true, starsLength: starObj.starsLength + 1 });
    } catch (error) {
      console.error(error);
    }
  };

  // remove heart
  const RemoveStar = async () => {
    const url = `https://beautyverse.herokuapp.com/api/v1/users/${props?._id}/feeds/${props?.feed?._id}/stars/${currentUser?._id}`;
    const response = await fetch(url, { method: 'DELETE' })
      .then((response) => response.json())
      .then(async (data) => {
        setStarObj({ check: false, starsLength: starObj.starsLength - 1 });
      })

      .catch((error) => {
        console.log('Error fetching data:', error);
      });
  };

  // open report
  const [reports, setReports] = React.useState(false);

  // open post
  const [openPost, setOpenPost] = React.useState(false);

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

  const createdAt = format(props?.feed?.createdAt);

  const [imageHeight, setImageHeight] = useState(null);

  useEffect(() => {
    const img = new Image();
    if (isMobile) {
      img.src = props?.feed?.mobileJpeg;
    } else {
      img.src = props?.feed?.desktopUrl;
    }
    img.onload = () => {
      setImageHeight(img.height - (img.width - width));
      setTimeout(() => {
        setLoading(false);
      }, 200);
    };
  }, [props?.feed]);

  return (
    <Main feed={props?.feed?.name}>
      <Container
        onClick={
          props?.feed?.fileFormat === 'video'
            ? () => {
                navigate(
                  `api/v1/users/${props?._id}/feeds/${props?.feed?._id}`
                );
                dispatch(setFeedScrollY(window.scrollY));
              }
            : undefined
        }
      >
        <Divider id="divider" loading={loading.toString()}></Divider>
        <TopSection
          cover={props.cover}
          id={props._id}
          name={props?.name}
          username={props?.username}
          userType={props?.type}
          reports={reports}
          setReports={setReports}
          loading={loading}
        />
        {props?.feed?.post && (
          <>
            <PostContainer openPost={openPost}>
              <p
                style={{
                  whiteSpace: 'pre-line',
                  margin: '0 15px 5px 15px',
                  fontSize: '14px',
                }}
              >
                {loading ? (
                  <TextLoader />
                ) : (
                  <>{translated ? translated : props?.feed?.post}</>
                )}
              </p>
              {props?.feed?.post && !loading && (
                // country === props?.address?.country && (
                <Translater style={{ cursor: 'pointer' }}>
                  {translated?.length < 1 ? (
                    <div style={{ padding: '2px' }}>
                      <SiGoogletranslate
                        onClick={() => GetLanguages(props?.feed?.post)}
                        size={15}
                        color="#ddd"
                        style={{ cursor: 'pointer' }}
                      />
                    </div>
                  ) : (
                    <div style={{ padding: '2px' }}>
                      <SlReload
                        onClick={() => setTranslated('')}
                        size={15}
                        color="#ddd"
                        style={{ cursor: 'pointer' }}
                      />
                    </div>
                  )}
                </Translater>
              )}
            </PostContainer>
          </>
        )}
        <div>
          {reports && (
            <Reports path={`/api/v1/${props?._id}/feed/${props.feed?._id}`} />
          )}
          {props?.feed && (
            <>
              {props?.feed?.fileFormat === 'video' ? (
                <FileContainer>
                  {loading ? (
                    <ImgLoader />
                  ) : (
                    <Video width="100%" height="auto" controls autoplay muted>
                      <source src={props?.feed?.videoUrl} type="video/mp4" />
                    </Video>
                  )}
                </FileContainer>
              ) : (
                <FileContainer imageHeight={imageHeight}>
                  {loading ? (
                    // <div
                    //   style={{
                    //     widht: '100%',
                    //     height: imageHeight,
                    //     background: 'red',
                    //   }}
                    // ></div>
                    <ImgLoader imageHeight={imageHeight} />
                  ) : (
                    <>
                      {isMobile ? (
                        isWebpSupported() ? (
                          <Cover
                            src={props?.feed?.mobileWebp}
                            active={props.active}
                            onClick={() => {
                              dispatch(setFeedScrollY(window.scrollY));
                              navigate(
                                `api/v1/users/${props?._id}/feeds/${props?.feed?._id}`
                              );
                            }}
                          />
                        ) : (
                          <Cover
                            src={props?.feed?.mobileJpeg}
                            active={props.active}
                            onClick={() => {
                              dispatch(setFeedScrollY(window.scrollY));
                              navigate(
                                `api/v1/users/${props?._id}/feeds/${props?.feed?._id}`
                              );
                            }}
                          />
                        )
                      ) : (
                        <Cover
                          src={props?.feed?.desktopUrl}
                          active={props.active}
                          onClick={() => {
                            dispatch(setFeedScrollY(window.scrollY));
                            navigate(
                              `api/v1/users/${props?._id}/feeds/${props?.feed?._id}`
                            );
                          }}
                        />
                      )}
                    </>
                  )}
                </FileContainer>
              )}
            </>
          )}
        </div>
        {/* )} */}

        <Review>
          {loading ? (
            <LineLoader />
          ) : (
            <>
              <div style={{ flex: 1 }}>
                <Likes>
                  {starObj?.check ? (
                    <BiStar className="likedIcon" onClick={RemoveStar} />
                  ) : (
                    <BiStar
                      className="unlikedIcon"
                      onClick={
                        currentUser != undefined
                          ? SetStar
                          : () => navigate('/login')
                      }
                    />
                  )}
                  {starObj.starsLength}
                </Likes>
              </div>

              <div
                style={{ flex: 1, display: 'flex', justifyContent: 'center' }}
              >
                <TextReview
                  open={openReview}
                  onClick={() => {
                    dispatch(setFeedScrollY(window.scrollY));
                    navigate(
                      `api/v1/users/${props?._id}/feeds/${props?.feed?._id}`
                    );
                  }}
                >
                  {props?.feed?.reviewsLength}{' '}
                  {language?.language.Main.feedCard.reviews}
                </TextReview>
              </div>
              <PostTime>
                <span>{createdAt}</span>
              </PostTime>
            </>
          )}
        </Review>
      </Container>
      {/* )} */}
    </Main>
  );
};

const Main = styled.div``;

const Divider = styled.div`
  display: none;
  @media only screen and (max-width: 600px) {
    display: flex;
    height: 1px;
    background: ${(props) => props.theme.secondLevel};
  }
`;

const Container = styled.div`
  width: 35vw;
  height: auto;
  max-height: auto;
  max-width: 35vw;
  border-radius: 0.5vw;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  justify-content: start;
  box-shadow: 0 0.1vw 0.3vw ${(props) => props.theme.shadowColor};
  background: ${(props) => props.theme.background}
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
    background: ${(props) => props.theme.mobileFeedCard};
    box-shadow: none;
  }
`;

const PostContainer = styled.div`
  padding: 0 25px 10px 20px;
  margin: 0;
  max-height: ${(props) => (props.openPost ? '100%' : '55px')};
  height: auto,
  overflow: ${(props) => (props.openPost ? 'visible' : 'hidden')};
  cursor: pointer;
  background: ${(props) => props.theme.background};
  display: flex;
  justify-content: space-between;
  
  & > p {
    color: ${(props) => props.theme.font};
    background: ${(props) => props.theme.background};
  }

  @media only screen and (max-width: 600px) {
    padding: 0 4.3vw 10px 10px;
  }
 
`;

const Translater = styled.div`
  @media only screen and (max-width: 600px) {
    position: relative;
    left: 0.5vw;
  }
`;

const FileContainer = styled.div`
  width: 100%;
  height: 35vw;
  min-height: 400px;
  display: flex;
  aling-items: center;
  justify-content: center;

  @media only screen and (max-width: 600px) {
    height: ${(props) => props.imageHeight}px;
    max-width: 100%;
    max-height: 100%;
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

  @media only screen and (max-width: 600px) {
    height: 10vw;
    padding-left: 4vw;
    padding-right: 4vw;
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
  font-size: 12px;
  color: ${(props) => props.theme.font};
`;

const PostTime = styled.div`
  flex: 1;
  display: flex;
  justify-content: flex-end;

  span {
    color: ${(props) => props.theme.font};
    font-size: 12px;
  }
`;

const TextReview = styled.span`
  cursor: pointer;
  color: ${(props) => props.theme.font};
  transition: ease-in-out 100ms;
  font-size: 12px;
  letter-spacing: 0;
  // margin-bottom: 0.1vw;

  @media only screen and (max-width: 600px) {
    position: relative;
    bottom: 0.2px;
  }

  :hover {
    color: #ccc;
  }
`;
