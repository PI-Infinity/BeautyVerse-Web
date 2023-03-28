import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { SpecialistsCard } from '../../pages/main/specialistCard';
import { useDispatch, useSelector } from 'react-redux';
import useWindowDimensions from '../../functions/dimensions';
import { setLoadFeed, setRerender } from '../../redux/main';
import { setScroll } from '../../redux/scroll';
import { IsMobile } from '../../functions/isMobile';
import { Spinner } from '../../components/loader';
import { ProceduresOptions } from '../../data/registerDatas';

export const Specialists = (props) => {
  const scrollY = useSelector((state) => state.storeScroll.cardsScrollY);
  useEffect(() => {
    const Scrolling = () => {
      setTimeout(() => {
        return window.scrollTo(0, scrollY);
      }, 500);
    };
    return Scrolling();
  }, [scrollY]);
  const isMobile = IsMobile();
  const { height, width } = useWindowDimensions();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const proceduresOptions = ProceduresOptions();
  // import users
  const userList = useSelector((state) => state.storeMain.userList);

  // scrolling

  const scrollref = React.useRef(null);
  const getscroll = () => {
    const scroll = Math.abs(
      scrollref.current.getBoundingClientRect().top -
        scrollref.current.offsetTop
    );

    if (scroll > 250) {
      localStorage.setItem('BeautyVerse:scrollPosition', scroll);
    } else {
      localStorage.setItem('BeautyVerse:scrollPosition', 0);
    }

    if (isMobile) {
      if (scroll < 50 && scroll > -1) {
        dispatch(setScroll(true));
      } else {
        dispatch(setScroll(false));
      }

      if (Math.abs(scrollref.current.getBoundingClientRect().top > 230)) {
        dispatch(setRerender());
      }
    }
  };

  // go back to saved scroll position
  // useEffect(() => {
  //   const pos = localStorage.getItem("BeautyVerse:scrollPosition");
  //   const w = document.getElementById("list");
  //   w.scrollTop = pos;
  // }, [userList]);
  setTimeout(() => {
    setLoading(false);
  }, 300);

  useEffect(() => {
    if (userList?.length < 1) {
      dispatch(setLoadFeed(false));
    }
  }, [userList]);

  console.log(userList);

  return (
    <Container direction={props.direction} height={height}>
      {loading ? (
        <Loader height={height}>
          <Spinner />
        </Loader>
      ) : (
        <Wrapper onScroll={getscroll} id="list" ref={scrollref}>
          {/* <div style={{ color: "orange", height: "auto", width: "auto" }}> */}
          {userList ? (
            <>
              {userList?.map((item, index) => {
                return (
                  <SpecialistsCard
                    key={index}
                    index={index}
                    {...item}
                    filterOpen={props.filterOpen}
                  />
                );
              })}
            </>
          ) : (
            <div
              style={{
                width: '100%',
                height: '90vh',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                color: 'orange',
              }}
            >
              Nothing found with this filter!
            </div>
          )}
          {/* </div> */}
        </Wrapper>
      )}
    </Container>
  );
};

const Loader = styled.div`
  z-index: 800;
  height: 85vh;
  width: 100%;
  background: ${(props) => props.theme.background};
  display: flex;
  justify-content: center;
  align-items: center;

  @media only screen and (max-width: 600px) {
    height: ${(props) => props.height}px;
    width: 100vw;
  }
`;

const Container = styled.div`
  z-index: 800;
  // height: 85vh;
  overflow-x: hidden;
  width: 100%;
  background: ${(props) => props.theme.background};

  @media only screen and (max-width: 600px) {
    // height: ${(props) => props.height}px;
    width: 100vw;
    display: flex;
    justify-content: center;
  }
`;

const Wrapper = styled.div`
  height: auto;
  width: 100%;
  display: flex;
  justify-content: start;
  align-items: start;
  flex-wrap: wrap;
  overflow-y: scroll;
  overflow-x: hidden;
  box-sizing: border-box;
  padding: 1.5vw 2.5vw;
  gap: 15px;

  @media only screen and (max-width: 600px) {
    width: 92vw;
    justify-content: start;
    flex-wrap: wrap;
    padding: 15vw 0 15vw 0;
    gap: 15px;
  }

  .empty {
    display: none;
    @media only screen and (max-width: 600px) {
      display: flex;
      height: 27vw;
    }
  }

  /* width */
  ::-webkit-scrollbar {
    width: 0vw;
  }

  /* Track */
  ::-webkit-scrollbar-track {
    background-color: white;
  }

  /* Handle */
  ::-webkit-scrollbar-thumb {
    background-color: #222;
  }

  /* Handle on hover */
  ::-webkit-scrollbar-thumb:hover {
    background-color: #1e1e1e;
  }
`;
