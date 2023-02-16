import React, { useContext, useState, useEffect } from "react";
import styled from "styled-components";
import {
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  FacebookAuthProvider,
} from "firebase/auth";
import { useNavigate } from "react-router-dom/";
import { FcGoogle } from "react-icons/fc";
import { Link } from "react-router-dom/";
import { AuthContext } from "../context/AuthContext";
import { doc, setDoc, serverTimestamp, updateDoc } from "firebase/firestore";
import { db, DetectLanguage, auth } from "../firebase";
import { setCover, setRerender, setLoading } from "../redux/main";
import { setRegisterPage } from "../redux/register";
import { useDispatch, useSelector } from "react-redux";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import PhoneCode from "react-phone-code";
import { Button } from "../components/button";
import useWindowDimensions from "../functions/dimensions";

export default function Login() {
  const { height, width } = useWindowDimensions();
  const mainDispatch = useDispatch();

  // import users
  const usersList = useSelector((state) => state.storeMain.userList);
  let users;
  if (usersList?.length > 0) {
    users = JSON.parse(usersList);
  }

  //signin with email and password
  const [error, setError] = useState(false);
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
    e.preventDefault();
    if (phoneNumber === "" || phoneNumber === undefined) {
      return alert("Please Input Valid Phone Phone Number");
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
    e.preventDefault();
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
          alert("Password didn't match");
        }
      } else {
        alert("Phone Number not found");
      }
    } else {
      alert("Please Input Fields");
    }
  };

  return (
    <>
      <Container
        style={{ display: !flag ? "visible" : "none" }}
        height={height}
      >
        <Title>Log In</Title>
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
              placeholder="Phone Number"
              onChange={(e) => setPhoneNumber(e.target.value)}
            />
          </InputWrapper>
          <InputWrapper>
            <Input
              type="password"
              placeholder="Password"
              onChange={(e) => setPassword(e.target.value)}
            />
          </InputWrapper>
          <Button type="submit" title="Log In" function={handleLogin} />
          <div id="recaptcha-container"></div>
          <ForgottPass>Forgott Password?</ForgottPass>
          {error && (
            <span style={{ color: "red" }}>Wrong email or password!</span>
          )}
          <SignupText>
            Don't have a Account?{" "}
            <Link
              to="/register"
              id="signup"
              style={{ color: "orange", textDecoration: "none" }}
            >
              Register
            </Link>
          </SignupText>
        </Form>
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
  font-size: 1.7vw;
  letter-spacing: 0.05vw;

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

  @media only screen and (max-width: 600px) {
    gap 3vw;
  }
`;
const InputWrapper = styled.div`
  width: 25vw;
  height: 2.5vw;
  border-radius: 0.5vw;
  box-shadow: 0 0.1vw 0.3vw rgba(2, 2, 2, 0.1);
  border: none;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 0.5vw;
  transition: ease-in 200ms;
  box-sizing: border-box;

  @media only screen and (max-width: 600px) {
    box-shadow: 0 0.2vw 0.6vw rgba(2, 2, 2, 0.1);
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

const ForgottPass = styled.p`
  padding: 0;
  margin: 0;
  letter-spacing: 0.05vw;
  font-size: 0.9vw;

  @media only screen and (max-width: 600px) {
    font-size: 3.3vw;
    letter-spacing: 0.2vw;
  }
`;
const SignupText = styled.p`
  text-decoration: none;
  font-size: 0.9vw;
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
