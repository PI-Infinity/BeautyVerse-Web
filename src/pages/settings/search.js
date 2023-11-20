import React, { useEffect, useState } from 'react';
import { BsFillSearchHeartFill } from 'react-icons/bs';
import { MdClear } from 'react-icons/md';
import styled from 'styled-components';
import { ProceduresOptions } from '../../datas/registerDatas';
import { Language } from '../../context/language';

export const Search = ({ search, setSearch }) => {
  // procedures list
  const procedures = ProceduresOptions();
  // language
  const language = Language();

  const [animation, setAnimation] = useState(false);

  useEffect(() => {
    setAnimation(true);
  }, []);

  return (
    <div
      style={{
        width: animation ? '100%' : '30px',
        transition: 'ease-in 200ms',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        opacity: animation ? 1 : 0,
        boxSizing: 'border-box',
        overflow: 'hidden',
      }}
    >
      <SearchContainer>
        <BsFillSearchHeartFill size={18} color="#ccc" />
        <Input
          placeholder={language.language.Marketplace.marketplace.search}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {search?.length > 0 && (
          <MdClear size={18} color="red" onClick={() => setSearch('')} />
        )}
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
  overflow: hidden;

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
`;
