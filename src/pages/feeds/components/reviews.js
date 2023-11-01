import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { BounceLoader } from 'react-spinners';
import { useLocation, useNavigate } from 'react-router-dom';
import { setTargetUser } from '../../../redux/user';
import { setBackPath } from '../../../redux/app';
import { TextField } from '@mui/material';
import { MdClose, MdDone, MdSend } from 'react-icons/md';
import { v4 as uuidv4 } from 'uuid';
import { BiDotsHorizontalRounded } from 'react-icons/bi';
import { setFeeds } from '../../../redux/feeds';
import { Language } from '../../../context/language';
import GetTimesAgo from '../../../functions/getTimesAgo';

export const Reviews = ({ item, reviewsLength, setReviewsLength }) => {
  const [loading, setLoading] = useState(true);
  const [reviewsList, setReviewsList] = useState([]);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();

  // current user
  const currentUser = useSelector((state) => state.storeUser.currentUser);

  // feeds
  const feeds = useSelector((state) => state.storeFeeds.feeds);
  // backend url
  const backendUrl = useSelector((state) => state.storeApp.backendUrl);

  // getting data step by step
  const [page, setPage] = useState(1);

  useEffect(() => {
    const GetReviews = async () => {
      try {
        const response = await axios.get(
          backendUrl + `/api/v1/feeds/${item?._id}/reviews?page=${1}`
        );
        if (response.data.data.reviews) {
          setReviewsList(response.data.data.reviews);
          setReviewsLength(response.data.result);
          setPage(1);
          setLoading(false);
        }
      } catch (error) {
        console.log('error');
        console.log(error.response.data.message);
      }
    };
    if (item) {
      GetReviews();
    }
  }, [item]);

  // add reviews in list on scroll
  const scrollRef = useRef();

  const [loadingMore, setLoadingMore] = useState(false);

  const AddReviews = async (p) => {
    try {
      if (loadingMore) return; // Prevent multiple requests while one is in progress
      const scrollContainer = scrollRef.current;
      if (
        scrollContainer &&
        scrollContainer.scrollTop + scrollContainer.clientHeight >=
          scrollContainer.scrollHeight // You can adjust this threshold as needed
      ) {
        setLoadingMore(true); // Adjust the page size as needed
        const response = await axios.get(
          backendUrl + `/api/v1/feeds/${item?._id}/reviews?page=${p}`
        );
        if (response.data.data?.reviews) {
          setReviewsList((prev) => {
            const newReviews = response.data.data?.reviews || [];
            const uniqueReviews = newReviews.filter(
              (newReview) =>
                !prev.some(
                  (prevReview) => prevReview.reviewId === newReview.reviewId
                )
            );
            return [...prev, ...uniqueReviews];
          });
          setPage(p);
          setLoadingMore(false);
        }
      }
    } catch (error) {
      console.log(error.response.data.message);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    const scrollContainer = scrollRef.current;

    const handleScroll = () => {
      AddReviews(page + 1);
    };

    if (scrollContainer) {
      scrollContainer.addEventListener('scroll', handleScroll);
    }

    return () => {
      if (scrollContainer) {
        scrollContainer.removeEventListener('scroll', handleScroll);
      }
    };
  }, [reviewsList]);

  /**
   *  // add new review
   */
  const [textInput, setTextInput] = useState('');

  const AddReview = async () => {
    const newId = uuidv4();
    const newReview = {
      reviewId: newId,
      reviewer: {
        id: currentUser?._id,
        name: currentUser?.name,
        cover: currentUser?.cover,
        type: currentUser?.type,
      },
      createdAt: new Date(),
      text: textInput,
    };
    try {
      setReviewsList((prevReviews) => [newReview, ...prevReviews]);
      setReviewsLength((prev) => prev + 1);
      setTextInput('');
      const updatedFeeds = feeds.map((feed) =>
        feed._id === item?._id
          ? { ...feed, reviewsLength: reviewsLength + 1 }
          : feed
      );
      dispatch(setFeeds(updatedFeeds));
      await axios.post(backendUrl + `/api/v1/feeds/${item?._id}/reviews`, {
        reviewId: newId,
        reviewer: currentUser?._id,
        createdAt: new Date(),
        text: textInput,
      });
      // if (currentUser?._id !== props.user?._id) {
      //   await axios.post(
      //     backendUrl + `/api/v1/users/${props.user?._id}/notifications`,
      //     {
      //       senderId: currentUser?._id,
      //       text: ``,
      //       date: new Date(),
      //       type: 'review',
      //       status: 'unread',
      //       feed: `${props?.feed?._id}`,
      //     }
      //   );
      //   if (props.user._id !== currentUser._id) {
      //     if (props.user?.pushNotificationToken) {
      //       await sendNotification(
      //         props.user?.pushNotificationToken,
      //         currentUser.name,
      //         'added comment on your feed!',
      //         { feed: item._id }
      //       );
      //     }
      //   }
      // }

      // socket.emit('updateUser', {
      //   targetId: props.user?._id,
      // });
      // dispatch(setRerenderUserFeed());
    } catch (error) {
      console.error(error);
    }
  };

  /**
   *
   * delete review
   */
  const [confirmDelete, setConfirmDelete] = useState(false);
  const DeleteReview = async (id) => {
    const url = backendUrl + `/api/v1/feeds/${item?._id}/reviews/${id}`;
    try {
      setReviewsList((prevReviews) =>
        prevReviews.filter((review) => review.reviewId !== id)
      );
      setReviewsLength((prev) => prev - 1);
      const updatedFeeds = feeds.map((feed) =>
        feed._id === item?._id
          ? { ...feed, reviewsLength: reviewsLength - 1 }
          : feed
      );
      dispatch(setFeeds(updatedFeeds));
      const response = await fetch(url, { method: 'DELETE' });

      if (response.status === 200) {
        const data = await response.json();

        // Update the feed.reviews array by filtering out the deleted review
      } else {
        console.error('Error deleting review:', response.status);
      }
    } catch (error) {
      console.log('Error fetching data:', error);
    }
  };

  return (
    <>
      {loading ? (
        <div
          style={{
            width: '100%',
            display: 'flex',
            justifyContent: 'center',
            padding: '15px 0',
          }}
        >
          <BounceLoader color={'#f866b1'} loading={loading} size={30} />
        </div>
      ) : (
        <>
          {/* {reviewsLength > 0 && ( */}
          <Container>
            <div
              style={{
                color: '#ccc',
                fontSize: '14px',
                letterSpacing: '0.5px',
                fontWeight: 500,
              }}
            >
              Comments: ({reviewsLength})
            </div>
            {currentUser && (
              <div
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '15px',
                }}
              >
                <TextField
                  id="outlined-basic"
                  label="Write comment..."
                  variant="outlined"
                  value={textInput}
                  type="text"
                  onChange={(e) => setTextInput(e.target.value)}
                  inputProps={{ maxLength: 500 }}
                  sx={{
                    width: '90%',
                    margin: '15px 0 0 0',
                    '& .MuiOutlinedInput-root': {
                      height: '53px',
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'rgba(255,255,255,0.1)',
                        borderRadius: '15px',
                      },
                      '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#f866b1',
                      },
                      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#f866b1',
                      },
                    },
                    '& .MuiOutlinedInput-input': {
                      borderRadius: '15px',
                      color: '#ccc',
                    },
                    '& label': {
                      color: '#888',
                      fontSize: '14px',
                      letterSpacing: '0.5px',
                    },
                    '& label.Mui-focused': {
                      color: '#ccc',
                      fontSize: '14px',
                      letterSpacing: '0.5px',
                    },
                  }}
                />
                <div onClick={AddReview}>
                  <MdSend
                    color="#ccc"
                    size={24}
                    style={{ transform: 'rotate(320deg)' }}
                  />
                </div>
              </div>
            )}

            <div
              style={{
                marginTop: '15px',
                height: 'auto',
                width: '100%',
                maxHeight: '250px',
                overflowY: 'scroll',
                padding: '0 0 20px 0',
                boxSizing: 'border-box',
                display: 'flex',
                flexDirection: 'column',
                gap: '15px',
              }}
              ref={scrollRef}
            >
              {reviewsList?.map((itm, x) => {
                return (
                  <ReviewItem
                    key={x}
                    item={item}
                    itm={itm}
                    currentUser={currentUser}
                    confirmDelete={confirmDelete}
                    setConfirmDelete={setConfirmDelete}
                    DeleteReview={DeleteReview}
                  />
                );
              })}
            </div>
          </Container>
          {/* )} */}
        </>
      )}
    </>
  );
};

const Container = styled.div`
  width: 100%;
  height: auto;
  box-sizing: border-box;
  padding: 15px;
  overflow: hidden;
`;

const ReviewItem = ({
  item,
  itm,
  confirmDelete,
  setConfirmDelete,
  DeleteReview,
  currentUser,
}) => {
  const dispatch = useDispatch();
  const language = Language();
  const location = useLocation();
  const navigate = useNavigate();

  // get defined time
  const currentPostTime = GetTimesAgo(new Date(itm?.createdAt).getTime());

  let definedTime;
  if (currentPostTime?.includes('min')) {
    definedTime =
      currentPostTime?.slice(0, -3) + language?.language.Main.feedCard.min;
  } else if (currentPostTime?.includes('h')) {
    definedTime =
      currentPostTime?.slice(0, -1) + language?.language.Main.feedCard.h;
  } else if (currentPostTime?.includes('d')) {
    definedTime =
      currentPostTime?.slice(0, -1) + language?.language.Main.feedCard.d;
  } else if (currentPostTime?.includes('j')) {
    definedTime =
      currentPostTime?.slice(0, -1) + language?.language.Main.feedCard.justNow;
  } else if (currentPostTime?.includes('w')) {
    definedTime =
      currentPostTime?.slice(0, -1) + language?.language.Main.feedCard.w;
  } else if (currentPostTime?.includes('mo')) {
    definedTime =
      currentPostTime?.slice(0, -2) + language?.language.Main.feedCard.mo;
  } else if (currentPostTime?.includes('y')) {
    definedTime =
      currentPostTime?.slice(0, -1) + language?.language.Main.feedCard.y;
  }

  return (
    <div
      style={{
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
        }}
      >
        <div
          onClick={() => {
            dispatch(setTargetUser(item.owner));
            navigate(
              `/user/${item.owner._id}/${
                item.owner.type === 'shop' ? 'showroom' : 'feeds'
              }`
            );
            dispatch(
              setBackPath({
                path: [location.pathname],
                data: [],
                activeLevel: 0,
              })
            );
          }}
          style={{
            width: '30px',
            height: '30px',
            borderRadius: '50px',
            overflow: 'hidden',
            background: 'rgba(255,255,255,0.1)',
          }}
        >
          <img
            src={itm.reviewer?.cover}
            style={{
              width: '30px',
              height: '30px',
              borderRadius: '50px',
              objectFit: 'cover',
            }}
          />
        </div>
        <div
          onClick={() => {
            dispatch(setTargetUser(item.owner));
            navigate(
              `/user/${item.owner._id}/${
                item.owner.type === 'shop' ? 'showroom' : 'feeds'
              }`
            );
            dispatch(
              setBackPath({
                path: [location.pathname],
                data: [],
                activeLevel: 0,
              })
            );
          }}
          style={{
            color: '#ccc',
            fontSize: '14px',
            fontWeight: 'bold',
            letterSpacing: '0.5px',
          }}
        >
          {itm.reviewer.name}
        </div>
        <div
          style={{
            color: '#888',
            fontSize: '12px',
            fontWeight: 500,
            margin: '0 0 0 auto',
          }}
        >
          {definedTime}.
        </div>
      </div>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          width: '90vw',
        }}
      >
        <div
          style={{
            color: '#ccc',
            background: 'rgba(255,255,255,0.1)',
            boxSizing: 'border-box',
            padding: '6px 10px',
            borderRadius: '10px',
            fontSize: '14px',
            letterSpacing: '0.3px',
            fontWeight: 500,
            maxWidth: '90%',
            overflow: 'hidden',
            margin: 0,
          }}
        >
          {itm.text}
        </div>
        {currentUser && (
          <>
            {confirmDelete.active && confirmDelete.item === itm.reviewId ? (
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column-reverse',
                  gap: '15px',
                }}
              >
                <div onClick={() => setConfirmDelete(false)}>
                  <MdClose color="#888" size={24} />
                </div>
                <div onClick={() => DeleteReview(itm?.reviewId)}>
                  <MdDone color="red" size={24} />
                </div>
              </div>
            ) : (
              <BiDotsHorizontalRounded
                size={16}
                color="#ccc"
                onClick={() =>
                  setConfirmDelete({
                    active: true,
                    item: itm.reviewId,
                  })
                }
              />
            )}
          </>
        )}
      </div>
    </div>
  );
};
