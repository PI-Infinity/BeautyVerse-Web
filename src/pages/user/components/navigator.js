import React, { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { Location, useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { Language } from '../../../context/language';

export const Navigator = ({ user }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const scrollRef = useRef();

  const back = useSelector((state) => state.storeApp.backPath);

  useEffect(() => {
    if (scrollRef.current) {
      if (back && !back.back) {
        scrollRef.current.scrollLeft = 0;
      } else {
        scrollRef.current.scrollLeft =
          scrollRef.current.scrollWidth - scrollRef.current.clientWidth;
      }
    }
  }, [back]);

  // language
  const language = Language();

  const NavigatorItems = [
    {
      title: language?.language?.User?.userPage.showroom,
      icon: '',
      path: 'showroom',
    },
    {
      title: language?.language?.User?.userPage.feeds,
      icon: '',
      path: 'feeds',
    },
    {
      title: language?.language?.User?.userPage.contact,
      icon: '',
      path: 'contact',
    },
    {
      title: language?.language?.User?.userPage.procedures,
      icon: '',
      path: 'procedures',
    },
    {
      title: language?.language?.User?.userPage.workingInfo,
      icon: '',
      path: 'workinginfo',
    },
    {
      title: language?.language?.User?.userPage.audience,
      icon: '',
      path: 'audience',
    },
  ];

  const activeValue =
    location.pathname.split('/')?.length === 3
      ? location.pathname.split('/')[2]
      : location.pathname.split('/')[3];
  const active = NavigatorItems?.find((i) => i.path === activeValue)?.title;

  return (
    <Container ref={scrollRef}>
      {NavigatorItems?.map((item, index) => {
        if (item.path === 'showroom' && user?.type !== 'shop') {
          return;
        }
        if (item.path === 'procedures' && user?.type === 'shop') {
          return;
        }

        if (
          (item.path === 'feeds' ||
            item.path === 'procedures' ||
            item.path === 'products' ||
            item.path === 'statistics' ||
            item.path === 'workinginfo') &&
          user?.type === 'user'
        ) {
          return;
        }
        return (
          <Item
            active={activeValue}
            path={item.path}
            key={index}
            onClick={
              active === item.title ? undefined : () => navigate(item.path)
            }
          >
            {item.title}
          </Item>
        );
      })}
    </Container>
  );
};

const Container = styled.div`
  height: 40px;
  // width: 100%;
  overflow-x: scroll;
  display: flex;
  align-items: center;
  gap: 10px;
  margin: 3vw 0 1vw 0;
  padding-left: 10px;
  padding-right: 20px;

  &::-webkit-scrollbar {
    display: none !important;
  }
`;

const Item = styled.div`
  color: #ccc;
  letter-spacing: 0.5px;
  font-size: 16px;
  font-weight: 500;
  border: 1.5px solid
    ${(props) =>
      props.active === props.path ? '#f866b1' : 'rgba(255,255,255,0.05)'};
  border-radius: 50px;
  padding: 4px 16px;
  white-space: nowrap;
  // min-width: 120px;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background: rgba(255, 255, 255, 0.05);

  &:hover {
    opacity: 0.8;
  }
`;
