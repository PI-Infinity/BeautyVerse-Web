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
import axios from 'axios';
import { setCurrentUser } from '../../redux/user';
import { darkTheme, lightTheme } from '../../context/theme';
import {
  Alert,
  Button,
  IconButton,
  InputAdornment,
  TextField,
} from '@mui/material';
import { BounceLoader } from 'react-spinners';
import { MdVisibility, MdVisibilityOff } from 'react-icons/md';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';
import { Configs } from '../../pages/settings/deleteConfirm';

export const Security = ({ activePage, setActivePage }) => {
  // navigate
  const navigate = useNavigate();
  // location
  const location = useLocation();

  // transition
  const [transition, setTransition] = useState(true);

  useEffect(() => {
    setTransition(false);
  }, []);

  // alert message
  const [alert, setAlert] = useState({ active: false, text: '', type: '' });

  // define language
  const language = Language();
  // define dispatch
  const dispatch = useDispatch();

  // delete loading
  const [loading, setLoading] = useState(false);

  // define passwords states
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Add these variables to your component to track the state
  const [showPassword, setShowPassword] = useState(false);
  const handleClickShowPassword = () => setShowPassword(!showPassword);
  const handleMouseDownPassword = () => setShowPassword(!showPassword);

  // define current user
  const currentUser = useSelector((state) => state.storeUser.currentUser);

  // define theme
  const theme = useSelector((state) => state.storeApp.theme);
  const currentTheme = theme ? darkTheme : lightTheme;

  // backend url
  const backendUrl = useSelector((state) => state.storeApp.backendUrl);

  /**
   * password change function
   *  */
  const Changing = async () => {
    try {
      if (
        oldPassword?.length < 8 ||
        newPassword?.length < 8 ||
        confirmPassword?.length < 8
      ) {
        return setAlert({
          active: true,
          text: 'Passwords must include minimum 8 symbols!',
          type: 'error',
        });
      }
      if (newPassword !== confirmPassword) {
        return setAlert({
          active: true,
          text: 'New password and confirm password must be same!',
          type: 'error',
        });
      }

      const resp = await axios.patch(
        backendUrl + '/api/v1/changePassword/' + currentUser._id,
        {
          oldPassword: oldPassword,
          newPassword: newPassword,
          confirmPassword: confirmPassword,
        }
      );
      console.log(JSON.stringify(resp));
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
      return setAlert({
        active: true,
        text: 'Password changed successfully!',
        type: 'success',
      });
    } catch (error) {
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
      return setAlert({
        active: true,
        text: JSON.stringify(error.response.data.message),
        type: 'error',
      });
    }
  };

  // open remove account confirm popup state
  const [openDelete, setOpenDelete] = useState(false);

  /**
   * Delete account function
   */

  const Delete = async () => {
    try {
      setLoading(true);
      await axios.delete(backendUrl + '/api/v1/users/' + currentUser?._id);
      localStorage.removeItem('Beautyverse:currentUser');
      dispatch(setCurrentUser(null));
      navigate('/login');
      setLoading(false);
    } catch (error) {
      setLoading(false);
      return setAlert({
        active: true,
        text: error.response.data.message,
        type: 'error',
      });
    }
  };

  // delete account confirm popup
  const [openConfig, setOpenConfig] = useState({ active: false });

  return (
    <>
      {openConfig.active && (
        <Configs
          currentUser={currentUser}
          openConfig={openConfig}
          setOpenConfig={setOpenConfig}
          Delete={Delete}
        />
      )}
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
                {language?.language?.User.userPage.security}
              </h3>
            </div>
            <div style={{ width: '40px' }}></div>
          </Header>
          <div
            style={{
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '10px',
              margin: '30px 0 0 0',
            }}
          >
            <InputWrapper>
              <TextField
                label={language?.language.User.userPage.oldPassword}
                value={oldPassword}
                type={showPassword ? 'text' : 'password'}
                onChange={(e) => setOldPassword(e.target.value)}
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
            {oldPassword?.length > 1 &&
              newPassword?.length > 1 &&
              confirmPassword?.length > 1 && (
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
                  onClick={Changing}
                  //   {...props}
                >
                  {loading ? (
                    <BounceLoader
                      color={'#f866b1'}
                      loading={loading}
                      size={20}
                    />
                  ) : (
                    'Save'
                  )}
                </Button>
              )}
          </div>
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
          <Button
            variant="contained"
            style={{
              backgroundColor: loading ? '#ccc' : 'red',
              color: 'white',
            }}
            className="button"
            sx={{
              width: '40%',
              borderRadius: '50px',

              height: '40px',
            }}
            onClick={() => setOpenConfig({ active: true })}
            //   {...props}
          >
            {loading ? (
              <BounceLoader color={'#f866b1'} loading={loading} size={20} />
            ) : (
              'Delete Account'
            )}
          </Button>
        </Container>
      </div>
    </>
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

const InputWrapper = styled.div`
  box-shadow: 0 0.2vw 0.6vw ${(props) => props.theme.shadowColor};
  border-radius: 1.5vw;
  padding-left: 2vw;
  font-size: 16px;
  width: 100%;
  display: flex;
  justify-content: center;
`;
