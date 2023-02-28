import React, { useContext } from "react";
import styled from "styled-components";
import { useSelector, useDispatch } from "react-redux";
import {
  setName,
  setEmail,
  setPhoneNumber,
  setPassword,
  setCountryCode,
  setConfirmPassowrd,
} from "../../redux/register";
import { FaUserEdit } from "react-icons/fa";
import { ImProfile } from "react-icons/im";
import { MdAddBusiness } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { db, auth } from "../../firebase";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import MapAutocomplete from "../../components/mapAutocomplete";
import { RiShoppingCartFill } from "react-icons/ri";
import ReactGoogleMapLoader from "react-google-maps-loader";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import PhoneCode from "react-phone-code";
import useWindowDimensions from "../../functions/dimensions";
import { Button } from "../../components/button";
import { v4 } from "uuid";
import { Language } from "../../context/language";
import { IsMobile } from "../../functions/isMobile";

export const Identify = (props) => {
  const language = Language();
  const isMobile = IsMobile();
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
      return alert(`${language?.language.Auth.auth.valid}`);
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
        address: {
          number: 1,
          country: map.country,
          region: map.region,
          city: map.city,
          district: map.district,
          address: map.street,
          streetNumber: map.number,
          latitude: map.latitude,
          longitude: map.longitude,
        },
        lastPost: serverTimestamp(),
        registerDate: serverTimestamp(),
      });
      var actionId = v4();
      await setDoc(
        doc(db, `users`, `${user.uid}`, "notifications", `${actionId}`),
        {
          id: actionId,
          senderId: "beautyVerse",
          text: `${language?.language.Auth.auth.successRegister}`,
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
            alert(`${language?.language.Auth.auth.usedPhone}`);
          } else if (userRegistered2 !== undefined) {
            alert(`${language?.language.Auth.auth.usedEmail}`);
          }
        }
      } else {
        alert(`${language?.language.Auth.auth.passNotMatch}`);
      }
    } else {
      alert(`${language?.language.Auth.auth.pleaseInput}`);
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

  /// address
  const [address, setAddress] = React.useState("");

  return (
    <>
      <Container
        height={height}
        style={{ display: !flag ? "visible" : "none" }}
      >
        <Title>
          {icon}
          <span>{language?.language.Auth.auth.identify}</span>
        </Title>
        <WrapperContainer onSubmit={HandleSubmit}>
          {!isMobile && (
            <Button
              title={language?.language.Auth.auth.back}
              back={true}
              function={() => navigate("/register")}
            />
          )}
          <Fields>
            <>
              <TitleWrapper>
                <InputTitle>
                  {type == "beautyCenter" || type == "shop"
                    ? language?.language.Auth.auth.title
                    : language?.language.Auth.auth.name}
                  *
                </InputTitle>
                <InputTitle>{language?.language.Auth.auth.address}*</InputTitle>
              </TitleWrapper>
              <Wrapper>
                <InputWrapper>
                  <Input
                    requred
                    type="text"
                    placeholder={
                      type == "beautyCenter" || type == "shop"
                        ? language?.language.Auth.auth.title
                        : language?.language.Auth.auth.name
                    }
                    onChange={(e) => mainDispatch(setName(e.target.value))}
                    value={registerFields?.name}
                  />
                </InputWrapper>
                {/* <InputWrapper> */}
                <MapAutocomplete
                  language={language}
                  address={address}
                  setAddress={setAddress}
                />
                {/* </InputWrapper> */}
              </Wrapper>
            </>
            <>
              <TitleWrapper>
                <InputTitle>{language?.language.Auth.auth.email}*</InputTitle>
                <InputTitle>{language?.language.Auth.auth.phone}*</InputTitle>
              </TitleWrapper>
              <Wrapper>
                <InputWrapper>
                  <Input
                    required
                    type="text"
                    placeholder={language?.language.Auth.auth.email}
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
                    placeholder={language?.language.Auth.auth.phone}
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
                <InputTitle>
                  {language?.language.Auth.auth.password}*
                </InputTitle>
                <InputTitle>
                  {language?.language.Auth.auth.confirmPassword}*
                </InputTitle>
              </TitleWrapper>
              <Wrapper>
                <InputWrapper>
                  <Input
                    required
                    type="password"
                    placeholder={language?.language.Auth.auth.password}
                    onChange={(e) => mainDispatch(setPassword(e.target.value))}
                    value={registerFields?.password}
                  />
                </InputWrapper>
                <InputWrapper>
                  <Input
                    required
                    type="password"
                    placeholder={language?.language.Auth.auth.confirmPassword}
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
          {!isMobile && (
            <Button
              title={language?.language.Auth.auth.next}
              type="Submit"
              function={HandleSubmit}
            />
          )}
        </WrapperContainer>
        <MobileButtons>
          {" "}
          <Button
            title={language?.language.Auth.auth.back}
            back={true}
            function={() => navigate("/register")}
          />
          <Button
            title={language?.language.Auth.auth.next}
            type="Submit"
            function={HandleSubmit}
          />
        </MobileButtons>
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
        <Title>{language?.language.Auth.auth.verify}</Title>
        <InputWrapper>
          <Input
            type="text"
            placeholder="enter code"
            onChange={(e) => setOTP(e.target.value)}
            value={otp}
          />
        </InputWrapper>
        <SubmitButton type="submit">
          {language?.language.Auth.auth.confirm}
        </SubmitButton>
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
    justify-content: start;
    font-size: 3vw;
    padding-top: 40vw;
  }

  .userIcon {
    font-size: 2vw;
    // margin-bottom: -1.5vw;

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
    // margin-bottom: -1.5vw;

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
  color: ${(props) => props.theme.font};

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
  color: ${(props) => props.theme.font};
  background: ${(props) => props.theme.categoryItem};

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
    color: ${(props) => props.theme.font};
    background: ${(props) => props.theme.categoryItem};

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
  color: ${(props) => props.theme.font};
  background: ${(props) => props.theme.categoryItem};

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
    color: ${(props) => props.theme.font};
  }
`;

const InputTitle = styled.div`
  flex: 1;
  margin-bottom: -0.5vw;
  color: #888;

  @media only screen and (max-width: 600px) {
    font-size: 3vw;
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

const MobileButtons = styled.div`
  display: none;

  @media only screen and (max-width: 600px) {
    display: flex;
    align-items: center;
    justify-content: space-evenly;
    position: fixed;
    bottom: 3vw;
    gap: 15px;
  }
`;
