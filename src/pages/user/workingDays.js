import React, { useState } from 'react';
import styled from 'styled-components';
import { useSelector, useDispatch } from 'react-redux';
import { TiDeleteOutline } from 'react-icons/ti';
import { MdOutlinePlaylistAdd } from 'react-icons/md';
import { ImCheckmark } from 'react-icons/im';
import { GiConfirmed } from 'react-icons/gi';
import Select from 'react-select';
import makeAnimated from 'react-select/animated';
import { workingDaysOptions } from '../../data/registerDatas';
import useWindowDimensions from '../../functions/dimensions';
import { IsMobile } from '../../functions/isMobile';
import { RiEdit2Fill } from 'react-icons/ri';
import AlertDialog from '../../components/dialog';
import Warrning from '../../snackBars/success';
import axios from 'axios';
import { setRerenderCurrentUser } from '../../redux/rerenders';

const animatedComponents = makeAnimated();

export const WorkingDays = ({ targetUser, language }) => {
  const currentUser = JSON.parse(
    localStorage.getItem('Beautyverse:currentUser')
  );
  const isMobile = IsMobile();
  const dispatch = useDispatch();
  const { height, width } = useWindowDimensions();

  const [editWorkingDay, setEditWorkingDay] = useState(false);
  const [addWorkingDayInput, setAddWorkingDayInput] = useState('');

  const [editHours, setEditHours] = useState(false);
  const [addHoursInput, setAddHoursInput] = useState('');

  const [addHoursFirstlyInput, setAddHoursFirstlyInput] = useState('');

  const [alert, setAlert] = useState('');

  // add service to firebase
  const AddWorkingDay = async () => {
    var val = targetUser?.workingDays?.find(
      (item) => item.value === addWorkingDayInput.value
    );
    if (addWorkingDayInput === '') {
      setEditWorkingDay(false);
    } else {
      if (val) {
        setAlert({
          active: true,
          title:
            'Working day with same name already added in your working days list!',
        });
        setAddWorkingDayInput('');
      } else {
        const response = await axios.post(
          `https://beautyverse.herokuapp.com/api/v1/users/${targetUser?._id}/workingdays`,
          {
            value: addWorkingDayInput.value,
          }
        );
        const data = await response.data;
        setAddWorkingDayInput('');
        setEditWorkingDay(false);
        dispatch(setRerenderCurrentUser());
      }
    }
  };
  // add service to firebase
  const AddWorkingDayHours = async (itemId, itemValue) => {
    if (!addHoursInput && addHoursFirstlyInput === '') {
      setAlert({
        active: true,
        title: 'Hours not defined',
      });
    } else {
      await axios.patch(
        `https://beautyverse.herokuapp.com/api/v1/users/${targetUser?._id}/workingdays/${itemId}`,
        {
          value: itemValue,
          hours:
            editHours.value === itemValue
              ? addHoursInput
              : addHoursFirstlyInput,
        }
      );

      await dispatch(setRerenderCurrentUser());
      editHours.value === itemValue
        ? setAddHoursInput('')
        : setAddHoursFirstlyInput('');
    }
  };

  // delete service
  const Deleting = async (itemId) => {
    const url = `https://beautyverse.herokuapp.com/api/v1/users/${targetUser?._id}/workingdays/${itemId}`;
    const response = await fetch(url, { method: 'DELETE' })
      .then((response) => response.json())
      .then(() => dispatch(setRerenderCurrentUser()))
      .catch((error) => {
        console.log('Error fetching data:', error);
      });
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
      width: '38vw',
      minHeight: '2vw',
      cursor: 'pointer',
      '@media only screen and (max-width: 1200px)': {
        width: '80vw',
        fontSize: '14px',
      },
    }),
  };

  return (
    <SectionContainer>
      <span style={{ fontWeight: 'bold', marginTop: '1vw' }}>
        {language?.language.User.userPage.workingDays}:
      </span>
      <SectionWrapper>
        {targetUser?.authenticationId === currentUser?.uid && (
          <>
            {!editWorkingDay && (
              <MdOutlinePlaylistAdd
                className="open"
                onClick={() => setEditWorkingDay(true)}
              />
            )}
          </>
        )}
        {editWorkingDay && (
          <SelectContainer style={{ display: 'flex', gap: '10px' }}>
            <Select
              placeholder={language?.language.User.userPage.workingDays}
              components={animatedComponents}
              onChange={(value) => {
                setAddWorkingDayInput(value);
              }}
              styles={CustomStyle}
              options={workingDaysOpt}
            />
            <ImCheckmark className="add" onClick={AddWorkingDay} />
          </SelectContainer>
        )}
        <SectionList>
          {targetUser?.workingDays?.map((wd, index) => {
            var item = workingDaysOpt?.find((item) => item.value === wd.value);
            return (
              <SectionItemContainer key={index}>
                <SectionItem>
                  <span>{item?.label}</span>
                  {targetUser?.authenticationId !== currentUser?.uid ? (
                    <>
                      {wd?.hours && (
                        <AddationalValue>
                          <h4>{wd.hours}</h4>
                        </AddationalValue>
                      )}
                    </>
                  ) : (
                    <>
                      {wd?.hours && editHours.value !== wd.value ? (
                        <AddationalValue>
                          <h4>{wd.hours}</h4>
                          <RiEdit2Fill
                            className="editIcon"
                            onClick={() => {
                              setEditHours({
                                active: true,
                                value: wd.value,
                              });
                              setAddHoursInput(wd?.hours);
                            }}
                          />
                        </AddationalValue>
                      ) : (
                        <InputContainer>
                          <Input
                            type="text"
                            value={
                              editHours.value === wd.value
                                ? addHoursInput
                                : addHoursFirstlyInput
                            }
                            placeholder="10:00 - 18:00"
                            onChange={
                              editHours.value === wd.value
                                ? (e) => setAddHoursInput(e.target.value)
                                : (e) => setAddHoursFirstlyInput(e.target.value)
                            }
                          />

                          <GiConfirmed
                            onClick={async () => {
                              await AddWorkingDayHours(wd._id, wd.value);
                              editHours.value === wd.value
                                ? setEditHours(false)
                                : setAddHoursFirstlyInput('');
                            }}
                            style={{
                              color: 'green',
                              cursor: 'pointer',
                            }}
                          />
                        </InputContainer>
                      )}
                    </>
                  )}
                </SectionItem>
                {targetUser?.authenticationId === currentUser?.uid && (
                  <>
                    <TiDeleteOutline
                      className="remove"
                      onClick={() => {
                        setConfirmRemove(true);
                        setRemoveData(wd?._id);
                      }}
                    />
                    <AlertDialog
                      title={language?.language.User.userPage.confirm}
                      text={language?.language.User.userPage.removeServiceText}
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
      <Warrning
        open={alert?.active}
        setOpen={setAlert}
        type="error"
        title={alert?.title}
      />
    </SectionContainer>
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

  @media only screen and (max-width: 600px) {
    width: 90vw;
    height: calc(${(props) => props.height}px - 72vw);
    padding-top: 5vw;
    padding-left: 2vw;
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
  font-size: 14px;
  transition: ease 200;
  color: ${(props) => props.theme.font};

  // :hover {
  //   background: ${(props) => props.theme.background};
  // }

  @media only screen and (max-width: 600px) {
    width: 87vw;
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

  @media only screen and (max-width: 600px) {
    width: 81vw;
    height: 8vw;
    border-radius: 1vw;
    padding: 0 1.5vw 0 2vw;
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
  width: 7vw;
  position: relative;
  right: 0;

  @media only screen and (max-width: 600px) {
    gap: 2vw;
    height: 10vw;
    width: 24vw;
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
    height: 7.5vw;
    width: 28vw;
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
    width: 10vw;
    border-radius: 50vw;
    padding-left: 3vw;
    height: 70%;
  }

  :placeholder {
    font-size: 14px;
  }

  :focus {
    outline: none;
  }
`;
