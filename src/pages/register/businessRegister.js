import React, { useState, useContext } from "react";
import styled from "styled-components";
import { Button } from "../../components/button";
import { useSelector, useDispatch } from "react-redux";
import {
  setRegisterPage,
  setCategories,
  setWorkingDays,
  setInstagram,
  setFacebook,
  setTiktok,
  setYoutube,
  setOtherMedia,
  setOnAdress,
  setWorkingPlace,
  setWeb,
} from "../../redux/register";
import { useNavigate } from "react-router-dom";
import { FaUserEdit } from "react-icons/fa";
import { ImProfile } from "react-icons/im";
import { MdAddBusiness } from "react-icons/md";
import { AiOutlineProfile } from "react-icons/ai";
import Select from "react-select";
import makeAnimated from "react-select/animated";
import { AuthContext } from "../../context/AuthContext";
import {
  proceduresOptions,
  categoriesOptions,
  workingPlacesOptions,
  workingDaysOptions,
} from "../../data/registerDatas";
import { db, auth } from "../../firebase";
import { doc, setDoc, serverTimestamp, collection } from "firebase/firestore";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import useWindowDimensions from "../../functions/dimensions";

const animatedComponents = makeAnimated();

export const BusinessRegister = (props) => {
  const { height, width } = useWindowDimensions();
  const mainDispatch = useDispatch();
  const navigate = useNavigate();
  const { dispatch } = useContext(AuthContext);
  const page = useSelector((state) => state.storeRegister.page);
  // define user type
  const type = useSelector((state) => state.storeRegister.userType);
  const registerFields = useSelector((state) => state.storeRegister);
  const map = useSelector((state) => state.storeRegister.map);

  const HandleSubmit = async (e) => {
    e.preventDefault();
    if (registerFields?.categories?.length < 1) {
      alert("Please Input Required Fields");
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
      return alert("Please Input Valid Phone Phone Number");
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

  let categories;
  if (registerFields?.categories?.length > 0) {
    categories = registerFields?.categories?.map((item, index) => {
      return item.value;
    });
  }

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
        workingPlace:
          registerFields?.workingPlace?.length > 0
            ? registerFields?.workingPlace
            : "",
        workingDays:
          registerFields?.workingDays?.length > 0
            ? registerFields?.workingDays
            : "",
        lastPost: serverTimestamp(),
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
      navigate("/user");
    } catch (err) {
      alert(err);
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
            : "ინფორმაცია სამუშაოს შესახებ"}
        </Title>
        <WrapperContainer onSubmit={HandleSubmit}>
          <Button
            title="Back"
            function={() => navigate("/register/identify")}
            back={true}
          />
          <Fields>
            <>
              <TitleWrapper>
                <InputTitle>
                  {type == "shop" ? "აირჩიე კატეგორიები" : "სერვისები"}*
                </InputTitle>
              </TitleWrapper>
              <Wrapper>
                <Select
                  placeholder={
                    type == "shop" ? "დაამატე კატეგორიები" : "დაამატე სერვისი"
                  }
                  isMulti
                  components={animatedComponents}
                  onChange={(value) => {
                    mainDispatch(setCategories(value));
                  }}
                  styles={{
                    control: (baseStyles, state) => ({
                      ...baseStyles,
                      borderColor: state.isFocused
                        ? "rgba(0,0,0,0)"
                        : "rgba(0,0,0,0.1)",
                      width: "38vw",
                      minHeight: "2vw",
                      cursor: "pointer",
                      "@media only screen and (max-width: 1200px)": {
                        width: "85vw",
                        fontSize: "16px",
                      },
                    }),
                  }}
                  options={type == "shop" ? categoriesOptions : option}
                />
              </Wrapper>
              {type != "shop" && (
                <>
                  <TitleWrapper>
                    <InputTitle>სამუშაო დღეები (სურვილისამებრ)</InputTitle>
                  </TitleWrapper>
                  <Wrapper>
                    <Select
                      placeholder="სამუშაო დღეები"
                      isMulti
                      components={animatedComponents}
                      onChange={(value) => {
                        mainDispatch(setWorkingDays(value));
                      }}
                      styles={{
                        control: (baseStyles, state) => ({
                          ...baseStyles,
                          borderColor: state.isFocused
                            ? "rgba(0,0,0,0)"
                            : "rgba(0,0,0,0.1)",
                          width: "38vw",
                          minHeight: "2vw",
                          cursor: "pointer",
                          "@media only screen and (max-width: 1200px)": {
                            width: "85vw",
                            fontSize: "16px",
                          },
                        }),
                      }}
                      options={workingDaysOptions}
                    />
                  </Wrapper>
                </>
              )}
            </>
            {type != "shop" && (
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
                    styles={{
                      control: (baseStyles, state) => ({
                        ...baseStyles,
                        borderColor: state.isFocused
                          ? "rgba(0,0,0,0)"
                          : "rgba(0,0,0,0.1)",
                        width: "38vw",
                        minHeight: "2vw",
                        cursor: "pointer",
                        "@media only screen and (max-width: 1200px)": {
                          width: "85vw",
                          fontSize: "16px",
                        },
                      }),
                    }}
                    options={workingPlacesOptions}
                  />
                </Wrapper>
                <div id="recaptcha-container"></div>
              </>
            )}
            <></>
          </Fields>
          <Button title="Next" type="Submit" function={HandleSubmit} />
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
  overflow-y: scroll;

  @media only screen and (max-width: 600px) {
    justify-content: start;
    font-size: 3vw;
    padding-top: 30vw;
    padding-bottom: 15vw;
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
`;

const Wrapper = styled.div`
  display: flex;
  gap: 1vw;

  @media only screen and (max-width: 600px) {
    justify-content: start;
  }
`;

const TitleWrapper = styled.div`
  display: flex;
  gap: 1vw;

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
