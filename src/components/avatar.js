import styled from 'styled-components';
import { FaUser } from 'react-icons/fa';

export default function Avatar({ link, size, name }) {
  if (size === 'small') {
    return (
      <Small>
        {link?.length > 0 ? (
          <SmallImg src={link} alt={name} />
        ) : (
          <FaUser id="icon" />
        )}
      </Small>
    );
  } else if (size === 'medium') {
    return (
      <Medium>
        <LargeImg src={link} alt={name} />
      </Medium>
    );
  } else {
    return (
      <Large>
        {link?.length > 0 ? (
          <LargeImg src={link} alt={name} />
        ) : (
          <FaUser id="icon" />
        )}
      </Large>
    );
  }
}

const Small = styled.div`
  width: 5.5vw;
  height: 5.5vw;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  border-radius: 50%;
  cursor: pointer;
  background: ${(props) => props.theme.disabled};

  @media only screen and (max-width: 600px) {
    width: 5.5vw;
    height: 5.5vw;
  }
  #icon {
    color: #fff;
    @media only screen and (max-width: 600px) {
      font-size: 3vw;
    }
  }
`;
const SmallImg = styled.img`
  width: 45px;
  height: 45px;
  object-fit: cover;
  background: ${(props) => props.theme.disabled};

  @media only screen and (max-width: 600px) {
    width: 45px;
    height: 45px;
  }
`;
const Medium = styled.div`
  width: 45vw;
  height: 8vw;

  @media only screen and (max-width: 600px) {
    width: 45vw;
    height: 8vw;
  }

  #icon {
    font-size: 80%;
    color: #fff;
  }
`;
const Large = styled.div`
  width: 8vw;
  height: 8vw;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  border-radius: 50%;
  cursor: pointer;
  border: 5px solid ${(props) => props.theme.disabled};
  background: ${(props) => props.theme.disabled};

  @media only screen and (max-width: 600px) {
    width: 18vw;
    height: 18vw;
  }

  #icon {
    font-size: 3vw;
    color: #fff;
    @media only screen and (max-width: 600px) {
      font-size: 8vw;
    }
  }
`;
const LargeImg = styled.img`
  width: 8vw;
  height: 8vw;
  object-fit: cover;

  @media only screen and (max-width: 600px) {
    width: 18vw;
    height: 18vw;
  }
`;
