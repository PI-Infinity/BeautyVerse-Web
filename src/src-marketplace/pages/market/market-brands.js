import React, { useContext } from "react";
import styled from "styled-components";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../../context/AuthContext";

export const Brands = () => {
  const { currentUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const brandsList = useSelector((state) => state.storeMain.userList);
  let brands;
  if (brandsList?.length > 0) {
    brands = JSON.parse(brandsList)?.filter((item) => item.type === "shop");
  }
  return (
    <Container>
      {brands?.map((item, index) => {
        return (
          <Brand
            key={index}
            onClick={
              currentUser?.uid === item?.id
                ? () => navigate("/user")
                : () => navigate(`/user/${item?.id}`)
            }
          >
            {item.name}
          </Brand>
        );
      })}
    </Container>
  );
};

const Container = styled.div`
  width: 100%;
  box-sizing: border-box;
  padding: 0vw 1vw;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1vw;
  z-index: 0;
`;

const Brand = styled.div`
  font-weight: bold;
  font-style: italic;
  cursor: pointer;

  :hover {
    text-decoration: underline;
  }
`;
