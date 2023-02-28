import React, { useState } from "react";
import styled from "styled-components";
import { db } from "../../firebase";
import {
  doc,
  updateDoc,
  deleteDoc,
  setDoc,
  onSnapshot,
  collection,
} from "firebase/firestore";
import { useSelector } from "react-redux";
import { TiDeleteOutline } from "react-icons/ti";
import { MdLibraryAdd } from "react-icons/md";
import { ImCheckmark } from "react-icons/im";
import { GiConfirmed } from "react-icons/gi";
import Select from "react-select";
import makeAnimated from "react-select/animated";
import {
  ProceduresOptions,
  workingDaysOptions,
} from "../../data/registerDatas";
import useWindowDimensions from "../../functions/dimensions";
import { IsMobile } from "../../functions/isMobile";
import { useOutletContext } from "react-router-dom";
import { RiEdit2Fill } from "react-icons/ri";
import AlertDialog from "../../components/dialog";
import BasicTimePicker from "../../components/timePicker";

const animatedComponents = makeAnimated();

export const Services = () => {
  const proceduresOptions = ProceduresOptions();

  const [user, language] = useOutletContext();
  const isMobile = IsMobile();
  const [loading, setLoading] = React.useState(true);
  const { height, width } = useWindowDimensions();

  // import current user from redux state
  const userUnparsed = useSelector((state) => state.storeMain.user);
  let currentuser;
  if (userUnparsed?.length > 0) {
    currentuser = JSON.parse(userUnparsed);
  }

  // import services
  const [services, setServices] = React.useState([]);

  React.useEffect(() => {
    const data = onSnapshot(
      collection(db, "users", `${user?.id}`, "procedures"),
      (snapshot) => {
        setServices(snapshot.docs.map((doc) => doc.data()));
      }
    );
    return data;
  }, []);

  const [addService, setAddService] = useState(false);
  const [addServiceInput, setAddServiceInput] = useState("");
  const [addPrice, setAddPrice] = useState("");

  // add service to firebase
  const Adding = async () => {
    if (addServiceInput < 1) {
      setAddService(false);
    } else {
      const main = doc(db, "users", `${user.id}`);
      await updateDoc(main, {
        filterCategories: [...user?.filterCategories, addServiceInput.value],
      });
      const base = doc(
        db,
        "users",
        `${user.id}`,
        "procedures",
        addServiceInput.value
      );
      await setDoc(base, {
        value: addServiceInput.value,
      });
      setAddServiceInput("");
      setAddService(false);
    }
  };
  // add service to firebase
  const AddPrice = async (prop) => {
    const base = doc(db, "users", `${user.id}`, "procedures", prop);
    await updateDoc(base, {
      price: addPrice,
    });
    setAddPrice("");
  };

  // delete service
  const Deleting = async (prop) => {
    if (services?.length == 1) {
    } else {
      const main = doc(db, "users", `${user.id}`);
      let less = user?.filterCategories?.filter((item) => item != prop);
      await updateDoc(main, {
        filterCategories: less,
      });
      const base = doc(db, "users", `${user.id}`, "procedures", prop);
      // let less = user?.services?.filter((item) => item != prop);
      deleteDoc(base);
    }
  };

  // const [editWorkingPlace, setEditWorkingPlace] = React.useState("");
  const [editWorkingDays, setEditWorkingDays] = React.useState("");
  const [edit, setEdit] = React.useState(false);

  const [startingHours, setStartingHours] = React.useState(null);
  const [endingHours, setEndingHours] = React.useState(null);

  // define working days options language
  const lang = useSelector((state) => state.storeMain.language);
  let workingDaysOpt;
  if (lang === "ka") {
    workingDaysOpt = workingDaysOptions?.map((item) => {
      return { value: item.value, label: item.ka };
    });
  } else if (lang === "ru") {
    workingDaysOpt = workingDaysOptions?.map((item) => {
      return { value: item.value, label: item.ru };
    });
  } else {
    workingDaysOpt = workingDaysOptions?.map((item) => {
      return { value: item.value, label: item.en };
    });
  }

  // update working days
  const UpdateWorkingDays = (newValue) => {
    const base = doc(db, "users", `${user?.id}`);
    if (editWorkingDays?.length > 0) {
      updateDoc(base, {
        workingDays: editWorkingDays,
      });
    }
    setEditWorkingDays("");
    setEdit(false);
  };

  const UpdateWorkingHours = () => {
    const base = doc(db, "users", `${user?.id}`);
    if (startingHours !== null && endingHours !== null) {
      updateDoc(base, {
        workingHours: {
          start: startingHours?.$d?.toString().slice(16, 21),
          end: endingHours?.$d?.toString().slice(16, 21),
        },
      });
      setEndingHours("");
      setStartingHours("");
      setEdit(false);
    } else {
      alert("Add starting and ending time");
    }
  };

  // confirm remove service
  const [confirmRemove, setConfirmRemove] = React.useState(false);
  // import user gallery images from firestore
  const [removeData, setRemoveData] = useState("");

  // color mode
  const theme = useSelector((state) => state.storeMain.theme);
  const CustomStyle = {
    singleValue: (base, state) => ({
      ...base,
      color: state.isSelected
        ? theme
          ? "#333"
          : "#f3f3f3"
        : theme
        ? "#f3f3f3"
        : "#333",
    }),
    placeholder: (base, state) => ({
      ...base,
      color: state.isSelected
        ? theme
          ? "#333"
          : "#f3f3f3"
        : theme
        ? "#f3f3f3"
        : "#333",
    }),
    input: (base, state) => ({
      ...base,
      color: theme ? "#f3f3f3" : "#333",
      fontSize: "16px",
    }),
    menuList: (base, state) => ({
      ...base,
      backgroundColor: theme ? "#333" : "#f3f3f3",
    }),
    option: (base, state) => ({
      ...base,
      backgroundColor: state.isSelected
        ? theme
          ? "#f3f3f3"
          : "#333"
        : theme
        ? "#333"
        : "#f3f3f3",
      color: state.isSelected
        ? theme
          ? "#333"
          : "#f3f3f3"
        : theme
        ? "#f3f3f3"
        : "#333",
    }),
    control: (baseStyles, state) => ({
      ...baseStyles,
      backgroundColor: theme ? "#333" : "#fff",
      borderColor: state.isFocused ? "rgba(0,0,0,0)" : "rgba(0,0,0,0.1)",
      width: "38vw",
      minHeight: "2vw",
      cursor: "pointer",
      "@media only screen and (max-width: 1200px)": {
        width: "85vw",
        fontSize: "16px",
      },
    }),
  };

  setTimeout(() => {
    setLoading(false);
  }, 300);

  return (
    <ContentContainer height={height}>
      <WrapperOne>
        <WorkingDays>
          <span style={{ fontWeight: "bold" }}>
            {language?.language.User.userPage.workingDays}:{" "}
            {user?.id === currentuser?.id && edit !== "days" && (
              <RiEdit2Fill className="edit" onClick={() => setEdit("days")} />
            )}
          </span>
          <div>
            {user?.workingDays
              ?.sort(function (a, b) {
                return a.id - b.id;
              })
              ?.map((item, index) => {
                let daysLang = workingDaysOpt?.find(
                  (it) => it.value === item.value
                );
                return <div key={item.id}>{daysLang.label}</div>;
              })}
          </div>
          {edit === "days" && (
            <SelectContainer
              style={{ display: "flex", gap: "10px", alignItems: "center" }}
            >
              <Select
                onChange={(value) => {
                  setEditWorkingDays(value);
                }}
                placeholder={language?.language.User.userPage.workingDays}
                isMulti
                components={animatedComponents}
                styles={CustomStyle}
                options={workingDaysOpt}
              />
              <ImCheckmark
                className="add"
                onClick={() => {
                  UpdateWorkingDays();
                  setEdit(false);
                }}
              />
            </SelectContainer>
          )}
        </WorkingDays>
        <WorkingDays>
          <span style={{ fontWeight: "bold" }}>
            {language?.language.User.userPage.workingHours + ": "}
            {user?.id === currentuser?.id && edit !== "hours" && (
              <RiEdit2Fill className="edit" onClick={() => setEdit("hours")} />
            )}
          </span>
          {edit === "hours" ? (
            <div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "start",
                  gap: "10px",
                }}
              >
                <span>{language?.language.User.userPage.startAt}</span>
                <BasicTimePicker
                  value={startingHours}
                  setValue={setStartingHours}
                  title={language?.language.User.userPage.startAt}
                />
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "start",
                  gap: "10px",
                }}
              >
                <span>{language?.language.User.userPage.endAt}</span>
                <BasicTimePicker
                  value={endingHours}
                  setValue={setEndingHours}
                  title={language?.language.User.userPage.endAt}
                />
              </div>
              <ImCheckmark
                className="add"
                onClick={() => setEdit(false)}
                onClick={UpdateWorkingHours}
              />
            </div>
          ) : (
            <span>
              {user?.workingHours !== undefined &&
                user?.workingHours?.start + "-" + user?.workingHours?.end}
            </span>
          )}
        </WorkingDays>
      </WrapperOne>
      <ServicesContainer>
        <span style={{ fontWeight: "bold", marginTop: "1vw" }}>
          {language?.language.User.userPage.service}:
        </span>
        <Servs>
          {user?.id === currentuser?.id && (
            <>
              {!addService && (
                <MdLibraryAdd
                  className="open"
                  onClick={() => setAddService(true)}
                />
              )}
            </>
          )}
          {addService && (
            <SelectContainer style={{ display: "flex", gap: "10px" }}>
              <Select
                placeholder={language?.language.User.userPage.addService}
                components={animatedComponents}
                onChange={(value) => {
                  setAddServiceInput(value);
                }}
                styles={CustomStyle}
                options={proceduresOptions?.filter((item) => {
                  let symbolCount = 0;
                  for (let i = 0; i < item.value.length; i++) {
                    if (item.value[i] === "-") {
                      symbolCount++;
                    }
                  }
                  return symbolCount === 2;
                })}
              />
              <ImCheckmark className="add" onClick={Adding} />
            </SelectContainer>
          )}
          <ServicesList>
            {services?.map((cat, index) => {
              var item = proceduresOptions?.find(
                (item) => item.value === cat.value
              );
              return (
                <ServiceItemContainer key={index}>
                  <ServiceItem>
                    <span>{item?.label}</span>
                    {user?.id !== currentuser?.id ? (
                      <>
                        {cat?.price != undefined ? (
                          <Price>
                            <h4>
                              {cat.price}
                              {`\u20BE`}
                            </h4>
                          </Price>
                        ) : undefined}
                      </>
                    ) : (
                      <>
                        {cat?.price != undefined ? (
                          <Price>
                            <h4>
                              {cat.price}
                              {`\u20BE`}
                            </h4>
                          </Price>
                        ) : (
                          <InputContainer>
                            <Input
                              type="text"
                              placeholder={
                                language?.language.User.userPage.price
                              }
                              onChange={(e) => setAddPrice(e.target.value)}
                            />
                            {`\u20BE`}

                            <GiConfirmed
                              // className="remove"
                              onClick={() => AddPrice(item.value)}
                              style={{ color: "green", cursor: "pointer" }}
                              // onClick={() => Deleting(item.value)}
                            />
                          </InputContainer>
                        )}
                      </>
                    )}
                  </ServiceItem>
                  {user?.id === currentuser?.id && (
                    <>
                      <TiDeleteOutline
                        className="remove"
                        onClick={() => {
                          setConfirmRemove(true);
                          setRemoveData(item.value);
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
                </ServiceItemContainer>
              );
            })}
          </ServicesList>
        </Servs>
      </ServicesContainer>
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
  height: 52vh;
  gap: 1vw;
  padding-bottom: 3vw;
  overflow-y: scroll;
  overflow-x: hidden;

  @media only screen and (max-width: 600px) {
    width: 90vw;
    height: calc(${(props) => props.height}px - 68vw);
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
  width: 100%;
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

const WorkingDays = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: start;
  justify-content: start;
  gap: 0.5vw;
  min-height: 2vw;
  color: ${(props) => props.theme.font};

  @media only screen and (max-width: 600px) {
    min-height: 8vw;
    align-items: start;
    gap: 3vw;
  }

  & span {
    @media only screen and (max-width: 600px) {
      font-size: 16px;
    }
  }

  & div {
    @media only screen and (max-width: 600px) {
      font-size: 16px;
    }
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

const ServicesList = styled.div`
  width: 100%;
  margin-top: 1vw;
  border-radius: 5px;
  box-shadow: 0 0.1vw 0.2vw rgba(0, 0, 0, 0.2);
  background: ${(props) => props.theme.secondLevel};
`;

const ServicesContainer = styled.div`
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

    :hover {
      color: ${(props) => props.theme.secondLevel};
    }
  }

  @media only screen and (max-width: 600px) {
    display: flex;
    flex-direction: column;
    gap: 3vw;
    margin-top: 3vw;
    font-size: 3.5vw;
  }
`;

const Servs = styled.div`
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

const ServiceItemContainer = styled.div`
  width: 42vw;
  border-bottom: 1px solid #ccc;
  padding: 10px;
  display: flex;
  align-items: center;
  font-size: 0.8vw;
  transition: ease 200;
  color: ${(props) => props.theme.font};

  :hover {
    background: ${(props) => props.theme.background};
  }

  @media only screen and (max-width: 600px) {
    width: 87vw;
    padding-right: 3vw;
    gap: 1vw;
  }
`;

const ServiceItem = styled.div`
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
    padding: 0 0 0 2vw;
    font-size: 3vw;
  }

  // & span {
  //   position: relative;
  //   bottom: 0.1vw;
  //   font-size: 0.8vw;
  // }
`;

const Price = styled.div`
  padding: 0.5vw;
  border-radius: 50vw;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.2vw;
  height: 2vw;
  width: 2vw;
  position: relative;
  right: 0;

  @media only screen and (max-width: 600px) {
    gap: 2vw;
    height: 10vw;
    width: 10vw;
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
    font-size: 4vw;
  }
`;

const Input = styled.input`
  border: none;
  border-radius: 50vw;
  background: white;
  font-size: 0.8vw;
  width: 5vw;
  height: 70%;
  padding-left: 0.25vw;
  background: ${(props) => props.theme.secondLevel};
  color: ${(props) => props.theme.font};
  @media only screen and (max-width: 600px) {
    width: 10vw;
    border-radius: 50vw;
    font-size: 16px;
    padding-left: 3vw;
    height: 70%;
  }

  :placeholder {
    font-size: 1vw;
  }

  :focus {
    outline: none;
  }
`;
