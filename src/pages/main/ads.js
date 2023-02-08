import React from "react";
import styled from "styled-components";

export const Ads = () => {
  return (
    <Container>
      <Ad>
        <img
          src="https://res.cloudinary.com/dmmumy2b1/image/upload/v1668849735/Beautyverse/shop_ggr6lu.jpg"
          style={{ width: "8vw", height: "8vw", objectFit: "cover" }}
        />
      </Ad>
      <Ad>
        <img
          src="https://res.cloudinary.com/dmmumy2b1/image/upload/v1668849826/Beautyverse/konkurspost_fn7zqk.png"
          style={{ width: "8vw", height: "8vw", objectFit: "cover" }}
        />
      </Ad>
    </Container>
  );
};

const Container = styled.div`
  border-radius: 0.5vw;
  width: 80%;
  height: 9vw;
  box-shadow: 0 0.1vw 0.3vw rgba(2, 2, 2, 0.1);
  display: flex;
  gap: 0.7vw;
  align-items: center;
  padding: 0 0.7vw;
  justify-content: space-evenly;
  background: rgba(255, 255, 255, 0.7);
`;

const Ad = styled.div`
  //   padding: 1vw;
  width: 8vw;
  height: 8vw;
  box-shadow: 0 0.1vw 0.1vw rgba(2, 2, 2, 0.1);
  border-radius: 0.5vw;
  overflow: hidden;
  cursor: pointer;
  transition: ease-in-out 200ms;

  :hover {
    filter: brightness(0.96);
  }
`;
