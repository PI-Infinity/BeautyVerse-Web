import React, { useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { CgSearch } from 'react-icons/cg';
import { MdClear } from 'react-icons/md';
import {
  setRerender,
  setEnterSearch,
  setFilterOpen,
} from '../../../redux/main';
import { setSearch } from '../../../redux/filter';
import { ProceduresOptions } from '../../../data/registerDatas';
import Select from 'react-select';
import { GrList } from 'react-icons/gr';
import { MdOutlinePersonPin } from 'react-icons/md';
import { setChangeFeed, setLoadFeed } from '../../../redux/main';

export const Search = (props) => {
  const proceduresOptions = ProceduresOptions();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // import current user & parse it
  const user = useSelector(
    (state) => state.storeMain.user?.length > 0 && state.storeMain.user
  );

  const search = useSelector((state) => state.storeFilter.search);
  const [resultCont, setResultCont] = React.useState('0');
  const [srch, setSrch] = React.useState('');

  React.useEffect(() => {
    dispatch(setSearch('all'));
    setSrch('');
  }, []);

  const [focus, setFocus] = useState(false);

  // import users
  const users = useSelector(
    (state) =>
      state.storeMain?.userList?.length > 0 &&
      JSON.parse(state.storeMain?.userList)
  );

  const [bg, setBg] = React.useState(false);

  const loadFeed = useSelector((state) => state.storeMain.loadFeed);
  const changeFeed = useSelector((state) => state.storeMain.changeFeed);

  // filter for result container
  const Filter = () => {
    // define filtered words list
    let userNames = users?.map((item) => {
      if (item.type != 'user') {
        return item.name;
      }
    });
    let proceduresGeo = proceduresOptions?.map((item, index) => {
      return item.label;
    });
    let proceduresEng = proceduresOptions?.map((item, index) => {
      return item.value;
    });
    let full = proceduresGeo.concat(proceduresEng, userNames);

    let data;
    data = full
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
    <Container changeFeed={changeFeed?.toString()}>
      <SearchWrapper>
        <h3
          onClick={() => navigate('/marketplace')}
          style={{ cursor: 'pointer' }}
        >
          Marketplace
        </h3>
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
              await setSrch('');
              await dispatch(setSearch('all'));
              await dispatch(setRerender());
              setFocus(false);
            }}
          />
        )}
      </SearchWrapper>
      {focus && (
        <div style={{ width: '100%', position: 'relative' }}>
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
  justify-content: start;
  align-items: start;
  width: 100%;
  height: 2.5vw;
  margin-left: 2vw;

  & > h3 {
    margin-right: 2vw;
    @media only screen and (max-width: 600px) {
      display: none;
    }
  }

  @media only screen and (max-width: 600px) {
    width: 100%;
    align-items: center;
    height: 8vw;
  }

  .feedicon {
    display: none;
    @media only screen and (max-width: 600px) {
      display: flex;
      font-size: 5vw;
      color: #010101;
    }
  }
  .profileicon {
    color: ${(props) => (props.changeFeed === 'true' ? '#ddd' : '#050505')};
    font-size: 1.2vw;
    cursor: pointer;

    @media only screen and (max-width: 600px) {
      font-size: 6vw;
    }
  }

  .icon {
    font-size: 1.4vw;
    margin-right: 0.5vw;
    color: #010101;
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
  width: 95%;
  height: 100%;
  gap: 2vw;
  box-sizing: border-box;

  @media only screen and (max-width: 600px) {
    width: 100%;
    padding: 0 3vw;
  }

  .iconContainer {
    display: none;
    @media only screen and (max-width: 600px) {
      display: flex;
      min-width: 6vw;
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
  background: #f3f3f3;
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
              await dispatch(setSearch(item.label));
              await props.setSrch(item.label);
              await dispatch(setRerender());
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
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(40px);
  border: 1px solid #eee;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: start;
  padding: 1vw;
  border-radius: 0.5vw;

  @media only screen and (max-width: 600px) {
    height: calc(100vh - 38vw);
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
  border-bottom: 1px solid #fff;
  width: 100%;
  text-align: start;
  padding: 7px;
  font-size: 14px;

  :hover {
    background: #f5f5f5;
  }
`;
