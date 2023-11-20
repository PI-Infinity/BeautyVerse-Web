import React, { useRef, useState } from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import styled from 'styled-components';
import Button from '@mui/material/Button';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { Alert } from '@mui/material';
import { BounceLoader } from 'react-spinners';
import { TextEditor } from '../../feeds/addFeed/textEditor';
import { Language } from '../../../context/language';
import { Input } from '../../../pages/settings/input';

export const Form = () => {
  const language = Language();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');

  const backendUrl = useSelector((state) => state.storeApp.backendUrl);

  // defines loading backdrop
  const [loading, setLoading] = useState(false);
  // alert message
  const [alert, setAlert] = useState({ active: false, text: '', type: '' });

  const onSubmit = async () => {
    try {
      if (name?.length < 1) {
        return setAlert({
          active: true,
          text: 'Please write a name...',
          type: 'error',
        });
      }
      if (email?.length < 3 || !email?.includes('@')) {
        return setAlert({
          active: true,
          text: 'Please write email address...',
          type: 'error',
        });
      }
      if (phone?.length < 3) {
        return setAlert({
          active: true,
          text: 'Please write phone number...',
          type: 'error',
        });
      }
      if (message?.length < 10) {
        return setAlert({
          active: true,
          text: 'To send the message, the text must be more than 10 symbols...',
          type: 'error',
        });
      }
      setLoading(true);
      await axios.post(backendUrl + '/support/sendEmail', {
        message:
          message +
          ' / Name: ' +
          name +
          ' / User Email: ' +
          email +
          ' / Phone: ' +
          phone,
        email: email,
      });
      setEmail('');
      setMessage('');
      setName('');
      setPhone('');
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
    <Container>
      <h1 style={{ color: '#f866b1', letterSpacing: '0.5px' }}>
        {language?.language?.Auth?.auth?.form}
      </h1>
      <p
        style={{
          color: '#ccc',
          textAlign: 'center',
          padding: '15px',
          letterSpacing: '0.5px',
        }}
      >
        {language?.language?.Auth?.auth?.formText}
      </p>
      <div
        style={{
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '10px',
        }}
      >
        <Input
          value={name}
          onChange={setName}
          label={language?.language?.Auth?.auth?.name}
          width="90%"
        />
        <Input
          value={email}
          onChange={setEmail}
          label={language?.language?.Auth?.auth?.email}
          width="90%"
        />
        <Input
          value={phone}
          type="number"
          onChange={setPhone}
          label={language?.language?.Auth?.auth?.phone}
          width="90%"
        />
      </div>
      <TextEditor text={message} setText={setMessage} language={language} />
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
          language?.language?.Auth?.auth?.send
        )}
      </Button>
      {alert?.active && (
        <div style={{ boxSizing: 'border-box', padding: '10vw' }}>
          (
          <Alert
            onClick={() => setAlert({ type: '', text: '', active: false })}
            severity={alert?.type}
          >
            {alert?.text}
          </Alert>
          )
        </div>
      )}
    </Container>
  );
};

const Container = styled.div`
  width: 100vw;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  z-index: 0;
  padding: 7vh 25vw;

  @media only screen and (max-width: 600px) {
    padding: 0;
    padding 7vh 0;
  }

  h1 {
    color: #f866b1;
    letter-spacing: 0.5px;
    padding: 0;


    @media only screen and (max-width: 600px) {
      line-height: 7.5vw;
      font-size: 4.5vw;
    }
  }
`;
