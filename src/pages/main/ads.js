import styled from 'styled-components';
import { Language } from '../../context/language';

export const Ads = (props) => {
  const language = Language();

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: props.left ? 'start' : 'flex-end',
        marginTop: props.left ? 0 : '20px',
      }}
    >
      <div style={{ margin: '1vw', fontWeight: 'bold', fontSize: '18px' }}>
        {language?.language.Main.ads.title}
      </div>
      <Container>
        <Ad>
          <img
            src={props.leftAd}
            style={{ width: '10vw', height: '8vw', objectFit: 'cover' }}
          />
        </Ad>
        <Ad>
          <img
            src={props.rightAd}
            style={{ width: '10vw', height: '8vw', objectFit: 'cover' }}
          />
        </Ad>
      </Container>
    </div>
  );
};

const Container = styled.div`
  border-radius: 0.5vw;
  width: 80%;
  height: 9vw;
  box-shadow: 0 0.1vw 0.3vw ${(props) => props.theme.lineColor};
  display: flex;
  gap: 0.7vw;
  align-items: center;
  padding: 0 0.7vw;
`;

const Ad = styled.div`
  //   padding: 1vw;
  width: 10vw;
  height: 8vw;
  box-shadow: 0 0.1vw 0.1vw rgba(2, 2, 2, 0.1);
  border-radius: 0.5vw;
  overflow: hidden;
  cursor: pointer;
  transition: ease-in-out 200ms;

  :hover {
    filter: brightness(0.96);
  }

  & > img {
    object-fit: cover;
  }
`;
