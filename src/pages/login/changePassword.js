import React, { useState } from 'react';
import styled from 'styled-components';
import MuiButton from '@mui/material/Button';
import { AiOutlineEyeInvisible, AiOutlineEye } from 'react-icons/ai';
import { useNavigate } from 'react-router-dom';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import TextField from '@mui/material/TextField';
import DialogTitle from '@mui/material/DialogTitle';
import axios from 'axios';
import { Language } from '../../context/language';
import Error from '../../snackBars/success';

export default function ChangePassword() {
  const navigate = useNavigate();
  const language = Language();
  const [alert, setAlert] = useState(false);
  const [showPassword, setShowPassword] = React.useState('');
  const [newPassword, setNewPassword] = React.useState('');
  const [confirmPassword, setConfirmPassword] = React.useState('');

  const path = window.location.pathname.split('/');
  const token = path[path?.length - 1];

  // change password

  async function Changing() {
    try {
      const response = await axios.patch(
        `https://beautyverse.herokuapp.com/api/v1/resetPassword/${token}`,
        {
          password: newPassword,
          confirmPassword: confirmPassword,
        }
      );
      setAlert({
        active: true,
        title: 'Password changed succesfully!',
        type: 'success',
      });
      setTimeout(() => {
        navigate('/login');
      }, 1000);
    } catch (error) {
      // If there's an error, display an alert
      setAlert({
        active: true,
        title: error.response.data.message,
        type: 'error',
      });
    }
  }

  return (
    <Container>
      {alert?.active && (
        <Error
          open={alert?.active}
          setOpen={setAlert}
          type={alert?.type}
          title={alert?.title}
        />
      )}
      <Title>{language?.language.User.userPage.newPassword}</Title>
      <InputWrapper>
        <Input
          placeholder={language?.language.User.userPage.newPassword}
          value={newPassword}
          type={showPassword === 'new' ? 'text' : 'password'}
          onChange={(e) => setNewPassword(e.target.value)}
        />
        {showPassword === 'new' ? (
          <AiOutlineEye
            className="eye"
            size={20}
            style={{ cursor: 'pointer' }}
            onClick={() => setShowPassword('')}
          />
        ) : (
          <AiOutlineEyeInvisible
            className="eye"
            size={20}
            style={{ cursor: 'pointer' }}
            onClick={() => setShowPassword('new')}
          />
        )}
      </InputWrapper>
      <InputWrapper>
        <Input
          placeholder={language?.language.User.userPage.confirmPassword}
          value={confirmPassword}
          type={showPassword === 'confirm' ? 'text' : 'password'}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
        {showPassword === 'confirm' ? (
          <AiOutlineEye
            className="eye"
            size={20}
            style={{ cursor: 'pointer' }}
            onClick={() => setShowPassword('')}
          />
        ) : (
          <AiOutlineEyeInvisible
            className="eye"
            size={20}
            style={{ cursor: 'pointer' }}
            onClick={() => setShowPassword('confirm')}
          />
        )}
      </InputWrapper>
      <DialogActions>
        <Button
          onClick={() => {
            setNewPassword('');
            setConfirmPassword('');
            navigate('/login');
          }}
        >
          {language?.language.User.userPage.cancel}
        </Button>
        <Button onClick={Changing}>
          {language?.language.User.userPage.change}
        </Button>
      </DialogActions>
    </Container>
  );
}

const Container = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  height: 100vh;
  align-items: center;
  gap: 10px;
`;

const Title = styled.h3`
  color: ${(props) => props.theme.font};
`;

const InputWrapper = styled.div`
  width: 25vw;
  height: 2.5vw;
  border-radius: 0.5vw;
  box-shadow: 0 0.1vw 0.3vw ${(props) => props.theme.shadowColor};
  border: none;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 0.5vw;
  transition: ease-in 200ms;
  box-sizing: border-box;
  background: ${(props) => props.theme.categoryItem};
  color: ${(props) => props.theme.font};

  @media only screen and (max-width: 600px) {
    box-shadow: 0 0.2vw 0.6vw ${(props) => props.theme.shadowColor};
    width: 75vw;
    height: 10vw;
    border-radius: 1.5vw;
    padding-left: 2vw;
    font-size: 16px;
  }
`;

const Input = styled.input`
  width: 100%;
  height: 100%;
  border-radius: 0.5vw;
  border: none;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.5vw;
  padding-left: 0.5vw;
  transition: ease-in 200ms;
  box-sizing: border-box;
  background: ${(props) => props.theme.categoryItem};
  color: ${(props) => props.theme.font};
  font-size: 16px;

  @media only screen and (max-width: 600px) {
    border-radius: 1.5vw;
    padding-left: 2vw;
    font-size: 16px;
  }

  :focus {
    outline: none;
  }

  ::placeholder {
    font-size: 14px;
    color: #ccc;
  }
`;

const Button = styled.button`
  width: 15vw;
  height: 2.5vw;
  border-radius: 0.5vw;
  box-shadow: 0 0.1vw 0.3vw rgba(2, 2, 2, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: ease-in 200ms;
  color: ${(props) => (props.back ? '#ccc' : 'green')};
  font-weight: bold;
  background: rgba(255, 255, 255, 0.7);
  border: none;
  font-size: 14px;

  @media only screen and (max-width: 600px) {
    width: 35vw;
    height: 8vw;
    border-radius: 1.5vw;
    box-shadow: 0 0.3vw 0.6vw rgba(2, 2, 2, 0.2);
  }

  :hover {
    box-shadow: 0 0.1vw 0.3vw rgba(2, 2, 2, 0.2);
  }
`;
