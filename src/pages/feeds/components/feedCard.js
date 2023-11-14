import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { TopSection } from './topSection';
import { BottomSection } from './bottomSection';
import { useLocation, useNavigate } from 'react-router-dom';
import { setOpenedFeed } from '../../../redux/feed';
import { useDispatch, useSelector } from 'react-redux';
import { AnimationSkelton } from '../../../components/animationSkelton';
import VideoComponent from './videoComponent';
import { BounceLoader } from 'react-spinners';
import { PostSection } from './postSection';
import { Options } from './options';
import axios from 'axios';
import { setFeeds } from '../../../redux/feeds';

export const FeedCard = ({
  item,
  setItem,
  goToFeeds,
  setOpenFeed,
  setOpenReviews,
}) => {
  // define file sizes
  const fileWidth = item?.fileWidth;
  const fileHeight = item?.fileHeight;
  const aspectRatio = fileWidth / fileHeight; // 0.6
  const screenWidth = window.innerWidth;
  const screenHeight = screenWidth / aspectRatio;
  // define navigate
  const navigate = useNavigate();

  // defines location
  const location = useLocation();

  // redux dispatch
  const dispatch = useDispatch();

  // image loading opacity
  const [opacity, setOpacity] = useState(false);

  /**
   * user actions on feed
   */

  const [stared, setStared] = useState(item?.checkIfStared || false);
  const [starsLength, setStarsLength] = useState(item?.starsLength || 0);
  const [saved, setSaved] = useState(item?.checkIfSaved || false);
  const [savesLength, setSavesLength] = useState(item?.saves?.length || 0);
  const [reviewsLength, setReviewsLength] = useState(item?.reviewsLength || 0);

  useEffect(() => {
    setStared(item?.checkIfStared);
    setStarsLength(item?.starsLength || 0);
    setSaved(item?.checkIfSaved);
    setSavesLength(item?.saves?.length || 0);
    setReviewsLength(item?.reviewsLength || 0);
  }, [item]);

  /**
   * item media sizes
   */

  const widthReduction = 20;
  const reductionPercent = (widthReduction / screenWidth) * 100;
  const adjustedHeight = screenHeight - screenHeight * (reductionPercent / 100);

  // pagin enabled scrolling images
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollRef = useRef();

  const handleScroll = (event) => {
    const offsetX = event.target.scrollLeft;
    const index = Math.round(offsetX / window.innerWidth);
    if (index !== activeIndex) setActiveIndex(index);
  };

  useEffect(() => {
    const scrollView = scrollRef.current;
    const handleScrollEnd = () => {
      const offsetX = scrollView.scrollLeft;
      const index = Math.round(offsetX / window.innerWidth);
      const offset = index * window.innerWidth;
      scrollView.scrollTo({
        left: offset,
        behavior: 'smooth',
      });
    };
    scrollView.addEventListener('scrollend', handleScrollEnd);

    return () => scrollView.removeEventListener('scrollend', handleScrollEnd);
  }, []);

  const currentUser = useSelector((state) => state.storeUser.currentUser);
  const backendUrl = useSelector((state) => state.storeApp.backendUrl);
  const feeds = useSelector((state) => state.storeFeeds.feeds);

  // open feed option
  const [openOption, setOpenOption] = useState(false);

  /*
  
  set star main function 
  */
  const SetStar = async () => {
    try {
      setStared({ checkIfStared: true });
      setStarsLength((prev) => prev + 1);
      const updatedFeeds = feeds.map((feed) =>
        feed._id === item?._id
          ? { ...feed, starsLength: feed.starsLength + 1, checkIfStared: true }
          : feed
      );
      dispatch(setFeeds(updatedFeeds));
      await axios.post(`${backendUrl}/api/v1/feeds/${item?._id}/stars`, {
        star: {
          staredBy: currentUser?._id,
          createdAt: new Date(),
        },
      });

      if (currentUser?._id !== item?.owner?._id) {
        await axios.post(
          `${backendUrl}/api/v1/users/${item?.owner?._id}/notifications`,
          {
            senderId: currentUser?._id,
            text: '',
            date: new Date(),
            type: 'star',
            status: 'unread',
            feed: `${item?._id}`,
          }
        );
      }
      //   // if (item?.owner?.pushNotificationToken) {
      //   //   await sendNotification(
      //   //     item?.owner?.pushNotificationToken,
      //   //     currentUser.name,
      //   //     "added star on your feed!",
      //   //     {
      //   //       feed: item?._id,
      //   //     }
      //   //   );
      //   // }
      //   // socket.emit("updateUser", {
      //   //   targetId: item?.owner?._id,
      //   // });
      // }
    } catch (error) {
      console.error(error.response.data.message);
    }
  };

  /**
   * Remove start main function
   */
  const RemoveStar = async () => {
    try {
      setStared(null);
      setStarsLength((prev) => prev - 1);
      const updatedFeeds = feeds.map((feed) =>
        feed._id === item?._id
          ? { ...feed, starsLength: feed.starsLength - 1, checkIfStared: false }
          : feed
      );
      dispatch(setFeeds(updatedFeeds));
      const url = `${backendUrl}/api/v1/feeds/${item?._id}/stars/${currentUser?._id}`;
      await fetch(url, { method: 'DELETE' })
        .then((response) => response.json())

        .catch((error) => {
          console.log('Error fetching data:', error);
        });
    } catch (error) {
      console.log(error.response.data.message);
    }
  };

  /**
   *
   * Main save function
   */
  const SaveFeed = async () => {
    try {
      setSaved({ checkIfSaved: true });
      setSavesLength((prev) => prev + 1);
      const updatedFeeds = feeds.map((feed) =>
        feed._id === item?._id
          ? {
              ...feed,
              saves: [
                ...feed.saves,
                { user: currentUser?._id, savedAt: new Date().toISOString() },
              ],
              checkIfSaved: true,
            }
          : feed
      );
      dispatch(setFeeds(updatedFeeds));

      await axios.patch(backendUrl + '/api/v1/feeds/' + item._id + '/save', {
        saveFor: currentUser._id,
      });
      if (currentUser?._id !== item?.owner?._id) {
        await axios.post(
          `${backendUrl}/api/v1/users/${item?.owner?._id}/notifications`,
          {
            senderId: currentUser?._id,
            text: ``,
            date: new Date(),
            type: 'save',
            status: 'unread',
            feed: `${item?._id}`,
          }
        );
        // if (item?.owner?.pushNotificationToken) {
        //   await sendNotification(
        //     item?.owner?.pushNotificationToken,
        //     currentUser.name,
        //     'saved your feed!',
        //     {
        //       feed: item._id,
        //     }
        //   );
        // }
        // socket.emit('updateUser', {
        //   targetId: item?.owner?._id,
        // });
      }
    } catch (error) {
      console.log(error.response);
    }
  };

  const UnSaveFeed = async () => {
    try {
      setSaved(null);
      setSavesLength((prev) => prev - 1);
      const updatedFeeds = feeds.map((feed) =>
        feed._id === item?._id
          ? {
              ...feed,
              saves: feed.saves.filter(
                (save) => save.user !== currentUser?._id
              ),
              savesLength: feed.savesLength - 1,
              checkIfSaved: false,
            }
          : feed
      );

      dispatch(setFeeds(updatedFeeds));

      await axios.patch(backendUrl + '/api/v1/feeds/' + item?._id + '/save', {
        unSaveFor: currentUser._id,
      });
    } catch (error) {
      console.log(error.response.data.message);
    }
  };

  return (
    <Container>
      <TopSection
        item={item}
        setOpenOption={setOpenOption}
        openOption={openOption}
      />
      {item?.post?.original?.length > 0 && <PostSection item={item} />}
      <FilesContainer
        ref={scrollRef}
        onScroll={handleScroll}
        width={screenWidth - widthReduction}
        height={adjustedHeight}
        style={{ overflowX: item?.images?.length > 1 ? 'scroll' : 'hidden' }}
      >
        {openOption?.active && (
          <Options
            openOption={openOption}
            setOpenOption={setOpenOption}
            width={screenWidth - widthReduction}
            height={adjustedHeight}
            setItem={setItem}
            setOpenFeed={setOpenFeed}
          />
        )}

        {!opacity && (
          <BounceLoader
            style={{
              position: 'absolute',
              left: (screenWidth - widthReduction - 20) / 2,
              zIndex: -1,
              marginBottom: '40px',
            }}
            size={40}
            color="#f866b1"
          />
        )}
        {item?.fileFormat === 'img' ? (
          <>
            {item?.images?.map((itm, index) => {
              return (
                <Image
                  onClick={() => {
                    if (!goToFeeds) {
                      if (
                        location.pathname === '/feeds' ||
                        location.pathname.includes('profile/settings')
                      ) {
                        navigate(
                          location.pathname.includes('/profile')
                            ? `feed/${item?._id}`
                            : `/feeds/${item?._id}`
                        );
                        dispatch(setOpenedFeed(item));
                      } else {
                        return undefined;
                      }
                    } else {
                      goToFeeds();
                    }
                  }}
                  key={index}
                  src={itm?.url}
                  width="auto"
                  height="auto"
                  style={{
                    opacity: opacity ? 1 : 0,
                    transition: 'ease-in 300ms',
                    objectFit: 'cover',
                    maxWidth: '100%',
                  }}
                  onLoad={() => setOpacity(true)}
                />
              );
            })}
          </>
        ) : (
          <VideoComponent
            item={item}
            location={location}
            screenHeight={adjustedHeight}
            screenWidth={screenWidth - widthReduction}
          />
        )}
      </FilesContainer>
      <BottomSection
        item={item}
        stared={stared}
        starsLength={starsLength}
        SetStar={SetStar}
        RemoveStar={RemoveStar}
        saved={saved}
        savesLength={savesLength}
        SaveFeed={SaveFeed}
        UnSaveFeed={UnSaveFeed}
        setOpenReviews={setOpenReviews}
        reviewsLength={reviewsLength}
        setReviewsLength={setReviewsLength}
      />
    </Container>
  );
};

const Container = styled.div`
  width: 100%;
`;

const FilesContainer = styled.div`
  width: ${(props) => props.width / 2.5}px;
  height: ${(props) => props.height / 2.5}px;
  background: rgba(255, 255, 255, 0.1);
  display: flex;
  align-items: center;
  overflow-y: hidden;
  overflow-x: scroll;
  margin-left: 10px;
  border-radius: 20px;
  max-height: 1080px;
  max-width: 640px;
  box-sizing: border-box;
  scroll-snap-type: x mandatory;
  -webkit-overflow-scrolling: touch;

  @media only screen and (max-width: 600px) {
    width: ${(props) => props.width}px;
    height: ${(props) => props.height}px;
    background: rgba(255, 255, 255, 0.1);
    display: flex;
    align-items: center;
    margin-left: 10px;
    border-radius: 20px;
    max-width: auto;
    max-height: 640px;
  }
`;

const Image = styled.img`
  width: ${(props) => props.width / 2.5}px;
  height: ${(props) => props.height / 2.5}px;
  max-height: 1080px;
  max-width: 640px;

  @media only screen and (max-width: 600px) {
    width: ${(props) => props.width}px;
    height: ${(props) => props.height}px;
    max-width: auto;
    max-height: 640px;
  }
`;
