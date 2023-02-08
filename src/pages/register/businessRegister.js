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

const animatedComponents = makeAnimated();

export const BusinessRegister = (props) => {
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
        lastPost: serverTimestamp(),
        filterCategories: categories,
      });
      let subcat;
      if (type === "specialist" || type === "beautyCenter") {
        registerFields?.categories?.map((item, index) => {
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
    <Container>
      <AiOutlineProfile className="icon" />
      <Title>
        {type == "shop"
          ? "ინფორმაცია მაღაზიის შესახებ"
          : "ინფორმაცია სამუშაოს შესახებ"}
      </Title>
      <WrapperContainer
        onSubmit={HandleSubmit}
        style={{ display: !flag ? "visible" : "none" }}
      >
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
                    width: "33vw",
                    minHeight: "2vw",
                    cursor: "pointer",
                    "@media only screen and (max-width: 1200px)": {
                      width: "85vw",
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
                        width: "33vw",
                        minHeight: "2vw",
                        cursor: "pointer",
                        "@media only screen and (max-width: 1200px)": {
                          width: "85vw",
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
                      width: "33vw",
                      minHeight: "2vw",
                      cursor: "pointer",
                      "@media only screen and (max-width: 1200px)": {
                        width: "85vw",
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
      <form
        onSubmit={VerifyOTP}
        className="verify"
        style={{
          display: flag ? "flex" : "none",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <InputWrapper>
          <Input
            type="text"
            placeholder="enter code"
            onChange={(e) => setOTP(e.target.value)}
            value={otp}
          />
        </InputWrapper>
        <button type="submit">Verify</button>
      </form>
    </Container>
  );
};

const Container = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2vw;
  margin-top: 10vw;

  .icon {
    font-size: 2vw;
    margin-bottom: -1.5vw;

    @media only screen and (max-width: 600px) {
      font-size: 6vw;
    }
  }

  .verify {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100vh;
    overflow: hidden;
    z-index: 10010;
    background: rgba(0, 0, 0, 0.2);
  }

  @media only screen and (max-width: 600px) {
    justify-content: start;
    margin-top: 25vw;
    padding-bottom: 20vw;
    overflow-y: scroll;
  }
`;

const Title = styled.h3`
  margin-bottom: 1vw;

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
    padding-left: 5vw;
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
  height: 1.5vw;
  border-radius: 0.5vw;
  box-shadow: 0 0.1vw 0.3vw rgba(2, 2, 2, 0.1);
  border: none;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.5vw;
  padding: 0.5vw;
  transition: ease-in 200ms;

  @media only screen and (max-width: 600px) {
    width: 42vw;
    height: 7vw;
    border-radius: 1.5vw;
    padding-left: 2vw;
    font-size: 16px;
  }
`;

const Input = styled.input`
  width: 15vw;
  height: 1.5vw;
  border-radius: 0.5vw;
  box-shadow: 0 0.1vw 0.3vw rgba(2, 2, 2, 0.1);
  border: none;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.5vw;
  padding: 0.5vw;
  transition: ease-in 200ms;

  @media only screen and (max-width: 600px) {
    width: 42vw;
    height: 7vw;
    border-radius: 1.5vw;
    padding-left: 2vw;
    font-size: 16px;
  }

  :focus {
    outline: none;
  }

  :hover {
    box-shadow: 0 0.2vw 0.5vw rgba(2, 2, 2, 0.2);
  }
`;

const InputTitle = styled.span`
  flex: 1;
  margin-bottom: -0.5vw;

  @media only screen and (max-width: 600px) {
    text-align: start;
    font-size: 3vw;
  }
`;
