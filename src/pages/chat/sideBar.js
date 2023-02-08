import React from "react";
import styled from "styled-components";
import { Header } from "../../pages/chat/header";
import { Search } from "../../pages/chat/search";
import { ChatUsers } from "../../pages/chat/chatUsers";
import { Favourites } from "../../pages/chat/favourites";
import { AiFillHeart } from "react-icons/ai";
import { MdAvTimer } from "react-icons/md";

export const SideBar = (props) => {
  const [search, setSearch] = React.useState("");
  const [active, setActive] = React.useState("recently");

  return (
    <Container>
      <Header />

      <Navigator>
        <div
          className={active == "recently" ? "active" : undefined}
          onClick={() => setActive("recently")}
        >
          <MdAvTimer className="icon" />
          Recently
        </div>
        <div
          className={active == "followings" ? "active" : undefined}
          onClick={() => setActive("followings")}
        >
          <AiFillHeart className="icon" />
          Followings
        </div>
      </Navigator>
      <Search setSearch={setSearch} search={search} />
      {active == "recently" ? (
        <ChatUsers search={search} />
      ) : (
        <Favourites search={search} />
      )}
    </Container>
  );
};

const Container = styled.div`
  flex: 1;
  background: #fff;
  border-right: 1px solid #ddd;
  display: flex;
  flex-direction: column;
  align-items: center;

  @media only screen and (max-width: 600px) {
    background: #fff;
    border: none;
  }
`;

const Navigator = styled.div`
  width: 100%;
  display: flex;
  gap: 0;

  @media only screen and (max-width: 600px) {
    box-sizing: border-box;
    gap: 0;
  }

  & > div {
    flex: 1;
    padding: 0.5vw 0;
    display: flex;
    align-items: center;
    justify-content: center;
    box-sizing: border-box;
    background: #fff;
    color: #ddd;
    cursor: pointer;
    border-bottom: 1px solid #ddd;
    gap: 0;

    @media only screen and (max-width: 600px) {
      padding: 2vw 0;
      box-sizing: border-box;
      gap: 1.5vw;
    }
  }

  .icon {
    font-size: 1.2vw;
    @media only screen and (max-width: 600px) {
      font-size: 4vw;
    }
  }

  .active {
    // background: #fff;
    font-weight: bold;
    color: ${(props) => props.theme.mainFont};
    border-bottom: 1px solid #aaa;
  }
`;
