import React, { useContext, useState, useEffect } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom/";
import { Link } from "react-router-dom/";
import { AuthContext } from "../../context/AuthContext";
import { db, auth } from "../../firebase";
import { useDispatch, useSelector } from "react-redux";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import PhoneCode from "react-phone-code";
import { Button } from "../../components/button";
import useWindowDimensions from "../../functions/dimensions";
import { Language } from "../../context/language";
import MuiButton from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { AiOutlineEyeInvisible, AiOutlineEye } from "react-icons/ai";
import { updateDoc, doc } from "firebase/firestore";
import ForgotPass from "../../pages/login/forgotPassword";
import UpdatePhoneButton from "../../pages/login/updatePhoneButton";
import ChangePassword from "../../pages/login/changePassword";
import UpdatePhone from "../../pages/login/updatePhone";
import { FaPhoneAlt } from "react-icons/fa";

export default function Login() {
  const language = Language();
  const { height, width } = useWindowDimensions();
  const mainDispatch = useDispatch();

  // import users
  const usersList = useSelector((state) => state.storeMain.userList);
  let users;
  if (usersList?.length > 0) {
    users = JSON.parse(usersList);
  }

  //signin with email and password
  const [code, setCode] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  // otp register
  const [otp, setOTP] = React.useState("");
  const [flag, setFlag] = React.useState(false);
  const [confirmObj, setConfirmObj] = React.useState("");

  const navigate = useNavigate();
  const { dispatch } = useContext(AuthContext);

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, []);

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
    // e.preventDefault();
    if (phoneNumber === "" || phoneNumber === undefined) {
      return alert(`${language?.language.Auth.auth.valid}`);
    }
    try {
      const num = code + phoneNumber;
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
      navigate("/");
    } catch (err) {
      alert(err);
    }
  };

  const handleLogin = (e) => {
    // e.preventDefault();
    const definedUser = users?.find(
      (item) => item.phone === code + phoneNumber
    );
    if (phoneNumber?.length > 3 || password?.length > 7) {
      if (definedUser !== undefined) {
        /**
         * define user registered or not
         */ if (definedUser.password === password) {
          GetOTP(e);
        } else {
          alert(`${language?.language.Auth.auth.passwrong}`);
        }
      } else {
        alert(`${language?.language.Auth.auth.noPhone}`);
      }
    } else {
      alert(`${language?.language.Auth.auth.pleaseInput}`);
    }
  };

  const handleKey = (e) => {
    e.code === "Enter" && handleLogin();
  };
  const verifyKey = (e) => {
    e.code === "Enter" && VerifyOTP();
  };

  /**
   * send email for define random passowrd
   */

  const [emailInput, setEmailInput] = useState("");
  // open change passwords
  const [openChange, setOpenChange] = useState(false);
  const [openInput, setOpenInput] = useState(false);
  const [randomPass, setRandomPass] = useState("");

  const targetUser = users?.find((item) => item.email === emailInput);

  /**
   * update phone number
   */

  // open change passwords
  const [openPhoneChange, setOpenPhoneChange] = useState(false);
  const [openPhoneInput, setOpenPhoneInput] = useState(false);

  function SendEmail() {
    const email = emailInput;
    if (users?.find((item) => item.email === emailInput) !== undefined) {
      fetch(
        `https://beautyverse.herokuapp.com/emails/forgotPassword?email=${email}`
      )
        .then((response) => response.json())
        .then((data) => {
          setRandomPass(data);
          if (openInput) {
            setOpenInput(false);
            setOpenChange(true);
          } else if (openPhoneInput) {
            setOpenPhoneInput(false);
            setOpenPhoneChange(true);
          } else {
            return;
          }
        })
        .catch((error) => {
          console.log("Error fetching data:", error);
        });
    } else {
      alert("Wrong Email");
    }
  }

  return (
    <>
      <Container
        style={{ display: !flag ? "visible" : "none" }}
        height={height}
      >
        <Title>{language?.language.Auth.auth.login}</Title>
        <Form onSubmit={handleLogin}>
          <InputWrapper>
            <PhoneCode
              onSelect={(code) => {
                setCode(code);
              }} // required
              showFirst={["GE"]}
              defaultValue="GE"
              id="codes"
              name="codes"
              className="codes"
              optionClassName="codesOption"
            />
            <Input
              type="text"
              placeholder={language?.language.Auth.auth.phone}
              onChange={(e) => setPhoneNumber(e.target.value)}
            />
          </InputWrapper>
          <InputWrapper>
            <Input
              type="password"
              placeholder={language?.language.Auth.auth.password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={handleKey}
            />
          </InputWrapper>
          <Button
            type="submit"
            title={language?.language.Auth.auth.login}
            function={handleLogin}
          />
          <div id="recaptcha-container"></div>
          <ForgotPass
            title={language?.language.Auth.auth.forgot}
            emailInput={emailInput}
            setEmailInput={setEmailInput}
            SendEmail={() => SendEmail()}
            language={language}
            setOpenChange={setOpenChange}
            openInput={openInput}
            setOpenInput={setOpenInput}
          />
          <UpdatePhoneButton
            emailInput={emailInput}
            setEmailInput={setEmailInput}
            SendEmail={() => SendEmail()}
            language={language}
            setOpenChange={setOpenPhoneChange}
            openInput={openPhoneInput}
            setOpenInput={setOpenPhoneInput}
          />

          <SignupText>
            {language?.language.Auth.auth.dontHave}{" "}
            <Link
              to="/register"
              id="signup"
              style={{ color: "orange", textDecoration: "none" }}
            >
              {language?.language.Auth.auth.register}
            </Link>
          </SignupText>
        </Form>
      </Container>
      <ChangePassword
        forgot={true}
        open={openChange}
        setOpen={setOpenChange}
        randomPass={randomPass}
        targetUser={targetUser}
        language={language}
      />
      <UpdatePhone
        forgot={true}
        open={openPhoneChange}
        setOpen={setOpenPhoneChange}
        randomPass={randomPass}
        targetUser={targetUser}
        language={language}
      />
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
            onKeyDown={verifyKey}
          />
        </InputWrapper>
        <SubmitButton type="submit">
          {language?.language.Auth.auth.confirm}
        </SubmitButton>
      </Confirm>
    </>
  );
}

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

const Title = styled.h4`
  font-size: 1.2vw;
  letter-spacing: 0.05vw;
  color: ${(props) => props.theme.font};

  @media only screen and (max-width: 600px) {
    font-size: 5vw;
    letter-spacing: 0.1vw;
  }
`;
const Form = styled.form`
  display: flex;
  align-items: center;
  flex-direction: column;
  gap: 0.7vw;
  color: ${(props) => props.theme.font};

  @media only screen and (max-width: 600px) {
    gap 3vw;
  }
`;
const InputWrapper = styled.div`
  width: 25vw;
  height: 2.5vw;
  border-radius: 0.5vw;
  box-shadow: 0 0.1vw 0.3vw ${(props) => props.theme.shadowColor};
  border: none;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 0.5vw;
  transition: ease-in 200ms;
  box-sizing: border-box;
  background: ${(props) => props.theme.categoryItem};
  color: ${(props) => props.theme.font};

  @media only screen and (max-width: 600px) {
    box-shadow: 0 0.2vw 0.6vw ${(props) => props.theme.shadowColor};
    width: 75vw;
    height: 10vw;
    border-radius: 1.5vw;
    padding-left: 2vw;
    font-size: 16px;
  }

  .codes {
    width: 5vw;
    height: 2vw;
    border-radius: 0.5vw;
    border: none;
    padding: 0.5vw;
    cursor: pointer;
    background: ${(props) => props.theme.categoryItem};
    color: ${(props) => props.theme.font};

    @media only screen and (max-width: 600px) {
      width: 15vw;
      height: 8vw;
    }

    :focus {
      outline: none;
    }
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
  padding-left: 0.5vw;
  transition: ease-in 200ms;
  box-sizing: border-box;
  background: ${(props) => props.theme.categoryItem};
  color: ${(props) => props.theme.font};
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

const SignupText = styled.p`
  text-decoration: none;
  font-size: 0.8vw;
  font-weight: bold;

  @media only screen and (max-width: 600px) {
    font-size: 3vw;
    letter-spacing: 0.2vw;
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
