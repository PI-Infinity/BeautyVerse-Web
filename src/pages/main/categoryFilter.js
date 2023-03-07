import React, { useContext } from "react";
import styled from "styled-components";
import { setFilter } from "../../redux/filter";
import { setRerender } from "../../redux/main";
import { useDispatch, useSelector } from "react-redux";
import { VerseCategories } from "../../data/categories";
import { AuthContext } from "../../context/AuthContext";
import useWindowDimensions from "../../functions/dimensions";

export const CategoryFilter = () => {
  const { height, width } = useWindowDimensions();
  const [loading, setLoading] = React.useState(true);
  const dispatch = useDispatch();
  const filter = useSelector((state) => state.storeFilter.filter);
  const filterOpen = useSelector((state) => state.storeMain.mobileFilter);

  React.useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, [filterOpen]);

  setTimeout(() => {
    setLoading(false);
  }, 300);

  return (
    <FilterContainer height={height}>
      <List height={height}>
        {VerseCategories?.map((item, index) => {
          return <CategoryItem key={item.id} {...item} />;
        })}
      </List>
    </FilterContainer>
  );
};

const FilterContainer = styled.div`
  width: 100%;
  height: 53%;

  @media only screen and (max-width: 600px) {
    height: 40%;
  }
`;

const List = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.4vw;
  box-sizing: border-box;
  overflow-y: scroll;
  height: 26vw;
  padding: 1.5vw 0 0.5vw 0.5vw;

  @media only screen and (max-width: 600px) {
    padding: 2vw 5vw 3vw 5vw;
    gap: 1.5vw;
    height: 100%;
    background: none;
    margin-top: 0;
  }

  ::-webkit-scrollbar {
    width: 0.3vw;
  }

  /* Track */
  ::-webkit-scrollbar-track {
    background-color: white;
  }

  /* Handle */
  ::-webkit-scrollbar-thumb {
    background-color: #e5e5e5;
  }

  /* Handle on hover */
  ::-webkit-scrollbar-thumb:hover {
    background-color: #1e1e1e;
  }
`;

const CategoryItem = (props) => {
  const dispatch = useDispatch();
  const filter = useSelector((state) => state.storeFilter.filter);
  const { currentUser } = useContext(AuthContext);
  const language = useSelector((state) => state.storeMain.language);
  // import users
  const usersList = useSelector((state) => state.storeMain.userList);
  let users;
  if (usersList?.length > 0) {
    users = JSON.parse(usersList);
  }

  return (
    <Wrapper color={props.color}>
      <CategoryItemContainer
        className={filter === props.value ? "active" : ""}
        onClick={() => {
          dispatch(setFilter(props.value));
          dispatch(setRerender());
        }}
        color={filter === props.value ? "active" : "none"}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5vw",
          }}
        >
          <div>{props.icon}</div>
          {(() => {
            if (language === "ka") {
              return props.geo;
            } else if (language === "en") {
              return props.eng;
            } else if (language === "ru") {
              return props.rus;
            }
          })()}
        </div>
      </CategoryItemContainer>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  .active {
    width: 70%;
    // padding-left: 10%;
    background: ${(props) => props.theme.categoryItem};
    box-shadow: inset 0 0 0.15vw green;
    color: ${(props) => props.theme.font};

    @media only screen and (max-width: 600px) {
      width: 100%;
      box-shadow: inset 0 0 0.5vw green;
    }
  }
`;
const CategoryItemContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.3vw 1vw 0.4vw 1vw;
  width: 65%;
  background: ${(props) => props.theme.categoryItem};
  border-radius: 50vw;
  transition: ease-in 200ms;
  cursor: pointer;
  gap: 1vw;
  box-shadow: 0 0.1vw 0.2vw rgba(2, 2, 2, 0.1);
  font-size: 14px;
  color: ${(props) => props.theme.font};

  & div > div {
    display: flex;
    align-items: center;
    color: ${(props) => (props.color === "active" ? "green" : "#ccc")};
  }

  @media only screen and (max-width: 600px) {
    padding: 1.5vw 3vw 1.5vw 2vw;
    width: 100%;
    gap: 2.5vw;
    box-shadow: 0 0.3vw 0.6vw rgba(2, 2, 2, 0.1);
    box-sizing: border-box;
  }

  .icon {
    font-size: 16px;
    color: #ccc;
  }
  .allicon {
    font-size: 16px;
    position: relative;
    top: 0.1vw;
  }

  :hover {
    width: 70%;
    // padding-left: 10%;
    @media only screen and (max-width: 600px) {
      width: auto;
    }
  }
`;
