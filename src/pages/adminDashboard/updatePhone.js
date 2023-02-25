import React, { useContext, useState } from "react";
import styled from "styled-components";
import { AuthContext } from "../../context/AuthContext";
import {
  getAuth,
  updateProfile,
  updatePhoneNumber,
  RecaptchaVerifier,
  PhoneAuthProvider,
} from "firebase/auth";
import { db, auth } from "../../firebase";
import { doc, getDoc, listCollections } from "firebase/firestore";

export default function UpdatePhone() {
  const [phone, setPhone] = useState("");
  const [captcha, setCaptcha] = useState(true);

  async function Change() {
    setCaptcha(true);
    const { currentUser: fuser } = auth;
    if (fuser && fuser.phoneNumber) {
      try {
        const verifier = new RecaptchaVerifier("recaptcha-container", {}, auth);
        const phoneProvider = new PhoneAuthProvider(auth);
        const id = await phoneProvider.verifyPhoneNumber(phone, verifier);
        const code = window.prompt("Bitte zugeschickten Code eingeben");
        const cred = PhoneAuthProvider.credential(id, code);
        await updatePhoneNumber(fuser, cred);
        await setCaptcha(false);
        alert("phone number changed", id, cred, fuser);
        // setSuccess(true);
      } catch (e) {
        console.error(e);
      }
    }
  }
  return (
    <Container>
      <input
        placeholder="enter phone number.."
        type="text"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
      />
      {captcha && <div id="recaptcha-container"></div>}
      <button onClick={Change}>change</button>
    </Container>
  );
}

const Container = styled.div`
  padding: 20px;
  box-sizing: border-box;
`;
