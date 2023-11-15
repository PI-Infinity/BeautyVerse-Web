import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Styled from 'styled-components';
import { setTargetUser } from '../../../redux/user';
import { useDispatch, useSelector } from 'react-redux';
import GetTimesAgo from '../../../functions/getTimesAgo';
import { Language } from '../../../context/language';
import { GiStarShuriken, GiEarthAmerica } from 'react-icons/gi';
import { AnimationSkelton } from '../../../components/animationSkelton';
import { VscVerifiedFilled } from 'react-icons/vsc';
import { setBackPath } from '../../../redux/app';
import { BounceLoader } from 'react-spinners';
import { PiDotsThreeOutlineBold } from 'react-icons/pi';
import { MdClose } from 'react-icons/md';

export const TopSection = ({ item, openOption, setOpenOption }) => {
  // dnavigation
  const navigate = useNavigate();
  // redux dispatch
  const dispatch = useDispatch();
  // location
  const location = useLocation();
  // language
  const language = Language();
  // currentUser
  const currentUser = useSelector((state) => state.storeUser.currentUser);

  const currentPostTime = GetTimesAgo(new Date(item?.createdAt).getTime());

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

  // image loading
  const [loading, setLoading] = useState(true);

  // capitalize first letters function
  function capitalizeFirstLetter(string) {
    return string?.charAt(0).toUpperCase() + string?.slice(1);
  }

  // capitalize and define user's type
  const t = capitalizeFirstLetter(item?.owner?.type);

  let type;
  if (item?.owner?.type === 'specialist') {
    type = t;
  } else if (item?.owner?.type === 'shop') {
    type = t;
  } else {
    type = 'Beauty Salon';
  }

  return (
    <Container>
      <ImageContainer
        onClick={() => {
          if (
            location.pathname?.includes('/user') ||
            location.pathname?.includes('/profile')
          ) {
            return undefined;
          } else {
            dispatch(setTargetUser(item?.owner));
            navigate(
              `/user/${item?.owner?._id}/${
                item?.owner?.type === 'shop' ? 'showroom' : 'feeds'
              }`
            );
            dispatch(
              setBackPath({
                path: [location.pathname],
                data: [],
                activeLevel: 0,
              })
            );
          }
        }}
      >
        {loading && (
          // <BounceLoader
          //   // style={{ position: 'absolute', zIndex: 2 }}
          //   size={40}
          //   color="#f866b1"
          //   loading={true}
          // />
          <div
            style={{
              opacity: '1',
              width: '100%',
              height: '100%',
              background: 'rgba(255,255,255,0.2)',
              borderRadius: '50px',
            }}
          >
            {/* <BounceLoader size="25vw" loading={loading} color="#f866b1" /> */}
          </div>
        )}

        <Image
          src={item?.owner?.cover}
          onLoad={() => {
            setLoading(false);
          }}
        />
      </ImageContainer>

      <div style={{ width: '80%' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '15px',
            width: '100%',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <h3
              onClick={() => {
                if (
                  location.pathname?.includes('/user') ||
                  location.pathname?.includes('/profile')
                ) {
                  return undefined;
                } else {
                  dispatch(setTargetUser(item?.owner));
                  navigate(
                    `/user/${item?.owner?._id}/${
                      item?.owner?.type === 'shop' ? 'showroom' : 'feeds'
                    }`
                  );
                  dispatch(
                    setBackPath({
                      path: [location.pathname],
                      data: [],
                      activeLevel: 0,
                    })
                  );
                }
              }}
              style={{
                color: '#ccc',
                letterSpacing: '0.5px',
                padding: 0,
                margin: 0,
                fontSize: '16px',
              }}
            >
              {item?.owner?.name}
            </h3>
            {item?.owner?.subscription?.status === 'active' && (
              <VscVerifiedFilled color="#f866b1" size={14} />
            )}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <GiStarShuriken size={10} color="#ccc" />
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <GiEarthAmerica size={12} color="#ccc" />
              <span
                style={{
                  color: '#ccc',
                  letterSpacing: '0.5px',
                  fontSize: '12px',
                }}
              >
                {definedTime}.
              </span>
            </div>
            <GiStarShuriken size={10} color="#ccc" />
          </div>
          {item?.owner?._id === currentUser?._id &&
            location.pathname?.includes('/profile') &&
            !location.pathname?.includes('/profile/notifications') && (
              <div
                onClick={
                  !openOption?.active
                    ? () => setOpenOption({ active: true, data: item })
                    : () => setOpenOption(null)
                }
                style={{
                  margin: '0 0 0 auto',
                  padding: '0 2px 0 8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {openOption?.active ? (
                  <MdClose color="#f866b1" size={20} />
                ) : (
                  <PiDotsThreeOutlineBold color="#ccc" size={20} />
                )}
              </div>
            )}
        </div>
        <span
          style={{ color: '#ccc', letterSpacing: '0.5px', fontSize: '14px' }}
        >
          {item?.owner?.username ? item.owner?.username : type}
        </span>
      </div>
    </Container>
  );
};

const Container = Styled.div`
  height: 70px;
  width: 100%;
  display: flex;
  align-items: center;
  gap: 15px;
  box-sizing: border-box;
  padding: 0 10px;
`;

const ImageContainer = Styled.div`
  width: 45px;
  height: 45px;
  border-radius: 50px;
  border: 1.5px solid #f866b1;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Image = Styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50px;
  object-fit: cover;
  opacity: 1;
  position: absolute;
  z-index: 0;
`;
