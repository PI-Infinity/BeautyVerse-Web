import React, { useState } from 'react';
import styled from 'styled-components';
import { IsMobile } from '../../functions/isMobile';
import { useOutletContext, useNavigate } from 'react-router-dom';
import { AiOutlineEyeInvisible, AiOutlineEye } from 'react-icons/ai';
import ChangePassword from '../../pages/user/changePassword';
import Success from '../../snackBars/success';
import {
  setRerenderCurrentUser,
  setRerenderUserList,
} from '../../redux/rerenders';
import { useSelector, useDispatch } from 'react-redux';
import makeAnimated from 'react-select/animated';
import Switch from '@mui/material/Switch';
import { Spinner } from '../../components/loader';
import axios from 'axios';

const animatedComponents = makeAnimated();

export const Settings = () => {
  const [loading, setLoading] = useState(true);
  const [targetUser, language] = useOutletContext();
  const isMobile = IsMobile();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const currentUser = JSON.parse(
    localStorage.getItem('Beautyverse:currentUser')
  );

  const country = useSelector((state) => state.storeMain.country);

  React.useEffect(() => {
    if (targetUser?._id !== currentUser?._id) {
      navigate('/');
    }
  }, []);

  // useEffect(() => {
  //   const getPass = async () => {
  //     await axios
  //       .get(
  //         '/api/v1/users/' + currentUser._id + '/password'
  //       )
  //       .then((data) => {
  //         console.log(data.data.data.user.password);
  //       });
  //   };
  //   getPass();
  // }, []);

  // success messaage open
  const [open, setOpen] = React.useState(false);

  // color mode
  const theme = useSelector((state) => state.storeMain.theme);

  const CustomStyle = {
    singleValue: (base, state) => ({
      ...base,
      color: state.isSelected
        ? theme
          ? '#333'
          : '#f3f3f3'
        : theme
        ? '#f3f3f3'
        : '#333',
      fontSize: '14px',
    }),
    placeholder: (base, state) => ({
      ...base,
      // height: "1000px",
      color: state.isSelected
        ? theme
          ? '#333'
          : '#f3f3f3'
        : theme
        ? '#f3f3f3'
        : '#333',
      maxHeight: '50px',
    }),
    input: (base, state) => ({
      ...base,
      color: theme ? '#f3f3f3' : '#333',
      fontSize: '16px',
      maxHeight: '100px',
    }),
    multiValue: (base, state) => ({
      ...base,
      backgroundColor: state.isDisabled ? null : 'lightblue',
      borderRadius: '20px',
    }),
    multiValueLabel: (base, state) => ({
      ...base,
    }),
    menuList: (base, state) => ({
      ...base,
      backgroundColor: theme ? '#333' : '#f3f3f3',
      zIndex: 1000,
    }),
    option: (base, state) => ({
      ...base,
      backgroundColor: state.isSelected
        ? theme
          ? '#f3f3f3'
          : '#333'
        : theme
        ? '#333'
        : '#f3f3f3',
      color: state.isSelected
        ? theme
          ? '#333'
          : '#f3f3f3'
        : theme
        ? '#f3f3f3'
        : '#333',
      fontSize: '14px',
    }),
    control: (baseStyles, state) => ({
      ...baseStyles,
      backgroundColor: theme ? '#333' : '#fff',
      borderColor: state.isFocused ? 'rgba(0,0,0,0)' : 'rgba(0,0,0,0.1)',
      width: '10vw',
      color: '#888',
      minHeight: '2vw',
      cursor: 'pointer',
      '@media only screen and (max-width: 1200px)': {
        width: '50vw',
        fontSize: '12px',
      },
    }),
  };

  const rerenderCurrentUser = useSelector(
    (state) => state.storeRerenders?.rerenderCurrentUser
  );
  const rerenderUserList = useSelector(
    (state) => state.storeRerenders?.rerenderCurrentUser
  );

  // deactivate or active account
  const ControlActivity = async () => {
    try {
      const response = await axios.patch(
        `https://beautyverse.herokuapp.com/api/v1/users/${targetUser?._id}`,
        {
          active: !targetUser?.active,
        }
      );
      const data = await response.data;
      dispatch(setRerenderCurrentUser(!rerenderCurrentUser));
      dispatch(setRerenderUserList(!rerenderUserList));
    } catch (error) {
      console.error(error);
    }
  };

  // open delete account dialog
  const [deleteAccount, setDelleteAccount] = useState(false);

  setTimeout(() => {
    setLoading(false);
  }, 300);

  return (
    <>
      {loading ? (
        <Content
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Spinner />
        </Content>
      ) : (
        <Content>
          <Success
            open={open}
            setOpen={setOpen}
            title={language?.language.User.userPage.succesChange}
          />
          <ChangePassword
            targetUser={targetUser}
            setOpen={setOpen}
            language={language}
          />
          {/* <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              marginTop: '30px',
            }}
          >
            <FaGlobeEurope size={20} color={theme ? '#fff' : '#111'} />
            <Select
              placeholder={country}
              components={animatedComponents}
              onChange={(value) => {
                dispatch(setCountry(value?.value));
                localStorage.setItem(
                  'BeautyVerse:Country',
                  JSON.stringify(value?.value)
                );
              }}
              // value={registerFields?.categories}
              styles={CustomStyle}
              options={countries}
            />
          </div> */}
          {targetUser?._id === currentUser?._id && (
            <>
              {targetUser?.active ? (
                <div>
                  <h4
                    style={{
                      color: theme ? '#fff' : '#111',
                      margin: '30px 0 0 0',
                    }}
                  >
                    Deactivate account!
                  </h4>
                  <div
                    style={{
                      color: theme ? '#666' : '#111',
                      margin: '5px 0 10px 0',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '5px',
                    }}
                  >
                    <AiOutlineEye />
                    <span>(Everyone can see your profile now)</span>
                  </div>
                  <div>
                    <Switch
                      size="large"
                      checked={targetUser?.active}
                      onChange={ControlActivity}
                    />
                  </div>
                </div>
              ) : (
                <div>
                  <h4
                    style={{
                      color: theme ? '#fff' : '#111',
                      margin: '50px 0 0 0',
                    }}
                  >
                    Active account!
                  </h4>
                  <div
                    style={{
                      color: theme ? '#666' : '#111',
                      margin: '5px 0 10px 0',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '5px',
                    }}
                  >
                    <AiOutlineEyeInvisible />
                    <span>(Nobody can see your profile now)</span>
                  </div>
                  <div>
                    <Switch
                      size="large"
                      checked={targetUser?.active}
                      onChange={ControlActivity}
                    />
                  </div>
                </div>
              )}
            </>
          )}
          {/* {targetUser?._id === currentUser?._id && (
            <>
              {!requested?.request ? (
                <div>
                  <h4
                    style={{
                      color: theme ? '#fff' : '#111',
                      margin: '20px 0 0 0',
                    }}
                  >
                    Delete account!
                  </h4>
                  <div
                    style={{
                      color: theme ? '#666' : '#111',
                      margin: '5px 0 10px 0',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center',
                      gap: '10px',
                    }}
                  >
                    <span>
                      (Send account remove request, 24 hours for accepting)
                    </span>
                    <AiFillDelete
                      size={24}
                      onClick={() => setDelleteAccount(true)}
                      style={{ cursor: 'pointer' }}
                    />
                  </div>
                  <div></div>
                  <AlertDialog
                    title="Do you really want to dielete account"
                    open={deleteAccount}
                    setOpen={setDelleteAccount}
                    language={language}
                    function={SendDeleteRequest}
                  />
                </div>
              ) : (
                <button onClick={CancelRequest} style={{ cursor: 'pointer' }}>
                  Cancel Delete Account Request
                </button>
              )}
            </>
          )} */}
        </Content>
      )}
    </>
  );
};

const Content = styled.div`
  display: flex;
  flex-direction: column;
  align-items: start;
  justify-content: start;
  padding-top: 1vw;
  padding-left: 3vw;
  width: 100%;
  height: 100%;
  min-height: 50vh;
  flex-wrap: wrap;
  gap: 1vw;
  height: auto;
  margin-bottom: 5vw;
  overflow-x: hidden;
  box-sizing: border-box;

  .loadingIcon {
    font-size: 3vw;
  }

  @media only screen and (max-width: 600px) {
    justify-content: start;
    padding-top: 6vw;
    padding-left: 12vw;
    gap: 3vw;
  }
`;

const Password = styled.div`
  color: ${(props) => props.theme.font};
  display: flex;
  align-items: center;
  gap: 15px;
  font-size: 14px;

  #blur {
    color: transparent;
    text-shadow: 0 0 12px ${(props) => props.theme.font};
  }

  .eye {
    cursor: pointer;
    font-size: 1.2vw;
    @media only screen and (max-width: 600px) {
      font-size: 4vw;
    }
  }

  .password {
    min-width: 15vw;
  }
`;
