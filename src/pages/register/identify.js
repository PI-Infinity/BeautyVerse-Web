import React, { useState } from 'react';
import styled from 'styled-components';
import { useSelector, useDispatch } from 'react-redux';
import {
  setName,
  setUserType,
  setEmail,
  setPhoneNumber,
  setPassword,
  setConfirmPassowrd,
  setCurrentUser,
} from '../../redux/register';
import { FaUserEdit } from 'react-icons/fa';
import { ImProfile } from 'react-icons/im';
import { MdAddBusiness } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import AddressAutocomplete from '../../components/addresAutocomplete';
import { RiShoppingCartFill } from 'react-icons/ri';
import useWindowDimensions from '../../functions/dimensions';
import { Button } from '../../components/button';
import { Language } from '../../context/language';
import { IsMobile } from '../../functions/isMobile';
import VerifyEmail from '../../pages/register/verifyPopup';
import Error from '../../snackBars/success';
import axios from 'axios';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import SimpleBackdrop from '../../components/backDrop';
import { setBackdropOpen } from '../../redux/main';

export const Identify = (props) => {
  const language = Language();
  const isMobile = IsMobile();
  const { height, width } = useWindowDimensions();

  const dispatch = useDispatch();
  const navigate = useNavigate();

  // define user type
  const type = useSelector((state) => state.storeRegister.userType);
  const registerFields = useSelector((state) => state.storeRegister);
  const map = useSelector((state) => state.storeRegister.map);

  const [alert, setAlert] = useState(false);
  const [verify, setVerify] = useState(false);

  const Register = async (e) => {
    try {
      dispatch(setBackdropOpen(true));
      // Signup user
      const response = await axios.post(
        'https://beautyverse.herokuapp.com/api/v1/signup',
        {
          name: registerFields?.name,
          type: type,
          email: registerFields?.email,
          phone: registerFields?.phoneNumber,
          password: registerFields?.password,
          confirmPassword: registerFields?.confirmPassowrd,
          address: {
            country: map.country,
            region: map.region,
            city: map.city,
            district: map.district,
            street: map.street,
            number: map.number,
            latitude: map.latitude,
            longitude: map.longitude,
          },
          media: {
            facebook: '',
            instagram: '',
            tiktok: '',
            youtube: '',
            telegram: false,
            whatsapp: false,
          },
          notifications: [
            {
              senderId: 'Beautyverse',
              text: `${language?.language.Auth.auth.successRegister}`,
              date: new Date(),
              type: 'welcome',
              status: 'unread',
              feed: '',
            },
          ],
        }
      );
      await setVerify(true);
      dispatch(setBackdropOpen(false));
    } catch (err) {
      dispatch(setBackdropOpen(false));
      setAlert({
        active: true,
        type: 'error',
        title: err.response.data.message,
      });
    }
  };

  const handleKey = (e) => {
    e.code === 'Enter' && Register(e);
  };

  // define title icon
  let icon;
  if (type === 'user') {
    icon = <FaUserEdit className="userIcon" />;
  } else if (type === 'specialist') {
    icon = <ImProfile className="specIcon" />;
  } else if (type === 'beautyCenter') {
    icon = <MdAddBusiness className="businessIcon" />;
  } else if (type === 'shop') {
    icon = <RiShoppingCartFill className="businessIcon" />;
  }

  /// address
  const [address, setAddress] = React.useState('');
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
    }),
    control: (baseStyles, state) => ({
      ...baseStyles,
      backgroundColor: theme ? '#333' : '#fff',
      borderColor: state.isFocused ? 'rgba(0,0,0,0)' : 'rgba(0,0,0,0.1)',
      width: '7vw',
      minHeight: '2vw',
      cursor: 'pointer',
      '@media only screen and (max-width: 1200px)': {
        width: '23vw',
        fontSize: '12px',
      },
    }),
  };

  /**
   * send identify email
   */

  const [code, setCode] = React.useState('');

  async function Verify() {
    try {
      const response = await axios.post(
        'https://beautyverse.herokuapp.com/api/v1/verifyEmail',
        {
          email: registerFields?.email,
          code: code,
        }
      );

      const newUser = response.data.data.newUser;

      if (type === 'user') {
        await localStorage.setItem(
          'Beautyverse:currentUser',
          JSON.stringify(newUser)
        );
        if (isMobile) {
          navigate(`/api/v1/users/${newUser._id}/contact`);
        } else {
          navigate(`/api/v1/users/${newUser._id}/audience`);
        }
      } else {
        dispatch(setCurrentUser(newUser));
        navigate(`/register/business`);
      }

      dispatch(setName(''));
      dispatch(setUserType(''));
      dispatch(setEmail(''));
      dispatch(setPhoneNumber(''));
      dispatch(setPassword(''));
      dispatch(setConfirmPassowrd(''));
    } catch (err) {
      setAlert({
        active: true,
        type: 'error',
        title: err.response.data.message,
      });
    }
  }

  // phone input styled
  const containerStyle = {
    width: '100%',
    borderRadius: '4px',
    background: 'none',
    border: 'none',
  };

  const buttonStyle = {
    background: 'none',
  };

  const inputStyle = {
    background: 'none',
    color: theme ? '#fff' : '#111',
    width: '100%',
    border: 'none',
  };
  const searchStyle = {
    width: '80%',
    fontSize: '16px',
    backgroundColor: '#fff',
  };

  const dropdownStyle = {
    width: isMobile ? '45vw' : '18vw',
    color: '#111',
  };

  const handleFocus = (event) => {
    event.target.focus();
  };

  const handleBlur = (event) => {
    event.target.blur();
  };

  return (
    <>
      <SimpleBackdrop />
      <Error
        open={alert?.active}
        setOpen={setAlert}
        type="error"
        title={alert?.title}
      />
      <VerifyEmail
        open={verify}
        setOpen={setVerify}
        Verify={Verify}
        email={registerFields?.email}
        language={language}
        code={code}
        setCode={setCode}
      />
      <Container
        height={height}
        // style={{ display: !flag ? "visible" : "none" }}
      >
        <Title>
          {icon}
          <span>{language?.language.Auth.auth.identify}</span>
        </Title>
        <WrapperContainer onSubmit={Register}>
          {!isMobile && (
            <Button
              title={language?.language.Auth.auth.back}
              back={true}
              function={() => navigate('/register')}
            />
          )}
          <Fields>
            <>
              <TitleWrapper>
                <InputTitle>
                  {type == 'beautyCenter' || type == 'shop'
                    ? language?.language.Auth.auth.title
                    : language?.language.Auth.auth.name}
                  *
                </InputTitle>
                <InputTitle>{language?.language.Auth.auth.address}*</InputTitle>
              </TitleWrapper>
              <Wrapper>
                <InputWrapper>
                  <Input
                    requred
                    type="text"
                    placeholder={
                      type == 'beautyCenter' || type == 'shop'
                        ? language?.language.Auth.auth.title
                        : language?.language.Auth.auth.name
                    }
                    onChange={(e) => dispatch(setName(e.target.value))}
                    value={registerFields?.name}
                  />
                </InputWrapper>
                <InputWrapper>
                  <AddressAutocomplete
                    language={language}
                    address={address}
                    setAddress={setAddress}
                  />
                </InputWrapper>
              </Wrapper>
            </>
            <>
              <TitleWrapper>
                <InputTitle>{language?.language.Auth.auth.email}*</InputTitle>
                <InputTitle>{language?.language.Auth.auth.phone}*</InputTitle>
              </TitleWrapper>
              <Wrapper>
                <InputWrapper>
                  <Input
                    required
                    type="text"
                    placeholder={language?.language.Auth.auth.email}
                    onChange={(e) => dispatch(setEmail(e.target.value))}
                    value={registerFields?.email}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                  />
                </InputWrapper>
                <InputWrapper style={{ display: 'flex', flexDirection: 'row' }}>
                  <PhoneInput
                    containerStyle={containerStyle}
                    searchStyle={searchStyle}
                    inputStyle={inputStyle}
                    dropdownStyle={dropdownStyle}
                    country={'ge'}
                    enableSearch
                    value={registerFields?.countryCode?.code}
                    onChange={(value) => {
                      dispatch(setPhoneNumber(value));
                    }}
                  />
                  {/* <Select
                    // placeholder={language?.language.Auth.auth.workingDays}
                    defaultValue="+995"
                    defaultInputValue="+995"
                    placeholder="+995"
                    value={registerFields?.countryCode?.code}
                    onChange={(value) => {
                      dispatch(setCountryCode(value));
                    }}
                    styles={CustomStyle}
                    options={countries}
                  />
                  <Input
                    required
                    type="tel"
                    placeholder={language?.language.Auth.auth.phone}
                    onChange={(e) =>
                      dispatch(setPhoneNumber(e.target.value))
                    }
                    value={registerFields?.phoneNumber}
                  /> */}
                </InputWrapper>
              </Wrapper>
            </>
            <>
              <TitleWrapper>
                <InputTitle>
                  {language?.language.Auth.auth.password}*
                </InputTitle>
                <InputTitle>
                  {language?.language.Auth.auth.confirmPassword}*
                </InputTitle>
              </TitleWrapper>
              <Wrapper>
                <InputWrapper>
                  <Input
                    required
                    type="password"
                    placeholder={language?.language.Auth.auth.password}
                    onChange={(e) => dispatch(setPassword(e.target.value))}
                    value={registerFields?.password}
                  />
                </InputWrapper>
                <InputWrapper>
                  <Input
                    required
                    type="password"
                    placeholder={language?.language.Auth.auth.confirmPassword}
                    value={registerFields?.confirmPassowrd}
                    onChange={(e) =>
                      dispatch(setConfirmPassowrd(e.target.value))
                    }
                    onKeyDown={handleKey}
                  />
                </InputWrapper>
              </Wrapper>
              <div id="recaptcha-container"></div>
            </>
          </Fields>
          {!isMobile && (
            <Button
              title={
                type === 'user'
                  ? language?.language.Auth.auth.register
                  : language?.language.Auth.auth.next
              }
              type="Submit"
              function={Register}
            />
          )}
        </WrapperContainer>
        {/* <button onClick={() => GetEmail('tornike.pirtakhia.lietuva@gmail.com')}>
          test
        </button> */}
        <MobileButtons>
          {' '}
          <Button
            title={language?.language.Auth.auth.back}
            back={true}
            function={() => navigate('/register')}
          />
          <Button
            title={
              type === 'user'
                ? language?.language.Auth.auth.register
                : language?.language.Auth.auth.next
            }
            type="Submit"
            function={() => Register()}
          />
        </MobileButtons>
      </Container>
    </>
  );
};

const Container = styled.div`
  width: 100%;
  height: ${(props) => props.height}px;
  box-sizing: border-box;
  padding-top: 3vw;
  padding-bottom: 5vw;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2vw;
  box-sizing: border-box;

  @media only screen and (max-width: 600px) {
    justify-content: center;
    padding-top: 18vh;
    height: 100%;
  }

  .userIcon {
    font-size: 2vw;

    @media only screen and (max-width: 600px) {
      font-size: 7vw;
    }
  }

  .specIcon {
    font-size: 2vw;
    @media only screen and (max-width: 600px) {
      font-size: 7vw;
    }
  }

  .businessIcon {
    font-size: 2vw;

    @media only screen and (max-width: 600px) {
      font-size: 7vw;
    }
  }
`;

const Confirm = styled.form`
  width: 100%;
  height: ${(props) => props.height}px;
  box-sizing: border-box;
  padding-top: 3vw;
  padding-bottom: 5vw;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2vw;

  @media only screen and (max-width: 600px) {
    padding-top: 0vw;
    padding-bottom: 3vw;
  }
`;

const Title = styled.h2`
  margin-bottom: 1vw;
  display: flex;
  align-items: center;
  gap: 15px;
  color: ${(props) => props.theme.font};
  font-size: 18px;

  @media only screen and (max-width: 600px) {
    margin-bottom: 7vw;
  }
`;

const Fields = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1vw;
`;

const Wrapper = styled.div`
  display: flex;
  gap: 1vw;
  @media only screen and (max-width: 600px) {
    gap: 3vw;
  }
`;

const TitleWrapper = styled.div`
  display: flex;
  gap: 1vw;

  @media only screen and (max-width: 600px) {
    margin: 2vw 1vw;
  }
`;

const WrapperBtn = styled.div`
  display: flex;
  gap: 1vw;
  margin-top: 5vw;
`;

const WrapperContainer = styled.form`
  display: ${(props) => (props.flag === 'true' ? 'none' : 'flex')};

  align-items: center;
  justify-content: center;
  gap: 10vw;

  @media only screen and (max-width: 600px) {
    flex-direction: column;
    gap: 15vw;
  }
`;

const Codes = styled.select`
  background: none;
  border: none;
  cursor: pointer;
`;

const InputWrapper = styled.div`
  width: 18.5vw;
  height: 2.5vw;
  border-radius: 0.5vw;
  box-shadow: 0 0.1vw 0.3vw rgba(2, 2, 2, 0.1);
  border: none;
  display: flex;
  align-items: center;
  justify-content: start;
  gap: 0.5vw;
  transition: ease-in 200ms;
  box-sizing: border-box;
  color: ${(props) => props.theme.font};
  background: ${(props) => props.theme.categoryItem};

  @media only screen and (max-width: 600px) {
    box-shadow: 0 0.2vw 0.6vw rgba(2, 2, 2, 0.1);
    width: 45vw;
    height: 10vw;
    border-radius: 1.5vw;
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
  transition: ease-in 200ms;
  padding-left: 0.5vw;
  box-sizing: border-box;
  color: ${(props) => props.theme.font};
  background: ${(props) => props.theme.categoryItem};

  @media only screen and (max-width: 600px) {
    border-radius: 1.5vw;
    padding-left: 2vw;
    font-size: 16px;
  }

  :focus {
    outline: none;
  }

  ::placeholder {
    font-size: 12px;
    color: #888;
  }
`;

const InputTitle = styled.div`
  flex: 1;
  margin-bottom: -0.5vw;
  color: ${(props) => props.theme.font};
  font-size: 14px;
`;

const SubmitButton = styled.button`
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

  @media only screen and (max-width: 600px) {
    width: 45vw;
    height: 8vw;
    border-radius: 1.5vw;
    box-shadow: 0 0.3vw 0.6vw rgba(2, 2, 2, 0.2);
    font-size: 3.8vw;
  }

  :hover {
    box-shadow: 0 0.1vw 0.3vw rgba(2, 2, 2, 0.2);
  }
`;

const MobileButtons = styled.div`
  display: none;

  @media only screen and (max-width: 600px) {
    display: flex;
    align-items: center;
    justify-content: space-evenly;
    position: fixed;
    bottom: 3vw;
    gap: 15px;
    font-size: 14px;
  }
`;
