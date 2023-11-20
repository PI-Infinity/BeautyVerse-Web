import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setLanguage } from '../../../redux/app';
import { Language } from '../../../context/language';
import styled from 'styled-components';
import ReactCountryFlag from 'react-country-flag';

export const LanguageComponent = () => {
  const dispatch = useDispatch();
  const language = Language();
  const activeLanguage = useSelector((state) => state.storeApp.language);
  return (
    <Container>
      <h1 style={{ color: '#f866b1', letterSpacing: '0.5px' }}>
        {language?.language?.Auth?.auth?.selectLanguage}
      </h1>
      <Wrapper>
        <Item
          style={{
            border:
              activeLanguage === 'en'
                ? '1.5px solid #f866b1'
                : '1.5px solid rgba(255,255,255,0.1)',
            color: activeLanguage === 'en' ? '#f866b1' : '#ccc',
          }}
          onClick={() => {
            localStorage.setItem('Beautyverse:language', 'en');
            dispatch(setLanguage('en'));
          }}
        >
          <ReactCountryFlag
            className="emojiFlag"
            countryCode="US"
            aria-label="United States"
          />
          {language?.language?.Auth?.auth?.english}
        </Item>
        <Item
          style={{
            border:
              activeLanguage === 'ka'
                ? '1.5px solid #f866b1'
                : '1.5px solid rgba(255,255,255,0.1)',
            color: activeLanguage === 'ka' ? '#f866b1' : '#ccc',
          }}
          onClick={() => {
            localStorage.setItem('Beautyverse:language', 'ka');
            dispatch(setLanguage('ka'));
          }}
        >
          <ReactCountryFlag
            className="emojiFlag"
            countryCode="Ge"
            aria-label="Georgia"
          />
          {language?.language?.Auth?.auth?.georgian}
        </Item>
        <Item
          style={{
            color: activeLanguage === 'ru' ? '#f866b1' : '#ccc',
            border:
              activeLanguage === 'ru'
                ? '1.5px solid #f866b1'
                : '1.5px solid rgba(255,255,255,0.1)',
          }}
          onClick={() => {
            localStorage.setItem('Beautyverse:language', 'ru');
            dispatch(setLanguage('ru'));
          }}
        >
          <ReactCountryFlag
            className="emojiFlag"
            countryCode="Ru"
            aria-label="Russia"
          />
          {language?.language?.Auth?.auth?.russian}
        </Item>
      </Wrapper>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;

  @media only screen and (max-width: 600px) {
    align-items: center;
    gap: 10px;
    margin: 20px 0 0 0;
  }

  h1 {
    color: #f866b1;
    letter-spacing: 0.5px;
    padding: 0;
    font-size: 1.4vw;

    @media only screen and (max-width: 600px) {
      line-height: 7.5vw;
      font-size: 4.5vw;
    }
  }
`;

const Wrapper = styled.div`
  display: flex;
  width: 20vw;
  gap: 10px;

  @media only screen and (max-width: 600px) {
    width: 100%;
    justify-content: space-evenly;
    margin: 0 0 50px 0;
  }
`;

const Item = styled.div`
  width: 100%;
  padding: 5px 10px;
  border-radius: 50px;
  display: flex;
  justify-content: center;
  alignitems: center;
  letter-spacing: 0.5px;
  font-weight: 500;
  gap: 4px;

  @media only screen and (max-width: 600px) {
    font-size: 14px;
    gap: 2px;
  }

  .emojiFlag {
    position: relative;
    top: 1px;

    @media only screen and (max-width: 600px) {
      top: 2px;
    }
  }
`;
