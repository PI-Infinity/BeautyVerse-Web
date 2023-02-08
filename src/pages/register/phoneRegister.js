import React, { useContext } from "react";
import PhoneInput from "react-phone-number-input";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { auth, db } from "../../firebase";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { serverTimestamp, doc, setDoc } from "firebase/firestore";

export const PhoneRegister = () => {
  const navigate = useNavigate();
  const { dispatch } = useContext(AuthContext);
  const [number, setNumber] = React.useState("");
  const [otp, setOTP] = React.useState();
  const [flag, setFlag] = React.useState(false);
  const [confirmObj, setConfirmObj] = React.useState("");
  //
  const SetupRecaptcha = (number) => {
    const recaptchaVerifer = new RecaptchaVerifier(
      "recaptcha-container",
      {},
      auth
    );
    recaptchaVerifer.render(number);
    return signInWithPhoneNumber(auth, number, recaptchaVerifer);
  };
  const GetOTP = async (e) => {
    e.preventDefault();
    if (number === "" || number === undefined) {
      return alert("Please Input Valid Phone Number");
    }
    try {
      const response = await SetupRecaptcha(number);
      console.log(response);
      setConfirmObj(response);
      setFlag(true);
    } catch (err) {
      alert(err);
    }
    console.log(number);
  };

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
        // type: type,
        // name: nm,
        // password: pss,
        // email: eml,
        phone: number,
        // adress: {
        //   country: map.country,
        //   region: map.region,
        //   city: map.city,
        //   destrict: map.destrict,
        //   adress: map.street,
        //   streetNumber: map.number,
        //   latitude: map.latitude,
        //   longitude: map.longitude,
        // },
        lastPost: serverTimestamp(),
      });
      await navigate("/user");
      window.location.reload();
    } catch (err) {
      alert(err);
    }
  };
  return (
    <div style={{ width: "40vw", height: "40vw" }}>
      <form onSubmit={GetOTP} style={{ display: !flag ? "visible" : "none" }}>
        <PhoneInput
          defaultCountry="GE"
          value={number}
          onChange={setNumber}
          placeholder="enter number"
        />
        <div id="recaptcha-container"></div>
        <button type="submit">send otp</button>
      </form>
      <form
        onSubmit={VerifyOTP}
        style={{ display: flag ? "flex" : "none", marginTop: "20vw" }}
      >
        <input
          type="text"
          placeholder="enter code"
          onChange={(e) => setOTP(e.target.value)}
        />
        <div id="recaptcha-container"></div>
        <button type="submit">verify otp</button>
      </form>
    </div>
  );
};
