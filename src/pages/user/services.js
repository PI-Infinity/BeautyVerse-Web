import React, { useContext, useEffect, useState } from "react";
import styled from "styled-components";
import Loader from "react-js-loader";
import { db } from "../../firebase";
import {
  doc,
  updateDoc,
  deleteDoc,
  setDoc,
  onSnapshot,
  collection,
} from "firebase/firestore";
import { useSelector, useDispatch } from "react-redux";
import { TiDeleteOutline } from "react-icons/ti";
import { MdLibraryAdd } from "react-icons/md";
import { ImCheckmark } from "react-icons/im";
import { GiConfirmed } from "react-icons/gi";
import Select from "react-select";
import makeAnimated from "react-select/animated";
import {
  proceduresOptions,
  workingPlacesOptions,
  workingDaysOptions,
} from "../../data/registerDatas";
import useWindowDimensions from "../../functions/dimensions";
import { IsMobile } from "../../functions/isMobile";
import { useOutletContext } from "react-router-dom";
import { RiEdit2Fill } from "react-icons/ri";

const animatedComponents = makeAnimated();

export const Services = () => {
  const [user] = useOutletContext();
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
      alert("ბოლო სერვისისი წაშლა შეუძლებელია");
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

  const [editWorkingPlace, setEditWorkingPlace] = React.useState("");
  const [editWorkingDays, setEditWorkingDays] = React.useState("");
  const [editWorkingHours, setEditWorkingHours] = React.useState("");
  const [edit, setEdit] = React.useState(false);

  // update working places
  const UpdateWorkingPlace = (newValue) => {
    const base = doc(db, "users", `${user?.id}`);
    if (editWorkingPlace?.length > 0) {
      updateDoc(base, {
        workingPlace: editWorkingPlace,
      });
      setEditWorkingPlace("");
    }
    setEditWorkingPlace("");
    setEdit(false);
  };
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

  setTimeout(() => {
    setLoading(false);
  }, 300);

  return (
    <ContentContainer height={height}>
      <WrapperOne>
        <WorkingDays>
          <span style={{ fontWeight: "bold" }}>სამუშაო დღეები:</span>
          <div>
            {user?.workingDays
              ?.sort(function (a, b) {
                return a.id - b.id;
              })
              ?.map((item, index) => {
                return <div key={item.id}>{item.label}</div>;
              })}
          </div>
          {edit === "days" && (
            <Select
              placeholder="დაამატე სამუშაო დღეები"
              components={animatedComponents}
              onChange={(value) => {
                setEditWorkingDays(value);
              }}
              placeholder="სამუშაო დღეები"
              isMulti
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
              options={workingDaysOptions}
            />
          )}
          {edit === "days" ? (
            <ImCheckmark
              className="confirmIcon"
              onClick={() => setEdit(false)}
              onClick={UpdateWorkingDays}
            />
          ) : (
            <RiEdit2Fill className="editIcon" onClick={() => setEdit("days")} />
          )}
        </WorkingDays>
        <WorkingDays>
          <span style={{ fontWeight: "bold" }}>სამუშაო გარემო:</span>
          <div>
            {user?.workingPlace
              ?.sort(function (a, b) {
                return a.id - b.id;
              })
              ?.map((item, index) => {
                return <div key={item.id}>{item.label}</div>;
              })}
          </div>
          {edit === "place" && (
            <Select
              placeholder="დაამატე სამუშაო დღეები"
              components={animatedComponents}
              onChange={(value) => {
                setEditWorkingPlace(value);
              }}
              placeholder="სამუშაო დღეები"
              isMulti
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
              options={workingPlacesOptions}
            />
          )}
          {edit === "place" ? (
            <ImCheckmark
              className="confirmIcon"
              onClick={() => setEdit(false)}
              onClick={UpdateWorkingPlace}
            />
          ) : (
            <RiEdit2Fill
              className="editIcon"
              onClick={() => setEdit("place")}
            />
          )}
        </WorkingDays>
        {/* <WorkingDays>
          <span style={{ fontWeight: "bold" }}>სამუშაო ადგილი:</span>
          {user?.workingPlace?.map((item, index) => {
            return (
              <div key={index}>
                {item.label}
                {index != user.workingPlace?.length - 1 && ","}
              </div>
            );
          })}
          {user?.id === currentuser?.id && (
            <>
              {edit == "place" ? (
                <ImCheckmark className="confirmIcon" onClick={UpdateLink} />
              ) : (
                <RiEdit2Fill
                  className="editIcon"
                  onClick={() => setEditWorkingPlace(item.id)}
                />
              )}
            </>
          )}
        </WorkingDays>
        <WorkingDays>
          <span style={{ fontWeight: "bold" }}>სამუშაო საათები:</span>
          {user?.workingHours?.map((item, index) => {
            return <div key={index}>{item.label}</div>;
          })}
          {user?.id === currentuser?.id && (
            <>
              {edit == "place" ? (
                <ImCheckmark
                  className="confirmIcon"
                  onClick={UpdateWorkingHours}
                />
              ) : (
                <RiEdit2Fill
                  className="editIcon"
                  onClick={() => setEditWorkingHours(item.id)}
                />
              )}
            </>
          )}
        </WorkingDays> */}
      </WrapperOne>
      <ServicesContainer>
        <span style={{ fontWeight: "bold", marginTop: "1vw" }}>სერვისები:</span>
        <Servs>
          {user?.id === currentuser?.id && (
            <>
              {!addService ? (
                <MdLibraryAdd
                  className="open"
                  onClick={() => setAddService(true)}
                />
              ) : (
                <ImCheckmark className="add" onClick={Adding} />
              )}
            </>
          )}
          {addService && (
            <SelectContainer>
              <Select
                placeholder="დაამატე სერვისი"
                components={animatedComponents}
                onChange={(value) => {
                  setAddServiceInput(value);
                }}
                styles={{
                  control: (baseStyles, state) => ({
                    ...baseStyles,
                    borderColor: state.isFocused
                      ? "rgba(0,0,0,0)"
                      : "rgba(0,0,0,0.1)",
                    width: "100%",
                    cursor: "pointer",
                  }),
                }}
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
            </SelectContainer>
          )}
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
                            placeholder="ფასი"
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
                  <TiDeleteOutline
                    className="remove"
                    onClick={() => Deleting(item.value)}
                  />
                )}
              </ServiceItemContainer>
            );
          })}
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
  padding-left: 2vw;
  width: 100%;
  min-height: 57vh;
  gap: 1vw;
  margin-bottom: 5vw;
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
  gap: 1vw;

  @media only screen and (max-width: 600px) {
    flex-direction: column;
  }
`;

const SelectContainer = styled.div`
  width: 45vw;
  @media only screen and (max-width: 600px) {
    width: 81vw;
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

  @media only screen and (max-width: 600px) {
    min-height: 8vw;
    align-items: start;
    gap: 3vw;
  }

  & span {
    @media only screen and (max-width: 600px) {
      font-size: 3.5vw;
    }
  }

  & div {
    @media only screen and (max-width: 600px) {
      font-size: 3vw;
    }
  }
`;

const ServicesContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1vw;

  .remove {
    font-size: 1.5vw;
    color: #555;
    cursor: pointer;
    position: relative;
    left: 1vw;

    @media only screen and (max-width: 600px) {
      font-size: 6vw;
      left: 0;
    }

    :hover {
      color: #aaa;
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
    color: #555;
    cursor: pointer;

    @media only screen and (max-width: 600px) {
      font-size: 8vw;
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
      font-size: 8vw;
    }

    :hover {
      filter: brightness(1.1);
    }
  }
`;

const ServiceItemContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.3vw;
  margin-top: 10px;

  @media only screen and (max-width: 600px) {
    gap: 1vw;
  }
`;

const ServiceItem = styled.div`
  padding: 0.2vw 0.5vw 0.2vw 1vw;
  border: 1px solid #f3f3f3;
  border-radius: 0.25vw;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5vw;
  background: white;
  box-sizing: border-box;
  width: 40vw;
  height: 2.5vw;

  @media only screen and (max-width: 600px) {
    width: 81vw;
    height: 8vw;
    border-radius: 1vw;
    padding: 0 0 0 3vw;
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
