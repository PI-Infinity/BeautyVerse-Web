import React, { useState } from "react";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import { CgSearch } from "react-icons/cg";
import { MdClear } from "react-icons/md";
import { BsListCheck } from "react-icons/bs";
import { setRerender, setEnterSearch, setFilterOpen } from "../../redux/main";
import { setSearch } from "../../redux/filter";
import { ProceduresOptions } from "../../data/registerDatas";
import Select from "react-select";
import { GrList } from "react-icons/gr";
import { MdOutlinePersonPin } from "react-icons/md";
import { setChangeFeed, setLoadFeed } from "../../redux/main";
import { useNavigate } from "react-router-dom";

export const Search = (props) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const proceduresOptions = ProceduresOptions();
  // import current user & parse it
  const loadFeed = useSelector((state) => state.storeMain.loadFeed);
  const changeFeed = useSelector((state) => state.storeMain.changeFeed);

  const userUnparsed = useSelector((state) => state.storeMain.user);
  let user;
  if (userUnparsed?.length > 0) {
    user = JSON.parse(userUnparsed);
  }

  const search = useSelector((state) => state.storeFilter.search);
  const [resultCont, setResultCont] = React.useState("0");
  const [srch, setSrch] = React.useState("");

  React.useEffect(() => {
    dispatch(setSearch(""));
    setSrch("");
  }, []);

  const [focus, setFocus] = useState(false);

  // import users
  const usersList = useSelector((state) => state.storeMain.userList);
  let users;
  if (usersList?.length > 0) {
    users = JSON.parse(usersList);
  }

  const [bg, setBg] = React.useState(false);

  // filter for result container
  const Filter = () => {
    // define filtered words list
    let userNames = users?.map((item) => {
      if (item.type != "user") {
        return item.name;
      }
    });
    let procedures = proceduresOptions?.map((item, index) => {
      return item.label;
    });
    // let proceduresEng = proceduresOptions?.map((item, index) => {
    //   return item.value;
    // });
    // let full = proceduresGeo.concat(proceduresEng, userNames);

    let data;
    data = procedures
      .map((item, index) => ({
        // id: index + 1,
        value: item,
        label: item,
      }))
      .filter((item) => item.label != undefined);
    // }
    return data;
  };

  const data = Filter();

  return (
    <Container changeFeed={window.location.pathname.toString()}>
      <SearchWrapper>
        <div
          className="iconContainer"
          onClick={() => {
            dispatch(setFilterOpen(true));
          }}
        >
          <BsListCheck className="feedicon" />
        </div>
        <SearchContainer>
          <CgSearch className="icon" />
          <Input
            id="search"
            placeholder="ძებნა..."
            // isMulti
            value={srch}
            onFocus={() => {
              dispatch(setFilterOpen(false));
              setFocus(true);
            }}
            autoFocus={false}
            onChange={(e) => {
              setSrch(e.target.value);
            }}
          />
        </SearchContainer>
        {(search?.length > 0 || srch?.length > 0 || focus) && (
          <MdClear
            className="clearicon"
            onClick={async () => {
              await setSrch("");
              await dispatch(setSearch(""));
              await dispatch(setRerender());
              setFocus(false);
            }}
          />
        )}
        <MdOutlinePersonPin
          className="profileicon"
          onClick={
            window.location.pathname === "/"
              ? () => {
                  dispatch(setRerender());
                  navigate("/cards");
                }
              : () => {
                  dispatch(setRerender());
                  navigate("/");
                }
          }
        />
      </SearchWrapper>
      {focus && (
        <div style={{ width: "100%", position: "relative" }}>
          <Result
            setFocus={setFocus}
            data={data}
            srch={srch}
            setSrch={setSrch}
          />
        </div>
      )}
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: start;
  width: 36%;
  padding: 0;
  height: 2vw;
  background: ${(props) => props.theme.background};

  @media only screen and (max-width: 600px) {
    width: 100%;
    align-items: center;
    height: 8vw;
  }

  .profileicon {
    color: ${(props) =>
      props.changeFeed === "/cards" ? props.theme.logo2 : "#ddd"};
    font-size: 1.2vw;
    cursor: pointer;

    @media only screen and (max-width: 600px) {
      font-size: 6vw;
      display: none;
    }
  }

  .icon {
    font-size: 1.4vw;
    margin-right: 0.5vw;
    color: ${(props) => props.theme.icon};
    min-width: 1.5vw;

    @media only screen and (max-width: 600px) {
      font-size: 5vw;
      min-width: 5vw;
    }
  }
`;

const SearchWrapper = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  height: 100%;
  gap: 15px;

  @media only screen and (max-width: 600px) {
    width: 92%;
  }

  .iconContainer {
    display: none;
    @media only screen and (max-width: 600px) {
      display: flex;
      min-width: 6vw;
    }

    .feedicon {
      display: none;
      @media only screen and (max-width: 600px) {
        display: flex;
        font-size: 5vw;
        color: ${(props) => props.theme.icon};
      }
    }
  }

  .clearicon {
    font-size: 1.3vw;
    color: red;
    cursor: pointer;

    @media only screen and (max-width: 600px) {
      font-size: 6vw;
    }
  }
`;

const SearchContainer = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  align-items: center;
  padding: 0 1vw;
  background: ${(props) => props.theme.secondLevel};
  border-radius: 50vw;
  box-sizing: border-box;
  
  
  @media only screen and (max-width: 600px) {
    border-radius: 1.5vw;
    padding: 0.5vw 2vw;
    height: 100%;
    gap: 1vw;
    width: 100%;
    justify-content: center;
  }

  
}
`;

const Input = styled.input`
  width: 100%;
  height: 100%;
  background: none;
  outline: none;
  border: none;
  font-size: 16px;

  :focus {
    outline: none;
  }
`;

const Result = (props) => {
  const dispatch = useDispatch();
  const ResultData = () => {
    let data;
    data = props.data
      ?.filter((item) =>
        item.label?.toLowerCase()?.includes(props.srch?.toLowerCase())
      )
      ?.map((item, index) => {
        return (
          <Item
            onClick={async () => {
              await dispatch(setRerender());
              await dispatch(setSearch(item.label));
              await props.setSrch(item.label);
              props.setFocus(false);
            }}
            key={index}
          >
            {item.label}
          </Item>
        );
      });
    return data;
  };

  const resultData = ResultData();
  return <ResultContainer>{resultData}</ResultContainer>;
};

const ResultContainer = styled.div`
  width: 100%;
  height: 85vh;
  overflow-y: scroll;
  position: absolute;
  top: 0.5vw;
  background: ${(props) => props.theme.background};
  backdrop-filter: blur(40px);
  border: 1px solid ${(props) => props.theme.lineColor};
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: start;
  padding: 1vw;
  border-radius: 0.5vw;

  @media only screen and (max-width: 600px) {
    height: calc(100vh - 35vw);
    width: 100vw;
    border-radius: 0;
    top: 2vw;
    padding: 2vw 12vw;
    z-index: 920;
  }

  animation: fadeIn 0.5s;
  -webkit-animation: fadeIn 0.5s;
  -moz-animation: fadeIn 0.5s;
  -o-animation: fadeIn 0.5s;
  -ms-animation: fadeIn 0.5s;

  @keyframes fadeIn {
    0% {
      opacity: 0;
    }
    100% {
      opacity: 1;
    }
  }

  @-moz-keyframes fadeIn {
    0% {
      opacity: 0;
    }
    100% {
      opacity: 1;
    }
  }

  @-webkit-keyframes fadeIn {
    0% {
      opacity: 0;
    }
    100% {
      opacity: 1;
    }
  }

  @-o-keyframes fadeIn {
    0% {
      opacity: 0;
    }
    100% {
      opacity: 1;
    }
  }

  @-ms-keyframes fadeIn {
    0% {
      opacity: 0;
    }
    100% {
      opacity: 1;
    }
  }
`;

const Item = styled.div`
  cursor: pointer;
  padding: 5px;
  border-radius: 5px;
  box-sizing: border-box;
  border-bottom: 1px solid ${(props) => props.theme.lineColor};
  width: 100%;
  text-align: start;
  padding: 7px;
  font-size: 14px;
  color: ${(props) => props.theme.font};

  :hover {
    background: #f5f5f5;
  }
`;
