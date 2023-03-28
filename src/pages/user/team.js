import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useOutletContext, useNavigate } from 'react-router-dom';
import useWindowDimensions from '../../functions/dimensions';
import makeAnimated from 'react-select/animated';
import Select from 'react-select';
import 'react-calendar/dist/Calendar.css';
import {
  collection,
  doc,
  setDoc,
  onSnapshot,
  deleteDoc,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from '../../firebase';
import { useSelector } from 'react-redux';
import Avatar from '@mui/material/Avatar';
import Success from '../../snackBars/success';
import { IoMdPersonAdd, IoMdClose } from 'react-icons/io';
import AlertDialog from '../../components/dialog';
import { HiUserRemove } from 'react-icons/hi';
import { ProceduresOptions } from '../../data/registerDatas';
import { v4 } from 'uuid';
import ProceduresPopup from '../../pages/user/proceduresPopup';

const animatedComponents = makeAnimated();

export const Team = () => {
  const { height, width } = useWindowDimensions();

  const proceduresOptions = ProceduresOptions();
  /// open add member
  const [add, setAdd] = useState(false);

  const [member, setMember] = useState('');
  const [procedures, setProcedures] = useState('');
  const [user, language] = useOutletContext();

  const navigate = useNavigate();
  // define current user
  // import current user from redux state
  const currentuser = useSelector(
    (state) => state.storeMain.user?.length > 0 && state.storeMain.user
  );

  // define user list
  const userList = useSelector(
    (state) =>
      state.storeMain?.userList?.length > 0 &&
      JSON.parse(state.storeMain?.userList)
  );

  const specialists = userList?.filter((item) => item.type === 'specialist');
  const optionList = specialists?.map((item, index) => {
    return { value: item?.id, label: item?.name, cover: item?.cover };
  });

  /// confir snackbar
  const [open, setOpen] = React.useState(false);

  const AddingMember = async (e) => {
    e.preventDefault();
    if (member?.value?.length > 0) {
      await setDoc(doc(db, 'users', currentuser?.id, 'team', member?.value), {
        name: member?.label,
        id: member?.value,
        procedures: procedures,
        experience: experience,
        confirm: false,
      });
      var actionId = v4();
      await setDoc(
        doc(db, `users`, `${member?.value}`, 'notifications', `${actionId}`),
        {
          id: actionId,
          senderId: currentuser?.id,
          senderName: currentuser?.name,
          senderCover: currentuser?.cover,
          text: language?.language.User.userPage.invite,
          date: serverTimestamp(),
          type: 'offer',
          status: 'unread',
          feed: ``,
        }
      );
      await setOpen(true);
      setMember('');
      setProcedures('');
      setExperience('');
    } else {
      alert(language?.language.User.userPage.addMember);
    }
  };

  // master experience
  const [experience, setExperience] = useState('');

  const experienceOption = [
    {
      value: 'beginner',
      label: `0-1`,
    },
    {
      value: 'intermediate',
      label: `1-2`,
    },
    {
      value: 'advanced',
      label: `2-3`,
    },
    {
      value: 'advanced2',
      label: `3-4`,
    },
    {
      value: 'advanced3',
      label: `4-5`,
    },
    {
      value: 'advanced3',
      label: `5+`,
    },
  ];

  /// import team members
  const [team, setTeam] = useState([]);
  useEffect(() => {
    const data = onSnapshot(
      collection(db, 'users', `${user?.id}`, 'team'),
      (snapshot) => {
        setTeam(snapshot.docs.map((doc) => doc.data()));
      }
    );
    return data;
  }, []);

  // delet member
  const DeleteMember = async (id) => {
    await deleteDoc(doc(db, 'users', currentuser?.id, 'team', id));
  };

  // alert dialog
  const [openDialog, setOpenDialog] = useState(false);

  // defined procedures which specialist or salon can to choise
  let option = proceduresOptions?.filter((item) => {
    let symbolCount = 0;
    for (let i = 0; i < item.value.length; i++) {
      if (item.value[i] === '-') {
        symbolCount++;
      }
    }
    return symbolCount === 2;
  });

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
      fontSize: '16px',
      color: state.isSelected
        ? theme
          ? '#333'
          : '#f3f3f3'
        : theme
        ? '#f3f3f3'
        : '#333',
    }),
    menuList: (base, state) => ({
      ...base,
      backgroundColor: theme ? '#333' : '#fff',
    }),
    input: (base, state) => ({
      ...base,
      color: theme ? '#f3f3f3' : '#333',
      fontSize: '16px',
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
      color: 'red',
      '@media only screen and (max-width: 1200px)': {
        width: '80vw',
        fontSize: '14px',
      },
    }),
  };

  return (
    <Container height={height}>
      <div>
        {currentuser?.id === user?.id && (
          <>
            {add ? (
              <IoMdClose
                className="icon"
                size={24}
                style={{ cursor: 'pointer' }}
                onClick={() => setAdd(false)}
              />
            ) : (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  cursor: 'pointer',
                }}
                onClick={() => setAdd(true)}
              >
                <IoMdPersonAdd
                  size={24}
                  style={{ cursor: 'pointer' }}
                  className="icon"
                />
                <Title>{language?.language.User.userPage.memberOffer}</Title>
              </div>
            )}
          </>
        )}
      </div>
      {add && currentuser?.id === user?.id && (
        <AddMember onSubmit={AddingMember}>
          <Title>{language?.language.User.userPage.addMember}</Title>
          <Select
            placeholder={language?.language.User.userPage.findMember}
            components={animatedComponents}
            onChange={(value) => {
              setMember(value);
            }}
            required
            value={member}
            components={animatedComponents}
            styles={CustomStyle}
            options={optionList}
          />
          <div
            style={{
              display: 'flex',
              alignItems: 'start',
              flexDirection: 'column',
              gap: '15px',
              marginTop: '15px',
              background: '#f3f3f3',
              padding: '15px',
              borderRadius: '5px',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '15px',
              }}
            >
              <Avatar
                alt={member?.label}
                src={member?.cover !== undefined ? member?.cover : ''}
                sx={{ width: 38, height: 38 }}
              />
              <span
                style={{ cursor: 'pointer' }}
                onClick={() => navigate(`/user/${member?.value}`)}
              >
                {member?.label}
              </span>
            </div>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '15px',
                marginTop: '5px',
              }}
            >
              {member?.value?.length > 0 && (
                <>
                  {procedures?.length > 0 &&
                    procedures?.map((item, index) => {
                      return <span>{item?.label}</span>;
                    })}
                </>
              )}
            </div>
          </div>
          <Title>
            {language?.language.User.userPage.memberOfferedServices}
          </Title>
          <Select
            placeholder={language?.language.User.userPage.memberServices}
            components={animatedComponents}
            onChange={(value) => {
              setProcedures(value);
            }}
            isMulti
            required
            value={procedures}
            components={animatedComponents}
            styles={CustomStyle}
            options={option}
          />
          <Title>{language?.language.User.userPage.experienceInBeauty}</Title>
          <Select
            placeholder={language?.language.User.userPage.experience}
            components={animatedComponents}
            onChange={(value) => {
              setExperience(value);
            }}
            required
            value={experience}
            components={animatedComponents}
            styles={CustomStyle}
            options={experienceOption}
          />
          <Success
            open={open}
            setOpen={setOpen}
            title={language?.language.User.userPage.successOffer}
            type="success"
          />
          <Button type="submit">
            {language?.language.User.userPage.sendOffer}
          </Button>
        </AddMember>
      )}
      {team?.filter((item) => item.confirm === true)?.length > 0 && (
        <MemberList>
          <MemberRow>
            <div style={{ flex: 1, fontWeight: 'bold' }}>
              {language?.language.User.userPage.name}
            </div>
            <div style={{ flex: 1, fontWeight: 'bold' }}>
              {language?.language.User.userPage.service}
            </div>{' '}
            <div style={{ flex: 1, fontWeight: 'bold' }}>
              {language?.language.User.userPage.experience}
            </div>
          </MemberRow>
          {team?.map((item, index) => {
            if (item?.confirm === true) {
              return (
                <MemberRow key={index}>
                  <div
                    style={{
                      flex: 1,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      cursor: 'pointer',
                    }}
                    onClick={() => navigate(`/user/${item.id}`)}
                  >
                    <Avatar
                      alt={item?.name}
                      src={item?.cover !== undefined ? item?.cover : ''}
                      sx={{ width: 24, height: 24 }}
                    />
                    {item.name}
                  </div>
                  <div
                    style={{ flex: 1, display: 'flex', alignItems: 'center' }}
                  >
                    <ProceduresPopup
                      procedures={item?.procedures}
                      language={language}
                    />
                  </div>{' '}
                  <div
                    style={{
                      flex: 1,
                      flex: 1,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                  >
                    {item.experience?.label}{' '}
                    {language?.language.User.userPage.year}
                    {currentuser?.id === user?.id && (
                      <HiUserRemove
                        size={22}
                        style={{ cursor: 'pointer', color: '#333' }}
                        onClick={() => setOpenDialog(true)}
                      />
                    )}
                  </div>
                  <AlertDialog
                    title={language?.language.User.userPage.confirm}
                    open={openDialog}
                    setOpen={setOpenDialog}
                    text={language?.language.User.userPage.removeMember}
                    function={() => DeleteMember(item?.id)}
                  />
                </MemberRow>
              );
            }
          })}
        </MemberList>
      )}
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: start;
  justify-content: start;
  padding-top: 1vw;
  padding-left: 2vw;
  width: 100%;
  min-height: 57vh;
  height: 57vh;
  gap: 0vw;
  padding-bottom: 5vw;
  box-sizing: border-box;
  overflow-y: scroll;
  overflow-x: hidden;

  @media only screen and (max-width: 600px) {
    width: 90vw;
    height: calc(${(props) => props.height}px - 65vw);
    padding-top: 5vw;
    padding-left: 0vw;
    gap: 5vw;
  }

  .icon {
    color: ${(props) => props.theme.icon};
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

const AddMember = styled.form`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: start;
  gap: 5px;
`;

const Title = styled.h5`
  color: ${(props) => props.theme.font};
`;

const MemberList = styled.div`
  margin-top: 1vw;
  border-radius: 5px;
  box-shadow: 0 0.1vw 0.2vw ${(props) => props.theme.shadowColor};
  background: ${(props) => props.theme.secondLevel};
  color: ${(props) => props.theme.font};
`;

const InputContainer = styled.div`
  width: 15vw;
  height: 2.5vw;
  border-radius: 0.5vw;
  box-shadow: 0 0.1vw 0.2vw ${(props) => props.theme.shadowColor};
  border: none;
  display: flex;
  align-items: center;
  justify-content: start;
  gap: 0.5vw;
  transition: ease-in 200ms;
  box-sizing: border-box;
  font-size: 14px;

  @media only screen and (max-width: 600px) {
    box-shadow: 0 0.2vw 0.4vw ${(props) => props.theme.shadowColor};
    width: 45vw;
    height: 10vw;
    border-radius: 1.5vw;
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
  }
`;

const Button = styled.button`
  width: 15vw;
  height: 2.5vw;
  border-radius: 0.5vw;
  box-shadow: 0 0.1vw 0.2vw ${(props) => props.theme.shadowColor};
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: ease-in 200ms;
  color: ${(props) => (props.back ? '#ccc' : 'green')};
  font-weight: bold;
  background: ${(props) => props.theme.categoryItem};
  border: none;
  margin-top: 1vw;
  font-size: 14px;

  @media only screen and (max-width: 600px) {
    width: 45vw;
    height: 8vw;
    border-radius: 1.5vw;
    box-shadow: 0 0.3vw 0.6vw ${(props) => props.theme.shadowColor};
  }

  :hover {
    box-shadow: 0 0.1vw 0.3vw ${(props) => props.theme.shadowColor};
  }
`;

const MemberRow = styled.div`
  width: 42vw;
  border-bottom: 1px solid ${(props) => props.theme.lineColor};
  padding: 15px;
  display: flex;
  font-size: 14px;
  transition: ease 200;
  gap: 10px;

  @media only screen and (max-width: 600px) {
    width: 90vw;
  }

  :hover {
    filter: brightness(0.9);
  }
`;
