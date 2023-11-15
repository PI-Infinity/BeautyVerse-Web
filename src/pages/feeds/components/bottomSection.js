import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { FaRegStar, FaHeart, FaComment, FaShare, FaEye } from 'react-icons/fa';
import { MdSaveAlt } from 'react-icons/md';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setOpenedFeed } from '../../../redux/feed';
import ShareComponent from './shareComponent';
import { Reviews } from './reviews';

export const BottomSection = ({
  item,
  stared,
  starsLength,
  SetStar,
  RemoveStar,
  saved,
  savesLength,
  SaveFeed,
  UnSaveFeed,
  reviewsLength,
  setReviewsLength,
}) => {
  // some functions states
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();

  // current user
  const currentUser = useSelector((state) => state.storeUser.currentUser);

  // open shares option
  const [openShares, setOpenShares] = useState(false);
  const [transition, setTransition] = useState(true);

  // shares length
  const [shares, setShares] = useState(item?.shares || 0);

  useEffect(() => {
    setShares(item?.shares);
  }, [item]);

  /**
   * reviews
   */

  const [openReviews, setOpenReviews] = useState(
    location?.search?.length > 0
      ? { active: true, item: '' }
      : { active: false, item: '' }
  );

  return (
    <>
      {openShares && (
        <ShareComponent
          userId={item.owner._id}
          user={item.owner}
          feedId={item._id}
          transition={transition}
          setTransition={setTransition}
          shares={shares}
          setShares={setShares}
        />
      )}
      <Container>
        <div style={{ color: '#ccc' }}>
          <FaRegStar
            onClick={() => {
              if (currentUser) {
                stared ? RemoveStar() : SetStar();
              } else {
                navigate('/login');
              }
            }}
            size={22}
            color={stared ? '#f866b1' : '#ccc'}
          />
          <span style={{ width: '20px' }}>({starsLength})</span>
        </div>
        <div
          style={{ color: '#ccc' }}
          onClick={() => {
            if (location.pathname !== '/feeds') {
              if (
                openReviews?.active === true &&
                openReviews?.item === item?._id
              ) {
                setOpenReviews((prev) => {
                  return { ...prev, active: false, item: '' };
                });
              } else {
                setOpenReviews((prev) => {
                  return { ...prev, active: true, item: item._id };
                });
              }
              // setOpenReviews((prev) => {
              //   if (prev.active) {
              //     return { active: false, item: '' };
              //   } else {
              //     return { ...prev, active: true, item: item._id };
              //   }
              // });
            } else {
              if (location.pathname === '/feeds') {
                navigate(`/feeds/${item?._id}?reviews`);
                dispatch(setOpenedFeed(item));
              } else {
                return undefined;
              }
            }
          }}
        >
          <FaComment size={18} color="#ccc" />
          <span style={{ width: '20px' }}>({reviewsLength})</span>
        </div>

        <div
          style={{ color: '#ccc' }}
          onClick={() => {
            if (!transition) {
              setTransition(true);
            }
            if (openShares) {
              setTimeout(() => {
                setOpenShares(false);
              }, 300);
            } else {
              setOpenShares(true);
            }
          }}
        >
          <FaShare size={20} color="#ccc" />
          <span style={{ width: '20px' }}>({shares})</span>
        </div>
        <div
          style={{ color: '#ccc' }}
          onClick={() => {
            if (currentUser) {
              saved ? UnSaveFeed() : SaveFeed();
            } else {
              navigate('/login');
            }
          }}
        >
          <MdSaveAlt size={20} color={saved ? '#f866b1' : '#ccc'} />
          <span style={{ width: '20px' }}>({savesLength})</span>
        </div>
        <div style={{ color: '#ccc' }}>
          <FaEye size={20} color="#ccc" />
          <span style={{ width: '20px' }}>({item?.views?.length})</span>
        </div>
      </Container>
      {location.pathname !== '/feeds' &&
        openReviews?.active &&
        (openReviews?.item === item?._id || openReviews?.item === '') && (
          <Reviews
            item={item}
            reviewsLength={reviewsLength}
            setReviewsLength={setReviewsLength}
          />
        )}
    </>
  );
};

const Container = styled.div`
  height: 45px;
  width: 100%;
  border-bottom: 1.5px solid rgba(255, 255, 255, 0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-sizing: border-box;
  padding: 0 1vw;
  gap: 1vw;

  div {
    height: 100%;
    width: 18vw;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 4px;
    font-size: 12px;
  }
`;
