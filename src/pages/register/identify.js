import React, { useState, useContext, useEffect } from "react";
import styled from "styled-components";
import { useSelector, useDispatch } from "react-redux";
import {
  setRegisterPage,
  setName,
  setAddationalAdress,
  setEmail,
  setPhoneNumber,
  setPassword,
  setCountryCode,
  setConfirmPassowrd,
} from "../../redux/register";
import { FaUserEdit } from "react-icons/fa";
import { ImProfile } from "react-icons/im";
import { MdAddBusiness } from "react-icons/md";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { db, auth } from "../../firebase";
import { doc, setDoc, serverTimestamp, collection } from "firebase/firestore";
import axios from "axios";
import MapAutocomplete from "../../components/mapAutocomplete";
import { RiShoppingCartFill } from "react-icons/ri";
import ReactGoogleMapLoader from "react-google-maps-loader";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import PhoneCode from "react-phone-code";
import useWindowDimensions from "../../functions/dimensions";
import { Button } from "../../components/button";
import { v4 } from "uuid";
// loading google map

export const Identify = (props) => {
  const { height, width } = useWindowDimensions();
  // import users
  const usersList = useSelector((state) => state.storeMain.userList);
  let users;
  if (usersList?.length > 0) {
    users = JSON.parse(usersList);
  }
  <ReactGoogleMapLoader
    params={{
      key: "AIzaSyBxx8CORlQQBBkbGc-F0yu95DMZaiJkMmo", // Define your api key here
      libraries: "places,geometry", // To request multiple libraries, separate them with a comma
    }}
    render={(googleMaps) => googleMaps && <div>Google Maps is loaded !</div>}
  />;
  const mainDispatch = useDispatch();
  const navigate = useNavigate();
  const { dispatch } = useContext(AuthContext);

  // define user type
  const type = useSelector((state) => state.storeRegister.userType);
  const registerFields = useSelector((state) => state.storeRegister);
  const map = useSelector((state) => state.storeRegister.map);

  // otp register
  const [otp, setOTP] = React.useState("");
  const [flag, setFlag] = React.useState(false);
  const [confirmObj, setConfirmObj] = React.useState("");
  // send recaptcha
  const SetupRecaptcha = (number) => {
    const recaptchaVerifer = new RecaptchaVerifier(
      "recaptcha-container",
      {},
      auth
    );
    recaptchaVerifer.render(number);
    return signInWithPhoneNumber(auth, number, recaptchaVerifer);
  };
  // get otp
  const GetOTP = async (e) => {
    e.preventDefault();
    if (
      registerFields?.phoneNumber === "" ||
      registerFields?.phoneNumber === undefined
    ) {
      return alert("Please Input Valid Phone Number");
    }
    try {
      const num = registerFields?.countryCode + registerFields?.phoneNumber;
      const response = await SetupRecaptcha(num);
      setConfirmObj(response);
      setFlag(true);
    } catch (err) {
      alert(err);
    }
  };

  //verify code
  const VerifyOTP = async (e) => {
    e.preventDefault();
    if (otp === "" || otp === null) return;
    try {
      const userCredential = await confirmObj.confirm(otp);
      console.log(userCredential);
      const user = userCredential.user;
      await dispatch({ type: "LOGIN", payload: user });
      // create user database
      await setDoc(doc(db, `users`, user.uid), {
        id: user.uid,
        type: type,
        name: registerFields?.name,
        password: registerFields?.password,
        email: registerFields?.email,
        phone: registerFields?.countryCode + registerFields?.phoneNumber,
        adress: {
          country: map.country,
          region: map.region,
          city: map.city,
          destrict: map.destrict,
          adress: map.street,
          streetNumber: map.number,
          latitude: map.latitude,
          longitude: map.longitude,
        },
        lastPost: serverTimestamp(),
      });
      var actionId = v4();
      await setDoc(
        doc(db, `users`, `${user.uid}`, "notifications", `${actionId}`),
        {
          id: actionId,
          senderId: "beautyVerse",
          senderName: "Beautyverse",
          senderCover: "",
          text: `თქვენ წარმატებით დარეგისტრირდით!`,
          date: serverTimestamp(),
          type: "welcome",
          status: "unread",
          feed: ``,
        }
      );
      navigate(`/user/${user?.uid}`);
    } catch (err) {
      alert(err);
    }
  };

  const HandleSubmit = (e) => {
    e.preventDefault();
    if (
      registerFields?.name?.length > 3 &&
      registerFields?.countryCode?.length > 3 &&
      registerFields?.phoneNumber?.length > 7 &&
      registerFields?.email?.length > 5 &&
      map?.country?.length > 5 &&
      map?.city?.length > 3
    ) {
      if (registerFields?.password === registerFields?.confirmPassowrd) {
        /**
         * define user registered or not
         */
        const userRegistered = users.find(
          (item) =>
            item.phone ===
            registerFields?.countryCode + registerFields?.phoneNumber
        );
        const userRegistered2 = users.find(
          (item) => item.email === registerFields?.email
        );
        if (userRegistered === undefined && userRegistered2 === undefined) {
          let HandleSubmit;
          if (type == "user") {
            GetOTP(e);
          } else if (
            type === "specialist" ||
            type === "beautyCenter" ||
            type === "shop"
          ) {
            navigate("/register/business");
          } else {
            navigate("/register");
          }
          return HandleSubmit;
        } else {
          if (userRegistered !== undefined) {
            alert("Phone Number Already Used");
          } else if (userRegistered2 !== undefined) {
            alert("Email Already Used");
          }
        }
      } else {
        alert("Password doesn't match");
      }
    } else {
      alert("Please Input Fields");
    }
  };

  // define title icon
  let icon;
  if (type === "user") {
    icon = <FaUserEdit className="userIcon" />;
  } else if (type === "specialist") {
    icon = <ImProfile className="specIcon" />;
  } else if (type === "beautyCenter") {
    icon = <MdAddBusiness className="businessIcon" />;
  } else if (type === "shop") {
    icon = <RiShoppingCartFill className="businessIcon" />;
  }

  return (
    <>
      <Container
        height={height}
        style={{ display: !flag ? "visible" : "none" }}
      >
        <Title>
          {icon}
          <span>იდენტიფიკაცია</span>
        </Title>
        <WrapperContainer onSubmit={HandleSubmit}>
          <Button
            title="Back"
            back={true}
            function={() => navigate("/register")}
          />
          <Fields>
            <>
              <TitleWrapper>
                <InputTitle>
                  {type == "beautyCenter" || type == "shop"
                    ? "დასახელება"
                    : "სახელი, გვარი"}
                  *
                </InputTitle>
                <InputTitle>მისამართი</InputTitle>
              </TitleWrapper>
              <Wrapper>
                <InputWrapper>
                  <Input
                    requred
                    type="text"
                    placeholder={
                      type == "beautyCenter" || type == "shop"
                        ? "დასახელება"
                        : "სახელი, გვარი"
                    }
                    onChange={(e) => mainDispatch(setName(e.target.value))}
                    value={registerFields?.name}
                  />
                </InputWrapper>
                {/* <InputWrapper> */}
                <MapAutocomplete />
                {/* </InputWrapper> */}
              </Wrapper>
            </>
            <>
              <TitleWrapper>
                <InputTitle>ელ-ფოსტა*</InputTitle>
                <InputTitle>მობილურის ნომერი*</InputTitle>
              </TitleWrapper>
              <Wrapper>
                <InputWrapper>
                  <Input
                    required
                    type="text"
                    placeholder="ელ-ფოსტა"
                    onChange={(e) => mainDispatch(setEmail(e.target.value))}
                    value={registerFields?.email}
                  />
                </InputWrapper>
                <InputWrapper style={{ display: "flex", flexDirection: "row" }}>
                  <PhoneCode
                    onSelect={(code) => mainDispatch(setCountryCode(code))} // required
                    showFirst={["GE"]}
                    defaultValue="GE"
                    id="codes"
                    name="codes"
                    className="codes"
                    optionClassName="codesOption"
                  />
                  <Input
                    required
                    type="text"
                    placeholder="მობილურის-ნომერი"
                    onChange={(e) =>
                      mainDispatch(setPhoneNumber(e.target.value))
                    }
                    value={registerFields?.phoneNumber}
                  />
                </InputWrapper>
              </Wrapper>
            </>
            <>
              <TitleWrapper>
                <InputTitle>პაროლი*</InputTitle>
                <InputTitle>დაადასტურე პაროლი*</InputTitle>
              </TitleWrapper>
              <Wrapper>
                <InputWrapper>
                  <Input
                    required
                    type="password"
                    placeholder="პაროლი"
                    onChange={(e) => mainDispatch(setPassword(e.target.value))}
                    value={registerFields?.password}
                  />
                </InputWrapper>
                <InputWrapper>
                  <Input
                    required
                    type="password"
                    placeholder="დაადასტურე პაროლი"
                    value={registerFields?.confirmPassowrd}
                    onChange={(e) =>
                      mainDispatch(setConfirmPassowrd(e.target.value))
                    }
                  />
                </InputWrapper>
              </Wrapper>
              <div id="recaptcha-container"></div>
            </>
          </Fields>
          <Button title="შემდეგი" type="Submit" function={HandleSubmit} />
        </WrapperContainer>
      </Container>
      <Confirm
        height={height}
        onSubmit={VerifyOTP}
        className="verify"
        style={{
          display: flag ? "flex" : "none",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Title>Verify Phone Number</Title>
        <InputWrapper>
          <Input
            type="text"
            placeholder="enter code"
            onChange={(e) => setOTP(e.target.value)}
            value={otp}
          />
        </InputWrapper>
        <SubmitButton type="submit">დადასტურება</SubmitButton>
      </Confirm>
    </>
  );
};

const Container = styled.div`
  width: 100%;
  height: ${(props) => props.height}px;
  box-sizing: border-box;
  padding-top: 3vw;
  padding-bottom: 5vw;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2vw;

  @media only screen and (max-width: 600px) {
    font-size: 3vw;
    padding-top: 14vw;
    padding-bottom: 5vw;
  }

  .userIcon {
    font-size: 2vw;
    margin-bottom: -1.5vw;

    @media only screen and (max-width: 600px) {
      font-size: 7vw;
    }
  }

  .specIcon {
    font-size: 2vw;
    @media only screen and (max-width: 600px) {
      font-size: 7vw;
    }
  }

  .businessIcon {
    font-size: 2vw;
    margin-bottom: -1.5vw;

    @media only screen and (max-width: 600px) {
      font-size: 7vw;
    }
  }
`;

const Confirm = styled.form`
  width: 100%;
  height: ${(props) => props.height}px;
  box-sizing: border-box;
  padding-top: 3vw;
  padding-bottom: 5vw;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2vw;

  @media only screen and (max-width: 600px) {
    font-size: 3vw;
    padding-top: 14vw;
    padding-bottom: 3vw;
  }
`;

const Title = styled.h2`
  margin-bottom: 1vw;
  display: flex;
  align-items: center;
  gap: 15px;

  @media only screen and (max-width: 600px) {
    margin-bottom: 7vw;
  }
`;

const Fields = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1vw;
`;

const Wrapper = styled.div`
  display: flex;
  gap: 1vw;
  @media only screen and (max-width: 600px) {
    gap: 3vw;
  }
`;

const TitleWrapper = styled.div`
  display: flex;
  gap: 1vw;

  @media only screen and (max-width: 600px) {
    margin: 2vw 1vw;
  }
`;

const WrapperBtn = styled.div`
  display: flex;
  gap: 1vw;
  margin-top: 5vw;
`;

const WrapperContainer = styled.form`
  display: ${(props) => (props.flag === "true" ? "none" : "flex")};
  align-items: center;
  justify-content: center;
  gap: 10vw;

  @media only screen and (max-width: 600px) {
    flex-direction: column;
    gap: 15vw;
  }
`;

const InputWrapper = styled.div`
  width: 18.5vw;
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

  .codes {
    width: 5vw;
    height: 2.5vw;
    border-radius: 0.5vw;
    border: none;
    padding: 0.5vw;
    cursor: pointer;

    @media only screen and (max-width: 600px) {
      width: 15vw;
      height: 8vw;
    }

    :focus {
      outline: none;
    }
  }

  .codesOption {
    border: none;
    outline: none;
    border-radius: 0.5vw;
    box-shadow: 0 0.1vw 0.3vw rgba(2, 2, 2, 0.1);
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

const InputTitle = styled.div`
  flex: 1;
  margin-bottom: -0.5vw;

  @media only screen and (max-width: 600px) {
    font-size: 3vw;
    color: #888;
  }
`;

const SubmitButton = styled.button`
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
