import React from 'react';
import styled from 'styled-components';
import { useSelector, useDispatch } from 'react-redux';
import { CoverUploader } from '../../components/coverUploader';
import { MdLocationPin } from 'react-icons/md';
import { ImCheckmark } from 'react-icons/im';
import { RiEdit2Fill } from 'react-icons/ri';
import Map from '../../components/map';
import { GiConfirmed } from 'react-icons/gi';
import { FiEdit } from 'react-icons/fi';
import MapAutocomplete from '../../components/mapAutocomplete';
import { useNavigate } from 'react-router-dom';
import { BsArrowRightCircleFill, BsArrowLeftCircleFill } from 'react-icons/bs';
import AddAddress from '../../pages/user/addAddressPopup';
import { IsMobile } from '../../functions/isMobile';
import { setAddress } from '../../redux/register';
import TextField from '@mui/material/TextField';
import axios from 'axios';
import { setRerenderCurrentUser } from '../../redux/rerenders';
import {
  setTargetUserName,
  setTargetUsername,
  setTargetUserAddress,
} from '../../redux/user';
import { TitleLoader, MapLoader } from '../../components/loader';

const CoverSection = React.memo(function ({
  targetUser,
  language,
  loading,
  setLoading,
}) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isMobile = IsMobile();

  // import current user from localstorage
  const currentUser = JSON.parse(
    localStorage.getItem('Beautyverse:currentUser')
  );

  const theme = useSelector((state) => state.storeMain.theme);
  // edit name
  const [edit, setEdit] = React.useState(false);

  const [editName, setEditName] = React.useState('');

  const UpdateName = async () => {
    try {
      const response = await axios.patch(
        `https://beautyverse.herokuapp.com/api/v1/users/${targetUser?._id}`,
        {
          name: editName,
        }
      );
      const data = await response.data;
      dispatch(setTargetUserName(editName));
      setEdit(false);
      setEditName('');
    } catch (error) {
      console.error(error);
    }
  };

  // edit type
  const [editUsername, setEditUsername] = React.useState(false);

  const [username, setUsername] = React.useState('');

  const UpdateUsername = async () => {
    try {
      const response = await axios.patch(
        `https://beautyverse.herokuapp.com/api/v1/users/${targetUser?._id}`,
        {
          username: username,
        }
      );
      const data = await response.data;
      dispatch(setTargetUsername(username));
      setEditUsername(false);
      setUsername('');
    } catch (error) {
      console.error(error);
    }
  };

  // edit about
  const [editAbout, setEditAbout] = React.useState(false);

  const [about, setAbout] = React.useState(targetUser?.about);

  // capitilize firs letter
  function capitalizeFirstLetter(string) {
    return string?.charAt(0).toUpperCase() + string?.slice(1);
  }

  const name = capitalizeFirstLetter(targetUser?.name);
  const userType = capitalizeFirstLetter(targetUser?.type);

  // edit address
  const map = useSelector((state) => state.storeRegister.map);
  const [editAddress, SetEditAddress] = React.useState('');
  const [addressInput, SetAddressInput] = React.useState('');

  /// address for autocomplete
  const address = useSelector((state) => state.storeRegister.address);

  // get all addresses
  const addresses = targetUser?.address;

  /**
   * change addresses list on cover
   */

  const [currentAddress, setCurrentAddress] = React.useState(0);

  let latitude;
  let longitude;
  let addressDefined;
  if (targetUser?.address) {
    latitude = targetUser?.address[currentAddress]?.latitude;
    longitude = targetUser?.address[currentAddress]?.longitude;
    addressDefined = (
      <div>
        {targetUser?.address[currentAddress]?.city === "T'bilisi"
          ? 'Tbilisi'
          : targetUser?.address[currentAddress]?.city}
        {targetUser?.address[currentAddress]?.district?.length > 0 &&
          ', ' + targetUser?.address[currentAddress]?.district}
        {targetUser?.address[currentAddress]?.street?.length > 0 &&
          ', ' + targetUser?.address[currentAddress]?.street + ' '}
        {targetUser?.address[currentAddress]?.number}
      </div>
    );
  }

  const UpdateAddress = async () => {
    try {
      const newAddress = {
        country: map.country,
        region: map.region,
        city: map.city,
        district: map.district,
        street: map.street,
        number: map.number,
        latitude: map.latitude,
        longitude: map.longitude,
      };
      const response = await axios.patch(
        `https://beautyverse.herokuapp.com/api/v1/users/${
          targetUser?._id
        }/address/${
          targetUser?.address?.length > 0 &&
          targetUser?.address[currentAddress]._id
        }`,
        newAddress
      );
      const data = await response.data;
      SetEditAddress(false);
      await dispatch(
        setTargetUserAddress({
          index: currentAddress,
          data: newAddress,
        })
      );
      dispatch(setRerenderCurrentUser());
    } catch (error) {
      console.error(error);
    }
  };

  const [type, setType] = React.useState('');

  React.useEffect(() => {
    setType('');
    if (targetUser?.type?.toLowerCase() === 'specialist') {
      setType(language?.language.User.userPage.specialist);
    } else if (targetUser?.type?.toLowerCase() === 'beautycenter') {
      setType(language?.language.User.userPage.beautySalon);
    } else {
      setType(language?.language.User.userPage.user);
    }
  }, [language]);

  /** Define following to user or not
   * //
   */

  // import followings
  const [followerDefined, setFollowerDefined] = React.useState('');
  const [render, setRender] = React.useState(false);
  React.useEffect(() => {
    async function checkFollower() {
      const response = await fetch(
        `https://beautyverse.herokuapp.com/api/v1/users/${targetUser?._id}/followers/${currentUser?._id}/check/`
      )
        .then((response) => response.json())
        .then(async (data) => {
          setFollowerDefined(data.data.follower);
        })
        .catch((error) => {
          console.log('Error fetching data:', error);
        });
    }
    if (targetUser?._id) {
      checkFollower();
    }
  }, [targetUser?._id, render]);

  // function to follow user
  const FollowToUser = async () => {
    try {
      await axios.post(
        `https://beautyverse.herokuapp.com/api/v1/users/${currentUser?._id}/followings`,
        {
          followingId: targetUser?._id,
          followingAuthId: targetUser?._id,
          followingName: targetUser?.name,
          followingCover: targetUser?.cover,
          followerId: currentUser?._id,
          followAt: new Date(),
        }
      );
      await axios.post(
        `https://beautyverse.herokuapp.com/api/v1/users/${targetUser?._id}/followers`,
        {
          followerId: currentUser?._id,
          followerAuthId: currentUser?._id,
          followerName: currentUser?.name,
          followerCover: currentUser?.cover,
          followingId: targetUser?._id,
          followAt: new Date(),
        }
      );
      if (currentUser?._id !== targetUser?._id) {
        await axios.post(
          `https://beautyverse.herokuapp.com/api/v1/users/${targetUser?._id}/notifications`,
          {
            senderId: targetUser?._id,
            text: `გამოიწერა თქვენი გვერდი!`,
            date: new Date(),
            type: 'star',
            status: 'unread',
            feed: `/api/v1/users/${currentUser?._id}/`,
          }
        );
      }
      // const data = await response.data;
    } catch (error) {
      console.error(error);
    }
    setRender(!render);
  };
  // function to unfollow user
  const UnFollowToUser = async (id) => {
    try {
      const url = `https://beautyverse.herokuapp.com/api/v1/users/${currentUser?._id}/followings/${targetUser?._id}`;
      await fetch(url, { method: 'DELETE' })
        .then((response) => response.json())
        .then(async (data) => {})
        .catch((error) => {
          console.log('Error fetching data:', error);
        });
      const url2 = `https://beautyverse.herokuapp.com/api/v1/users/${targetUser?._id}/followers/${followerDefined?.followerId}`;
      await fetch(url2, { method: 'DELETE' })
        .then((response) => response.json())
        .then(async (data) => {})
        .catch((error) => {
          console.log('Error fetching data:', error);
        });

      // const data = await response.data;
    } catch (error) {
      console.error(error);
    }
    setRender(!render);
  };
  setTimeout(() => {
    setLoading(false);
  }, 500);

  return (
    <InfoSide>
      <CoverUploader
        cover="cover"
        targetUser={targetUser}
        loadingProfile={loading}
      />
      <TitleContainer>
        {editUsername ? (
          <Wrapper1>
            <Wrapper2>
              <div
                style={{
                  position: 'fixed',
                  height: '1.5vw',
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <WhiteBorderTextField
                  onChange={(e) => setUsername(e.target.value)}
                  size="small"
                  autoFocus
                  placeholder={`Max. 30 letters`}
                  value={username}
                  sx={{
                    input: { color: theme ? '#fff' : '#151515' },
                    fontSize: '16px',
                    fontWeight: 'bold',
                  }}
                  id="standard-basic"
                  label={`${username?.length} letters`}
                  variant="outlined"
                />
              </div>
            </Wrapper2>
            <ImCheckmark
              className="uploaderIcon"
              color="green"
              onClick={
                username?.length < 31
                  ? () => UpdateUsername()
                  : () => alert('Max length 30 letters')
              }
            />
          </Wrapper1>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {loading ? (
              <TitleLoader />
            ) : (
              <>
                <Type>
                  {targetUser?.username ? targetUser?.username : type}
                </Type>
                {currentUser?._id === targetUser?._id && (
                  <RiEdit2Fill
                    className="editIcon"
                    onClick={() => {
                      setEditUsername(true);
                      setUsername(
                        targetUser?.username?.length > 0
                          ? targetUser?.username
                          : targetUser?.type
                      );
                    }}
                  />
                )}
              </>
            )}
          </div>
        )}
        <Title edit={edit} following={followerDefined?.followerId?.toString()}>
          {edit ? (
            <>
              <Wrapper1>
                <Wrapper2>
                  <div>
                    <WhiteBorderTextField
                      size="small"
                      autoFocus
                      placeholder={`Max. 30 letters`}
                      label={`${editName?.length} letters`}
                      value={editName}
                      sx={{
                        input: { color: theme ? '#fff' : '#151515' },
                        fontSize: '16px',
                        fontWeight: 'bold',
                      }}
                      onChange={(e) => setEditName(e.target.value)}
                      id="standard-basic"
                      variant="outlined"
                    />
                  </div>
                </Wrapper2>
                <ImCheckmark
                  className="uploaderIcon"
                  color="green"
                  onClick={
                    editName?.length < 31 && editName?.length > 1
                      ? () => UpdateName()
                      : () =>
                          alert('Min length 1 letter, Max length 30 letters')
                  }
                />
              </Wrapper1>
            </>
          ) : (
            <>
              {loading ? (
                <TitleLoader />
              ) : (
                <>
                  <div
                    style={{
                      height: '1.5vw',
                      display: 'flex',
                      alignItems: 'center',
                    }}
                  >
                    <h3 style={{ margin: 0 }}>{name}</h3>{' '}
                    {currentUser?._id !== targetUser?._id && (
                      <>
                        {!loading && (
                          <>
                            {followerDefined ? (
                              <ImCheckmark
                                className="followIcon"
                                following="true"
                                onClick={UnFollowToUser}
                              />
                            ) : (
                              <ImCheckmark
                                className="followIcon"
                                onClick={
                                  targetUser
                                    ? FollowToUser
                                    : () => navigate('/login')
                                }
                              />
                            )}
                          </>
                        )}
                      </>
                    )}
                  </div>
                  {currentUser?._id === targetUser?._id && (
                    <RiEdit2Fill
                      className="editIcon"
                      onClick={() => {
                        setEdit(true);
                        setEditName(targetUser?.name);
                      }}
                    />
                  )}
                </>
              )}
            </>
          )}
        </Title>

        {/* {!isMobile && (
          <About>
            {editAbout ? (
              <>
                <Wrapper1>
                  <Wrapper2>
                    <WhiteBorderTextField
                      editAbout={editAbout?.toString()}
                      id="standard-basic"
                      multiline
                      rows={2}
                      autoFocus
                      placeholder={`Max. 100 letters`}
                      label={`${about?.length} letters`}
                      value={about}
                      sx={{
                        inputStyle: { color: theme ? '#fff' : '#151515' },
                        input: { color: theme ? '#fff' : '#151515' },
                        fontSize: '16px',
                        fontWeight: 'normal',
                        background: editAbout ? '#151515' : 'none',
                        width: isMobile ? '100%' : '300px',
                      }}
                      onChange={(e) => setAbout(e.target.value)}
                      variant="outlined"
                    />
                  </Wrapper2>
                </Wrapper1>
                <ImCheckmark
                  className="followIcon"
                  color="green"
                  onClick={about?.length < 101 ? () => UpdateAbout() : () => alert('Max length 100 letters')}
                />
              </>
            ) : (
              <div style={{ display: 'flex' }}>
                <div
                  style={{
                    height: '1.5vw',
                    display: 'flex',
                    alignItems: 'center',
                    whiteSpace: 'normal',
                    width: '100%',
                  }}
                >
                  {targetUser?.about?.length > 0 && (
                    <div
                      style={{
                        margin: 0,
                        whiteSpace: 'normal',
                        lineBreak: 'auto',
                      }}
                    >
                      {targetUser?.about?.length < 1 || targetUser?.about === undefined ? (
                        <span style={{ width: '80px' }}>About you</span>
                      ) : (
                        <span>{targetUser?.about}</span>
                      )}
                    </div>
                  )}
                  {currentUser?._id !== targetUser?._id && (
                    <>
                      {following?.id?.length > 0 ? (
                        <ImCheckmark className="followIcon" following="true" onClick={UnFollowToUser} />
                      ) : (
                        <ImCheckmark
                          className="followIcon"
                          onClick={currentUser != undefined ? FollowToUser : () => navigate('/login')}
                        />
                      )}
                    </>
                  )}
                </div>
                {currentUser?._id === targetUser?._id && (
                  <RiEdit2Fill className="editIcon" onClick={() => setEditAbout(true)} />
                )}
              </div>
            )}
          </About>
        )} */}
      </TitleContainer>

      {loading && !isMobile ? (
        <MapLoader />
      ) : (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1.5vw',
            width: '50%',
            minWidth: '50%',
          }}
        >
          {!isMobile && targetUser?._id === currentUser?._id && (
            <AddAddress
              language={language}
              targetUser={targetUser}
              type="dekstop"
              address={address}
              setAddress={setAddress}
            />
          )}
          {addresses?.length > 1 && !isMobile && (
            <BsArrowLeftCircleFill
              size={24}
              color={'#ccc'}
              style={{
                cursor: currentAddress === 0 ? 'auto' : 'pointer',
                opacity: currentAddress === 0 ? '0.5' : 1,
              }}
              onClick={
                currentAddress !== 0
                  ? () => setCurrentAddress(currentAddress - 1)
                  : undefined
              }
            />
          )}
          <WorkingInfo>
            <div style={{ zIndex: 4 }}>
              <div style={{ position: 'relative', top: '8vw' }}>
                <Map latitude={latitude} longitude={longitude} />
              </div>
            </div>

            <StaticInfo>
              <Location>
                <MdLocationPin className="location" />{' '}
                {editAddress ? (
                  <>
                    <MapAutocomplete language={language} />
                    <GiConfirmed
                      className="confirm"
                      onClick={async (e) => {
                        if (map.country?.length > 0) {
                          e.preventDefault();
                          await UpdateAddress();
                          SetEditAddress(false);
                        } else {
                          alert('Add address..');
                        }
                      }}
                    />
                  </>
                ) : (
                  <>
                    {addressDefined}
                    <>
                      {currentUser?._id === targetUser?._id && (
                        // currentAddress === 0 && (
                        <FiEdit
                          className="edit"
                          onClick={() => {
                            SetEditAddress(true);
                          }}
                        />
                      )}
                    </>
                  </>
                )}
              </Location>
            </StaticInfo>
          </WorkingInfo>
          {addresses?.length > 1 && !isMobile && (
            <BsArrowRightCircleFill
              size={24}
              color={'#ccc'}
              style={{
                cursor:
                  currentAddress < addresses?.length - 1 ? 'pointer' : 'auto',
                opacity: currentAddress < addresses?.length - 1 ? 1 : 0.5,
              }}
              onClick={
                currentAddress < addresses?.length - 1
                  ? () => setCurrentAddress(currentAddress + 1)
                  : false
              }
            />
          )}
        </div>
      )}
    </InfoSide>
  );
});

export default CoverSection;

const InfoSide = styled.div`
  width: 70%;
  box-shadow: 0 0.1vw 0.3vw ${(props) => props.theme.shadowColor};
  border-radius: 0 0 5px 5px;
  padding: 15px;
  display: flex;
  align-items: center;
  justify-content: start;
  box-sizing: border-box;

  @media only screen and (max-width: 600px) {
    width: 100%;
    padding: 0 4vw;
  }
`;

const AddImg = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 15vw;
  height: 15vw;
  border: 0.25vw solid #fff;
  border-radius: 0.5vw;

  @media only screen and (max-width: 600px) {
    width: 22vw;
    height: 22vw;
    border-radius: 50vw;
    position: relative;
  }

  .uploaderIcon {
    font-size: 5vw;
    color: ${(props) => props.theme.disabled};
    position: relative;
    left: 5vw;

    @media only screen and (max-width: 600px) {
      font-size: 5vw;
    }
  }
`;

const TitleContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: start;
  justify-content: center;
  padding-left: 2vw;
  width: 30vw;
  white-space: nowrap;
  max-width: 60vw;
  min-height: 130px;

  @media only screen and (max-width: 600px) {
    justify-content: center;
    min-width: auto;
    width: auto;
    height: auto;
    padding-left: 6vw;
  }

  .editIcon {
    font-size: 1.1vw;
    color: ${(props) => (props.following > 0 ? '#2bdfd9' : '#ddd')};
    margin-left: 0.5vw;
    cursor: pointer;

    @media only screen and (max-width: 600px) {
      font-size: 3.5vw;
      margin-left: 15px;
    }
  }
`;

const Title = styled.h2`
  font-size: 18px;
  font-weight: bold;
  letter-spacing: 0.03vw;
  margin: 10px 0 0 0;
  height: 1.5vw;
  display: flex;
  align-items: center;
  justify-content: start;
  gap: 0.5vw;
  width: 100%;
  color: ${(props) => props.theme.font};
  transition: ease 200ms;

  @media only screen and (max-width: 600px) {
    font-size: 16px;
    margin: 20px 0 0 0;
    gap: 15px;
    letter-spacing: 0.2vw;
  }

  .editIcon {
    font-size: 1.1vw;
    color: ${(props) => (props.following > 0 ? '#2bdfd9' : '#ddd')};
    margin-left: 0.5vw;
    cursor: pointer;

    @media only screen and (max-width: 600px) {
      font-size: 4.5vw;
    }
  }

  .followIcon {
    font-size: 1.1vw;
    color: ${(props) => (props.following ? '#2bdfd9' : '#ddd')};
    margin-left: 0.5vw;
    cursor: pointer;

    @media only screen and (max-width: 600px) {
      font-size: 4.5vw;
      margin-left: 15px;
    }
  }
`;

const Wrapper1 = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;

  .uploaderIcon {
    font-size: 1vw;
    color: color: ${(props) => props.theme.disabled};
    cursor: pointer;

    @media only screen and (max-width: 600px) {
      font-size: 5vw;
    }
  }
`;
const Wrapper2 = styled.div`
  width: 350px;
  height: 1.5vw;

  @media only screen and (max-width: 600px) {
    width: 60vw;
  }
`;

const WhiteBorderTextField = styled(TextField)`
  & label.Mui-focused {
    color: ${(props) => props.theme.font};
  }
  & .MuiOutlinedInput-root {
    color: ${(props) => props.theme.font};
    &.Mui-focused fieldset {
      width: 300px;
      @media only screen and (max-width: 600px) {
        width: 55vw;
      }
      border-color: ${(props) => props.theme.secondLevel};
    }
  }
  & multilineccolor: {
    color: red;
  }
`;

const Name = styled.h2`
  font-size: 18px;
  font-weight: bold;
  border: none;
  background: none;
  width: auto;
  max-width: 15vw;
  height: 1.5vw;
  margin: 0;
  overflow: hidden;
  cursor: pointer;
  display: flex;
  align-items: center;

  @media only screen and (max-width: 600px) {
    font-size: 16px;
  }
`;

const Type = styled.p`
  color: ${(props) => props.theme.font};
  font-size: 14px;
  font-weight: bold;
  letter-spacing: 0.03vw;
  height: 1.5vw;
  margin: 0;
  display: flex;
  align-items: center;
`;

const About = styled.div`
  margin: 1vw 0 0 0;
  width: 400px;
  height: auto;
  white-space: normal;
  color: ${(props) => props.theme.font};
  font-size: 14px;
  font-weight: normal;
  letter-spacing: 0.03vw;
  gap: 10px;
  display: flex;
  justify-content: start;
  align-items: start;

  .editIcon {
    font-size: 1.1vw;
    color: ${(props) => (props.following > 0 ? '#2bdfd9' : '#ddd')};
    margin-left: 0.5vw;
    cursor: pointer;

    @media only screen and (max-width: 600px) {
      font-size: 3.5vw;
      margin-left: 15px;
    }
  }

  @media only screen and (max-width: 600px) {
    width: 68vw;
    margin-top: 5vw;
  }
`;

const WorkingInfo = styled.div`
  display: flex;
  flex-direction: column;
  align-items: start;
  justify-content: flex-end;
  width: 100%;
  height: 190px;
  box-shadow: 0 0.1vw 0.3vw rgba(2, 2, 2, 0.1);
  overflow: hidden;
  border-radius: 0.5vw;
  z-index: 9;
  gap: 15px;

  @media only screen and (max-width: 600px) {
    font-size: 14px;
    letter-spacing: 0.1vw;
    display: none;
  }

  .workingInfoIcon {
    font-size: 15px;

    @media only screen and (max-width: 600px) {
      font-size: 14px;
      letter-spacing: 0.1vw;
    }
  }
`;

const StaticInfo = styled.div`
  z-index: 5;
  background: rgba(255, 255, 255, 0.9);
  padding: 1vw;
  margin: 0 0 0.5vw 0.5vw;
  border-radius: 0.5vw;
  display: flex;
  flex-direction: column;
  align-items: start;
  justify-content: start;
  gap: 0.5vw;

  @media only screen and (max-width: 600px) {
    display: none;
  }
`;

const Location = styled.div`
  color: #444;
  font-size: 14px;
  letter-spacing: 0.03vw;
  display: flex;
  align-items: center;
  justify-content: start;
  gap: 0.25vw;
  text-align: end;

  .location {
    color: red;
  }

  .confirm {
    color: green;
    cursor: pointer;
  }
  .edit {
    color: orange;
    cursor: pointer;
  }
`;
