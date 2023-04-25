import { useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { FiSend } from 'react-icons/fi';
import { BiStar } from 'react-icons/bi';
import axios from 'axios';
import { v4 } from 'uuid';
import { useSelector, useDispatch } from 'react-redux';
import { UpdateUser } from '../../../redux/main';

export const AddReview = (props) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [text, setText] = useState();

  // import current currentUser & parse it
  const currentUser = JSON.parse(
    localStorage.getItem('Beautyverse:currentUser')
  );

  // give heart to currentUser
  const SetStar = async () => {
    try {
      props.setFeedObj((prev) => {
        return {
          ...prev,
          feed: {
            ...prev.feed,
            starsLength: prev.feed.starsLength + 1,
          },
          checkIfStared: true,
        };
      });
      const handleReview = (userId, isDecrement) => {
        const user = userList.find((u) => u._id === userId);
        if (user) {
          const newStarsLength = isDecrement
            ? user.feed.starsLength - 1
            : user.feed.starsLength + 1;
          const updatedUser = {
            ...user,
            feed: {
              ...user.feed,
              starsLength: newStarsLength,
              checkIfStared:
                newStarsLength > user.feed.starsLength
                  ? true
                  : newStarsLength < user.feed.starsLength
                  ? false
                  : user.feed.checkIfStared,
            },
          };
          dispatch(UpdateUser(updatedUser));
        }
      };
      handleReview(props?.targetUser._id);
      await axios.post(
        `https://beautyverse.herokuapp.com/api/v1/users/${props?.targetUser._id}/feeds/${props.currentFeed?._id}/stars`,
        {
          staredBy: currentUser?._id,
          createdAt: new Date(),
        }
      );
      if (currentUser._id !== props?.targetUser._id) {
        await axios.post(
          `https://beautyverse.herokuapp.com/api/v1/users/${props?.targetUser._id}/notifications`,
          {
            senderId: currentUser?._id,
            text: `მიანიჭა ვარსკვლავი თქვენ პოსტს!`,
            date: new Date(),
            type: 'star',
            status: 'unread',
            feed: `/api/v1/users/${props?.targetUser._id}/feeds/${props.currentFeed?._id}`,
          }
        );
      }
    } catch (error) {
      console.error(error);
    }
  };

  // let stars;

  // remove heart
  const RemoveStar = async () => {
    try {
      props.setFeedObj((prev) => {
        return {
          ...prev,
          feed: {
            ...prev.feed,
            starsLength: prev.feed.starsLength - 1,
          },
          checkIfStared: false,
        };
      });
      const handleReview = (userId, isDecrement) => {
        const user = userList.find((u) => u._id === userId);
        if (user) {
          const newStarsLength = user.feed.starsLength - 1;
          const updatedUser = {
            ...user,
            feed: {
              ...user.feed,
              starsLength: newStarsLength,
              checkIfStared:
                newStarsLength > user.feed.starsLength
                  ? true
                  : newStarsLength < user.feed.starsLength
                  ? false
                  : user.feed.checkIfStared,
            },
          };
          dispatch(UpdateUser(updatedUser, isDecrement));
        }
      };
      handleReview(props?.targetUser._id);
      const url = `https://beautyverse.herokuapp.com/api/v1/users/${props.targetUser?._id}/feeds/${props?.currentFeed?._id}/stars/${props.currentUser?._id}`;
      const response = await fetch(url, { method: 'DELETE' })
        .then((response) => response.json())

        .catch((error) => {
          console.log('Error fetching data:', error);
        });
    } catch (error) {
      console.log(error);
    }
  };

  /**
   * add review
   *  */

  const userList = useSelector((state) => state.storeMain.userList);

  const SetReview = async () => {
    const newId = v4();
    try {
      props.setFeedObj((prev) => {
        return {
          ...prev,
          feed: {
            ...prev.feed,
            reviews: [
              {
                reviewId: newId,
                reviewer: {
                  id: currentUser?._id,
                  name: currentUser?.name,
                  cover: currentUser.cover,
                  type: currentUser.type,
                },
                createdAt: new Date(),
                text: text,
              },
              ...prev.feed.reviews,
            ],
          },
          next: prev.next,
        };
      });
      const handleReview = (userId) => {
        const user = userList.find((u) => u._id === userId);
        if (user) {
          const updatedUser = {
            ...user,
            feed: { ...user.feed, reviewsLength: user.feed.reviewsLength + 1 },
          };
          dispatch(UpdateUser(updatedUser));
        }
      };
      handleReview(props?.targetUser._id);
      await axios.post(
        `https://beautyverse.herokuapp.com/api/v1/users/${props?.targetUser._id}/feeds/${props.currentFeed?._id}/reviews`,
        {
          reviewId: newId,
          reviewer: currentUser?._id,
          createdAt: new Date(),
          text: text,
        }
      );
      if (currentUser._id !== props?.targetUser._id) {
        await axios.post(
          `https://beautyverse.herokuapp.com/api/v1/users/${props?.targetUser._id}/notifications`,
          {
            senderId: currentUser?._id,
            text: `დატოვა კომენტარი თქვენს პოსტზე!`,
            date: new Date(),
            type: 'star',
            status: 'unread',
            feed: `/api/v1/users/${props?.targetUser._id}/feeds/${props.currentFeed?._id}`,
          }
        );
      }
      setText('');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <ReviewContainer>
      {currentUser && (
        <Footer>
          <Likes>
            {props.checkIfStared ? (
              <BiStar className="likedIcon" onClick={RemoveStar} />
            ) : (
              <BiStar
                className="unlikedIcon"
                onClick={currentUser?._id ? SetStar : () => navigate('/login')}
              />
            )}
            {props.starsLength}
          </Likes>
          {currentUser._id && (
            <>
              <AddReviewContainer
                value={text}
                type="text"
                placeholder="Add Review"
                onChange={(e) => setText(e.target.value)}
              />{' '}
              <FiSend
                className="send"
                onClick={text?.length > 0 ? SetReview : null}
              />
            </>
          )}
        </Footer>
      )}
    </ReviewContainer>
  );
};

const ReviewContainer = styled.div`
  position: relative;
  width: 100%;
  height: auto;
  max-height: 55%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  padding-bottom: 1.5vw;
  box-sizing: border-box;
  margin-top: auto;

  .send {
    color: ${(props) => props.theme.icon};
    font-size: 24px;
    margin-left: 0.2vw;
    cursor: pointer;
    width: 15%;

    @media only screen and (max-width: 600px) {
      margin-left: 0;
    }
  }

  @media only screen and (max-width: 600px) {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    height: auto;
    margin-left: auto;
    padding: 1.5vw 3vw 1.5vw 3vw;
    box-shadow: 0 -0.3vw 0.9vw ${(props) => props.theme.shadowColor};
    background: ${(props) => props.theme.secondLevel};
    z-index: 10006;
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

const AddReviewContainer = styled.input`
  border: none;
  color: ${(props) => props.theme.font};
  background: #050505;
  width: 100%;
  padding: 0.5vw;
  border-radius: 50vw;

  @media only screen and (max-width: 600px) {
    padding: 2vw 2vw 2vw 3vw;
    font-size: 16px;
    box-sizing: border-box;
  }

  ::placeholder {
    color: #666;
    font-size: 14px;
  }

  :focus {
    outline: none;
  }
`;

const Likes = styled.div`
  display: flex;
  align-items: center;
  font-size: 14px;
  width: 15%;
  color: ${(props) => props.theme.font};
`;

const Footer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  gap: 15px;
  font-size: 14px;
`;
