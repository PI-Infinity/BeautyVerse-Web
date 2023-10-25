import React from 'react';
import styled from 'styled-components';
import { FaRegStar, FaHeart, FaComment, FaShare, FaEye } from 'react-icons/fa';
import { MdSaveAlt } from 'react-icons/md';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setOpenedFeed } from '../../../redux/feed';

export const BottomSection = ({ item }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  return (
    <Container>
      <div style={{ color: '#ccc' }}>
        <FaRegStar size={20} color="#ccc" />({item?.starsLength})
      </div>
      <div
        style={{ color: '#ccc' }}
        onClick={
          location.pathname === '/feeds'
            ? () => {
                navigate(`/feeds/${item?._id}`);
                dispatch(setOpenedFeed(item));
              }
            : undefined
        }
      >
        <FaComment size={16} color="#ccc" />({item?.reviewsLength})
      </div>
      <div style={{ color: '#ccc' }}>
        <FaShare size={18} color="#ccc" />({item?.shares})
      </div>
      <div style={{ color: '#ccc' }}>
        <MdSaveAlt size={20} color="#ccc" />({item?.saves?.length})
      </div>
      <div style={{ color: '#ccc' }}>
        <FaEye size={18} color="#ccc" />({item?.views?.length})
      </div>
    </Container>
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
  padding: 0 20px;

  div {
    height: 100%;
    display: flex;
    align-items: center;
    gap: 4px;
    font-size: 12px;
  }
`;
