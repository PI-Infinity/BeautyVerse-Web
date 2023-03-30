import { useState } from 'react';
import styled from 'styled-components';
import { MdOutlineRemove } from 'react-icons/md';
import { FaUser } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import GetTimesAgo from '../../../functions/getTimesAgo';
import { Language } from '../../../context/language';
import { format } from 'timeago.js';

export const ReviewList = (props) => {
  const language = Language();

  const navigate = useNavigate();

  const [reviewers, setReviewers] = useState([]);
  const DeleteReview = async (id) => {
    const url = `https://beautyverse.herokuapp.com/api/v1/users/${props.targetUser?._id}/feeds/${props?.currentFeed?._id}/reviews/${id}`;
    try {
      const response = await fetch(url, { method: 'DELETE' });

      if (response.status === 200) {
        const data = await response.json();

        // Update the feed.reviews array by filtering out the deleted review
        props.setFeedObj((prev) => {
          return {
            ...prev,
            feed: {
              ...prev.feed,
              reviews: prev.feed.reviews.filter(
                (review) => review.reviewId !== id
              ),
            },
            next: prev.next,
          };
        });
      } else {
        console.error('Error deleting review:', response.status);
      }
    } catch (error) {
      console.log('Error fetching data:', error);
    }
  };

  return (
    <ReviewListContainer>
      {props?.reviews?.map((item, index) => {
        return (
          <ReviewItem key={index}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                width: '100%',
              }}
            >
              {item.reviewer.cover ? (
                <Img src={item.reviewer.cover} alt="beautyverse" />
              ) : (
                <UserProfileEmpty>
                  <FaUser className="user" />
                </UserProfileEmpty>
              )}

              <Reviewer
                onClick={() => navigate(`/api/v1/users/${item?.reviewer.id}`)}
              >
                {item.reviewer.name}
              </Reviewer>

              <span
                style={{
                  fontSize: '12px',
                  color: '#ccc',
                  marginLeft: 'auto',
                }}
              >
                {format(item?.createdAt)}
              </span>
            </div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                width: '100%',
              }}
            >
              <Text>{item.text}</Text>
              {(props.currentUser?._id === item.reviewer.id ||
                props.id === props.currentUser._id) && (
                <MdOutlineRemove
                  onClick={() => DeleteReview(item.reviewId)}
                  style={{
                    minWidth: '5%',
                    textAlign: 'center',
                    fontSize: '16px',
                    cursor: 'pointer',
                  }}
                  className="remove"
                />
              )}
            </div>
          </ReviewItem>
        );
      })}
    </ReviewListContainer>
  );
};

const ReviewListContainer = styled.div`
  overflow-y: scroll;
  width: 100%;
  height: auto;
  max-height: 70%;
  margin-top: 0.5vw;
  margin-bottom: 1vw;
  padding: 0.5vw;
  color: #444;
  box-sizing: border-box;

  @media only screen and (max-width: 600px) {
    height: auto;
    overflow: hidden;
    max-height: 100%;
    padding: 0;
    padding-bottom: 20vw;
  }

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
    background-color: #444;
  }

  /* Handle on hover */
  ::-webkit-scrollbar-thumb:hover {
    background-color: #1e1e1e;
  }
`;

const ReviewItem = styled.div`
  width: 100%;
  // background: #fff;
  border-radius: 0.25vw;
  padding: 0.5vw;
  box-sizing: border-box;
  margin-bottom: 0.3vw;
  // box-shadow: 0 0.1vw 0.2vw rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  justify-content: start;
  align-items: center;
  gap: 0.5vw;
  font-size: 12px;
  color: ${(props) => props.theme.font};

  @media only screen and (max-width: 600px) {
    // box-shadow: 0 0.2vw 0.6vw rgba(0, 0, 0, 0.1);
    padding: 1.5vw;
    border-radius: 1vw;
    margin-bottom: 1vw;
    gap: 2.5vw;
  }

  .remove {
    color: ${(props) => props.theme.secondLevel};
  }
`;

const Text = styled.div`
  word-wrap: break-word;
  width: 90%;
  max-width: 100%;
  overflow: hidden;
  text-align: start;
  background: ${(props) => props.theme.secondLevel};
  border-radius: 0 15px 15px 15px;
  padding: 5px 15px;
  // marginLeft: 5px;
`;

const Img = styled.img`
  width: 1.5vw;
  height: 1.5vw;
  cursor: pointer;
  object-fit: cover;
  border-radius: 50vw;

  :hover {
    filter: brightness(0.97);
  }

  @media only screen and (max-width: 600px) {
    width: 6vw;
    height: 6vw;
  }
`;

const UserProfileEmpty = styled.div`
  width: 1.5vw;
  height: 1.5vw;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;

  @media only screen and (max-width: 600px) {
    width: 6vw;
    height: 6vw;
  }

  .user {
    font-size: 1.2vw;

    @media only screen and (max-width: 600px) {
      font-size: 5vw;
    }
  }
`;

const Reviewer = styled.div`
  font-weight: bold;
  margin-right: 5px;
  transition: ease 200ms;
  cursor: pointer;
  width: auto;

  @media only screen and (max-width: 600px) {
    margin-right: 0;
  }

  :hover {
    text-decoration: underline;
  }
`;
