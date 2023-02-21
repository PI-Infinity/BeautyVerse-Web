import styled from "styled-components";
import { BsSearch } from "react-icons/bs";
import { Language } from "../../context/language";

export const Search = (props) => {
  const language = Language();
  return (
    <Container>
      <BsSearch id="icon" />
      <SearchInput
        placeholder={language?.language.Chat.chat.findUser}
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
  border-bottom: 1px solid ${(props) => props.theme.lineColor};
  box-sizing: border-box;
  background: ${(props) => props.theme.secondLevel};
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
  color: ${(props) => props.theme.font};

  ::placeholder {
    font-size: 14px;
    color: ${(props) => props.theme.font};
  }
  @media only screen and (max-width: 600px) {
    color: ${(props) => props.theme.font};
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
