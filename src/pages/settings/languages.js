import React, { useEffect, useState } from 'react';
import {
  IoMdArrowDropdown,
  IoMdArrowDropleft,
  IoMdArrowDropright,
} from 'react-icons/io';
import { useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { Language } from '../../context/language';
import { useDispatch, useSelector } from 'react-redux';
import { setLanguage } from '../../redux/app';

export const Languages = ({ activePage, setActivePage }) => {
  // navigate
  const navigate = useNavigate();
  // location
  const location = useLocation();
  // define language
  const language = Language();
  // dispatch
  const dispatch = useDispatch();

  // transition
  const [transition, setTransition] = useState(true);

  useEffect(() => {
    setTransition(false);
  }, []);

  // language state
  const activeLanguage = useSelector((state) => state.storeApp.language);

  return (
    <div
      style={{
        background: 'rgba(1, 2, 12, 0.2)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        zIndex: 1001,
        width: '100vw',
        height: '100%',
        position: 'fixed',
        top: '0',
        left: '0',
      }}
    >
      <Container openpage={transition ? 'true' : 'false'}>
        <Header>
          <div
            onClick={() => {
              setTransition(true);
              setTimeout(() => {
                setActivePage({ active: false, page: null, data: null });
              }, 300);
            }}
            style={{
              padding: '5px',

              zIndex: 1000,
            }}
          >
            <IoMdArrowDropleft size={30} color="#f866b1" />
          </div>
          <div>
            <h3
              style={{
                color: '#ccc',
                margin: 0,
                padding: 0,
                letterSpacing: '0.5px',
              }}
            >
              Languages
            </h3>
          </div>
          <div style={{ width: '40px' }}></div>
        </Header>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '10px',
            margin: '20px 0 0 0',
          }}
        >
          <div
            style={{
              border:
                activeLanguage === 'en'
                  ? '1.5px solid #f866b1'
                  : '1.5px solid rgba(255,255,255,0.1)',
              color: activeLanguage === 'en' ? '#f866b1' : '#ccc',
              width: '60vw',
              padding: '5px 10px',
              borderRadius: '50px',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              letterSpacing: '0.5px',
              fontWeight: 500,
            }}
            onClick={() => {
              localStorage.setItem('Beautyverse:language', 'en');
              dispatch(setLanguage('en'));
            }}
          >
            {language?.language?.Auth?.auth?.english}
          </div>
          <div
            style={{
              border:
                activeLanguage === 'ka'
                  ? '1.5px solid #f866b1'
                  : '1.5px solid rgba(255,255,255,0.1)',
              color: activeLanguage === 'ka' ? '#f866b1' : '#ccc',
              width: '60vw',
              padding: '5px 10px',
              borderRadius: '50px',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              letterSpacing: '0.5px',
              fontWeight: 500,
            }}
            onClick={() => {
              localStorage.setItem('Beautyverse:language', 'ka');
              dispatch(setLanguage('ka'));
            }}
          >
            {language?.language?.Auth?.auth?.georgian}
          </div>
          <div
            style={{
              color: activeLanguage === 'ru' ? '#f866b1' : '#ccc',
              border:
                activeLanguage === 'ru'
                  ? '1.5px solid #f866b1'
                  : '1.5px solid rgba(255,255,255,0.1)',
              width: '60vw',
              padding: '5px 10px',
              borderRadius: '50px',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              letterSpacing: '0.5px',
              fontWeight: 500,
            }}
            onClick={() => {
              localStorage.setItem('Beautyverse:language', 'ru');
              dispatch(setLanguage('ru'));
            }}
          >
            {language?.language?.Auth?.auth?.russian}
          </div>
        </div>
      </Container>
    </div>
  );
};

const Container = styled.div`
  width: 100vw;
  height: 100%;
  padding: 0 0 50px 0;
  z-index: 1000;
  background: rgba(1, 2, 12, 0.9);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  transition: ease-in 200ms;
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow-y: scroll;
  overflow-x: hidden;
  position: fixed;
  left: ${(props) => (props.openpage === 'false' ? 0 : '100vw')};
`;

const Header = styled.div`
  width: 100%;
  padding: 12.5px 8px;
  box-sizing: border-box;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;
