import React, { useState } from 'react';
import styled from 'styled-components';
import { Links } from '../../pages/user/links';
import { useSelector, useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import AddressAutocomplete from '../../components/addresAutocomplete';
import Map from '../../components/map';
import useWindowDimensions from '../../functions/dimensions';
import { GiConfirmed } from 'react-icons/gi';
import { FiEdit } from 'react-icons/fi';
import { MdLocationPin } from 'react-icons/md';
import { useOutletContext } from 'react-router-dom';
import { BsArrowRightCircleFill, BsArrowLeftCircleFill } from 'react-icons/bs';
import AddAddress from '../../pages/user/addAddressPopup';
import { setAddress } from '../../redux/register';
import { Spinner } from '../../components/loader';
import axios from 'axios';
import { setRerenderCurrentUser } from '../../redux/rerenders';
import Button from '@mui/material/Button';
import { BiLocationPlus } from 'react-icons/bi';

export const Contact = () => {
  const [targetUser, language] = useOutletContext();
  const [loading, setLoading] = useState(true);
  // get user by params id
  const { Id } = useParams();
  const { height, width } = useWindowDimensions();

  const dispatch = useDispatch();

  // import users
  const users = useSelector((state) => state.storeMain.userList);

  const userVis = users?.find((item) => item.id === Id);

  const currentUser = JSON.parse(
    localStorage.getItem('Beautyverse:currentUser')
  );

  // edit address
  const map = useSelector((state) => state.storeRegister.map);
  const [editAddress, SetEditAddress] = React.useState('');
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
  if (targetUser?.address !== undefined) {
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
      const response = await axios.patch(
        `https://beautyverse.herokuapp.com/api/v1/users/${targetUser?._id}/address/${targetUser?.address[currentAddress]._id}`,
        {
          country: map.country,
          region: map.region,
          city: map.city,
          district: map.district,
          street: map.street,
          number: map.number,
          latitude: map.latitude,
          longitude: map.longitude,
        }
      );
      const data = await response.data;
      dispatch(setRerenderCurrentUser());
      SetEditAddress(false);
    } catch (error) {
      console.error(error);
    }
  };

  // open add addresses
  const [openAddresses, setOpenAddresses] = React.useState(false);

  setTimeout(() => {
    setLoading(false);
  }, 300);

  return (
    <>
      {loading ? (
        <Container
          height={height}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Spinner />
        </Container>
      ) : (
        <Container style={{ padding: '3vw 0' }} height={height}>
          <Links targetUser={targetUser} />
          <span
            style={{
              fontWeight: 'bold',
              display: 'flex',
              alignItems: 'center',
              gap: '50px',
            }}
          >
            {/* <BsArrowLeftCircleFill /> */}
            {language?.language.User.userPage.address}:
            {/* <BsArrowRightCircleFill /> */}
          </span>
          <>
            {
              <>
                {editAddress ? (
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'start',
                      gap: '5px',
                      width: '80%',
                    }}
                  >
                    <AddressAutocomplete
                      language={language}
                      userMobile="true"
                      address={address}
                      setAddress={setAddress}
                    />
                    <GiConfirmed
                      className="confirm"
                      onClick={
                        map?.country?.length > 0
                          ? async (e) => {
                              e.preventDefault();
                              await UpdateAddress();
                              SetEditAddress(false);
                            }
                          : () => SetEditAddress(false)
                      }
                    />
                  </div>
                ) : (
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '5px',
                      fontSize: '12px',
                    }}
                  >
                    <MdLocationPin className="location" />
                    {addressDefined}
                    {currentUser?._id === targetUser?._id && (
                      <FiEdit
                        className="edit"
                        onClick={() => {
                          SetEditAddress(true);
                        }}
                      />
                    )}
                  </div>
                )}

                <div>
                  <Map latitude={latitude} longitude={longitude} />
                </div>
                <div
                  style={{
                    display: 'flex',
                    width: '100%',
                    alignItems: 'center',
                    justifyContent: 'space-evenly',
                  }}
                >
                  <div>
                    {addresses?.length > 1 && (
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
                            : false
                        }
                      />
                    )}
                  </div>
                  {targetUser?._id === currentUser?._id && (
                    <Button>
                      <BiLocationPlus
                        color="orange"
                        size={28}
                        onClick={() => setOpenAddresses(true)}
                      />
                    </Button>
                  )}
                  {openAddresses && targetUser?._id === currentUser?._id && (
                    <AddAddress
                      language={language}
                      targetUser={targetUser}
                      address={address}
                      setAddress={setAddress}
                      type="true"
                      setOpenAddresses={setOpenAddresses}
                    />
                  )}
                  <div>
                    {addresses?.length > 1 && (
                      <BsArrowRightCircleFill
                        size={24}
                        color={'#ccc'}
                        style={{
                          cursor:
                            currentAddress < addresses?.length - 1
                              ? 'pointer'
                              : 'auto',
                          opacity:
                            currentAddress < addresses?.length - 1 ? 1 : 0.5,
                        }}
                        onClick={
                          currentAddress < addresses?.length - 1
                            ? () => setCurrentAddress(currentAddress + 1)
                            : undefined
                        }
                      />
                    )}
                  </div>
                </div>
              </>
            }
          </>
        </Container>
      )}
    </>
  );
};

const Container = styled.div`
  display: none;

  @media only screen and (max-width: 600px) {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 5vw;
    overflow-x: hidden;
    overflow-y: scroll;
    height: auto;

    width: 100%;
    color: ${(props) => props.theme.font};
  }

  .location {
    color: red;
    font-size: 4vw;
  }

  .confirm {
    color: green;
    cursor: pointer;
    font-size: 5vw;
    position: relative;
    top: 2vw;
  }
  .edit {
    color: orange;
    cursor: pointer;
    font-size: 4vw;
  }
`;
