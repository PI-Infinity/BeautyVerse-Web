import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { collection, doc, getDoc } from "firebase/firestore";
import { db, auth } from "../../firebase";
import { AuthContext } from "../../context/AuthContext";
import { IsMobile } from "../../functions/isMobile";
import { useOutletContext, useNavigate } from "react-router-dom";
import { AiOutlineEyeInvisible, AiOutlineEye } from "react-icons/ai";
import ChangePassword from "../../pages/user/changePassword";
import Success from "../../snackBars/success";
import { updatePassword } from "firebase/auth";

export const Settings = () => {
  const [user, language] = useOutletContext();
  const isMobile = IsMobile();
  const navigate = useNavigate();
  const { currentUser } = React.useContext(AuthContext);

  React.useEffect(() => {
    if (user?.id !== currentUser?.uid) {
      navigate("/");
    }
  }, []);

  // success messaage open
  const [open, setOpen] = React.useState(false);

  const [password, setPassword] = useState("");
  useEffect(() => {
    const GetUserPass = async () => {
      const passRef = doc(db, "users", currentUser?.uid, "secret", "password");
      const usr = await getDoc(passRef);
      if (usr.exists()) {
        setPassword(usr.data().password);
      } else {
        // doc.data() will be undefined in this case
        console.log("No such document!");
      }
    };
    GetUserPass();
  }, [open]);

  const [showPassword, setShowPassword] = React.useState(false);

  return (
    <Content>
      <Password>
        {language?.language.User.userPage.password}:{" "}
        {showPassword ? (
          <div id="password">{password}</div>
        ) : (
          <div id="blur">{password}</div>
        )}{" "}
        {showPassword ? (
          <AiOutlineEye
            className="eye"
            onClick={() => setShowPassword(false)}
          />
        ) : (
          <AiOutlineEyeInvisible
            className="eye"
            onClick={() => setShowPassword(true)}
          />
        )}
      </Password>
      <Success
        open={open}
        setOpen={setOpen}
        title={language?.language.User.userPage.succesChange}
      />
      <ChangePassword
        user={user}
        password={password}
        setOpen={setOpen}
        language={language}
      />
    </Content>
  );
};

const Content = styled.div`
  display: flex;
  flex-direction: column;
  align-items: start;
  justify-content: start;
  padding-top: 1vw;
  padding-left: 3vw;
  width: 100%;
  height: 100%;
  min-height: 50vh;
  flex-wrap: wrap;
  gap: 1vw;
  height: auto;
  margin-bottom: 5vw;
  overflow-x: hidden;
  box-sizing: border-box;

  .loadingIcon {
    font-size: 3vw;
  }

  @media only screen and (max-width: 600px) {
    justify-content: start;
    padding-top: 6vw;
    padding-left: 12vw;
    gap: 3vw;
  }
`;

const Password = styled.div`
  color: ${(props) => props.theme.font};
  display: flex;
  align-items: center;
  gap: 15px;
  font-size: 14px;

  #blur {
    color: transparent;
    text-shadow: 0 0 12px ${(props) => props.theme.font};
  }

  .eye {
    cursor: pointer;
    font-size: 1.2vw;
    @media only screen and (max-width: 600px) {
      font-size: 4vw;
    }
  }

  .password {
    min-width: 15vw;
  }
`;
