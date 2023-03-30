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
import useScrollPosition from '../../functions/useScrollPosition';

export const Specialists = (props) => {
  const isMobile = IsMobile();
  const { height, width } = useWindowDimensions();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const proceduresOptions = ProceduresOptions();
  // import users
  const userList = useSelector((state) => state.storeMain.userList);

  setTimeout(() => {
    setLoading(false);
  }, 500);

  const { saveScrollPosition } = useScrollPosition();

  useEffect(() => {
    return () => {
      saveScrollPosition();
    };
  }, [saveScrollPosition]);

  return (
    <Container direction={props.direction} height={height}>
      {/* {loading ? (
        <Loader height={height}>
          <Spinner />
        </Loader>
      ) : ( */}
      <Wrapper id="list">
        {/* <div style={{ color: "orange", height: "auto", width: "auto" }}> */}
        {userList ? (
          <>
            {userList?.map((item, index) => {
              return (
                <SpecialistsCard
                  loading={loading}
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
      {/* )} */}
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
