import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FeedCard } from '../../pages/main/feedCard/feedCard';
import { useSelector, useDispatch } from 'react-redux';
import useWindowDimensions from '../../functions/dimensions';
import { IsMobile } from '../../functions/isMobile';
import { Spinner } from '../../components/loader';
import { useNavigate } from 'react-router-dom';
import useScrollPosition from '../../functions/useScrollPosition';

export const Feeds = (props) => {
  const loadFeeds = useSelector((state) => state.storeMain.loadFeeds);
  const { height, width } = useWindowDimensions();
  const isMobile = IsMobile();
  const dispatch = useDispatch();

  const feeds = useSelector((state) => state.storeMain.userList);

  const navigate = useNavigate();
  const { saveScrollPosition } = useScrollPosition();

  useEffect(() => {
    return () => {
      saveScrollPosition();
    };
  }, [saveScrollPosition]);

  return (
    <Container height={height}>
      <Wrapper id="feed">
        {feeds?.map((item, index) => {
          if (item.feed) {
            if (feeds.length === index + 1) {
              return (
                <>
                  <FeedCard
                    lastFeedRef={props.lastFeedElementRef}
                    key={index}
                    {...item}
                    index={index}
                    filterOpen={props.filterOpen}
                    socket={props.socket}
                  />
                </>
              );
            } else {
              return (
                <FeedCard
                  key={index}
                  {...item}
                  index={index}
                  filterOpen={props.filterOpen}
                  socket={props.socket}
                />
              );
            }
          }
        })}
      </Wrapper>
      {/* )} */}
    </Container>
  );
};

const Container = styled.div`
  z-index: 800;
  // height: 83vh;
  width: 100%;

  @media only screen and (max-width: 600px) {
    // height: ${(props) => props.height}px;
    width: 100vw;
    overscroll-behavior: none;
  }
`;

const LoaderContainer = styled.div`
  width: 100%;
  height: 83vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Wrapper = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
  justify-content: start;
  flex-direction: column;
  align-items: center;
  overflow-x: hidden;
  box-sizing: border-box;
  padding: 1.5vw 0;

  @media only screen and (max-width: 600px) {
    padding: 13vw 0 12vw 0;
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
