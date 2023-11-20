import Switch from '@mui/material/Switch';
import { styled } from '@mui/styles';
import React from 'react';
import { IoMdArrowDropright } from 'react-icons/io';
import mainStyled from 'styled-components';
import { Language } from '../../context/language';

export const MenuItems = ({
  activePage,
  setActivePage,
  currentUser,
  ControlActivity,
}) => {
  const PinkSwitch = styled(Switch)(({ theme }) => ({
    '& .MuiSwitch-switchBase.Mui-checked': {
      color: '#f866b1',
    },
    '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
      backgroundColor: '#f866b1',
    },
  }));

  const language = Language();

  const Items = [
    {
      value: 'personalInfo',
      label: language?.language?.User?.userPage?.personalInfo,
    },
    {
      value: 'addresses',
      label: language?.language?.User?.userPage?.addresses,
    },
    {
      value: 'procedures',
      label: language?.language?.User?.userPage?.procedures,
    },
    {
      value: 'products',
      label: language?.language?.User?.userPage?.products,
    },
    {
      value: 'workingInfo',
      label: language?.language?.User?.userPage?.workingInfo,
    },
    {
      value: 'savedItems',
      label: language?.language?.User?.userPage?.savedItems,
    },
    {
      value: 'support',
      label: language?.language?.User?.userPage?.support,
    },
    {
      value: 'security',
      label: language?.language?.User?.userPage?.security,
    },
    {
      value: 'languages',
      label: language?.language?.User?.userPage?.languages,
    },
    // {
    //   value: 'darkMode',
    //   label: 'Dark Mode',
    // },
    {
      value: 'activation',
      label: language?.language?.User?.userPage?.activation,
    },
    {
      value: 'terms&rules',
      label: language?.language?.Pages?.pages?.terms,
    },
    {
      value: 'q&a',
      label: language?.language?.Pages?.pages?.qa,
    },
    {
      value: 'pp',
      label: language?.language?.Pages?.pages?.privacy,
    },
    {
      value: 'hw',
      label: language?.language?.Pages?.pages?.usage,
    },
  ];

  return (
    <Container>
      {Items?.map((item, index) => {
        if (
          currentUser?.type === 'user' &&
          (item.value === 'procedures' ||
            item.value === 'products' ||
            item.value === 'workingInfo')
        ) {
          return;
        }
        if (
          (currentUser?.type === 'specialist' ||
            currentUser?.type === 'beautycenter') &&
          item.value === 'products'
        ) {
          return;
        }
        if (currentUser?.type === 'shop' && item.value === 'procedures') {
          return;
        }
        if (item.value !== 'activation' && item.value !== 'darkMode') {
          return (
            <Item
              onClick={() =>
                setActivePage({ active: true, page: item.value, data: null })
              }
              key={index}
            >
              {item.label}
              <IoMdArrowDropright color="#f866b1" />
            </Item>
          );
        } else if (currentUser?.type !== 'user') {
          return (
            <Item
              key={index}
              style={{
                borderRadius: 50,
                margin: item.value !== 'darkMode' ? '25px 0' : '0 0 25px 0',
              }}
            >
              {item.label}
              <PinkSwitch
                checked={
                  item.value === 'activation' ? currentUser?.active : false
                }
                onChange={() => ControlActivity(!currentUser?.active)}
                inputProps={{ 'aria-label': 'controlled' }}
              />
            </Item>
          );
        }
      })}
    </Container>
  );
};

const Container = mainStyled.div`
  width: 95%;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-sizing: border-box;
  margin: 2.5% 0 0 0;
  background: rgba(255, 255, 255, 0.05);
  padding: 10px;
  border-radius: 10px;
  gap: 5px;
`;

const Item = mainStyled.div`
  box-sizing: border-box;
  width: 100%;
  color: #ccc;
  padding: 10px 15px;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 10px;
  letter-spacing: 0.5px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  font-weight: 500;

`;
