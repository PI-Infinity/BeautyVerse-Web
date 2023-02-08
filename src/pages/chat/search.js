import React, { useState } from "react";
import styled from "styled-components";
import { useSelector } from "react-redux";
import {
  collection,
  query,
  where,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";
import { ref, uploadBytes, listAll, getDownloadURL } from "firebase/storage";
import { db, storage } from "../../firebase";
import { BsSearch } from "react-icons/bs";

export const Search = (props) => {
  return (
    <Container>
      <BsSearch id="icon" />
      <SearchInput
        placeholder="Find User.."
        // onKeyDown={handleKey}
        onChange={(e) => props.setSearch(e.target.value)}
        value={props.search}
      />
    </Container>
  );
};

const Container = styled.div`
  width: 70%;
  display: flex;
  flex-direction: row;
  align-items: center;
  padding-left: 30px;
  border-bottom: 1px solid #ddd;
  box-sizing: border-box;
  background: #f3f3f3;
  margin: 1vw 0;
  border-radius: 50vw;

  #icon {
    font-size: 1.2vw;
    color: #ddd;

    @media only screen and (max-width: 600px) {
      color: #050505;
      font-size: 5vw;
    }
  }
  @media only screen and (max-width: 600px) {
    width: 85%;
    height: 4vh;
    border: none;

    margin: 4vw 0;
  }
`;

const SearchInput = styled.input`
  border: none;
  outline: none;
  background: none;
  font-size: 18px;
  color: #ddd;
  padding: 0 15px;
  width: 100%;
  height: 40px;

  ::placeholder {
    font-size: 14px;
    color: #050505;
  }
  @media only screen and (max-width: 600px) {
    color: #050505;
    font-size: 16px;
  }
`;

const Img = styled.img`
  width: 2vw;
  height: 2vw;
  border-radius: 50%;
  object-fit: cover;
`;

const FoundedUser = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  background: #fff;
  width: 100%;
  padding: 0 10px;

  :hover {
    background: #ddd;
  }
`;
