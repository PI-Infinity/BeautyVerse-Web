import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FeedCard } from '../../pages/main/feedCard/feedCard';
import { useSelector, useDispatch } from 'react-redux';
import useWindowDimensions from '../../functions/dimensions';
import { IsMobile } from '../../functions/isMobile';
import { Spinner } from '../../components/loader';

export const Feeds = (props) => {
  const { height, width } = useWindowDimensions();
  const isMobile = IsMobile();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  // import users

  const rerenderUserList = useSelector(
    (state) => state.storeRerenders.rerenderUserList
  );
  const scrollY = useSelector((state) => state.storeScroll.feedScrollY);

  const loadFeeds = useSelector((state) => state.storeMain.loadFeeds);

  const feeds = useSelector((state) => state.storeMain.userList);

  useEffect(() => {
    const Scrolling = () => {
      setTimeout(() => {
        return window.scrollTo(0, scrollY);
      }, 500);
    };
    return Scrolling();
  }, [scrollY]);

  return (
    <Container height={height}>
      {loadFeeds ? (
        <LoaderContainer id="feed">
          <Spinner />
        </LoaderContainer>
      ) : (
        <Wrapper id="feed">
          <div style={{ color: 'orange', height: 'auto' }}>
            {feeds?.map((item, index) => {
              if (item.feed) {
                return (
                  <FeedCard
                    key={index}
                    {...item}
                    index={index}
                    filterOpen={props.filterOpen}
                  />
                );
              }
            })}
          </div>
        </Wrapper>
      )}
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
  justify-content: center;
  align-items: start;
  // overflow-y: scroll;
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
