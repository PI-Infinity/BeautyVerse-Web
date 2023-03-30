import React from 'react';
import styled from 'styled-components';
import { RiEdit2Fill } from 'react-icons/ri';
import { ImCheckmark } from 'react-icons/im';
import {
  FaFacebook,
  FaInstagram,
  FaYoutube,
  FaTiktok,
  FaPhoneAlt,
  FaChrome,
  FaWhatsapp,
  FaTelegram,
} from 'react-icons/fa';
import { AiOutlineMail } from 'react-icons/ai';
import { useSelector, useDispatch } from 'react-redux';
import { db } from '../../firebase';
import { doc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import Select from 'react-select';
import { countries } from '../../data/countryCodes';
import { IsMobile } from '../../functions/isMobile';
import axios from 'axios';
import { setRerenderCurrentUser } from '../../redux/rerenders';
import { LinkLoader } from '../../components/loader';

export const Links = ({ targetUser, loading }) => {
  const [edit, setEdit] = React.useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isMobile = IsMobile();
  // import current user & parse it
  const currentUser = JSON.parse(
    localStorage.getItem('Beautyverse:currentUser')
  );

  const [changePhone, setChangePhone] = React.useState('');
  const [countryCode, setCountryCode] = React.useState({
    value: '+995',
    label: 'Georgia',
  });
  const [changeField, setChangeField] = React.useState('');

  const UpdateLink = async (field, value) => {
    try {
      if (edit === 'web') {
        let parseLink;
        if (
          value?.toLowerCase()?.startsWith('https://') ||
          value?.toLowerCase()?.startsWith('http://')
        ) {
          parseLink = value;
        } else if (value?.toLowerCase()?.startsWith('www')) {
          parseLink = `https://${value?.slice(4)}`;
        } else {
          if (value?.length > 0) {
            parseLink = `https://${value}`;
          } else {
            parseLink = '';
          }
        }
        const response = await axios.patch(
          `https://beautyverse.herokuapp.com/api/v1/users/${targetUser?._id}`,
          {
            media: {
              ...targetUser?.media,
              web: parseLink,
            },
          }
        );
        const data = await response.data;
        dispatch(setRerenderCurrentUser());
      } else if (edit === 'phone') {
        const response = await axios.patch(
          `https://beautyverse.herokuapp.com/api/v1/users/${targetUser?._id}`,
          {
            [`${field}`]: value,
          }
        );
        const data = await response.data;
        dispatch(setRerenderCurrentUser());
      } else {
        const response = await axios.patch(
          `https://beautyverse.herokuapp.com/api/v1/users/${targetUser?._id}`,
          {
            media: {
              ...targetUser?.media,
              [`${field}`]: value,
            },
          }
        );
        const data = await response.data;
        dispatch(setRerenderCurrentUser());
      }
    } catch (error) {
      console.error(error);
    }
    setChangeField('');
    setEdit('');
  };

  const LinkList = [
    {
      id: 'email',
      placeholder: targetUser?.email,
      icon: <AiOutlineMail />,
      value: targetUser?.email,
    },
    {
      id: 'phone',
      placeholder: 'example: 555 555 555',
      icon: <FaPhoneAlt />,
      onChange: (e) => setChangePhone(e.target.value),
      value: targetUser?.phone,
    },
    {
      id: 'web',
      placeholder: 'web.com',
      icon: <FaChrome />,
      value: targetUser?.media?.web,
      onChange: (e) => setChangeField(e.target.value),
    },
    {
      id: 'facebook',
      placeholder: 'example Id: 123456789012345',
      icon: <FaFacebook />,
      value: targetUser?.media?.facebook,
      onChange: (e) => setChangeField(e.target.value),
    },
    {
      id: 'instagram',
      placeholder: 'example: @username',
      icon: <FaInstagram />,
      value: targetUser?.media?.instagram,
      onChange: (e) => setChangeField(e.target.value),
    },

    {
      id: 'tiktok',
      placeholder: 'example: @tiktok',
      icon: <FaTiktok />,
      value: targetUser?.media?.tiktok,
      onChange: (e) => setChangeField(e.target.value),
    },
    {
      id: 'youtube',
      placeholder: 'example: @youtube',
      icon: <FaYoutube />,
      value: targetUser?.media?.youtube,
      onChange: (e) => setChangeField(e.target.value),
    },
  ];

  /// add whatsapp and telegram

  const AddWhatsapp = async () => {
    const base = doc(db, 'users', `${targetUser?._id}`);
    if (targetUser?.media?.whatsapp === true) {
      const response = await axios.patch(
        `https://beautyverse.herokuapp.com/api/v1/users/${targetUser?._id}`,
        {
          media: {
            ...targetUser?.media,
            whatsapp: false,
          },
        }
      );
      const data = await response.data;
      dispatch(setRerenderCurrentUser());
    } else {
      const response = await axios.patch(
        `https://beautyverse.herokuapp.com/api/v1/users/${targetUser?._id}`,
        {
          media: {
            ...targetUser?.media,
            whatsapp: true,
          },
        }
      );
      const data = await response.data;
      dispatch(setRerenderCurrentUser());
    }
  };
  const AddTelegram = async () => {
    if (targetUser?.media?.telegram === true) {
      const response = await axios.patch(
        `https://beautyverse.herokuapp.com/api/v1/users/${targetUser?._id}`,
        {
          media: {
            ...targetUser?.media,
            telegram: false,
          },
        }
      );
      const data = await response.data;
      dispatch(setRerenderCurrentUser());
    } else {
      const response = await axios.patch(
        `https://beautyverse.herokuapp.com/api/v1/users/${targetUser?._id}`,
        {
          media: {
            ...targetUser?.media,
            telegram: true,
          },
        }
      );
      const data = await response.data;
      dispatch(setRerenderCurrentUser());
    }
  };

  // define who can see whatsapp
  let whatsapp;
  if (targetUser?.whatsapp) {
    whatsapp = true;
  } else if (
    targetUser?.whatsapp !== true &&
    targetUser?._id === currentUser?._id
  ) {
    whatsapp = true;
  } else {
    whatsapp = false;
  }
  // define who can see telegram
  let telegram;
  if (targetUser?.telegram) {
    telegram = true;
  } else if (
    targetUser?.telegram !== true &&
    targetUser?._id === currentUser?._id
  ) {
    telegram = true;
  } else {
    telegram = false;
  }

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
      width: '5vw',
      minHeight: '2vw',
      cursor: 'pointer',
      '@media only screen and (max-width: 1200px)': {
        width: '23vw',
        fontSize: '16px',
      },
    }),
  };

  return (
    <LinksContainer>
      {loading ? (
        <LinkLoader />
      ) : (
        <>
          {/* {targetUser?._id !== currentUser?._id && (
            <SendMessage
              onClick={
                currentUser !== undefined
                  ? () => handleSelect(targetUser)
                  : () => navigate('/login')
              }
            >
              Send Message
            </SendMessage>
          )} */}
          {LinkList?.map((item, index) => {
            if (item?.id === 'email') {
              return (
                <LinkContainer key={index} edit={edit}>
                  {item.icon}
                  <Link
                    style={{ textDecoration: 'none', color: 'inherit' }}
                    href={`mailto:${item?.value}`}
                    target="_blank"
                  >
                    {item?.value}
                  </Link>
                </LinkContainer>
              );
            } else if (item.id === 'phone') {
              if (targetUser?.type !== 'user') {
                return (
                  <LinkContainer>
                    {item.icon}
                    {edit == item.id ? (
                      <>
                        <Select
                          // placeholder={language?.language.Auth.auth.workingDays}
                          defaultValue="+995"
                          defaultInputValue="+995"
                          placeholder="+995"
                          value={countryCode}
                          onChange={(value) => {
                            setCountryCode(value);
                          }}
                          styles={CustomStyle}
                          options={countries}
                        />
                        <LinkInput
                          placeholder="Add phone number"
                          type="tel"
                          value={changeField}
                          onChange={(e) => setChangeField(e.target.value)}
                        />
                      </>
                    ) : (
                      <Link>
                        <a
                          style={{ color: 'inherit', textDecoration: 'none' }}
                          href={`tel://${item.placeholder}`}
                        >
                          {item.value}
                        </a>
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '15px',
                          }}
                        >
                          {whatsapp && (
                            <a
                              style={{
                                color: targetUser?.media?.whatsapp
                                  ? 'inherit'
                                  : 'gray',
                                textDecoration: 'none',
                              }}
                              onClick={
                                targetUser?._id === currentUser?._id
                                  ? () => AddWhatsapp()
                                  : false
                              }
                              href={
                                targetUser?._id !== currentUser?._id &&
                                `https://wa.me/${item.placeholder}`
                              }
                            >
                              <FaWhatsapp className="icons" />
                            </a>
                          )}
                          {telegram && (
                            <a
                              style={{
                                color: targetUser?.media?.telegram
                                  ? 'inherit'
                                  : 'gray',
                                textDecoration: 'none',
                              }}
                              onClick={
                                targetUser?._id === currentUser?._id
                                  ? () => AddTelegram()
                                  : false
                              }
                              href={
                                targetUser?._id !== currentUser?._id &&
                                ` https://t.me/${item.placeholder}`
                              }
                            >
                              <FaTelegram className="icons" />
                            </a>
                          )}
                        </div>
                      </Link>
                    )}
                    {targetUser?._id === currentUser?._id && (
                      <>
                        {edit == item.id ? (
                          <ImCheckmark
                            className="confirmIcon"
                            onClick={() =>
                              UpdateLink(
                                'phone',
                                countryCode?.value + changeField
                              )
                            }
                          />
                        ) : (
                          <RiEdit2Fill
                            className="editIcon"
                            onClick={() => {
                              setEdit(item.id);
                              setChangeField(item.value?.slice(4));
                            }}
                          />
                        )}
                      </>
                    )}
                  </LinkContainer>
                );
              }
            } else if (item?.id === 'web') {
              return (
                <LinkContainer key={index} edit={edit}>
                  {item.icon}
                  {edit == item.id ? (
                    <LinkInput
                      placeholder={item.placeholder}
                      value={changeField}
                      onChange={(e) => setChangeField(e.target.value)}
                    />
                  ) : (
                    <Link
                      style={{ textDecoration: 'none', color: 'inherit' }}
                      href={`${item?.value}`}
                      target="blank"
                    >
                      {item?.value?.slice(8)}
                    </Link>
                  )}
                  {targetUser?._id === currentUser?._id &&
                    item.id != 'email' && (
                      <>
                        {edit == item.id ? (
                          <ImCheckmark
                            className="confirmIcon"
                            onClick={() => UpdateLink('web', changeField)}
                          />
                        ) : (
                          <RiEdit2Fill
                            className="editIcon"
                            onClick={() => {
                              setEdit(item.id);
                              setChangeField(item?.value);
                            }}
                          />
                        )}
                      </>
                    )}
                </LinkContainer>
              );
            } else if (item?.id === 'facebook') {
              return (
                <LinkContainer key={index} edit={edit}>
                  {item.icon}
                  {edit == item.id ? (
                    <LinkInput
                      type="number"
                      placeholder={item.placeholder}
                      value={changeField}
                      onChange={(e) => setChangeField(e.target.value)}
                    />
                  ) : (
                    <Link
                      style={{
                        textDecoration: 'none',
                        color: 'inherit',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                      }}
                      href={
                        isMobile
                          ? `fb://profile/${item?.value}`
                          : `https://facebook.com/profile/${item?.value}`
                      }
                      target="_blank"
                    >
                      {item?.value?.length > 0 ? 'Facebook' : item?.value}
                    </Link>
                  )}
                  {targetUser?._id === currentUser?._id && (
                    <>
                      {edit == item.id ? (
                        <ImCheckmark
                          className="confirmIcon"
                          onClick={() => UpdateLink('facebook', changeField)}
                        />
                      ) : (
                        <RiEdit2Fill
                          className="editIcon"
                          onClick={() => {
                            setEdit(item.id);
                            setChangeField(item?.value);
                          }}
                        />
                      )}
                    </>
                  )}
                </LinkContainer>
              );
            } else if (item?.id === 'instagram') {
              return (
                <LinkContainer key={index} edit={edit}>
                  {item.icon}
                  {edit == item.id ? (
                    <LinkInput
                      placeholder={item.placeholder}
                      value={changeField}
                      onChange={(e) => setChangeField(e.target.value)}
                    />
                  ) : (
                    <Link
                      style={{
                        textDecoration: 'none',
                        color: 'inherit',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                      }}
                      href={`https://www.instagram.com/${item?.value?.slice(
                        1
                      )}/`}
                      target="_blank"
                    >
                      {item?.value}
                    </Link>
                  )}
                  {targetUser?._id === currentUser?._id && (
                    <>
                      {edit == item.id ? (
                        <ImCheckmark
                          className="confirmIcon"
                          onClick={() => UpdateLink('instagram', changeField)}
                        />
                      ) : (
                        <RiEdit2Fill
                          className="editIcon"
                          onClick={() => {
                            setEdit(item.id);
                            setChangeField(item?.value);
                          }}
                        />
                      )}
                    </>
                  )}
                </LinkContainer>
              );
            } else if (item?.id === 'tiktok') {
              return (
                <LinkContainer key={index} edit={edit}>
                  {item.icon}
                  {edit == item.id ? (
                    <LinkInput
                      placeholder={item.placeholder}
                      value={changeField}
                      onChange={(e) => setChangeField(e.target.value)}
                    />
                  ) : (
                    <Link
                      style={{
                        textDecoration: 'none',
                        color: 'inherit',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                      }}
                      href={`https://www.tiktok.com/${item.value}`}
                      target="_blank"
                    >
                      {item?.value}
                    </Link>
                  )}
                  {targetUser?._id === currentUser?._id && (
                    <>
                      {edit == item.id ? (
                        <ImCheckmark
                          className="confirmIcon"
                          onClick={() => UpdateLink('tiktok', changeField)}
                        />
                      ) : (
                        <RiEdit2Fill
                          className="editIcon"
                          onClick={() => {
                            setEdit(item.id);
                            setChangeField(item?.value);
                          }}
                        />
                      )}
                    </>
                  )}
                </LinkContainer>
              );
            } else if (item?.id === 'youtube') {
              return (
                <LinkContainer key={index} edit={edit}>
                  {item.icon}
                  {edit == item.id ? (
                    <LinkInput
                      placeholder={item.placeholder}
                      value={changeField}
                      onChange={(e) => setChangeField(e.target.value)}
                    />
                  ) : (
                    <Link
                      style={{
                        textDecoration: 'none',
                        color: 'inherit',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                      }}
                      href={`https://www.youtube.com/${item?.value}/`}
                      target="_blank"
                    >
                      {item?.value}
                    </Link>
                  )}
                  {targetUser?._id === currentUser?._id && (
                    <>
                      {edit == item.id ? (
                        <ImCheckmark
                          className="confirmIcon"
                          onClick={() => UpdateLink('youtube', changeField)}
                        />
                      ) : (
                        <RiEdit2Fill
                          className="editIcon"
                          onClick={() => {
                            setEdit(item.id);
                            setChangeField(item?.value);
                          }}
                        />
                      )}
                    </>
                  )}
                </LinkContainer>
              );
            }
          })}
        </>
      )}
    </LinksContainer>
  );
};

const LinksContainer = styled.div`
  width: auto;
  min-width: 20vw;
  max-width: 25vw;
  display: flex;
  flex-direction: column;
  align-items: start;
  justify-content: start;
  padding-top: 1vw;
  padding-left: 1vw;
  color: ${(props) => props.theme.font};

  @media only screen and (max-width: 600px) {
    width: 90vw;
    box-sizing: border-box;
    max-width: 90vw;
  }

  .editIcon {
    color: ${(props) => props.theme.disabled};
    cursor: pointer;
    font-size: 1vw;

    @media only screen and (max-width: 600px) {
      font-size: 4vw;
      margin-left: 10px;
    }
  }

  .confirmIcon {
    color: green;
    cursor: pointer;
    font-size: 1vw;

    @media only screen and (max-width: 600px) {
      font-size: 4vw;
      margin-left: 10px;
    }
  }
`;

const SendMessage = styled.div`
  width: 15vw;
  padding: 7px 15px;
  box-sizing: border-box;
  text-align: center;
  margin: 15px 0;
  box-shadow: 0 0.1vw 0.3vw rgba(0, 0, 0, 0.1);
  background: ${(props) => props.theme.categoryItem};
  border-radius: 0.5vw;
  cursor: pointer;
  font-weight: bold;
  color: ${(props) => props.theme.font};
  font-size: 14px;

  @media only screen and (max-width: 600px) {
    margin: 0 0 15px 0;
    padding: 12px;
    border-radius: 1.5vw;
    width: 100%;
  }

  :hover {
    filter: brightness(0.98);
  }
`;

const LinkContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 1vw;
  font-size: 14px;
  height: 2vw;
  color: ${(props) => props.theme.filterFontActive};
  width: auto;
  max-width: 20vw;
  border-bottom: 1px solid ${(props) => props.theme.lineColor};

  @media only screen and (max-width: 600px) {
    width: 100vw;
    height: 9vw;
    box-sizing: border-box;
    max-width: 100vw;
  }
`;

const LinkInput = styled.input`
  border: none;
  background: none;
  width: auto;
  max-width: 8vw;
  height: 90%;
  margin: 0;
  border-radius: 0.5vw;
  text-align: start;
  color: ${(props) => props.theme.font};
  font-size: 16px;

  :placeholder {
    text-align: start;
    font-size: 14px;
    font-weight: bold;
    padding-left: 0.5vw;
    color: green;
  }

  :focus {
    outline: none;
  }
`;

const Link = styled.a`
  font-size: 14px;
  font-weight: bold;
  border: none;
  background: none;
  width: auto;
  max-width: 15vw;
  height: 100%;
  margin: 0;
  overflow: hidden;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 1vw;

  @media only screen and (max-width: 600px) {
    height: 5vw;
    max-width: 80vw;
    position: relative;
    left: 3vw;
    margin-right: 3vw;
    gap: 7vw;
  }

  .icons {
    font-size: 16px;
    margin-top: 0.25vw;
  }
`;
