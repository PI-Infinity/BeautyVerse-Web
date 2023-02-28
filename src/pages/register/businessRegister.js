import React, { useContext } from "react";
import styled from "styled-components";
import { Button } from "../../components/button";
import { useSelector, useDispatch } from "react-redux";
import { setCategories, setWorkingDays } from "../../redux/register";
import { useNavigate } from "react-router-dom";
import { AiOutlineProfile } from "react-icons/ai";
import Select from "react-select";
import makeAnimated from "react-select/animated";
import { AuthContext } from "../../context/AuthContext";
import {
  ProceduresOptions,
  categoriesOptions,
  workingDaysOptions,
} from "../../data/registerDatas";
import { db, auth } from "../../firebase";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import useWindowDimensions from "../../functions/dimensions";
import { v4 } from "uuid";
import { Language } from "../../context/language";
import { IsMobile } from "../../functions/isMobile";

const animatedComponents = makeAnimated();

export const BusinessRegister = (props) => {
  const language = Language();
  const { height, width } = useWindowDimensions();
  const isMobile = IsMobile();
  const mainDispatch = useDispatch();
  const navigate = useNavigate();
  const { dispatch } = useContext(AuthContext);
  const page = useSelector((state) => state.storeRegister.page);
  const proceduresOptions = ProceduresOptions();
  // define user type
  const type = useSelector((state) => state.storeRegister.userType);
  const registerFields = useSelector((state) => state.storeRegister);
  const map = useSelector((state) => state.storeRegister.map);

  const HandleSubmit = async (e) => {
    e.preventDefault();
    if (registerFields?.categories?.length < 1) {
      alert(`${language?.language.Auth.auth.pleaseInput}`);
    } else {
      GetOTP(e);
    }
  };

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
    } else {
      try {
        const num = registerFields?.countryCode + registerFields?.phoneNumber;
        const response = await SetupRecaptcha(num);
        setConfirmObj(response);
        setFlag(true);
      } catch (err) {
        alert(err);
      }
    }
  };

  let categories;
  if (registerFields?.categories?.length > 0) {
    categories = registerFields?.categories?.map((item, index) => {
      return item.value;
    });
  }

  //verify code
  const VerifyOTP = async (e) => {
    e.preventDefault();
    if (otp === "" || otp === null) {
      return;
    } else {
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
          workingDays:
            registerFields?.workingDays?.length > 0
              ? registerFields?.workingDays
              : "",
          lastPost: serverTimestamp(),
          registerDate: serverTimestamp(),
          filterCategories: categories,
        });
        let subcat;
        if (type === "specialist" || type === "beautyCenter") {
          await registerFields?.categories?.map((item, index) => {
            setDoc(doc(db, `users`, user.uid, "procedures", item.value), {
              value: item.value,
            });
          });
        }
        var actionId = v4();
        await setDoc(
          doc(db, `users`, `${user.uid}`, "notifications", `${actionId}`),
          {
            id: actionId,
            senderId: "beautyVerse",
            text: language?.language.Auth.auth.successRegister,
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
    }
  };

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
      // height: "1000px",
      color: state.isSelected
        ? theme
          ? "#333"
          : "#f3f3f3"
        : theme
        ? "#f3f3f3"
        : "#333",
      maxHeight: "50px",
    }),
    input: (base, state) => ({
      ...base,
      color: theme ? "#f3f3f3" : "#333",
      fontSize: "16px",
      maxHeight: "100px",
    }),
    multiValue: (base, state) => ({
      ...base,
      backgroundColor: state.isDisabled ? null : "lightblue",
      borderRadius: "20px",
    }),
    multiValueLabel: (base, state) => ({
      ...base,
    }),
    menuList: (base, state) => ({
      ...base,
      backgroundColor: theme ? "#333" : "#f3f3f3",
      zIndex: 1000,
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

  // define working days language
  const lang = useSelector((state) => state.storeMain.language);
  let wdOption = workingDaysOptions?.map((item, index) => {
    if (lang === "en") {
      return {
        value: item.value,
        label: item.en,
      };
    } else if (lang === "ka") {
      return {
        value: item.value,
        label: item.ka,
      };
    } else if (lang === "ru") {
      return {
        value: item.value,
        label: item.ru,
      };
    }
  });

  return (
    <>
      <Container
        height={height}
        style={{ display: !flag ? "visible" : "none" }}
      >
        <Title>
          <AiOutlineProfile className="icon" />
          {type == "shop"
            ? "ინფორმაცია მაღაზიის შესახებ"
            : language?.language.Auth.auth.aboutSalon}
        </Title>
        <WrapperContainer onSubmit={HandleSubmit}>
          {!isMobile && (
            <Button
              title={language?.language.Auth.auth.back}
              function={() => navigate("/register/identify")}
              back={true}
            />
          )}
          <Fields>
            <>
              <TitleWrapper>
                <InputTitle>
                  {type == "shop"
                    ? "აირჩიე კატეგორიები"
                    : language?.language.Auth.auth.service}
                  *
                </InputTitle>
              </TitleWrapper>
              <Wrapper cat={registerFields?.categories?.length}>
                <Select
                  placeholder={
                    type == "shop"
                      ? "დაამატე კატეგორიები"
                      : language?.language.Auth.auth.addService
                  }
                  isMulti
                  components={animatedComponents}
                  onChange={(value) => {
                    mainDispatch(setCategories(value));
                  }}
                  value={registerFields?.categories}
                  styles={CustomStyle}
                  options={type == "shop" ? categoriesOptions : option}
                />
              </Wrapper>
              {type != "shop" && (
                <>
                  <TitleWrapper>
                    <InputTitle>
                      {language?.language.Auth.auth.workingDays} (
                      {language?.language.Auth.auth.optional})
                    </InputTitle>
                  </TitleWrapper>
                  {/* <Wrapper> */}
                  <Select
                    placeholder={language?.language.Auth.auth.workingDays}
                    isMulti
                    components={animatedComponents}
                    onChange={(value) => {
                      mainDispatch(setWorkingDays(value));
                    }}
                    styles={CustomStyle}
                    options={wdOption}
                  />
                  {/* </Wrapper> */}
                </>
              )}
            </>
            {/* {type != "shop" && (
              <>
                <TitleWrapper>
                  <InputTitle>სამუშაო სივრცე (სურვილისამებრ)</InputTitle>
                </TitleWrapper>
                <Wrapper>
                  <Select
                    placeholder="სამუშაო სივრცე"
                    isMulti
                    components={animatedComponents}
                    onChange={(value) => {
                      mainDispatch(setWorkingPlace(value));
                    }}
                    styles={CustomStyle}
                    options={workingPlacesOptions}
                  />
                </Wrapper>
                </>
              )} */}
            <div id="recaptcha-container"></div>
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
            function={() => navigate("/register/identify")}
            back={true}
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
    padding-bottom: 15vw;
    padding-top: 40vw;
  }

  .icon {
    font-size: 2vw;

    @media only screen and (max-width: 600px) {
      font-size: 6vw;
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

  .icon {
    font-size: 2vw;
    @media only screen and (max-width: 600px) {
      font-size: 7vw;
    }
  }
`;

const Fields = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1vw;
  // overflow-y: scroll;
  padding: 10px;
  height: 100%;
`;

const Wrapper = styled.div`
  display: flex;
  gap: 1vw;
  color: ${(props) => props.theme.font};
  background: ${(props) => props.theme.categoryItem};
  max-height: 400px;
  overflow-y: ${(props) => (props.cat > 30 ? "scroll" : "visible")};
  height: auto;
  z-index: 900;

  @media only screen and (max-width: 600px) {
    justify-content: start;
    max-height: 300px;
  }

  /* width */
  ::-webkit-scrollbar {
    width: 0.3vw;
    height: 0.5vw;
  }

  /* Track */
  ::-webkit-scrollbar-track {
    background-color: white;
  }

  /* Handle */
  ::-webkit-scrollbar-thumb {
    background-color: red;
  }

  /* Handle on hover */
  ::-webkit-scrollbar-thumb:hover {
    background-color: #1e1e1e;
  }
`;

const TitleWrapper = styled.div`
  display: flex;
  gap: 1vw;
  color: #888;

  @media only screen and (max-width: 600px) {
    margin: 2vw 1vw;
    justify-content: center;
  }
`;

const WrapperBtn = styled.div`
  display: flex;
  gap: 1vw;
  margin-top: 5vw;
`;

const WrapperContainer = styled.form`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10vw;

  @media only screen and (max-width: 600px) {
    flex-direction: column;
    padding-left: 0vw;
    gap: 15vw;
  }
`;

const Selected = styled.select`
  border: none;
  cursor: pointer;
  width: 10vw;
  height: 2vw;
  border-radius: 0.5vw;
  padding-left: 0.5vw;
  box-shadow: 0 0.1vw 0.3vw rgba(2, 2, 2, 0.1);

  :focus {
    outline: none;
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

const InputTitle = styled.span`
  flex: 1;

  @media only screen and (max-width: 600px) {
    text-align: start;
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
