import React from "react";
import styled from "styled-components";
import { FaFacebook, FaInstagram, FaYoutube } from "react-icons/fa";
import Flag from "react-world-flags";

export const Footer = () => {
  return (
    <Container>
      <Icons>
        <FaFacebook />
        <FaInstagram />
        <FaYoutube />
      </Icons>
      <Copyright>&#169; beautyverse</Copyright>{" "}
      <Languages
        onClick={() => {
          console.log("add");
        }}
      >
        <div
          onClick={() => {
            localStorage.setItem("BeautyVerse:Language", "ka");
            console.log("add");
          }}
        >
          <Flag code="geo" className="lang" />
        </div>
        <Flag code="usa" className="lang" />
        <Flag code="rus" className="langR" />
      </Languages>
    </Container>
  );
};

const Container = styled.div`
  background: ${(props) => props.theme.background};
  padding: 0.25vw 2vw;
  height: 2vw;
  border-top: 1px solid ${(props) => props.theme.lineColor};
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  align-items: center;
  display: flex;
  justify-content: space-between;
  z-index: 90;

  @media only screen and (max-width: 600px) {
    display: none;
  }
`;

const Languages = styled.div`
  flex 2;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 1vw;
  border-radius: 0.2vw;
  padding: 0.2vw 0.5vw;

  @media only screen and (max-width: 600px) {
    gap: 3vw;
    border-radius: 0.8vw;
    padding: 0.8vw 2vw;
  }

  .lang {
    width: 1vw;
    height: 0.7vw;
    cursor: pointer;

    @media only screen and (max-width: 600px) {
      width: 4vw;
      height: 2.8vw;
    }
  }
  .langR {
    width: 1vw;
    height: 0.7vw;
    cursor: pointer;
    position: relative;
    bottom: 0.1vw;

    @media only screen and (max-width: 600px) {
      width: 4vw;
      height: 2.8vw;
    }
  }
`;
const Icons = styled.div`
  flex: 2;
  display: flex;
  align-items: center;
  justify-content: start;
  gap: 0.5vw;
  font-size: 1vw;
  color: ${(props) => props.theme.icon};

  @media only screen and (max-width: 600px) {
    gap: 2vw;
    font-size: 4vw;
  }
`;

const Copyright = styled.div`
  flex: 2,
  display: flex;
  justify-content: center;
  font-size: 1vw;
  color: ${(props) => props.theme.font};

  @media only screen and (max-width: 600px) {
    font-size: 4vw;
  }
`;
