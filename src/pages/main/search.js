import React, { useState } from 'react';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import { CgSearch } from 'react-icons/cg';
import { MdClear, MdOutlinePersonPin } from 'react-icons/md';
import { TbArrowBigRightLines } from 'react-icons/tb';
import { setSearch } from '../../redux/filter';
import { ProceduresOptions } from '../../data/registerDatas';
import { useNavigate } from 'react-router-dom';
import { Language } from '../../context/language';
import { IsMobile } from '../../functions/isMobile';
import { setRerenderUserList } from '../../redux/rerenders';

export const Search = (props) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isMobile = IsMobile();
  const proceduresOptions = ProceduresOptions();
  const language = Language();

  // import current user & parse it
  const loadFeed = useSelector((state) => state.storeMain.loadFeed);
  const changeFeed = useSelector((state) => state.storeMain.changeFeed);

  const search = useSelector((state) => state.storeFilter.search);
  const [resultCont, setResultCont] = React.useState('0');
  const [srch, setSrch] = React.useState('');

  React.useEffect(() => {
    if (!isMobile) {
      dispatch(setSearch(''));
    }
    setSrch('');
  }, []);

  const [focus, setFocus] = useState(false);

  // import users
  const users = useSelector((state) => state.storeMain.userList);

  const [bg, setBg] = React.useState(false);

  // filter for result container
  const Filter = () => {
    // define filtered words list
    let userNames =
      users?.length > 0 &&
      users?.map((item) => {
        if (item?.type != 'user') {
          return item?.name;
        }
      });
    // let procedures = proceduresOptions?.map((item, index) => {
    //   return item.label;
    // });
    // let proceduresEng = proceduresOptions?.map((item, index) => {
    //   return item.value;
    // });
    // let full = proceduresGeo.concat(proceduresEng, userNames);

    let data;
    data = proceduresOptions
      ?.map((item, index) => ({
        // id: index + 1,
        value: item.value,
        label: item.label,
      }))
      .filter((item) => item.label != undefined);
    // }
    return data;
  };

  const data = Filter();

  const ResultData = () => {
    let dataResult = data
      ?.filter((item) =>
        item.label?.toLowerCase()?.includes(srch?.toLowerCase())
      )
      ?.map((item, index) => {
        return (
          <Item
            onClick={async () => {
              await dispatch(setSearch(item.value));
              await setSrch(item.label);
              await dispatch(setRerenderUserList());
              setFocus(false);
            }}
            key={index}
          >
            {item.label}
          </Item>
        );
      });
    return dataResult;
  };

  const resultData = ResultData();

  const [resultList, setResultList] = useState('');
  function GetName() {
    let em = srch?.toLowerCase();
    fetch(`https://beautyverse.herokuapp.com/api/v1/users/?name=${em}`)
      .then((response) => response.json())
      .then((data) => {
        setResultList(data.data.users);
      })
      .catch((error) => {
        console.log('Error fetching data:', error);
      });
  }
  React.useEffect(() => {
    GetName();
  }, []);

  return (
    <Container changeFeed={window.location.pathname.toString()}>
      <SearchWrapper>
        <SearchContainer>
          <CgSearch className="icon" />
          <Input
            id="search"
            placeholder={language?.language.Main.filter.search}
            // isMulti
            value={srch}
            onFocus={() => {
              if (resultData?.length > 0) {
                setFocus(true);
              }
            }}
            autoFocus={isMobile ? true : false}
            onChange={(e) => {
              setSrch(e.target.value);
            }}
          />
          {srch?.length > 0 && (
            <TbArrowBigRightLines
              onClick={
                isMobile
                  ? () => navigate('/')
                  : () => {
                      dispatch(setSearch(srch));
                      setFocus(false);
                    }
              }
              className="icon"
              style={{ cursor: 'pointer', filter: 'brightness(0.6)' }}
            />
          )}
        </SearchContainer>
        {((search?.length > 0 && search !== '') ||
          srch?.length > 0 ||
          focus) && (
          <MdClear
            className="clearicon"
            onClick={async () => {
              await setSrch('');
              await dispatch(setSearch(''));
              setFocus(false);
            }}
          />
        )}
        <MdOutlinePersonPin
          className="profileicon"
          onClick={
            window.location.pathname === '/'
              ? () => {
                  navigate('/cards');
                }
              : () => {
                  navigate('/');
                }
          }
        />
      </SearchWrapper>
      {focus && (
        <div style={{ width: '100%', position: 'relative' }}>
          <Result
            setFocus={setFocus}
            data={resultData}
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
  z-index: 900;

  @media only screen and (max-width: 600px) {
    width: 100%;
    justify-content: start;
    align-items: center;
    height: auto;
  }

  .profileicon {
    color: ${(props) =>
      props.changeFeed === '/cards' ? props.theme.font : '#aaa'};
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
    width: 93%;
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
  color: ${(props) => props.theme.font};

  :focus {
    position: static !important;
    outline: none;
  }
`;

const Result = (props) => {
  const dispatch = useDispatch();

  return <ResultContainer>{props.data}</ResultContainer>;
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
    overflow-y: visible;
    box-sizing: content-box;
    position: static;
    height: auto;
    width: 100vw;
    border-radius: 0;
    padding: 2vw 12vw 5vw 12vw;
    z-index: 920;
    border: none;
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
    filter: brightness(0.9);
  }
`;
