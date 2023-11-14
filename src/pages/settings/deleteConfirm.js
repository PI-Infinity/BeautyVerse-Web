import { Button } from '@mui/material';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';

export const Configs = ({ openConfig, setOpenConfig, Delete }) => {
  const [transition, setTransition] = useState(true);

  useEffect(() => {
    setTransition(false);
  }, []);

  // redux dispatch
  const dispatch = useDispatch();

  return (
    <div
      onClick={() => {
        setTransition(true);
        setTimeout(() => {
          setOpenConfig({ active: false });
        }, 300);
      }}
      style={{
        background: !openConfig.active
          ? 'rgba(1, 2, 12, 0.2)'
          : 'rgba(1, 2, 12, 0)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        zIndex: 10010,
        position: 'fixed',
        top: '0',
        left: '0',
        transition: 'ease-in-out 200ms',
        width: '100%',
        height: '100%',
      }}
    >
      <Container
        openConfig={transition ? 'true' : 'false'}
        onClick={(event) => event.stopPropagation()}
      >
        <h3 style={{ color: '#ccc', letterSpacing: '0.5px', margin: 0 }}>
          Delete
        </h3>
        <Buttons
          style={{
            display: 'flex',
            width: '100%',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '10px',
          }}
        >
          <Button
            onClick={() => {
              setTransition(true);
              setTimeout(() => {
                setOpenConfig({ active: false, id: null });
              }, 300);
            }}
            variant="contained"
            className="button"
            style={{ background: '#888' }}
            sx={{
              width: '40%',
              borderRadius: '50px',
              marginTop: '10px',
              height: '35px',
              fontWeight: 'bold',
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={() => {
              setTransition(true);
              setTimeout(() => {
                setOpenConfig({ active: false });
                Delete();
              }, 300);
            }}
            variant="contained"
            className="button"
            style={{ background: '#f866b1' }}
            sx={{
              width: '40%',
              borderRadius: '50px',
              marginTop: '10px',
              height: '35px',
              fontWeight: 'bold',
            }}
          >
            Delete
          </Button>
        </Buttons>
      </Container>
    </div>
  );
};

const Container = styled.div`
  width: 100vw;
  height: 20vh;
  background: rgba(255, 255, 255, 0.1);
  position: absolute;
  bottom: ${(props) => (props.openConfig === 'false' ? 0 : '-20vh')};
  border-radius: 30px 30px 0 0;
  z-index: 100011;
  transition: ease-in 200ms;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 15px;
  overflow-y: scroll;
  overflow-x: hidden;
`;

const Buttons = styled.div`
  .button {
    &:hover {
      filter: brightness(1.1);
    }
  }
`;
