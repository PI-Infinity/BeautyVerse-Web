import axios from 'axios';
import React, { useEffect, useState, useRef } from 'react';
import {
  IoMdArrowDropdown,
  IoMdArrowDropleft,
  IoMdArrowDropright,
} from 'react-icons/io';
import { useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { Language } from '../../context/language';
import { useSelector } from 'react-redux';
import { darkTheme, lightTheme } from '../../context/theme';
import { TextEditor } from '../feeds/addFeed/textEditor';
import { Button } from '@mui/material';
import { BounceLoader } from 'react-spinners';
import Alert from '@mui/material/Alert';

export const Support = ({ activePage, setActivePage }) => {
  // navigate
  const navigate = useNavigate();
  // location
  const location = useLocation();
  // define language
  const language = Language();
  // define theme
  const theme = useSelector((state) => state.storeApp.theme);
  const currentTheme = theme ? darkTheme : lightTheme;

  // transition
  const [transition, setTransition] = useState(true);

  useEffect(() => {
    setTransition(false);
  }, []);

  const [email, setEmail] = useState('');
  const [text, setText] = useState('');
  const currentUser = useSelector((state) => state.storeUser.currentUser);
  const backendUrl = useSelector((state) => state.storeApp.backendUrl);
  // defines loading backdrop
  const [loading, setLoading] = useState(false);
  // alert message
  const [alert, setAlert] = useState({ active: false, text: '', type: '' });

  const inputRef = useRef();
  const onSubmit = async () => {
    // inputRef.current.blur();

    try {
      if (!currentUser && (email?.length < 3 || !email?.includes('@'))) {
        return setAlert({
          active: true,
          text: 'Please write email address...',
          type: 'error',
        });
      }
      if (text?.length < 10) {
        return setAlert({
          active: true,
          text: 'To send the message, the text must be more than 10 symbols...',
          type: 'error',
        });
      }
      setLoading(true);
      let em = currentUser ? currentUser.email : email;
      await axios.post(backendUrl + '/support/sendEmail', {
        message: text + ' / Name: ' + currentUser.name + ' / User Email: ' + em,
        email: em,
      });
      setEmail('');
      setText('');
      setAlert({
        active: true,
        text: 'The message has sent succesfully!',
        type: 'success',
      });
      setLoading(false);
    } catch (error) {
      setAlert({
        active: true,
        text: error.response.data.message,
        type: 'error',
      });
      console.log(error.response);
      setLoading(false);
    }
  };

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
              Support
            </h3>
          </div>
          <div style={{ width: '40px' }}></div>
        </Header>
        <TextEditor text={text} setText={setText} />
        <Button
          variant="contained"
          style={{
            backgroundColor: loading ? '#ccc' : '#f866b1',
            color: 'white',
          }}
          className="button"
          sx={{
            width: '40%',
            borderRadius: '50px',
            marginTop: '30px',
            height: '40px',
          }}
          onClick={onSubmit}
          //   {...props}
        >
          {loading ? (
            <BounceLoader color={'#f866b1'} loading={loading} size={20} />
          ) : (
            'Send Message'
          )}
        </Button>
        <div style={{ boxSizing: 'border-box', padding: '10vw' }}>
          {alert?.active && (
            <Alert
              onClick={() => setAlert({ type: '', text: '', active: false })}
              severity={alert?.type}
            >
              {alert?.text}
            </Alert>
          )}
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
