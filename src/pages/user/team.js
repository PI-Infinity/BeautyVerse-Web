import React, { useState, useContext, useEffect } from "react";
import styled from "styled-components";
import { useOutletContext, useNavigate } from "react-router-dom";
import useWindowDimensions from "../../functions/dimensions";
import makeAnimated from "react-select/animated";
import Select from "react-select";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import {
  collection,
  doc,
  setDoc,
  updateDoc,
  onSnapshot,
  deleteDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../../firebase";
import { useSelector, useDispatch } from "react-redux";
import Avatar from "@mui/material/Avatar";
import Success from "../../snackBars/success";
import { IoMdPersonAdd, IoMdClose } from "react-icons/io";
import AlertDialog from "../../components/dialog";
import { HiUserRemove } from "react-icons/hi";
import {
  ProceduresOptions,
  categoriesOptions,
  workingPlacesOptions,
  workingDaysOptions,
} from "../../data/registerDatas";
import { v4 } from "uuid";
import { BsListCheck } from "react-icons/bs";
import ProceduresPopup from "../../pages/user/proceduresPopup";

const animatedComponents = makeAnimated();

export const Team = () => {
  const { height, width } = useWindowDimensions();

  const proceduresOptions = ProceduresOptions();
  /// open add member
  const [add, setAdd] = useState(false);

  const [member, setMember] = useState("");
  const [procedures, setProcedures] = useState("");
  const [user] = useOutletContext();

  const navigate = useNavigate();
  // define current user
  // import current user from redux state
  const userUnparsed = useSelector((state) => state.storeMain.user);
  let currentuser;
  if (userUnparsed?.length > 0) {
    currentuser = JSON.parse(userUnparsed);
  }

  // define user list
  const list = useSelector((state) => state.storeMain.userList);
  let userList;
  if (list?.length > 0) {
    userList = JSON.parse(list);
  }
  const specialists = userList?.filter((item) => item.type === "specialist");
  const optionList = specialists?.map((item, index) => {
    return { value: item?.id, label: item?.name, cover: item?.cover };
  });

  /// confir snackbar
  const [open, setOpen] = React.useState(false);

  const AddingMember = async (e) => {
    e.preventDefault();
    if (member?.value?.length > 0) {
      await setDoc(doc(db, "users", currentuser?.id, "team", member?.value), {
        name: member?.label,
        id: member?.value,
        procedures: procedures,
        experience: experience,
        confirm: false,
      });
      var actionId = v4();
      await setDoc(
        doc(db, `users`, `${member?.value}`, "notifications", `${actionId}`),
        {
          id: actionId,
          senderId: currentuser?.id,
          senderName: currentuser?.name,
          senderCover: currentuser?.cover,
          text: `გამოგიგზავნათ მოსაწვევი მის გუნდში გასაწევრიანებლად!`,
          date: serverTimestamp(),
          type: "offer",
          status: "unread",
          feed: ``,
        }
      );
      await setOpen(true);
      setMember("");
      setProcedures("");
      setExperience("");
    } else {
      alert("დაამატეთ გუნდის წავრი");
    }
  };

  // master experience
  const [experience, setExperience] = useState("");

  const experienceOption = [
    {
      value: "beginner",
      label: "0-1 წელი",
    },
    {
      value: "intermediate",
      label: "1-2 წელი",
    },
    {
      value: "advanced",
      label: "2-3 წელი",
    },
    {
      value: "advanced2",
      label: "3-4 წელი",
    },
    {
      value: "advanced3",
      label: "4-5 წელი",
    },
    {
      value: "advanced3",
      label: "5+ წელი",
    },
  ];

  /// import team members
  const [team, setTeam] = useState([]);
  useEffect(() => {
    const data = onSnapshot(
      collection(db, "users", `${user?.id}`, "team"),
      (snapshot) => {
        setTeam(snapshot.docs.map((doc) => doc.data()));
      }
    );
    return data;
  }, []);

  // delet member
  const DeleteMember = async (id) => {
    await deleteDoc(doc(db, "users", currentuser?.id, "team", id));
  };

  // alert dialog
  const [openDialog, setOpenDialog] = useState(false);

  // defined procedures which specialist or salon can to choise
  let option = proceduresOptions?.filter((item) => {
    let symbolCount = 0;
    for (let i = 0; i < item.value.length; i++) {
      if (item.value[i] === "-") {
        symbolCount++;
      }
    }
    return symbolCount === 2;
  });

  return (
    <Container height={height}>
      <div>
        {currentuser?.id === user?.id && (
          <>
            {add ? (
              <IoMdClose
                className="icon"
                size={24}
                style={{ cursor: "pointer" }}
                onClick={() => setAdd(false)}
              />
            ) : (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  cursor: "pointer",
                }}
                onClick={() => setAdd(true)}
              >
                <IoMdPersonAdd
                  size={24}
                  style={{ cursor: "pointer" }}
                  className="icon"
                />
                <Title>მოიწვიე ახალი გუნდის წევრი</Title>
              </div>
            )}
          </>
        )}
      </div>
      {add && currentuser?.id === user?.id && (
        <AddMember onSubmit={AddingMember}>
          <Title>დაამატე გუნდის წევრი</Title>
          <Select
            placeholder="მოძებნე გუნდის წევრი"
            components={animatedComponents}
            onChange={(value) => {
              setMember(value);
            }}
            required
            value={member}
            components={animatedComponents}
            styles={{
              control: (baseStyles, state) => ({
                ...baseStyles,
                borderColor: state.isFocused
                  ? "rgba(0,0,0,0)"
                  : "rgba(0,0,0,0.1)",
                width: "15vw",
                minHeight: "2vw",
                cursor: "pointer",
                "@media only screen and (max-width: 1200px)": {
                  width: "50vw",
                  fontSize: "16px",
                },
              }),
            }}
            options={optionList}
          />
          <div
            style={{
              display: "flex",
              alignItems: "start",
              flexDirection: "column",
              gap: "15px",
              marginTop: "15px",
              background: "#f3f3f3",
              padding: "15px",
              borderRadius: "5px",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "15px",
              }}
            >
              <Avatar
                alt={member?.label}
                src={member?.cover !== undefined ? member?.cover : ""}
                sx={{ width: 38, height: 38 }}
              />
              <span
                style={{ cursor: "pointer" }}
                onClick={() => navigate(`/user/${member?.value}`)}
              >
                {member?.label}
              </span>
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "15px",
                marginTop: "5px",
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
          <Title>სპეციალისტის მიერ შეთავაზებული პროცედურები</Title>
          <Select
            placeholder="სპეციალისტი პროცედურები"
            components={animatedComponents}
            onChange={(value) => {
              setProcedures(value);
            }}
            isMulti
            required
            value={procedures}
            components={animatedComponents}
            styles={{
              control: (baseStyles, state) => ({
                ...baseStyles,
                borderColor: state.isFocused
                  ? "rgba(0,0,0,0)"
                  : "rgba(0,0,0,0.1)",
                width: "25vw",
                minHeight: "2vw",
                cursor: "pointer",
                "@media only screen and (max-width: 1200px)": {
                  width: "80vw",
                  fontSize: "16px",
                },
              }),
            }}
            options={option}
          />
          <Title>სამუშაო გამოცდილება სილამაზის სფეროში</Title>
          <Select
            placeholder="გამოცდილება"
            components={animatedComponents}
            onChange={(value) => {
              setExperience(value);
            }}
            required
            value={experience}
            components={animatedComponents}
            styles={{
              control: (baseStyles, state) => ({
                ...baseStyles,
                borderColor: state.isFocused
                  ? "rgba(0,0,0,0)"
                  : "rgba(0,0,0,0.1)",
                width: "15vw",
                minHeight: "2vw",
                cursor: "pointer",
                "@media only screen and (max-width: 1200px)": {
                  width: "50vw",
                  fontSize: "16px",
                },
              }),
            }}
            options={experienceOption}
          />
          <Success
            open={open}
            setOpen={setOpen}
            title="მოწვევა წარმატებით გაიგზავნა!"
            type="success"
          />
          <Button type="submit">მოწვევის გაგზავნა</Button>
        </AddMember>
      )}
      {team?.filter((item) => item.confirm === true)?.length > 0 && (
        <MemberList>
          <MemberRow>
            <div style={{ flex: 1, fontWeight: "bold" }}>სახელი</div>
            <div style={{ flex: 1, fontWeight: "bold" }}>პროცედურები</div>{" "}
            <div style={{ flex: 1, fontWeight: "bold" }}>გამოცდილება</div>
          </MemberRow>
          {team?.map((item, index) => {
            if (item?.confirm === true) {
              return (
                <MemberRow key={index}>
                  <div
                    style={{
                      flex: 1,
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      cursor: "pointer",
                    }}
                    onClick={() => navigate(`/user/${item.id}`)}
                  >
                    <Avatar
                      alt={item?.name}
                      src={item?.cover !== undefined ? item?.cover : ""}
                      sx={{ width: 24, height: 24 }}
                    />
                    {item.name}
                  </div>
                  <div
                    style={{ flex: 1, display: "flex", alignItems: "center" }}
                  >
                    <ProceduresPopup procedures={item?.procedures} />
                  </div>{" "}
                  <div
                    style={{
                      flex: 1,
                      flex: 1,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    {item.experience?.label}
                    {currentuser?.id === user?.id && (
                      <HiUserRemove
                        size={22}
                        style={{ cursor: "pointer", color: "#333" }}
                        onClick={() => setOpenDialog(true)}
                      />
                    )}
                  </div>
                  <AlertDialog
                    title="დაადასტურეთ აქტივობა"
                    open={openDialog}
                    setOpen={setOpenDialog}
                    text="ნამდვილად გსურთ გუნდის წევრის წაშლა?"
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
    padding-left: 2vw;
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
  box-shadow: 0 0.1vw 0.2vw rgba(0, 0, 0, 0.2);
  background: #fff;
`;

const InputContainer = styled.div`
  width: 15vw;
  height: 2.5vw;
  border-radius: 0.5vw;
  box-shadow: 0 0.1vw 0.3vw rgba(2, 2, 2, 0.1);
  border: none;
  display: flex;
  align-items: center;
  justify-content: start;
  gap: 0.5vw;
  transition: ease-in 200ms;
  box-sizing: border-box;

  @media only screen and (max-width: 600px) {
    box-shadow: 0 0.2vw 0.6vw rgba(2, 2, 2, 0.1);
    width: 45vw;
    height: 10vw;
    border-radius: 1.5vw;
    font-size: 16px;
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
  box-shadow: 0 0.1vw 0.3vw rgba(2, 2, 2, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: ease-in 200ms;
  color: ${(props) => (props.back ? "#ccc" : "green")};
  font-weight: bold;
  background: rgba(255, 255, 255, 0.7);
  border: none;
  margin-top: 1vw;

  @media only screen and (max-width: 600px) {
    width: 45vw;
    height: 8vw;
    border-radius: 1.5vw;
    box-shadow: 0 0.3vw 0.6vw rgba(2, 2, 2, 0.2);
    font-size: 3.8vw;
  }

  :hover {
    box-shadow: 0 0.1vw 0.3vw rgba(2, 2, 2, 0.2);
  }
`;

const MemberRow = styled.div`
  width: 42vw;
  border-bottom: 1px solid #ccc;
  padding: 15px;
  display: flex;
  font-size: 0.8vw;
  transition: ease 200;

  :hover {
    background: #f1f1f1;
  }
`;
