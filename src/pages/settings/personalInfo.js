import React, { useEffect, useState } from 'react';
import {
  IoMdArrowDropdown,
  IoMdArrowDropleft,
  IoMdArrowDropright,
} from 'react-icons/io';
import { useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { Input } from './input';
import { Button, TextField } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import PhoneInput from 'react-phone-input-2';
import { setCurrentUser, setRerenderCurrentUser } from '../../redux/user';

export const PersonalInfo = ({ activePage, setActivePage, currentUser }) => {
  // navigate
  const navigate = useNavigate();
  // location
  const location = useLocation();
  // dispatch
  const dispatch = useDispatch();

  // with this state feeds open with scale and opacity
  useEffect(() => {
    // Disable body scroll when the component is open
    if (activePage) {
      document.body.style.overflowY = 'hidden';
    }

    return () => {
      // Re-enable body scroll when the component is closed
      document.body.style.overflowY = 'visible';
    };
  }, [activePage]);

  // transition
  const [transition, setTransition] = useState(true);

  useEffect(() => {
    setTransition(false);
  }, []);

  // capitalize first letters function
  function capitalizeFirstLetter(string) {
    return string?.charAt(0).toUpperCase() + string?.slice(1);
  }

  // capitalize and define user's type
  const Type = capitalizeFirstLetter(currentUser?.type);

  /**
   * edit state
   */
  const [edit, setEdit] = useState(false);

  // backend url
  const backendUrl = useSelector((state) => state.storeApp.backendUrl);

  const [editableUser, setEditableUser] = useState({ ...currentUser });
  const [callingCode, setCallingCode] = useState(currentUser.phone.callingCode);

  // phone input styled

  const containerStyle = {
    width: '100%',
    borderRadius: '4px',
  };

  const buttonStyle = {
    background: 'none',
    border: 'none',
    color: 'red',
  };

  const inputStyle = {
    background: 'none',
    color: '#f866b1',
    width: '100%',
    border: 'none',
  };
  const searchStyle = {
    width: '90%',
    fontSize: '16px',
    borderRadius: '50px',
  };

  const dropdownStyle = {
    width: '65vw',
    background: 'rgba(1, 2, 12, 1)',
    color: '#f866b1',
    fontWeight: 'bold',
    letterSpacing: '0.5px',
    border: '2px solid #f866b1',
    borderRadius: '20px',
  };

  // define function on save
  const handleSave = async () => {
    // if (editableUser?.phone.phone?.includes('+')) {
    //   setAlert({
    //     active: true,
    //     text: "Phone number doesn't need country code +" + callingCode,
    //     type: 'error',
    //   });
    // }
    const User = {
      ...currentUser,
      name: editableUser?.name,
      username: editableUser?.username,
      phone: {
        phone: editableUser.phone.phone,
        callingCode: callingCode,
        countryCode: editableUser.phone.countryCode,
      },
      about: editableUser?.about,
      media: {
        web: editableUser?.media?.web,
        facebook: editableUser?.media?.facebook,
        instagram: editableUser?.media?.instagram,
        youtube: editableUser?.media?.youtube,
        tiktok: editableUser?.media?.tiktok,
        whatsapp: editableUser?.media?.whatsapp,
        telegram: editableUser?.media?.telegram,
      },
    };

    dispatch(setCurrentUser(User));
    try {
      await axios.patch(backendUrl + '/api/v1/users/' + currentUser?._id, {
        name: editableUser?.name,
        username: editableUser?.username,
        phone: {
          phone: editableUser.phone.phone,
          callingCode: callingCode,
          countryCode: editableUser.phone.countryCode,
        },
        about: editableUser?.about,
        media: {
          web: editableUser?.media?.web,
          facebook: editableUser?.media?.facebook,
          instagram: editableUser?.media?.instagram,
          youtube: editableUser?.media?.youtube,
          tiktok: editableUser?.media?.tiktok,
          whatsapp: editableUser?.media?.whatsapp,
          telegram: editableUser?.media?.telegram,
        },
      });

      dispatch(setRerenderCurrentUser());
    } catch (error) {
      console.log(error.response.data.message);
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
              Personal Info
            </h3>
          </div>
          <div style={{ width: '40px' }}></div>
        </Header>
        <ContentList edit={edit ? 'true' : 'false'}>
          <ItemContainer edit={edit ? 'true' : 'false'}>
            <span className="title">User Type:</span>{' '}
            <span className="value" onClick={() => setEdit(!edit)}>
              {Type}
            </span>
          </ItemContainer>
          <ItemContainer edit={edit ? 'true' : 'false'}>
            <span className="title">Email:</span>{' '}
            <span className="value" onClick={() => setEdit(!edit)}>
              {currentUser?.email}
            </span>
          </ItemContainer>
          <ItemContainer edit={edit ? 'true' : 'false'}>
            <span className="title">Name:</span>{' '}
            {edit ? (
              <Input
                value={editableUser?.name}
                label={currentUser?.name}
                onChange={(text) =>
                  setEditableUser({
                    ...editableUser,
                    name: text,
                  })
                }
              />
            ) : (
              <span className="value" onClick={() => setEdit(!edit)}>
                {currentUser?.name}
              </span>
            )}
          </ItemContainer>
          <ItemContainer edit={edit ? 'true' : 'false'}>
            <span className="title">Username:</span>{' '}
            {edit ? (
              <Input
                value={editableUser?.username}
                label={
                  currentUser?.username
                    ? currentUser?.username
                    : 'type username...'
                }
                onChange={(text) =>
                  setEditableUser({
                    ...editableUser,
                    username: text,
                  })
                }
              />
            ) : (
              <span className="value" onClick={() => setEdit(!edit)}>
                {currentUser?.username}
              </span>
            )}
          </ItemContainer>

          <ItemContainer edit={edit ? 'true' : 'false'}>
            <span className="title">Phone:</span>{' '}
            {edit ? (
              <div
                style={{ display: 'flex', alignItems: 'center', gap: '10%' }}
              >
                <div style={{ width: '50%', margin: '0 0 0 15spx' }}>
                  <PhoneInput
                    enableSearch={true}
                    value={callingCode}
                    onChange={(phone) => setCallingCode(phone)}
                    containerStyle={containerStyle}
                    searchStyle={searchStyle}
                    inputStyle={inputStyle}
                    dropdownStyle={dropdownStyle}
                    buttonStyle={buttonStyle}
                    country={'ge'}
                  />
                </div>
                <TextField
                  id="outlined-basic"
                  label={
                    currentUser?.phone.phone
                      ? currentUser?.phone.phone
                      : 'add phone number...'
                  }
                  variant="outlined"
                  value={editableUser?.phone.phone}
                  onChange={(e) =>
                    setEditableUser({
                      ...editableUser,
                      phone: {
                        phone: e.target.value,
                        callingCode: callingCode,
                        countryCode: currentUser?.address.country,
                      },
                    })
                  }
                  sx={{
                    width: '30%',
                    position: 'absolute',
                    margin: '0 0 0 30%',
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
                      letterSpacing: '0.5px',
                    },
                    '& label': {
                      color: '#888',
                      fontSize: '14px',
                      letterSpacing: '0.5px',
                    },
                    '& label.Mui-focused': {
                      color: '#ccc',
                      fontSize: '14px',
                      letterSpacing: '0.5px',
                    },
                  }}
                />
              </div>
            ) : (
              <span className="value" onClick={() => setEdit(!edit)}>
                {'+' +
                  currentUser?.phone.callingCode +
                  ' ' +
                  currentUser?.phone.phone}
              </span>
            )}
          </ItemContainer>
          <ItemContainer edit={edit ? 'true' : 'false'} multiline="true">
            <span className="title">About:</span>{' '}
            {edit ? (
              <Input
                multiline
                minRows={5}
                value={editableUser?.about}
                onChange={(text) =>
                  setEditableUser({
                    ...editableUser,
                    about: text,
                  })
                }
                label={currentUser?.about ? currentUser?.about : 'add about...'}
              />
            ) : (
              <span className="value" onClick={() => setEdit(!edit)}>
                {currentUser?.about}
              </span>
            )}
          </ItemContainer>
          <ItemContainer edit={edit ? 'true' : 'false'}>
            <span className="title">Web:</span>{' '}
            {edit ? (
              <Input
                value={editableUser?.media.web}
                label={currentUser?.web ? currentUser?.web : 'add web link..'}
              />
            ) : (
              <span className="value" onClick={() => setEdit(!edit)}>
                {currentUser?.web}
              </span>
            )}
          </ItemContainer>
          <ItemContainer edit={edit ? 'true' : 'false'}>
            <span className="title">Instagram:</span>{' '}
            {edit ? (
              <Input
                value={editableUser?.media.instagram}
                label={
                  currentUser?.media.instagram
                    ? currentUser?.media.instagram
                    : 'add instagram @username.'
                }
              />
            ) : (
              <span className="value" onClick={() => setEdit(!edit)}>
                {currentUser?.media.instagram}
              </span>
            )}
          </ItemContainer>
          <ItemContainer edit={edit ? 'true' : 'false'}>
            <span className="title">Facebook:</span>{' '}
            {edit ? (
              <Input
                value={editableUser?.media.facebook}
                label={
                  currentUser?.media.facebook
                    ? currentUser?.media.facebook
                    : 'add facebook @username...'
                }
              />
            ) : (
              <span className="value" onClick={() => setEdit(!edit)}>
                {currentUser?.media.facebook}
              </span>
            )}
          </ItemContainer>
          <ItemContainer edit={edit ? 'true' : 'false'}>
            <span className="title">TikTok:</span>{' '}
            {edit ? (
              <Input
                value={editableUser?.media.tiktok}
                label={
                  currentUser?.media.tiktok
                    ? currentUser?.media.tiktok
                    : 'add tiktok @username...'
                }
              />
            ) : (
              <span className="value" onClick={() => setEdit(!edit)}>
                {currentUser?.media.tiktok}
              </span>
            )}
          </ItemContainer>
          <ItemContainer edit={edit ? 'true' : 'false'}>
            <span className="title">Youtube:</span>{' '}
            {edit ? (
              <Input
                value={editableUser?.media.youtube}
                label={
                  currentUser?.media.youtube
                    ? currentUser?.media.youtube
                    : 'add youtube @username...'
                }
              />
            ) : (
              <span className="value" onClick={() => setEdit(!edit)}>
                {currentUser?.media.youtube}
              </span>
            )}
          </ItemContainer>
        </ContentList>
        <Button
          variant="contained"
          style={{
            backgroundColor: !edit ? 'rgba(255,255,255,0.1)' : '#f866b1',
            color: 'white',
          }}
          className="button"
          sx={{
            width: '40%',
            borderRadius: '50px',
            margin: '20px 0 50px 0px',
            height: '40px',
          }}
          onClick={
            edit
              ? () => {
                  setEdit(!edit);
                  handleSave();
                }
              : () => setEdit(!edit)
          }
        >
          {edit ? 'Save' : 'Edit'}
        </Button>
      </Container>
    </div>
  );
};

const Container = styled.div`
  width: 100vw;
  height: 100%;
  padding: 0 0 30px 0;
  z-index: 1000;
  background: rgba(1, 2, 12, 0.3);
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
  box-sizing: border-box;
`;

const Header = styled.div`
  width: 100%;
  padding: 12.5px 8px;
  box-sizing: border-box;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const ContentList = styled.div`
  width: 90%;
  display: flex;
  flex-direction: column;
  border-radius: 10px;
  padding: 0 10px 20px 10px;
  background: rgba(1, 2, 12, 0.2);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  gap: 8px;
  border: 1.5px solid rgba(255, 255, 255, 0.05);
`;

const ItemContainer = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  gap: 8px;
  color: #ccc;
  font-size: 14px;
  font-weight: 500;
  padding: 5px 10px;
  letter-spacing: 0.5px;
  height: ${(props) =>
    props.multiline === 'true' && props.edit === 'true' ? 'auto' : '53px'};
  box-sizing: border-box;

  .title {
    width: 25%;
  }

  .value {
    width: 75%;
    color: #f866b1;
    height: ${(props) =>
      props.multiline === 'true' && props.edit === 'true' ? 'auto' : '53px'};
    display: flex;
    align-items: center;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    overflow: hidden;
  }
`;
