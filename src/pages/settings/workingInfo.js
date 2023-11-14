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
import { WDOptions } from './wdOptions';

export const WorkingInfo = ({ activePage, setActivePage, currentUser }) => {
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

  // backend url
  const backendUrl = useSelector((state) => state.storeApp.backendUrl);

  /**
   * Working days state
   */

  let wds =
    currentUser?.workingDays?.length > 0 ? [...currentUser?.workingDays] : [];
  const [workingDays, setWorkingDays] = useState(wds);
  function arraysEqual(a, b) {
    if (a.length !== b.length) return false;
    for (let i = 0; i < a.length; i++) {
      if (a[i] !== b[i]) return false;
    }
    return true;
  }

  let equals = arraysEqual(wds, workingDays);

  // // make address main
  const [changeLoading, setChangeLoading] = useState(false);
  const UpdateUser = async (field, value) => {
    setChangeLoading(true);
    const updatedUser = {
      ...currentUser,
      [field]: value,
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
              Working Info
            </h3>
          </div>
          <div style={{ width: '40px' }}></div>
        </Header>
        <ContentList>
          <h4 style={{ color: '#ccc', letterSpacing: '0.5px' }}>
            Working Days & Hours
          </h4>
          <WDOptions value={workingDays} setValue={setWorkingDays} />

          {!equals && (
            <Button
              variant="contained"
              style={{
                backgroundColor: changeLoading ? '#ccc' : '#f866b1',
                color: 'white',
              }}
              className="button"
              sx={{
                width: equals ? '0' : '40%',
                borderRadius: '50px',
                transition: 'ease-in-out 200ms',
                transform: `scale(${equals ? 0 : 1})`,
                opacity: equals ? 0 : 1,
                height: equals ? '0' : '40px',
                margin: equals ? '0' : '10px 0 0 0',
              }}
              onClick={() => UpdateUser('workingDays', workingDays)}
            >
              Save
            </Button>
          )}

          <h4 style={{ color: '#ccc', letterSpacing: '0.5px' }}>Currency</h4>
          <Currency>
            <div
              style={{
                padding: '8px 16px',
                borderRadius: '50px',
                border: `2px solid rgba(255,255,255,0.1)`,
                color: currentUser?.currency === 'Dollar' ? '#f866b1' : '#ccc',
                minWidth: '60px',
                fontWeight: 'bold',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                cursor: 'pointer',
              }}
              onClick={() => UpdateUser('currency', 'Dollar')}
            >
              $ Dollar
            </div>
            <div
              style={{
                padding: '8px 16px',
                borderRadius: '50px',
                border: `2px solid rgba(255,255,255,0.1)`,
                color: currentUser?.currency === 'Lari' ? '#f866b1' : '#ccc',
                minWidth: '60px',
                fontWeight: 'bold',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                cursor: 'pointer',
              }}
              onClick={() => UpdateUser('currency', 'Lari')}
            >
              ₾ Lari
            </div>
            <div
              style={{
                padding: '8px 16px',
                borderRadius: '50px',
                border: `2px solid rgba(255,255,255,0.1)`,
                color: currentUser?.currency === 'Euro' ? '#f866b1' : '#ccc',
                minWidth: '60px',
                fontWeight: 'bold',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                cursor: 'pointer',
              }}
              onClick={() => UpdateUser('currency', 'Euro')}
            >
              € Euro
            </div>
          </Currency>
        </ContentList>
      </Container>
    </div>
  );
};

const Container = styled.div`
  width: 100vw;
  height: 100%;
  padding: 0 0 2.5vw 0;
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
  align-items: center;
  gap: 10px;
  border-radius: 10px;
  padding: 10px 10px 40px 10px;
  background: rgba(1, 2, 12, 0.2);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1.5px solid rgba(255, 255, 255, 0.05);
`;

const Currency = styled.div`
  width: 50%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  margin: 0 0 30px 0;
`;
