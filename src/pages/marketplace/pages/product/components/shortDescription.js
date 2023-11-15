import React from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';

export const ShortDescription = ({ product }) => {
  const lang = useSelector((state) => state.storeApp.language);
  console.log(lang);
  return (
    <Container>
      <div>Short Description:</div>
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          gap: '4px',
        }}
      >
        <p
          style={{
            letterSpacing: '0.5px',
            margin: 0,
            fontSize: '14px',
            color: '#f866b1',
            fontWeight: 'normal',
          }}
        >
          {lang === 'en'
            ? product.shortDescription.en
            : lang === 'ka'
            ? product.shortDescription.ka
            : product.shortDescription.ru}
        </p>
      </div>
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
