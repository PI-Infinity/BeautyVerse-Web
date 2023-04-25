import React, { useState } from 'react';
import styled from 'styled-components';
import { useSelector, useDispatch } from 'react-redux';
import { TiDeleteOutline } from 'react-icons/ti';
import { MdOutlinePlaylistAdd } from 'react-icons/md';
import { GiConfirmed } from 'react-icons/gi';
import Select from 'react-select';
import { UpdateProcedurePrice, setTargetUser } from '../../redux/user';
import makeAnimated from 'react-select/animated';
import {
  ProceduresOptions,
  workingDaysOptions,
} from '../../data/registerDatas';
import useWindowDimensions from '../../functions/dimensions';
import { IsMobile } from '../../functions/isMobile';
import { useOutletContext } from 'react-router-dom';
import { RiEdit2Fill } from 'react-icons/ri';
import AlertDialog from '../../components/dialog';
import Warrning from '../../snackBars/success';
import { Spinner } from '../../components/loader';
import axios from 'axios';
import { setRerenderCurrentUser } from '../../redux/rerenders';
import { WorkingDays } from '../../pages/user/workingDays';
import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { Language } from '../../context/language';

const animatedComponents = makeAnimated();

export const Services = () => {
  const proceduresOptions = ProceduresOptions();
  const [loading, setLoading] = useState(true);
  const language = Language();
  const targetUser = useSelector((state) => state.storeUser.targetUser);

  const currentUser = JSON.parse(
    localStorage.getItem('Beautyverse:currentUser')
  );
  const isMobile = IsMobile();
  const dispatch = useDispatch();
  const { height, width } = useWindowDimensions();

  const [editProcedure, setEditProcedure] = useState(false);
  const [addProcedureInput, setAddProcedureInput] = useState('');

  const [editProcedurePrice, setEditProcedurePrice] = useState(false);
  const [addProcedurePriceInput, setAddProcedurePriceInput] = useState('');

  const [addPriceFirstly, setAddPriceFirstly] = useState('');

  const [alert, setAlert] = useState('');

  // add service to firebase
  const AddProcedure = async () => {
    var val = targetUser?.procedures?.find(
      (item) => item.value === addProcedureInput.value
    );
    if (addProcedureInput === '') {
      setEditProcedure(false);
    } else {
      if (val) {
        setAlert({
          active: true,
          title: 'Procedure already added in your procedures list!',
        });
        setAddProcedureInput('');
      } else {
        const response = await axios.post(
          `https://beautyverse.herokuapp.com/api/v1/users/${targetUser?._id}/procedures`,
          {
            value: addProcedureInput.value,
          }
        );
        const data = await response.data;
        dispatch(setRerenderCurrentUser());
        setAddProcedureInput('');
        setEditProcedure(false);
      }
    }
  };

  // add service to firebase
  const AddProcedurePrice = async (itemId, itemValue, indx) => {
    if (!addProcedurePriceInput && addPriceFirstly === '') {
      setAlert({
        active: true,
        title: 'input field',
      });
    } else {
      dispatch(
        UpdateProcedurePrice({
          index: indx,
          newPrice:
            editProcedurePrice.value === itemValue
              ? addProcedurePriceInput
              : addPriceFirstly,
        })
      );
      let response;
      await axios.patch(
        `https://beautyverse.herokuapp.com/api/v1/users/${targetUser?._id}/procedures/${itemId}`,
        {
          value: itemValue,
          price:
            editProcedurePrice.value === itemValue
              ? addProcedurePriceInput
              : addPriceFirstly,
        }
      );

      await dispatch(setRerenderCurrentUser());
      editProcedurePrice.value === itemValue
        ? setAddProcedurePriceInput('')
        : setAddPriceFirstly('');
    }
  };

  // delete service
  const Deleting = async (itemId) => {
    if (targetUser?.procedures?.length > 1) {
      const url = `https://beautyverse.herokuapp.com/api/v1/users/${targetUser?._id}/procedures/${itemId}`;
      const response = await fetch(url, { method: 'DELETE' })
        .then((response) => response.json())
        .then(() => dispatch(setRerenderCurrentUser()))
        .catch((error) => {
          console.log('Error fetching data:', error);
        });
    } else {
      setAlert({
        active: true,
        title: 'You cant delete last procedure',
      });
    }
  };

  // define working days options language
  const lang = useSelector((state) => state.storeMain.language);
  let workingDaysOpt;
  if (lang === 'ka') {
    workingDaysOpt = workingDaysOptions?.map((item) => {
      return { value: item.value, label: item.ka };
    });
  } else if (lang === 'ru') {
    workingDaysOpt = workingDaysOptions?.map((item) => {
      return { value: item.value, label: item.ru };
    });
  } else {
    workingDaysOpt = workingDaysOptions?.map((item) => {
      return { value: item.value, label: item.en };
    });
  }

  // confirm remove service
  const [confirmRemove, setConfirmRemove] = React.useState(false);
  // import user gallery images from firestore
  const [removeData, setRemoveData] = useState('');

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
      color: state.isSelected
        ? theme
          ? '#333'
          : '#f3f3f3'
        : theme
        ? '#f3f3f3'
        : '#333',
    }),
    input: (base, state) => ({
      ...base,
      color: theme ? '#f3f3f3' : '#333',
      fontSize: '16px',
    }),
    menuList: (base, state) => ({
      ...base,
      backgroundColor: theme ? '#333' : '#f3f3f3',
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
      width: '20vw',
      minHeight: '2vw',
      cursor: 'pointer',
      '@media only screen and (max-width: 1200px)': {
        width: '80vw',
        fontSize: '14px',
      },
    }),
  };

  // create tab navigator
  // tab state
  const [activeFilter, setActiveFilter] = useState('');

  function CenteredTabs({ value, setValue, language }) {
    const tabs = (() => {
      const uniqueLabels = new Set();
      return targetUser?.procedures
        ?.map((item, index) => {
          let x = item.value.split(' -');
          let result = x[0];
          let label = proceduresOptions.find(
            (it) => it.value.toLowerCase() === result.toLowerCase()
          );
          if (label && !uniqueLabels.has(label.value)) {
            uniqueLabels.add(label.value);
            return (
              <div
                className={activeFilter === label.value ? 'active' : 'unactive'}
                key={index}
                onClick={() => setActiveFilter(label.value)}
              >
                {label.label}
              </div>
            );
          }
          return null;
        })
        .filter((tab) => tab !== null);
    })();
    console.log(tabs);
    if (tabs?.length > 1) {
      return tabs;
    }
  }

  setTimeout(() => {
    setLoading(false);
  }, 300);

  return (
    <ContentContainer height={height}>
      <WrapperOne>
        <WorkingDays targetUser={targetUser} language={language} />

        {/**
         *
         *  Procedures Options
         *
         */}
        <SectionContainer>
          <span style={{ fontWeight: 'bold', marginTop: '1vw' }}>
            {language?.language.User.userPage.memberServices}:
          </span>

          <SectionWrapper>
            {targetUser?._id === currentUser?._id && (
              <>
                {!editProcedure && (
                  <MdOutlinePlaylistAdd
                    className="open"
                    onClick={() => setEditProcedure(true)}
                  />
                )}
              </>
            )}
            {editProcedure && (
              <SelectContainer
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                }}
              >
                <Select
                  placeholder={language?.language.User.userPage.addService}
                  components={animatedComponents}
                  onChange={(value) => {
                    setAddProcedureInput(value);
                  }}
                  styles={CustomStyle}
                  options={proceduresOptions?.filter((item) => {
                    let symbolCount = 0;
                    for (let i = 0; i < item.value.length; i++) {
                      if (item.value[i] === '-') {
                        symbolCount++;
                      }
                    }
                    return symbolCount === 2;
                  })}
                />
                <GiConfirmed
                  className="add"
                  onClick={AddProcedure}
                  style={{ fontSize: '26px' }}
                />
              </SelectContainer>
            )}
            <FilterNavigator>
              <div
                className={activeFilter === '' ? 'active' : 'unactive'}
                onClick={() => setActiveFilter('')}
              >
                {lang === 'ka' ? 'ყველა' : lang === 'ru' ? 'все' : 'All'}
              </div>

              <CenteredTabs width={width} />
            </FilterNavigator>
            <SectionList>
              {targetUser?.procedures
                ?.filter((item) =>
                  item.value
                    .toLowerCase()
                    .startsWith(activeFilter.toLowerCase())
                )
                ?.map((cat, index) => {
                  var item = proceduresOptions?.find(
                    (item) => item.value === cat.value
                  );
                  return (
                    <SectionItemContainer key={index}>
                      <SectionItem
                        current={(
                          targetUser?._id !== currentUser?._id
                        ).toString()}
                      >
                        <div
                          style={{
                            width:
                              targetUser?._id !== currentUser?._id
                                ? '100%'
                                : '70%',
                          }}
                        >
                          {item?.label}
                        </div>
                        {targetUser?._id !== currentUser?._id ? (
                          <>
                            {cat?.price && (
                              <AddationalValue>
                                <h4>
                                  {cat.price}
                                  {`\u20BE`}
                                </h4>
                              </AddationalValue>
                            )}
                          </>
                        ) : (
                          <>
                            {cat?.price &&
                            editProcedurePrice.value !== cat.value ? (
                              <AddationalValue>
                                <h4>
                                  {cat.price}
                                  {`\u20BE`}
                                </h4>
                                <RiEdit2Fill
                                  className="editIcon"
                                  onClick={() => {
                                    setEditProcedurePrice({
                                      active: true,
                                      value: cat.value,
                                    });
                                    setAddProcedurePriceInput(cat?.price);
                                  }}
                                />
                              </AddationalValue>
                            ) : (
                              <InputContainer>
                                <Input
                                  type="number"
                                  value={
                                    editProcedurePrice.value === cat.value
                                      ? addProcedurePriceInput
                                      : addPriceFirstly
                                  }
                                  placeholder={
                                    language?.language.User.userPage.price
                                  }
                                  onFocus={() =>
                                    setEditProcedurePrice({
                                      active: true,
                                      value: cat.value,
                                    })
                                  }
                                  onChange={
                                    editProcedurePrice.value === cat.value
                                      ? (e) =>
                                          setAddProcedurePriceInput(
                                            e.target.value
                                          )
                                      : (e) =>
                                          setAddPriceFirstly(e.target.value)
                                  }
                                />
                                {`\u20BE`}

                                <GiConfirmed
                                  onClick={async () => {
                                    await AddProcedurePrice(
                                      cat._id,
                                      cat.value,
                                      index
                                    );
                                    editProcedurePrice.value === cat.value
                                      ? setEditProcedurePrice(false)
                                      : setAddPriceFirstly(false);
                                  }}
                                  style={{
                                    color: 'green',
                                    cursor: 'pointer',
                                    fontSize: '18px',
                                  }}
                                />
                              </InputContainer>
                            )}
                          </>
                        )}
                      </SectionItem>
                      {targetUser?._id === currentUser?._id && (
                        <>
                          <TiDeleteOutline
                            className="remove"
                            onClick={() => {
                              setConfirmRemove(true);
                              setRemoveData(cat?._id);
                            }}
                          />
                          <AlertDialog
                            title={language?.language.User.userPage.confirm}
                            text={
                              language?.language.User.userPage.removeServiceText
                            }
                            open={confirmRemove}
                            setOpen={setConfirmRemove}
                            function={() => Deleting(removeData)}
                            language={language}
                          />
                        </>
                      )}
                    </SectionItemContainer>
                  );
                })}
            </SectionList>
          </SectionWrapper>
        </SectionContainer>
      </WrapperOne>

      <Warrning
        open={alert?.active}
        setOpen={setAlert}
        type="error"
        title={alert?.title}
      />
    </ContentContainer>
  );
};

const Content = styled.div`
  display: flex;
  align-items: start;
  justify-content: start;
  padding-top: 1vw;
  padding-left: 1.5vw;
  width: 100%;
  height: 100%;
  flex-wrap: wrap;
  gap: 0.5vw;
  margin-bottom: 5vw;
  background: green;

  @media only screen and (max-width: 600px) {
    width: 90vw;
  }

  .loadingIcon {
    font-size: 3vw;
  }
`;

const ContentContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: start;
  justify-content: start;
  padding-top: 1vw;
  padding-left: 4vw;
  width: 100%;
  // min-height: 57vh;
  height: 60vh;
  gap: 1vw;
  padding-bottom: 3vw;
  overflow-y: scroll;
  overflow-x: hidden;
  box-sizing: border-box;

  @media only screen and (max-width: 600px) {
    width: 100vw;
    height: auto;
    padding-top: 5vw;
    padding-left: 4vw;
    padding-right: 0;
    gap: 5vw;
  }

  animation: fadeIn 0.5s;
  -webkit-animation: fadeIn 0.5s;
  -moz-animation: fadeIn 0.5s;
  -o-animation: fadeIn 0.5s;
  -ms-animation: fadeIn 0.5s;

  @keyframes fadeIn {
    0% {
      opacity: 0;
    }
    100% {
      opacity: 1;
    }
  }

  @-moz-keyframes fadeIn {
    0% {
      opacity: 0;
    }
    100% {
      opacity: 1;
    }
  }

  @-webkit-keyframes fadeIn {
    0% {
      opacity: 0;
    }
    100% {
      opacity: 1;
    }
  }

  @-o-keyframes fadeIn {
    0% {
      opacity: 0;
    }
    100% {
      opacity: 1;
    }
  }

  @-ms-keyframes fadeIn {
    0% {
      opacity: 0;
    }
    100% {
      opacity: 1;
    }
  }

  .loadingIcon {
    font-size: 3vw;
  }
`;

const WrapperOne = styled.div`
  width: auto;
  display: flex;
  flex-direction: column;
  gap: 1vw;

  .datePicker {
    width: 100%;
  }

  @media only screen and (max-width: 600px) {
    gap: 5vw;
  }
`;

const SelectContainer = styled.div`
  width: 42vw;
  @media only screen and (max-width: 600px) {
    width: 90vw;
  }
`;

const SectionList = styled.div`
  width: 100%;
  margin-top: 1vw;
  border-radius: 5px;
  background: ${(props) => props.theme.secondLevel};

  @media only screen and (max-width: 600px) {
    width: 95%;
  }
`;

const SectionContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1vw;
  color: ${(props) => props.theme.font};

  .remove {
    font-size: 1.5vw;
    color: #555;
    cursor: pointer;
    position: relative;
    left: 0.2vw;

    @media only screen and (max-width: 600px) {
      font-size: 6vw;
      left: 0;
    }

    // :hover {
    //   color: ${(props) => props.theme.secondLevel};
    // }
  }

  @media only screen and (max-width: 600px) {
    display: flex;
    flex-direction: column;
    gap: 3vw;
    margin-top: 3vw;
    font-size: 3.5vw;
  }
`;

const SectionWrapper = styled.div`
  width: 100%;
  // display: flex;
  // flex-direction: column;
  // align-items: start;
  // justify-content: start;
  // flex-wrap: wrap;
  gap: 0.7vw;
  box-sizing: border-box;

  @media only screen and (max-width: 600px) {
    // flex-wrap: no-wrap;
    overflow-y: scroll;
    overflow-x: hidden;
    gap: 2vw;
  }

  .open {
    font-size: 1.5vw;
    color: ${(props) => props.theme.icon};
    cursor: pointer;

    @media only screen and (max-width: 600px) {
      font-size: 6vw;
      flex-direction: column;
    }

    :hover {
      filter: brightness(1.1);
    }
  }

  .add {
    font-size: 1.5vw;
    color: green;
    cursor: pointer;

    @media only screen and (max-width: 600px) {
      font-size: 6vw;
    }

    :hover {
      filter: brightness(1.1);
    }
  }
`;

const SectionItemContainer = styled.div`
  width: 42vw;
  // border-bottom: 1px solid #ccc;
  padding: 10px;
  display: flex;
  align-items: center;
  font-size: 12px;
  transition: ease 200;
  color: ${(props) => props.theme.font};

  // :hover {
  //   background: ${(props) => props.theme.background};
  // }

  @media only screen and (max-width: 600px) {
    width: 91vw;
    padding-right: 3vw;
    gap: 1vw;
  }
`;

const SectionItem = styled.div`
  padding: 0.2vw 0.5vw 0.2vw 1vw;
  border: 1px solid ${(props) => props.theme.lineColor};
  border-radius: 0.25vw;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5vw;
  background: ${(props) => props.theme.background};
  box-sizing: border-box;
  width: 100%;
  color: ${(props) => props.theme.font};
  height: 2.5vw;
  white-space: nowrap;
  overflow: hidden;

  @media only screen and (max-width: 600px) {
    width: ${(props) => (props.current === 'false' ? '81vw' : '95%')};
    height: 8vw;
    border-radius: 1vw;
    padding: ${(props) =>
      props.current === 'false' ? '0 1.5vw 0 2vw' : '0 0 0 2vw'};
  }
`;

const AddationalValue = styled.div`
  padding: 0.5vw;
  border-radius: 50vw;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.2vw;
  height: 2vw;
  width: 4vw;
  position: relative;
  right: 0;

  @media only screen and (max-width: 600px) {
    gap: 2vw;
    height: 10vw;
    width: 12vw;
  }
  .editIcon {
    color: ${(props) => props.theme.disabled};
    cursor: pointer;
    font-size: 1vw;

    @media only screen and (max-width: 600px) {
      font-size: 4vw;
    }
  }
`;

const InputContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #f1f1f1;
  height: 2vw;
  width: 10vw;
  padding: 0 0.5vw;
  border-radius: 0.25vw;
  box-sizing: border-box;
  background: ${(props) => props.theme.secondLevel};

  @media only screen and (max-width: 600px) {
    position: relative;
    border-radius: 1vw;
    gap: 1vw;
    height: 6.5vw;
    width: 31vw;
    padding: 0 2vw;
  }
`;

const Input = styled.input`
  border: none;
  border-radius: 50vw;
  background: white;
  width: 5vw;
  height: 70%;
  padding-left: 0.25vw;
  background: ${(props) => props.theme.secondLevel};
  color: ${(props) => props.theme.font};
  font-size: 16px;

  @media only screen and (max-width: 600px) {
    width: 15vw;
    border-radius: 50vw;
    padding-left: 3vw;
    height: 60%;
  }

  ::placeholder {
    font-size: 12px;
  }

  :focus {
    outline: none;
  }
`;

const FilterNavigator = styled.div`
  display: flex;
  align-items: center;
  height: 30px;
  padding: 5px 0;
  margin-top: 5px;
  overflow-x: scroll;
  overflow-y: hidden;
  width: 40vw;

  @media only screen and (max-width: 600px) {
    width: 95vw;
  }

  .active {
    width: auto;
    padding: 10px 15px;
    font-size: 12px;
    background: ${(props) => props.theme.secondLevel};
    border-radius: 5px;
    cursor: pointer;
    margin-right: 10px;
    white-space: nowrap;
  }
  .unactive {
    width: auto;
    padding: 10px 15px;
    font-size: 12px;
    background: none;
    border-radius: 5px;
    cursor: pointer;
    margin-right: 10px;
    white-space: nowrap;
  }

  /* width */
  ::-webkit-scrollbar {
    width: 0vw;
    height: 0vw;
  }

  /* Track */
  ::-webkit-scrollbar-track {
    background-color: #f1f1f1;
  }

  /* Handle */
  ::-webkit-scrollbar-thumb {
    background-color: #222;
  }

  /* Handle on hover */
  ::-webkit-scrollbar-thumb:hover {
    background-color: #1e1e1e;
  }
`;
