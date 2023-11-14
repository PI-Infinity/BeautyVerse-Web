import Switch from '@mui/material/Switch';
import { styled } from '@mui/styles';
import React from 'react';
import { IoMdArrowDropright } from 'react-icons/io';
import mainStyled from 'styled-components';

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

const Items = [
  {
    value: 'personalInfo',
    label: 'Personal Info',
  },
  {
    value: 'addresses',
    label: 'Addresses',
  },
  {
    value: 'procedures',
    label: 'Procedures',
  },
  {
    value: 'products',
    label: 'Products',
  },
  {
    value: 'workingInfo',
    label: 'Working Info',
  },
  {
    value: 'savedItems',
    label: 'Saved Items',
  },
  {
    value: 'support',
    label: 'Support',
  },
  {
    value: 'security',
    label: 'Security',
  },
  {
    value: 'languages',
    label: 'Languages',
  },
  // {
  //   value: 'darkMode',
  //   label: 'Dark Mode',
  // },
  {
    value: 'activation',
    label: 'Activation',
  },
  {
    value: 'terms&rules',
    label: 'Terms & Rules',
  },
  {
    value: 'q&a',
    label: 'Questions & Answers',
  },
  {
    value: 'pp',
    label: 'Privacy Policy',
  },
  {
    value: 'hw',
    label: 'How does BeautyVerse work?',
  },
];
