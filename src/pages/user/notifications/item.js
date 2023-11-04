import axios from 'axios';
import React, { useEffect, useState } from 'react';
import {
  FaCheck,
  FaComment,
  FaImage,
  FaShoppingBag,
  FaStar,
  FaUserCircle,
} from 'react-icons/fa';
import { MdSaveAlt } from 'react-icons/md';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { setCurrentUser, setTargetUser } from '../../../redux/user';
import { BiDotsVerticalRounded } from 'react-icons/bi';
import {
  setRerenderNotifications,
  setUnreadNotidications,
} from '../../../redux/notifications';
import { BounceLoader } from 'react-spinners';
import { setOpenedFeed } from '../../../redux/feed';
import { setNotifications } from '../../../redux/notifications';
import { setOpenedProduct } from '../../../redux/showroom';
import { setBackPath } from '../../../redux/app';
import logo from '../../../assets/logo.png';

export const NotificationItem = ({ item, currentUser, setOpenConfig }) => {
  // navigator
  const navigate = useNavigate();
  // redux dispatch
  const dispatch = useDispatch();
  // locaiton
  const location = useLocation();
  // loading
  const [loading, setLoading] = useState(true);
  // backend url
  const backendUrl = useSelector((state) => state.storeApp.backendUrl);

  // define text
  const lang = useSelector((state) => state.storeApp.language);
  let text;
  if (item?.type === 'star') {
    if (lang === 'en') {
      text = 'Added star on your feed';
    } else if (lang === 'ru') {
      text = 'Добавлена звезда к вашей ленте';
    } else if (lang === 'ka') {
      text = 'მიანიჭა ვარსკვლავი თქვენ პოსტს';
    }
  } else if (item?.type === 'save') {
    if (lang === 'en') {
      text = 'Saved your feed';
    } else if (lang === 'ru') {
      text = 'Ваша лента сохранена';
    } else if (lang === 'ka') {
      text = 'შეინახა თქვენი პოსტი';
    }
  } else if (item?.type === 'share') {
    if (lang === 'en') {
      text = 'Shared your feed';
    } else if (lang === 'ru') {
      text = 'Ваша лента поделилась';
    } else if (lang === 'ka') {
      text = 'გააზიარა თქვენი პოსტი';
    }
  } else if (item?.type === 'review') {
    if (lang === 'en') {
      text = 'Reviewed your feed';
    } else if (lang === 'ru') {
      text = 'Ваша лента была просмотрена';
    } else if (lang === 'ka') {
      text = 'შეაფასა თქვენი პოსტი';
    }
  } else if (item?.type === 'follow') {
    if (lang === 'en') {
      text = 'Started following you';
    } else if (lang === 'ru') {
      text = 'Начал следовать за вами';
    } else if (lang === 'ka') {
      text = 'გამოიწერა თქვენი გვერდი';
    }
  } else if (item?.type === 'saveProduct') {
    if (lang === 'en') {
      text = 'Saved your product';
    } else if (lang === 'ru') {
      text = 'Сохранил ваш продукт';
    } else if (lang === 'ka') {
      text = 'შეინახა თქვენი პროდუქტი';
    }
  }

  // notifications
  const list = useSelector((state) => state.storeNotifications.notifications);
  const unreadList = useSelector(
    (state) => state.storeNotifications.unreadNotifications
  );

  const ReadNotification = async (id) => {
    try {
      // Update notifications in the Redux store
      dispatch(
        setNotifications(
          list.map((item) =>
            item?._id === id ? { ...item, status: 'read' } : item
          )
        )
      );

      // Update unread notifications in the Redux store
      dispatch(
        setUnreadNotidications(unreadList.filter((item) => item._id !== id))
      );

      // Update the current user's notifications
      const newnotifs = list
        .filter((i) => i)
        .map((notification) => {
          if (notification) {
            if (notification?._id === id) {
              return { ...notification, status: 'read' };
            } else {
              return notification;
            }
          } else {
            return;
          }
        });
      const updatedUser = {
        ...currentUser,
        notifications: newnotifs,
      };

      // Save the updated user to local storage
      localStorage.setItem(
        'Beautyverse:currentUser',
        JSON.stringify(updatedUser)
      );

      // Update the current user in the Redux store
      dispatch(setCurrentUser(updatedUser));

      // Send a request to the backend to update the notification's status
      const resp = await axios.patch(
        `${backendUrl}/api/v1/users/${currentUser?._id}/notifications/${id}`,
        { status: 'read' }
      );
      console.log(resp);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 300);
  }, []);

  return (
    <Container
      onClick={() =>
        item?.status === 'read' ? undefined : ReadNotification(item?._id)
      }
      style={{
        background:
          item?.status === 'unread' ? '#f866b1' : 'rgba(255, 255, 255, 0.1)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <Img
          onClick={
            !item.sender
              ? undefined
              : () => {
                  dispatch(setTargetUser(item.sender));
                  navigate(
                    '/user/' +
                      item.sender?._id +
                      `${
                        item.sender?.type === 'shop'
                          ? '/showroom'
                          : item.sender?.type === 'user'
                          ? '/contact'
                          : '/feeds'
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
          }
        >
          {loading ? (
            <div>
              <BounceLoader color={'#f866b1'} loading={loading} size={30} />
            </div>
          ) : (
            <>
              {item.senderId === 'Beautyverse' ? (
                <img
                  src={logo}
                  style={{
                    width: '60px',
                    height: '60px',
                    borderRadius: '50px',
                    objectFit: 'cover',
                  }}
                />
              ) : (
                <>
                  {item?.sender?.cover?.length > 0 ? (
                    <img
                      src={item?.sender.cover}
                      style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '50px',
                        objectFit: 'cover',
                      }}
                    />
                  ) : (
                    <FaUserCircle size="40px" />
                  )}
                </>
              )}
            </>
          )}
        </Img>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            fontSize: '14px',
            gap: '2px',
          }}
        >
          {loading ? (
            <div
              style={{
                height: '10px',
                width: '70%',
                background: '#f866b1',
                borderRadius: '10px',
                opacity: 0.5,
              }}
            ></div>
          ) : (
            <span
              style={{
                color: '#ccc',
                fontWeight: 'bold',
                letterSpacing: '0.5px',
              }}
            >
              <>
                {item.senderId !== 'Beautyverse' ? (
                  <>{item?.sender.name ? item?.sender.name : 'Removed User'}</>
                ) : (
                  'BeautyVerse'
                )}
              </>
            </span>
          )}
          {loading ? (
            <div
              style={{
                height: '8px',
                width: '150px',
                background: '#f866b1',
                borderRadius: '10px',
                opacity: 0.5,
                margin: '2px 0 0 0',
              }}
            ></div>
          ) : (
            <span style={{ color: '#ccc', fontSize: '12px' }}>
              {text?.length > 0 ? text : 'Welcome to Beauty universe!'}
            </span>
          )}
        </div>
      </div>
      <div
        style={{
          marginRight: '8px',
          display: 'flex',
          alignItems: 'center',
          gap: '15px',
        }}
      >
        {(item?.type === 'star' ||
          item?.type === 'review' ||
          item?.type === 'save' ||
          item?.type === 'share') && (
          <FaImage
            onClick={() => {
              navigate(`feed/${item?.feed?._id}?review`);
              dispatch(setOpenedFeed(item?.feed));
            }}
            size={16}
            color={item?.status === 'unread' ? '#f1f1f1' : '#888'}
          />
        )}
        {item?.type === 'saveProduct' && (
          <FaShoppingBag
            onClick={() => {
              navigate(`product/${item?.product?._id}`);
              dispatch(setOpenedProduct(item?.product));
            }}
            size={16}
            color={item?.status === 'unread' ? '#f1f1f1' : '#888'}
          />
        )}

        <BiDotsVerticalRounded
          color="#888"
          size={18}
          onClick={() => setOpenConfig({ active: true, id: item._id })}
        />
      </div>
    </Container>
  );
};

const Container = styled.div`
  border-radius: 50px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  padding: 4px;
  box-sizing: border-box;
  width: 100%;
`;

const Img = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50px;
  background: rgba(255, 255, 255, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;

  & > :hover {
    opacity: 0.8;
  }
`;
