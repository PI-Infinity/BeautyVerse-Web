import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setUserType } from "../../redux/register";
import { FaUserEdit } from "react-icons/fa";
import { ImProfile } from "react-icons/im";
import { MdAddBusiness } from "react-icons/md";
import useWindowDimensions from "../../functions/dimensions";
import { Language } from "../../context/language";

const Register = () => {
  const language = Language();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { height, width } = useWindowDimensions();
  return (
    <FirstPageContainer height={height}>
      <Title>{language?.language.Auth.auth.choice}:</Title>
      <ChoiseContainer>
        <Card
          onClick={async () => {
            await dispatch(setUserType("user"));
            navigate("identify");
          }}
        >
          <FaUserEdit className="userIcon" />
          <h2>{language?.language.Auth.auth.user}</h2>
          <span style={{ textAlign: "center" }}>
            {language?.language.Auth.auth.userText}
          </span>
        </Card>
        <Card
          onClick={async () => {
            await dispatch(setUserType("specialist"));
            navigate("identify");
          }}
        >
          <ImProfile className="specIcon" />
          <h2>{language?.language.Auth.auth.specialist}</h2>
          <span style={{ textAlign: "center" }}>
            {language?.language.Auth.auth.specText}
          </span>
        </Card>
        <Card
          onClick={async () => {
            await dispatch(setUserType("beautyCenter"));
            navigate("identify");
          }}
        >
          <MdAddBusiness className="businessIcon" />
          <h2>{language?.language.Auth.auth.beautySalon}</h2>
          <span style={{ textAlign: "center" }}>
            {language?.language.Auth.auth.salonText}
          </span>
        </Card>
        {/* <Card
          onClick={async () => {
            await dispatch(setUserType("shop"));
            navigate("identify");
          }}
        >
          <RiShoppingCartFill className="businessIcon" />
          <h2>მაღაზია</h2>
          <span style={{ textAlign: "center" }}>
            შექმენი მაღაზია ბიუთი ბაზარზე
          </span>
        </Card> */}
      </ChoiseContainer>
    </FirstPageContainer>
  );
};

export default Register;

const FirstPageContainer = styled.div`
  width: 100%;
  height: ${(props) => props.height}px;
  padding-top: 3vw;
  padding-bottom: 5vw;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1.5vw;

  @media only screen and (max-width: 600px) {
    font-size: 3vw;
    padding-top: 14vw;
    padding-bottom: 3vw;
  }
`;

const Title = styled.h2`
  margin-bottom: 1vw;
  color: ${(props) => props.theme.font};

  @media only screen and (max-width: 600px) {
    margin-bottom: 7vw;
  }
`;

const ChoiseContainer = styled.div`
  display: flex;
  gap: 1.5vw;

  @media only screen and (max-width: 600px) {
    flex-direction: column;
    justify-content: center;
    gap: 3vw;
  }
`;

const Card = styled.div`
  width: 15vw;
  height: 15vw;
  border-radius: 0.5vw;
  box-shadow: 0 0.1vw 0.3vw ${(props) => props.theme.shadowColor};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.5vw;
  padding: 1vw;
  transition: ease-in 200ms;
  cursor: pointer;
  font-size: 0.7vw;
  background: ${(props) => props.theme.categoryItem};
  box-sizing: border-box;
  color: ${(props) => props.theme.font};

  @media only screen and (max-width: 600px) {
    width: 80vw;
    height: 35vw;
    border-radius: 3vw;
    box-shadow: 0 0.2vw 0.6vw ${(props) => props.theme.shadowColor};
    gap: 1.5vw;
    padding: 3vw;
  }

  :hover {
    box-shadow: 0 0.2vw 0.5vw rgba(2, 2, 2, 0.2);
  }

  .userIcon {
    font-size: 2vw;
    margin-bottom: 0.5vw;

    @media only screen and (max-width: 600px) {
      font-size: 6vw;
    }
  }

  .specIcon {
    font-size: 2vw;
    margin-bottom: 0.5vw;

    @media only screen and (max-width: 600px) {
      font-size: 6vw;
    }
  }

  .businessIcon {
    font-size: 2vw;
    margin-bottom: 0.5vw;

    @media only screen and (max-width: 600px) {
      font-size: 6vw;
    }
  }

  span {
    @media only screen and (max-width: 600px) {
      font-size: 2.6vw;
    }
  }
  h2 {
    @media only screen and (max-width: 600px) {
      font-size: 3vw;
    }
  }
`;
