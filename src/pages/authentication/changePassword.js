import { IconButton, InputAdornment, TextField } from '@mui/material';
import axios from 'axios';
import React, { useState } from 'react';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { Language } from '../../context/language';
import Alert from '@mui/material/Alert';
import SimpleBackdrop from '../../components/backDrop';
import { MdVisibility, MdVisibilityOff } from 'react-icons/md';
import { useSelector } from 'react-redux';

export default function ChangePassword() {
  const navigate = useNavigate();
  const language = Language();
  const [newPassword, setNewPassword] = React.useState('');
  const [confirmPassword, setConfirmPassword] = React.useState('');

  // Add these variables to your component to track the state
  const [showPassword, setShowPassword] = useState(false);
  const handleClickShowPassword = () => setShowPassword(!showPassword);
  const handleMouseDownPassword = () => setShowPassword(!showPassword);

  const path = window.location.pathname.split('/');
  const token = path[path?.length - 1];

  // alert message
  const [alert, setAlert] = useState({ status: false, text: '', type: '' });

  const [loading, setLoading] = useState(false);

  const backendUrl = useSelector((state) => state.storeApp.backendUrl);

  // change password

  async function Changing() {
    try {
      if (newPassword?.length < 1 || confirmPassword?.length < 1) {
        return setAlert({
          status: true,
          type: 'error',
          text: 'Please input fields!',
        });
      }
      if (
        (newPassword?.length > 0 && newPassword?.length < 8) ||
        (confirmPassword?.length > 0 && confirmPassword?.length < 8)
      ) {
        return setAlert({
          status: true,
          type: 'error',
          text: 'Passwords must includes min 8 symbols!',
        });
      }
      if (newPassword !== confirmPassword) {
        return setAlert({
          status: true,
          type: 'error',
          text: 'Passwords do not match!!',
        });
      }
      setLoading(true);
      const response = await axios.patch(
        `${backendUrl}/api/v1/resetPassword/${token}`,
        {
          password: newPassword,
          confirmPassword: confirmPassword,
        }
      );
      if (response) {
        setTimeout(() => {
          setAlert({
            status: true,
            text: 'Password changed succesfully!',
            type: 'success',
          });
          setLoading(false);
        }, 1000);
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      }
    } catch (error) {
      // If there's an error, display an alert
      setAlert({
        status: true,
        text: error.response.data.message,
        type: 'error',
      });
      setLoading(false);
    }
  }

  return (
    <Container>
      <SimpleBackdrop open={loading} setOpen={setLoading} />
      <Title>{language?.language.User.userPage.newPassword}</Title>
      <InputWrapper>
        <TextField
          label={language?.language.User.userPage.newPassword}
          value={newPassword}
          type={showPassword ? 'text' : 'password'}
          onChange={(e) => setNewPassword(e.target.value)}
          id="outlined-basic"
          variant="outlined"
          InputProps={{
            // <-- This is where the toggle button is added.
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={handleClickShowPassword}
                  onMouseDown={handleMouseDownPassword}
                >
                  {showPassword ? (
                    <MdVisibility color="#ccc" size={22} />
                  ) : (
                    <MdVisibilityOff color="#ccc" size={22} />
                  )}
                </IconButton>
              </InputAdornment>
            ),
          }}
          sx={{
            width: '75%',
            '& .MuiOutlinedInput-root': {
              height: '53px',
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: 'rgba(255,255,255,0.1)',
                borderRadius: '15px',
              },
              '&:hover .MuiOutlinedInput-notchedOutline': {
                borderColor: '#f866b1',
              },
              '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                borderColor: '#f866b1',
              },
            },
            '& .MuiOutlinedInput-input': {
              borderRadius: '15px',
              color: '#ccc',
            },
            '& label': {
              color: '#888',
              fontSize: '14px',
            },
            '& label.Mui-focused': {
              color: '#ccc',
              fontSize: '14px',
            },
          }}
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
        <TextField
          label={language?.language.User.userPage.confirmPassword}
          value={confirmPassword}
          type={showPassword ? 'text' : 'password'}
          onChange={(e) => setConfirmPassword(e.target.value)}
          id="outlined-basic"
          variant="outlined"
          InputProps={{
            // <-- This is where the toggle button is added.
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={handleClickShowPassword}
                  onMouseDown={handleMouseDownPassword}
                >
                  {showPassword ? (
                    <MdVisibility color="#ccc" size={22} />
                  ) : (
                    <MdVisibilityOff color="#ccc" size={22} />
                  )}
                </IconButton>
              </InputAdornment>
            ),
          }}
          sx={{
            width: '75%',
            '& .MuiOutlinedInput-root': {
              height: '53px',
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: 'rgba(255,255,255,0.1)',
                borderRadius: '15px',
              },
              '&:hover .MuiOutlinedInput-notchedOutline': {
                borderColor: '#f866b1',
              },
              '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                borderColor: '#f866b1',
              },
            },
            '& .MuiOutlinedInput-input': {
              borderRadius: '15px',
              color: '#ccc',
            },
            '& label': {
              color: '#888',
              fontSize: '14px',
            },
            '& label.Mui-focused': {
              color: '#ccc',
              fontSize: '14px',
            },
          }}
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
      <div
        style={{
          width: '75%',
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'center',
          boxSizing: 'border-box',
          gap: '2.5%',
        }}
      >
        <Button
          variant="contained"
          style={{
            backgroundColor: '#888',
            color: 'white',
            borderRadius: '100px',
            width: '45%',
          }}
          onClick={() => {
            setNewPassword('');
            setConfirmPassword('');
            navigate('/login');
          }}
          //   {...props}
        >
          {language?.language.User.userPage.cancel}
        </Button>
        <Button
          variant="contained"
          style={{
            backgroundColor: '#f866b1',
            color: 'white',
            borderRadius: '100px',
            width: '45%',
          }}
          onClick={Changing}
          //   {...props}
        >
          {language?.language.User.userPage.change}
        </Button>
      </div>
      {alert?.status && (
        <Alert
          onClick={() => setAlert({ type: '', text: '', status: false })}
          severity={alert?.type}
          style={{ margin: '15px 0 0 0' }}
        >
          {alert?.text}
        </Alert>
      )}
    </Container>
  );
}

const Container = styled.div`
  height: 75vh;
  width: 100vw;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 20vh;
  gap: 10px;
`;

const Title = styled.h3`
  color: #ccc;
  letter-spacing: 0.5px;
`;

const InputWrapper = styled.div`
  box-shadow: 0 0.2vw 0.6vw ${(props) => props.theme.shadowColor};
  border-radius: 1.5vw;
  padding-left: 2vw;
  font-size: 16px;
  width: 100%;
  display: flex;
  justify-content: center;
`;

const Button = styled.button`
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
  box-sizing: border-box;

  @media only screen and (max-width: 600px) {
    height: 8vw;
    border-radius: 1.5vw;
    box-shadow: 0 0.3vw 0.6vw rgba(2, 2, 2, 0.2);
  }

  :hover {
    box-shadow: 0 0.1vw 0.3vw rgba(2, 2, 2, 0.2);
  }
`;
