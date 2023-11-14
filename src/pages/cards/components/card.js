import React, { useState, useEffect } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { HiBadgeCheck, HiLocationMarker, HiUsers } from 'react-icons/hi';
import { FaRegStar, FaHeart } from 'react-icons/fa';
import { FaUser } from 'react-icons/fa';
import { useLocation, useNavigate } from 'react-router-dom';
import { setTargetUser } from '../../../redux/user';
import { useDispatch } from 'react-redux';
import { VscVerifiedFilled } from 'react-icons/vsc';
import { setBackPath } from '../../../redux/app';

export const Card = ({ item }) => {
  // capitalize first letters function
  function capitalizeFirstLetter(string) {
    return string?.charAt(0).toUpperCase() + string?.slice(1);
  }

  // capitalize and define user's type
  const t = capitalizeFirstLetter(item?.type);
  const name = capitalizeFirstLetter(item?.name);

  let type;
  if (item.type === 'specialist') {
    type = t;
  } else if (item.type === 'shop') {
    type = t;
  } else {
    type = 'Beauty Salon';
  }

  // navigate
  const navigate = useNavigate();

  // redux dispatch
  const dispatch = useDispatch();

  // location
  const location = useLocation();

  // page animation opacity
  const [opacity, setOpacity] = useState(false);

  useEffect(() => {
    setOpacity(true);
  }, []);

  return (
    <Container>
      <NameContainer>
        {item.subscription.status === 'active' && (
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <VscVerifiedFilled size={16} color="#f866b1" />
          </div>
        )}

        <h3
          style={{
            color: '#ccc',
            margin: 0,
            fontSize: '16px',
            letterSpacing: '0.5px',
          }}
        >
          {name}
        </h3>
      </NameContainer>
      <ImageContainer
        cover={item.cover?.length > 0 ? 'true' : 'false'}
        onClick={() => {
          dispatch(setTargetUser(item));
          navigate(
            `/user/${item._id}/${item.type === 'shop' ? 'showroom' : 'feeds'}`
          );
          dispatch(
            setBackPath({
              path: [location.pathname],
              data: [],
              activeLevel: 0,
            })
          );
        }}
      >
        {item.cover?.length > 0 ? (
          <img
            onLoad={() => setOpacity(true)}
            src={item.cover}
            width="100%"
            style={{
              objectFit: 'cover',
              aspectRatio: 1,
              borderRadius: '10px',
              opacity: opacity ? 1 : 0,
              transition: 'ease-in 500ms',
            }}
          />
        ) : (
          <FaUser size={80} color="#aaa" />
        )}
      </ImageContainer>
      <h4 style={{ color: '#ccc', margin: 0, letterSpacing: '0.5px' }}>
        {item?.username ? item.username : type}
      </h4>
      <div
        style={{
          width: '100%',
          display: 'flex',
          gap: '4px',
          alignItems: 'center',
          overflow: 'hidden',
          whiteSpace: 'nowrap',
        }}
      >
        <HiLocationMarker size={14} color="#f866b1" />

        <div style={{ width: '80%' }}>
          <span
            style={{
              color: '#ccc',
              margin: 0,
              fontWeight: 'normal',
              fontSize: '14px',
              // whiteSpace: "nowrap",
            }}
          >
            {item.address[0]?.city.replace("'", '')}
            {item.address[0]?.street && ' - '}
            {item.address[0]?.street}
          </span>
        </div>
      </div>
      <StatsContainer>
        <div>
          <FaRegStar size={14} color="#f866b1" /> {item?.totalStars}
        </div>
        <div>
          <HiUsers size={14} color="#ccc" />
          {item?.followersLength}
        </div>
        {item?.rating && (
          <div>
            <FaHeart size={14} color="#f866b1" />
            {item?.rating?.toFixed(1)}
          </div>
        )}
      </StatsContainer>
    </Container>
  );
};

const Container = styled.div`
  box-sizing: border-box;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 15px;
  row-gap: 15px;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 10px;

  &:hover {
    opacity: 0.8;
  }

  @media only screen and (max-width: 600px) {
    border: none;
    row-gap: 10px;
  }
`;

const NameContainer = styled.div`
  white-space: nowrap;
  overflow: hidden;
  max-width: 100%;
  display: flex;
  align-items: center;
  gap: 4px;

  @media only screen and (max-width: 600px) {
    white-space: nowrap;
    overflow: hidden;
    max-width: 100%;
    // display: flex;
    // align-items: center;
    gap: 4px;
  }
`;

const pulse = keyframes`
    0% {
      background-color: rgba(255,255,255,0.1); 
      
    }
    50% {
      background-color: rgba(255,255,255,0.2); 
      
    }
    100% {
      background-color: rgba(255,255,255,0.1); 
      
    }
  `;

const ImageContainer = styled.div`
  width: 100%;
  aspect-ratio: 1;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  ${(props) =>
    props.cover === 'true' &&
    css`
      animation: ${pulse} 1.5s ease-in-out infinite;
    `}
`;

const StatsContainer = styled.div`
  width: 100%;
  background: rgba(255, 255, 255, 0.08);
  border-radius: 10px;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
  color: #ccc;
  padding: 4px;

  div {
    font-size: 14px;
    display: flex;
    align-items: center;
    gap: 4px;
  }

  @media only screen and (max-width: 600px) {
    width: 100%;
    background: rgba(255, 255, 255, 0.08);
    border-radius: 10px;
    overflow: hidden;
  }
`;
