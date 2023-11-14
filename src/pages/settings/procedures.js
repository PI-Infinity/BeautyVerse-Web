import { Button } from '@mui/material';
import React, { useEffect, useState } from 'react';
import {
  IoMdArrowDropleft,
  IoMdArrowDropright,
  IoMdClock,
  IoMdClose,
} from 'react-icons/io';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import { BounceLoader } from 'react-spinners';
import styled from 'styled-components';
import SimpleBackdrop from '../../components/backDrop';
import { ProceduresOptions } from '../../datas/registerDatas';
import {
  MdClose,
  MdLockClock,
  MdMonetizationOn,
  MdMoney,
  MdPunchClock,
} from 'react-icons/md';
import { ServicesOptions } from '../authentication/servicesOptions';
import { DurationPicker } from './durationPicker';
import axios from 'axios';
import { setCurrentUser } from '../../redux/user';
import { PricePicker } from './PricePicker';

export const Procedures = ({ activePage, setActivePage, currentUser }) => {
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

  // all app procedures
  const proceduresList = ProceduresOptions();

  /**
   * New services state
   */
  const [procedures, setProcedures] = useState([...currentUser?.procedures]);
  function arraysEqual(a, b) {
    if (a.length !== b.length) return false;
    for (let i = 0; i < a.length; i++) {
      if (a[i] !== b[i]) return false;
    }
    return true;
  }

  let equals = arraysEqual(currentUser?.procedures, procedures);
  const [sendingLoading, setSendingLoading] = useState(false);

  // backend url
  const backendUrl = useSelector((state) => state.storeApp.backendUrl);
  const UpdateUser = async (field, value) => {
    setSendingLoading(true);
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
        setSendingLoading(false);
      }, 200);
    } catch (error) {
      console.log(error.response);
      alert(error.response.data.message);
      setSendingLoading(false);
    }
  };

  //duration
  const [duration, setDuration] = useState(false);
  //price
  const [price, setPrice] = useState(false);

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
      <SimpleBackdrop open={sendingLoading} />
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
              Procedures
            </h3>
          </div>
          <div style={{ width: '40px' }}></div>
        </Header>
        <ContentList>
          <ServicesOptions
            value={procedures}
            setValue={setProcedures}
            from="settings"
          />
          <div
            style={{
              width: '100%',
              boxSizing: 'border-box',
              padding: '5px',
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
            }}
          >
            {procedures?.map((item, index) => {
              let label = proceduresList?.find(
                (i) => i.value === item.value
              ).label;
              return (
                <div
                  key={index}
                  style={{
                    width: '91%',
                    maxWidth: '100%',
                    borderRadius: '20px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    border: '1.5px solid rgba(255,255,255,0.1)',
                    padding: '8px 4%',
                    color: '#ccc',
                    letterSpacing: '0.5px',
                    fontWeight: '500',
                    fontSize: '14px',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <span>{label}</span>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '15px',
                      }}
                    >
                      {procedures?.length > 1 && (
                        <IoMdClose
                          color="red"
                          size={20}
                          onClick={() =>
                            setProcedures((prev) =>
                              prev?.filter((i) => i.value !== item.value)
                            )
                          }
                        />
                      )}
                    </div>
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '5px',
                      background: 'rgba(255,255,255,0.1)',
                      borderRadius: '50px',
                      margin: '8px 0 4px 0',
                      boxSizing: 'border-box',
                      padding: '5px 10px',
                      gap: '25px',
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '5px',
                      }}
                    >
                      {item?.duration ? (
                        <span
                          onClick={() =>
                            setDuration({ active: true, item: item })
                          }
                        >
                          <span>Duration: </span>
                          <span style={{ color: '#f866b1' }}>
                            {item.duration < 60
                              ? item.duration + ' min.'
                              : item.duration >= 60
                              ? Math.floor(item.duration / 60) +
                                'h' +
                                (item.duration % 60 > 0
                                  ? ' ' + (item.duration % 60) + ' min.'
                                  : '')
                              : '0h'}
                          </span>
                        </span>
                      ) : (
                        <IoMdClock
                          color="#ccc"
                          size={16}
                          onClick={() =>
                            setDuration({ active: true, item: item })
                          }
                        />
                      )}
                    </div>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                      }}
                    >
                      {item?.price ? (
                        <span
                          onClick={() => setPrice({ active: true, item: item })}
                        >
                          Price:{' '}
                          <span style={{ color: '#f866b1' }}>
                            {item.price}{' '}
                            {currentUser?.currency && (
                              <>
                                {currentUser?.currency === 'Dollar'
                                  ? '$'
                                  : currentUser?.currency === 'Euro'
                                  ? '€'
                                  : '₾'}
                              </>
                            )}
                          </span>
                        </span>
                      ) : (
                        <MdMonetizationOn
                          color="green"
                          size={16}
                          onClick={() => setPrice({ active: true, item: item })}
                        />
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          {!equals && (
            <Button
              variant="contained"
              style={{
                backgroundColor: sendingLoading ? '#ccc' : '#f866b1',
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
                cursor: 'pointer',
              }}
              onClick={() => UpdateUser('procedures', procedures)}
            >
              Save
            </Button>
          )}
        </ContentList>
      </Container>
      {duration.active && (
        <DurationPicker
          value={procedures}
          setValue={setProcedures}
          setDuration={setDuration}
          duration={duration}
        />
      )}
      {price.active && (
        <PricePicker
          value={procedures}
          setValue={setProcedures}
          setPrice={setPrice}
          price={price}
        />
      )}
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
  align-items: center;
  gap: 10px;
  border-radius: 10px;
  padding: 10px 10px 20px 10px;
  background: rgba(1, 2, 12, 0.2);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1.5px solid rgba(255, 255, 255, 0.05);
`;
