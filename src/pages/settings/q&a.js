import React, { useEffect, useState } from 'react';
import {
  IoMdArrowDropdown,
  IoMdArrowDropleft,
  IoMdArrowDropright,
} from 'react-icons/io';
import { useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { terms, privacy, qa, usage } from '../../datas/pageTexts';

export const QA = ({ activePage, setActivePage }) => {
  // navigate
  const navigate = useNavigate();
  // location
  const location = useLocation();

  // transition
  const [transition, setTransition] = useState(true);

  useEffect(() => {
    setTransition(false);
  }, []);

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
              Questions & Answers
            </h3>
          </div>
          <div style={{ width: '40px' }}></div>
        </Header>
        <div
          style={{
            padding: '0px 15px',
            boxSizing: 'border-box',
          }}
        >
          <p
            style={{
              color: '#ccc',
              fontSize: '16px',
              letterSpacing: '0.5px',
              textAlign: 'center',
              lineHeight: '22px',
            }}
          >
            {qa}
          </p>
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
