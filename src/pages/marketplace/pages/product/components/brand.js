import React from "react";
import styled from "styled-components";
import { BiSolidShoppingBags } from "react-icons/bi";

export const Brand = ({ product }) => {
  return (
    <Container>
      <div>Brand:</div>

      <h2
        style={{
          letterSpacing: "0.5px",
          margin: 0,
          fontSize: "14px",
          color: "#f866b1",
        }}
      >
        {product?.brand}
      </h2>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  align-items: center;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  padding: 0 0 10px 0;
  font-size: 14px;
`;
