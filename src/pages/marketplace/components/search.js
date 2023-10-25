import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { BsFillSearchHeartFill } from "react-icons/bs";
import { MdClear } from "react-icons/md";
import { ProceduresOptions } from "../../../datas/registerDatas";
import { setSearch } from "../../../redux/cards";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { BsListUl } from "react-icons/bs";

export const Search = () => {
  // redux dispatch
  const dispatch = useDispatch();
  // navigate
  const navigate = useNavigate();

  const [animation, setAnimation] = useState(false);

  useEffect(() => {
    setAnimation(true);
  }, []);

  return (
    <div
      style={{
        width: animation ? "100%" : "30px",
        transition: "ease-in 200ms",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "10px",
        opacity: animation ? 1 : 0,
      }}
    >
      <SearchContainer>
        <BsFillSearchHeartFill size={18} color="#ccc" />
        <Input
          placeholder="Search..."
          onFocus={() => navigate("/marketplace/search", { state: "search" })}
        />
        <BsListUl
          color="#ccc"
          size={20}
          style={{ opacity: animation ? 1 : 0, transition: "ease-in 500ms" }}
          onClick={() => navigate("/marketplace/search", { state: "filter" })}
        />
      </SearchContainer>
    </div>
  );
};

const SearchContainer = styled.div`
  width: 90%;
  min-height: 30px;
  border-radius: 50px;
  background: rgba(255, 255, 255, 0.1);
  padding-left: 10px;
  padding-right: 10px;
  display: flex;
  align-items: center;
  margin-bottom: 15px;

  @media only screen and (max-width: 600px) {
    margin-bottom: 0px;
  }
`;

const Input = styled.input`
  background: none;
  width: 100%;
  height: 30px;
  border-radius: 50px;
  padding: 0;
  border: none;
  font-size: 16px;
  padding-left: 10px;
  letter-spacing: 0.5px;
  color: #ccc;

  @media only screen and (max-width: 600px) {
    width: 90%;
    margin-bottom: 0px;
  }

  &:hover {
    outline: none;
  }
  &:focus {
    outline: none;
  }
  &::placeholder {
    font-size: 14px;
  }
`;
