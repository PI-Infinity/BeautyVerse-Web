import React, { useState, useContext } from "react";
import styled from "styled-components";
import { Button } from "../../components/button";
import { useSelector, useDispatch } from "react-redux";
import { setRegisterPage } from "../../redux/register";
import { useNavigate } from "react-router-dom";
import { db, auth } from "../../firebase";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { AuthContext } from "../../context/AuthContext";

export const PageFourth = () => {
  const mainDispatch = useDispatch();
  const { dispatch } = useContext(AuthContext);
  const navigate = useNavigate();

  // define user type
  const type = useSelector((state) => state.storeRegister.userType);

  const [accept, setAccept] = useState(false);

  const userInfo = useSelector((state) => state.storeRegister);

  const HandleSubmit = async () => {
    if (accept != false) {
      await register();
    } else {
      alert("Accept terms");
    }
  };

  const map = useSelector((state) => state.storeRegister.map);

  const servicesEng = userInfo?.services?.map((item, index) => {
    return item.value;
  });
  const servicesRus = userInfo?.services?.map((item, index) => {
    return item.rus;
  });
  const servicesGeo = userInfo?.services?.map((item, index) => {
    return item.label;
  });

  const services = servicesGeo.concat(servicesEng, servicesRus);

  const register = async () => {
    try {
      const user = await createUserWithEmailAndPassword(
        auth,
        userInfo.email,
        userInfo.password
      ).then(async (userCredential) => {
        // Signed in
        const user = userCredential.user;
        await dispatch({ type: "LOGIN", payload: user });
        // create user database
        await setDoc(doc(db, `users`, user.uid), {
          id: user.uid,
          type: userInfo?.userType,
          name: userInfo?.name,
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
          password: userInfo?.password,
          email: userInfo?.email,
          phone: userInfo?.phoneNumber,
          socMedia: {
            web: userInfo?.web,
            instagram: userInfo?.instagram,
            facebook: userInfo?.facebook,
            tiktok: userInfo?.tiktok,
            youtube: userInfo?.youtube,
            otherMedia: userInfo?.otherMedia,
          },
          services: services,
          lastPost: serverTimestamp(),
        });
        for (var i = 0; i < userInfo?.services?.length; i++) {
          await setDoc(
            doc(
              db,
              `users`,
              user.uid,
              `${type != "shop" ? "procedures" : "categories"}`,
              `${userInfo?.services[i]?.value}`
            ),
            {
              value: userInfo?.services[i]?.value,
              label: userInfo?.services[i]?.label,
            }
          );
        }
        if (type != "shop") {
          for (var i = 0; i < userInfo?.workingDays?.length; i++) {
            await setDoc(
              doc(
                db,
                `users`,
                user.uid,
                "working days",
                `${userInfo?.workingDays[i]?.value}`
              ),
              {
                id: userInfo?.workingDays[i]?.id,
                value: userInfo?.workingDays[i]?.value,
                label: userInfo?.workingDays[i]?.label,
              }
            );
          }
          for (var i = 0; i < userInfo?.workingPlace?.length; i++) {
            await setDoc(
              doc(
                db,
                `users`,
                user.uid,
                "working places",
                `${userInfo?.workingPlace[i]?.value}`
              ),
              {
                value: userInfo?.workingPlace[i]?.value,
                label: userInfo?.workingPlace[i]?.label,
              }
            );
          }
        }

        await navigate("/");
        // setTimeout(() => {
        window.location.reload();
        // }, 100);
      });
    } catch (error) {
      console.log(error.message);
      alert(error.message);
    }
  };

  return (
    <Container>
      <Input>
        <input type="radio" onChange={(e) => setAccept(e.target.value)} />
        <span>Accept terms & rules</span>
      </Input>

      <Buttons>
        <Button
          title="Back"
          function={() => mainDispatch(setRegisterPage(3))}
          back={true}
        />
        <Button title="Register" type="Submit" function={HandleSubmit} />
      </Buttons>
    </Container>
  );
};

const Container = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 3vw;
  margin-top: 15vw;

  @media only screen and (max-width: 600px) {
    gap: 10vw;
    margin-top: 70vw;
  }
`;

const Input = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5vw;

  @media only screen and (max-width: 600px) {
    gap: 1.5vw;
  }
`;

const Buttons = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2vw;

  @media only screen and (max-width: 600px) {
    justify-content: center;
    margin-top: 5vw;
  }
`;
