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
import { Button } from "../components/button";
import { db, DetectLanguage, auth } from "../firebase";
import { setCover, setRerender, setLoading } from "../redux/main";
import { setRegisterPage } from "../redux/register";
import { useDispatch, useSelector } from "react-redux";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import PhoneCode from "react-phone-code";

export default function Login() {
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

  // const handleLogin = (e) => {
  //   e.preventDefault();
  //   signInWithEmailAndPassword(auth, email, password)
  //     .then(async (userCredential) => {
  //       // Signed in
  //       const user = userCredential.user;
  //       await defaultDeispatch(setLoading(true));
  //       await dispatch({ type: "LOGIN", payload: user });
  //       await defaultDeispatch(setRerender());
  //       await navigate("/");
  //       window.location.reload();
  //     })
  //     .catch((error) => {
  //       setError(true);
  //     });
  // };

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
    console.log(definedUser);
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
    <Container>
      <Title>Log In</Title>
      <Form
        onSubmit={handleLogin}
        style={{ display: !flag ? "visible" : "none" }}
      >
        <InputWrapper>
          <PhoneCode
            onSelect={(code) => setCode(code)} // required
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
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 8.5vw;
  padding-top: 3vw;
  gap: 2.5vw;

  @media only screen and (max-width: 600px) {
    margin-top: 30vw;
    padding: 10vw;
    gap: 8vw;
    overflow-y: hidden;
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
  height: 1.5vw;
  border-radius: 0.5vw;
  box-shadow: 0 0.1vw 0.3vw rgba(2, 2, 2, 0.1);
  border: none;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 0.5vw;
  padding: 0.5vw;
  transition: ease-in 200ms;

  @media only screen and (max-width: 600px) {
    box-shadow: 0 0.2vw 0.6vw rgba(2, 2, 2, 0.1);
    width: 65vw;
    height: 10vw;
    border-radius: 1.5vw;
    padding-left: 2vw;
    font-size: 16px;
  }

  .codes {
    width: 5vw;
    height: 2vw;
    border-radius: 0.5vw;
    box-shadow: 0 0.1vw 0.3vw rgba(2, 2, 2, 0.1);
    border: none;
    padding: 0.5vw;
    cursor: pointer;

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
  padding: 0.5vw;
  transition: ease-in 200ms;

  @media only screen and (max-width: 600px) {
    border-radius: 1.5vw;
    padding-left: 2vw;
    font-size: 16px;
  }

  :focus {
    outline: none;
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
const GoogleBtn = styled.button`
  border: none;
  width: 25vw;
  height: 3vw;
  border-radius: 0.2vw;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.5vw;

  &:hover {
    filter: brightness(0.9);
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
