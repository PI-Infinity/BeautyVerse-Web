import { useContext, useState, useEffect } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom/";
import { Link } from "react-router-dom/";
import { AuthContext } from "../../context/AuthContext";
import { auth } from "../../firebase";
import { useDispatch, useSelector } from "react-redux";
import { signInWithEmailAndPassword } from "firebase/auth";
import { Button } from "../../components/button";
import useWindowDimensions from "../../functions/dimensions";
import { Language } from "../../context/language";
import ForgotPass from "../../pages/login/forgotPassword";
import ChangePassword from "../../pages/login/changePassword";
import Error from "../../snackBars/success";

export default function Login() {
  const language = Language();
  const { height, width } = useWindowDimensions();
  const mainDispatch = useDispatch();

  document.body.style.overflowY = "hidden";

  // import users
  const usersList = useSelector((state) => state.storeMain.userList);
  let users;
  if (usersList?.length > 0) {
    users = JSON.parse(usersList);
  }

  //signin with email and password
  const [code, setCode] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();
  const { dispatch } = useContext(AuthContext);

  const [alert, setAlert] = useState(false);

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, []);

  const Handlelogin = async (e) => {
    signInWithEmailAndPassword(auth, email, password)
      .then(async (userCredential) => {
        // Signed in
        const user = userCredential.user;
        await dispatch({ type: "LOGIN", payload: user });
        navigate("/");
        setPassword("");
        // ...
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        setAlert({
          active: true,
          title: language?.language.Auth.auth.wrongEmailOrPass,
        });
        setPassword("");
      });
  };

  const handleKey = (e) => {
    e.code === "Enter" && Handlelogin();
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
   * send email to reset password
   */

  function SendEmail() {
    const email = emailInput;
    if (
      users?.find(
        (item) => item.email.toLowerCase() === emailInput.toLowerCase()
      ) !== undefined
    ) {
      fetch(
        `https://beautyverse.herokuapp.com/emails/forgotPassword?email=${email}`
      )
        .then((response) => response.json())
        .then((data) => {
          setRandomPass(data);
          if (openInput) {
            setOpenInput(false);
            setOpenChange(true);
          } else {
            return;
          }
        })
        .catch((error) => {
          console.log("Error fetching data:", error);
        });
    } else {
      setAlert({
        active: true,
        title: language?.language.Auth.auth.wrongEmail,
      });
    }
  }

  return (
    <>
      <Error
        open={alert?.active}
        setOpen={setAlert}
        type="error"
        title={alert?.title}
      />
      <Container height={height}>
        <Title>{language?.language.Auth.auth.login}</Title>
        <Form onSubmit={Handlelogin} method="post" action="/form">
          <InputWrapper>
            <Input
              type="email"
              value={email}
              required
              placeholder={language?.language.Auth.auth.email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </InputWrapper>
          <InputWrapper>
            <Input
              type="password"
              name="new-password"
              id="new-password"
              value={password}
              required
              autocomplete="new-password"
              placeholder={language?.language.Auth.auth.password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={handleKey}
            />
          </InputWrapper>
          <Button
            type="submit"
            title={language?.language.Auth.auth.login}
            function={Handlelogin}
          />
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
  font-size: 22px;
  letter-spacing: 0.05vw;
  color: ${(props) => props.theme.font};

  @media only screen and (max-width: 600px) {
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
  font-size: 16px;

  @media only screen and (max-width: 600px) {
    border-radius: 1.5vw;
    padding-left: 2vw;
    font-size: 16px;
  }

  :focus {
    outline: none;
  }

  ::placeholder {
    font-size: 14px;
    color: ${(props) => props.theme.font};
  }
`;

const SignupText = styled.p`
  text-decoration: none;
  font-size: 14px;
  font-weight: bold;

  @media only screen and (max-width: 600px) {
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
  font-size: 14px;

  @media only screen and (max-width: 600px) {
    width: 45vw;
    height: 8vw;
    border-radius: 1.5vw;
    box-shadow: 0 0.3vw 0.6vw rgba(2, 2, 2, 0.2);
  }

  :hover {
    box-shadow: 0 0.1vw 0.3vw rgba(2, 2, 2, 0.2);
  }
`;
