import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { BsListCheck } from 'react-icons/bs';
import { MdDone } from 'react-icons/md';
import { VerseCategories } from '../../../datas/categories';
import { useDispatch, useSelector } from 'react-redux';
import {
  setBeautyCenter,
  setCategoryFilter,
  setCity,
  setDistrict,
  setShop,
  setSpecialist,
} from '../../../redux/cards';
import axios from 'axios';
import { BounceLoader } from 'react-spinners';
import { MdChecklistRtl } from 'react-icons/md';
import { FiType } from 'react-icons/fi';
import { GiModernCity, GiVillage } from 'react-icons/gi';
import {
  FormControl,
  FormControlLabel,
  FormGroup,
  IconButton,
  Radio,
  RadioGroup,
} from '@mui/material';
import Checkbox from '@mui/material/Checkbox';
import DeleteIcon from '@mui/icons-material/Delete';
import { Language } from '../../../context/language';

export const Filter = ({ setFilter, filter }) => {
  // redux dispatch
  const dispatch = useDispatch();

  // language
  const language = Language();
  const lang = useSelector((state) => state.storeApp.language);

  // category filter
  const categoryFilter = useSelector(
    (state) => state.storeCards.categoryFilter
  );

  // backend url
  const backendUrl = useSelector((state) => state.storeApp.backendUrl);

  // location filters
  const activeCity = useSelector((state) => state.storeCards.city);
  const district = useSelector((state) => state.storeCards.district);
  const specialist = useSelector((state) => state.storeCards.specialist);
  const beautyCenter = useSelector((state) => state.storeCards.beautyCenter);
  const shop = useSelector((state) => state.storeCards.shop);

  // define active cities in BeautyVerse
  const [cities, setCities] = useState([]);

  // get cities from db function
  async function GetCities() {
    await fetch(`${backendUrl}/api/v1/cities?country=Georgia`)
      .then((response) => response.json())
      .then((data) => {
        setCities([...data.data.cities]);
      })
      .then(() => {})
      .catch((error) => {
        console.log('Error fetching data:', error);
      });
  }

  useEffect(() => {
    GetCities();
  }, []);

  // define BeautyVerse's active districts by city
  const [loadDistricts, setLoadDistricts] = useState(false);

  const [districts, setDistricts] = useState([]);

  async function GetDistricts() {
    try {
      const response = await axios.get(
        `${backendUrl}/api/v1/districts?city=${activeCity}`
      );
      if (response.data.data.districts?.length > 0) {
        setLoadDistricts(true);
        setDistricts([...response.data.data.districts]);
      } else {
        setDistricts([]);
        dispatch(setDistrict(''));
      }
      setTimeout(() => {
        setLoadDistricts(false);
      }, 500);
    } catch (error) {
      console.log(error.response.data.message);
    }
  }

  useEffect(() => {
    if (activeCity) {
      GetDistricts();
    }
  }, [activeCity]);

  let filterBadge;
  if (categoryFilter !== '') {
    filterBadge = 1;
  } else {
    filterBadge = 0;
  }
  // city state
  let cityBadge;
  if (activeCity?.length > 0) {
    cityBadge = 1;
  } else {
    cityBadge = 0;
  }

  // district state
  let districtBadge;
  if (district !== '') {
    districtBadge = 1;
  } else {
    districtBadge = 0;
  }
  // specialist state
  let specialistBadge;
  if (!specialist) {
    specialistBadge = 1;
  } else {
    specialistBadge = 0;
  }
  // salon state
  let objectBadge;
  if (!beautyCenter) {
    objectBadge = 1;
  } else {
    objectBadge = 0;
  }
  // salon state
  let shopBadge;
  if (!shop) {
    shopBadge = 1;
  } else {
    shopBadge = 0;
  }
  // total of active variants of filter and creating total of badge
  const sum =
    filterBadge +
    cityBadge +
    districtBadge +
    specialistBadge +
    objectBadge +
    shopBadge;

  return (
    <div style={{ width: '100%' }}>
      {filter && (
        <div
          style={{
            width: '100%',
            height: '100%',
            position: 'fixed',
            top: '0',
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
            background: 'rgba(0, 0, 0, 0.2)',
          }}
        />
      )}
      <Container filter={filter ? 'true' : 'false'}>
        <div
          onClick={() => setFilter(!filter)}
          style={{
            width: '100%',
            height: '60px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'flex-end',
            background: 'linear-gradient(180deg, rgba(0,0,0,0), rgba(0,0,0,1))',
            borderBottom: '2px solid #f866b1',
            position: 'relative',
            bottom: '62px',
          }}
        >
          <div
            style={{
              width: '35px',
              height: '30px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: '#f866b1',
              borderRadius: '5px 5px 0 0',
              border: '1.5px solid rgba(255,255,255,0.3)',
              position: 'relative',
              top: '2px',
              zIndex: '-1px',
            }}
          >
            {sum > 0 && (
              <div
                style={{
                  backgroundColor: '#f866b1',
                  position: 'absolute',
                  zIndex: 1,
                  top: '-5px',
                  right: '-5px',
                  borderRadius: '50px',
                  width: '17px',
                  height: '17px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '12px',
                  fontWeight: 'bold',
                  border: '2.5px solid #fff',
                  color: '#000',
                }}
              >
                {sum}
              </div>
            )}

            <BsListCheck color="#ccc" size={24} />
          </div>
        </div>

        <div
          style={{
            width: '100%',
            height: '100%',
            boxSizing: 'border-box',
            padding: '15px',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            overflowY: 'scroll',
            position: 'absolute',
            top: '15px',
            zIndex: 100,
            paddingBottom: '100px',
          }}
        >
          {sum > 0 && (
            <div
              onClick={() => {
                dispatch(setCategoryFilter(''));
                dispatch(setCity(''));
                dispatch(setDistrict(''));
                dispatch(setSpecialist(true));
                dispatch(setBeautyCenter(true));
                dispatch(setShop(true));
              }}
              style={{
                display: 'flex',
                justifyContent: 'flex-end',
                color: 'red',
                letterSpacing: '0.5px',
                position: 'absolute',
                top: '25px',
                right: '25px',
                borderRadius: '50px',
                fontWeight: '500',
                background: 'rgba(255,255,255,0.1)',
                padding: '5px 10px',
              }}
            >
              {language?.language?.Main?.filter?.clear}
            </div>
          )}
          <div
            style={{
              width: '100%',
              boxSizing: 'border-box',
              background: 'rgba(255,255,255,0.05)',
              borderRadius: '10px',
              padding: '8px 15px 25px 15px',
              display: 'flex',
              flexDirection: 'column',
              gap: '15px',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <FiType size={20} color="#ccc" />

              <h4
                style={{
                  color: '#ccc',
                  margin: '10px 4px',
                  padding: 0,
                  letterSpacing: '0.5px',
                }}
              >
                {language?.language?.Marketplace?.marketplace?.type}:
              </h4>
            </div>

            <FormGroup>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={specialist}
                    onChange={
                      specialist
                        ? () => dispatch(setSpecialist(false))
                        : () => dispatch(setSpecialist(true))
                    }
                    sx={{
                      color: '#f866b1',
                      '&.Mui-checked': {
                        color: '#f866b1',
                      },
                    }}
                  />
                }
                label={language?.language?.Main?.filter?.specialist}
                sx={{
                  color: '#ccc',
                  letterSpacing: '0.5px',
                  '&.Mui-checked': {
                    color: '#ccc',
                    letterSpacing: '0.5px',
                  },
                }}
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={beautyCenter}
                    onChange={
                      beautyCenter
                        ? () => dispatch(setBeautyCenter(false))
                        : () => dispatch(setBeautyCenter(true))
                    }
                    sx={{
                      color: '#f866b1',
                      '&.Mui-checked': {
                        color: '#f866b1',
                      },
                    }}
                  />
                }
                label={language?.language?.Main?.filter?.beautySalon}
                sx={{
                  color: '#ccc',
                  '&.Mui-checked': {
                    color: '#ccc',
                  },
                }}
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={shop}
                    onChange={
                      shop
                        ? () => dispatch(setShop(false))
                        : () => dispatch(setShop(true))
                    }
                    sx={{
                      color: '#f866b1',
                      '&.Mui-checked': {
                        color: '#f866b1',
                      },
                    }}
                  />
                }
                label={language?.language?.Main?.filter?.shop}
                sx={{
                  color: '#ccc',
                  '&.Mui-checked': {
                    color: '#ccc',
                  },
                }}
              />
            </FormGroup>
          </div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              paddingLeft: '15px',
            }}
          >
            <MdChecklistRtl size={20} color="#ccc" />

            <h4
              style={{
                color: '#ccc',
                margin: '10px 4px',
                padding: 0,
                letterSpacing: '0.5px',
              }}
            >
              {language?.language?.Marketplace?.marketplace?.categories}:
            </h4>
          </div>
          {VerseCategories?.map((item, index) => {
            return (
              <div
                key={index}
                onClick={() => dispatch(setCategoryFilter(item.value))}
                style={{
                  color: item.value === categoryFilter ? '#f866b1' : '#ccc',
                  letterSpacing: '0.5px',
                  backgroundColor: 'rgba(255,255,255,0.03)',
                  padding: '8px',
                  paddingLeft: '20px',
                  borderRadius: '50px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontSize: '14px',
                }}
              >
                {lang === 'en'
                  ? item?.eng
                  : lang === 'ru'
                  ? item?.rus
                  : item?.geo}
                {item.value === categoryFilter && (
                  <MdDone
                    size={16}
                    color="#f866b1"
                    style={{ position: 'relative', right: '10px' }}
                  />
                )}
              </div>
            );
          })}
          {loadDistricts ? (
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                padding: '15px 0',
              }}
            >
              <BounceLoader
                size={20}
                color={'#f866b1'}
                loading={loadDistricts}
              />
            </div>
          ) : (
            <>
              {districts?.length > 0 && (
                <div
                  style={{
                    background: 'rgba(255,255,255,0.05)',
                    borderRadius: '10px',
                    marginTop: '10px',
                    boxSizing: 'border-box',
                    padding: '8px 20px',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                    }}
                  >
                    <GiVillage size={18} color="#ccc" />
                    <h4
                      style={{
                        color: '#ccc',
                        margin: '8px',
                        padding: 0,
                        letterSpacing: '0.5px',
                      }}
                    >
                      {language?.language?.Main?.filter?.district}:
                    </h4>
                  </div>
                  <div style={{ marginTop: '15px' }}>
                    {districts?.map((item, index) => {
                      return (
                        <div
                          key={index}
                          onClick={
                            district?.length > 0
                              ? () => dispatch(setDistrict(''))
                              : () => dispatch(setDistrict(item))
                          }
                          style={{
                            color:
                              district?.toLowerCase() === item?.toLowerCase()
                                ? '#f866b1'
                                : '#ccc',
                            padding: '6px 15px',
                            borderRadius: '50px',
                            background: 'rgba(0,0,0,0.5)',
                            margin: '10px',
                            fontSize: '14px',
                            letterSpacing: '0.5px',
                          }}
                        >
                          {item}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </>
          )}

          <div
            style={{
              background: 'rgba(255,255,255,0.05)',
              borderRadius: '10px',
              marginTop: '10px',
              boxSizing: 'border-box',
              padding: '8px 20px',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <GiModernCity size={18} color="#ccc" />
              <h4
                style={{
                  color: '#ccc',
                  margin: '8px',
                  padding: 0,
                  letterSpacing: '0.5px',
                }}
              >
                {language?.language?.Main?.filter?.city}:
              </h4>
            </div>
            <div style={{ marginTop: '15px' }}>
              {cities?.map((item, index) => {
                return (
                  <div
                    key={index}
                    onClick={
                      activeCity?.length > 0 &&
                      activeCity?.toLowerCase() === item?.toLowerCase()
                        ? () => {
                            dispatch(setCity(''));
                            setDistricts([]);
                          }
                        : () => dispatch(setCity(item))
                    }
                    style={{
                      color:
                        activeCity?.toLowerCase() === item?.toLowerCase()
                          ? '#f866b1'
                          : '#ccc',
                      padding: '6px 15px',
                      borderRadius: '50px',
                      background: 'rgba(0,0,0,0.5)',
                      margin: '10px',
                      fontSize: '14px',
                      letterSpacing: '0.5px',
                    }}
                  >
                    {item}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
};

const Container = styled.div`
  width: 100%;
  height: 65vh;
  background: rgba(0, 0, 0, 0.9);
  position: fixed;
  bottom: ${(props) => (props.filter === 'true' ? '0' : '-59vh')};
  transition: ease-in-out 400ms;
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  padding-bottom: ${(props) => (props.filter === 'true' ? '50px' : '0')};
`;
