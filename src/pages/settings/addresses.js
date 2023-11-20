import React, { useEffect, useState } from 'react';
import {
  IoMdArrowDropdown,
  IoMdArrowDropleft,
  IoMdArrowDropright,
} from 'react-icons/io';
import { useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import GoogleMap from '../user/components/googleMap';
import { MapAutoComplete } from '../authentication/mapAutocomplete';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { Button } from '@mui/material';
import { BounceLoader } from 'react-spinners';
import { setCurrentUser } from '../../redux/user';
import { MdDelete } from 'react-icons/md';
import { FaMapMarkedAlt } from 'react-icons/fa';
import SimpleBackdrop from '../../components/backDrop';
import { Language } from '../../context/language';

export const Addresses = ({ activePage, setActivePage, currentUser }) => {
  // navigate
  const navigate = useNavigate();
  // location
  const location = useLocation();
  // dispatch
  const dispatch = useDispatch();
  // language
  const language = Language();

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

  /**
   * New address state
   */
  const [address, setAddress] = useState(null);
  const [sendingLoading, setSendingLoading] = useState(false);

  // backend url
  const backendUrl = useSelector((state) => state.storeApp.backendUrl);

  // add address
  const Add = async () => {
    if (!address.street) {
      return alert(
        // active: true,
        // language?.language?.Auth?.auth?.wrongAddress
        'Address not defined!'
        // type: 'error',
      );
    }
    setSendingLoading(true);
    const newAddress = {
      country: address.country,
      region: address.region,
      city: address.city && address.city,
      district: address.district && address.district,
      street: address.street && address.street,
      number: address.streetNumber && address.streetNumber,
      latitude: address.latitude,
      longitude: address.longitude,
    };

    try {
      const response = await axios.post(
        `${backendUrl}/api/v1/users/${currentUser?._id}/address`,
        newAddress
      );

      const updatedUser = {
        ...currentUser,
        address: [...currentUser.address, response.data.data.address],
      };
      dispatch(setCurrentUser(updatedUser));
      setAddress(null);
      setTimeout(() => {
        setSendingLoading(false);
      }, 200);
    } catch (error) {
      console.log(error.response);
      alert(error.response.data.message);
      setSendingLoading(false);
    }
  };

  // delete confirm state
  const [confirm, setConfirm] = useState(false);

  const DeleteAddress = async (id) => {
    try {
      const updatedAddresses = currentUser.address.filter(
        (address) => address._id !== id
      );
      dispatch(setCurrentUser({ ...currentUser, address: updatedAddresses }));
      const url = `${backendUrl}/api/v1/users/${currentUser._id}/address/${id}`;
      await axios.delete(url);
    } catch (error) {
      console.log('Error fetching data:', error);
    }
  };

  // make address main
  const [changeLoading, setChangeLoading] = useState(false);
  const ChangeAddresToMain = async (addressId) => {
    setChangeLoading(true);
    // Construct the new address array with the main address first
    const mainAddress = currentUser.address.find((a) => a._id === addressId);
    const otherAddresses = currentUser.address.filter(
      (a) => a._id !== addressId
    );
    const updatedAddresses = [mainAddress, ...otherAddresses];
    const updatedUser = {
      ...currentUser,
      address: updatedAddresses,
    };

    try {
      await axios.patch(
        `${backendUrl}/api/v1/users/${currentUser?._id}`,
        updatedUser
      );
      dispatch(setCurrentUser(updatedUser));
      setTimeout(() => {
        setChangeLoading(false);
      }, 200);
    } catch (error) {
      console.log(error.response);
      alert(error.response.data.message);
      setChangeLoading(false);
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
      <SimpleBackdrop open={changeLoading} />
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
              {language?.language?.User?.userPage?.addresses}
            </h3>
          </div>
          <div style={{ width: '40px' }}></div>
        </Header>
        <ContentList>
          <div
            style={{ width: '100%', display: 'flex', justifyContent: 'center' }}
          >
            <MapAutoComplete
              address={address}
              setAddress={setAddress}
              width="90vw"
            />
          </div>
          {address && (
            <Button
              variant="contained"
              style={{
                backgroundColor: sendingLoading ? '#ccc' : '#f866b1',
                color: 'white',
              }}
              className="button"
              sx={{
                width: '40%',
                borderRadius: '50px',

                height: '40px',
              }}
              onClick={Add}
              //   {...props}
            >
              {sendingLoading ? (
                <BounceLoader
                  color={'#f866b1'}
                  loading={sendingLoading}
                  size={20}
                />
              ) : (
                'Add address'
              )}
            </Button>
          )}
          {currentUser?.address?.map((item, index) => {
            return (
              <div
                onClick={
                  index !== 0 ? () => ChangeAddresToMain(item._id) : undefined
                }
                key={index}
                style={{
                  color: '#ccc',
                  width: '85%',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '30px',
                  height: '130px',
                  border: `1.5px solid ${
                    index === 0 ? '#f866b1' : 'rgba(255,255,255,0.1)'
                  }`,
                  borderRadius: '15px',
                  padding: '0 5% 0 10%',
                }}
              >
                {index === 0 && (
                  <div
                    style={{
                      position: 'absolute',
                      left: '30px',
                      color: '#f866b1',
                      margin: '0 0 90px 0',
                      fontWeight: 'bold',
                    }}
                    onClick={() => setConfirm({ active: true, item: item._id })}
                  >
                    Main
                  </div>
                )}
                {confirm.item !== item._id &&
                  currentUser?.address?.length > 1 && (
                    <div
                      style={{ position: 'absolute', right: '30px' }}
                      onClick={() =>
                        setConfirm({ active: true, item: item._id })
                      }
                    >
                      <MdDelete color="red" size={20} />
                    </div>
                  )}
                {/* <GoogleMap
                  address={item}
                  mapStyles={{
                    height: '120px',
                    width: '35%',
                    borderRadius: '15px',
                  }}
                /> */}
                <FaMapMarkedAlt size={50} color="#ccc" />
                {confirm.active && confirm.item === item._id ? (
                  <div
                    style={{
                      width: '70%',
                      display: 'flex',
                      justifyContent: 'center',
                      gap: '10%',
                      alignItems: 'center',
                      letterSpacing: '0.5px',
                      fontWeight: 600,
                    }}
                  >
                    <div
                      style={{ color: '#888' }}
                      onClick={() => setConfirm({ active: false, item: null })}
                    >
                      Cancel
                    </div>
                    <div
                      style={{ color: '#f866b1' }}
                      onClick={() => DeleteAddress(item?._id)}
                    >
                      Delete
                    </div>
                  </div>
                ) : (
                  <div
                    style={{
                      width: '70%',
                      padding: '10px 0',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '4px',
                      fontSize: '14px',
                      fontWeight: 500,
                      color: '#f866b1',
                      letterSpacing: '0.5px',
                      fontStyle: 'italic',
                    }}
                  >
                    {item.country && (
                      <span style={{ color: '#ccc' }}>{item.country}</span>
                    )}
                    {item.region && (
                      <span style={{ color: '#ccc' }}>{item.region}</span>
                    )}
                    {item.city && (
                      <span style={{ color: '#ccc' }}>
                        {item.city?.replace("'", '')}
                      </span>
                    )}
                    {item.district && <span>{item.district}</span>}
                    {item.street && (
                      <span>
                        {item.street}{' '}
                        {item.number && <span>N{item.number}</span>}
                      </span>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </ContentList>
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
  gap: 15px;
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
  align-items: center;
  gap: 10px;
  border-radius: 10px;
  padding: 10px 10px 20px 10px;
  background: rgba(1, 2, 12, 0.2);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1.5px solid rgba(255, 255, 255, 0.05);
`;
