import axios from 'axios';
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { FeedCard } from './components/feedCard';
import { BounceLoader } from 'react-spinners';
import { Outlet } from 'react-router-dom';
import {
  setPage,
  AddFeeds,
  setScrollYFeeds,
  AddFollowingsFeeds,
  setFollowingsPage,
} from '../../redux/feeds';
import { Options } from './components/options';

const Feeds = ({ list }) => {
  // redux dispatch
  const dispatch = useDispatch();

  // current user state
  const currentUser = useSelector((state) => state.storeUser.currentUser);

  // backend url
  const backendUrl = useSelector((state) => state.storeApp.backendUrl);

  // fo to saved scroll y position
  const scrollYPosition = useSelector((state) => state.storeFeeds.scrollY);
  useEffect(() => {
    window.scrollTo(0, scrollYPosition);
  }, []);

  // navigation between for you and followings feeds state
  const [activeList, setActiveList] = useState(true);

  // feeds
  const loading = useSelector((state) => state.storeFeeds.loading);
  const page = useSelector((state) => state.storeFeeds.page);
  const feeds = useSelector((state) => state.storeFeeds.feeds);

  // adding feeds
  const AddUsersFeeds = async (currentPage) => {
    try {
      const response = await axios.get(
        `${backendUrl}/api/v1/feeds?page=${currentPage}${
          currentUser ? '&check=' + currentUser._id : ''
        }&limit=3`
      );
      const newFeeds = response.data.data.feedlist;

      dispatch(AddFeeds(newFeeds));
      dispatch(setPage(currentPage));
    } catch (error) {
      console.log(error.response.data.message);
    }
  };

  // feeds

  const followingsPage = useSelector(
    (state) => state.storeFeeds.followingsPage
  );
  const followingsFeeds = useSelector(
    (state) => state.storeFeeds.followingsFeeds
  );

  // adding feeds
  const AddUsersFollowingsFeeds = async (currentPage) => {
    try {
      const response = await axios.get(
        `${backendUrl}/api/v1/feeds/followings?check=${currentUser._id}&page=1&limit=3`
      );
      const newFeeds = response.data.data.feedlist;

      dispatch(AddFollowingsFeeds(newFeeds));
      dispatch(setFollowingsPage(currentPage));
    } catch (error) {
      console.log(error.response.data.message);
    }
  };

  useEffect(() => {
    const handleScroll = async () => {
      const { scrollY, innerHeight } = window;
      const { scrollHeight } = document.documentElement;

      dispatch(setScrollYFeeds(scrollY));

      if (scrollY + innerHeight >= scrollHeight - 200) {
        if (activeList) {
          await AddUsersFeeds(page + 1);
        } else {
          await AddUsersFollowingsFeeds(followingsPage + 1);
        }
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [page]);

  // scroll to top
  const scrollToTop = useSelector((state) => state.storeApp.scrollToTop);
  const firstLoadScroll = useRef(true);
  useEffect(() => {
    if (firstLoadScroll.current) {
      firstLoadScroll.current = false;
      return;
    }
    // Perform some action when scrollToTop is true
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // other logic you want to perform when scrollToTop changes
  }, [scrollToTop]);

  // refresh indicator
  const [refresh, setRefresh] = useState(false);
  const rerenderFeeds = useSelector((state) => state.storeFeeds.rerenderFeeds);
  const firstLoad = useRef(true);
  useEffect(() => {
    if (firstLoad.current) {
      firstLoad.current = false;
      return;
    }
    setRefresh(true);
    setTimeout(() => {
      setRefresh(false);
    }, 1500);
  }, [rerenderFeeds]);

  /**
   * feed seen functionallity
   */

  // Ref to hold all feed item refs
  const feedItemRefs = useRef([]);

  // Function to add a feed item to the refs array
  const addToRefs = (el) => {
    if (el && !feedItemRefs.current.includes(el)) {
      feedItemRefs.current.push(el);
    }
  };

  const machineId = useSelector((state) => state.storeApp.machineId);

  // Callback function for the Intersection Observer
  const handleIntersect = useCallback(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && entry.intersectionRatio >= 0.6) {
          const Seen = async (userId, itemId) => {
            try {
              if (userId !== currentUser?._id) {
                const response = await axios.patch(
                  backendUrl + '/api/v1/feeds/' + itemId + '/view',
                  {
                    view: machineId,
                  }
                );
              }
            } catch (error) {
              console.log(error);
            }
          };
          if (machineId) {
            Seen(entry.target.dataset.ownerId, entry.target.dataset.id);
          }
        }
      });
    },
    [machineId]
  );

  // Setting up the Intersection Observer
  useEffect(() => {
    const observer = new IntersectionObserver(handleIntersect, {
      root: null,
      rootMargin: '0px',
      threshold: 0.6,
    });

    // Observe all current feed item refs
    feedItemRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    // Cleanup function to unobserve all feed items
    return () => {
      feedItemRefs.current.forEach((ref) => {
        if (ref) observer.unobserve(ref);
      });
    };
  }, [feeds, handleIntersect, machineId]);

  return (
    <Container>
      <Outlet />
      {loading ? (
        <div
          style={{
            position: 'fixed',
            top: '0px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            height: '100vh',
          }}
        >
          <BounceLoader color={'#f866b1'} loading={loading} size={50} />
        </div>
      ) : (
        <>
          <div
            style={{
              height: refresh ? '60px' : 0,
              opacity: refresh ? 1 : 0,
              width: '100%',
              transition: 'ease-in-out 300ms',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <BounceLoader color={'#f866b1'} loading={refresh} size={30} />
          </div>
          <Navigator>
            <div className="wrapper">
              <div
                onClick={() => setActiveList(true)}
                style={{
                  width: '50%',
                  boxSizing: 'border-box',
                  textAlign: 'center',
                  padding: '10px 0',
                  letterSpacing: '0.5px',
                  fontWeight: 500,
                  color: activeList ? '#f866b1' : '#ccc',
                }}
              >
                For You
              </div>
              <div
                onClick={() => setActiveList(false)}
                style={{
                  width: '50%',
                  boxSizing: 'border-box',
                  textAlign: 'center',
                  padding: '10px 0',
                  letterSpacing: '0.5px',
                  fontWeight: 500,
                  color: !activeList ? '#f866b1' : '#ccc',
                }}
              >
                Followings
              </div>
            </div>
            <div className="line">
              <div
                style={{
                  transition: 'ease-in 200ms',
                  width: '50%',
                  height: '1.5px',
                  background: '#f866b1',
                  position: 'relative',
                  left: activeList ? '0' : '50%',
                }}
              ></div>
            </div>
          </Navigator>
          <ContentContainer>
            <ListContainer activelist={activeList === true ? 'true' : 'false'}>
              {feeds?.length > 0 ? (
                feeds?.map((item, index) => {
                  return (
                    <FeedContainer
                      ref={addToRefs}
                      data-id={item._id}
                      data-owner-id={item?.owner._id}
                      key={index}
                    >
                      <FeedCard item={item} />
                    </FeedContainer>
                  );
                })
              ) : (
                <div
                  style={{
                    width: '100%',
                    height: '500px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'rgba(255,255,255,0.3)',
                  }}
                >
                  <p>No feeds found!</p>
                </div>
              )}
            </ListContainer>
            <ListContainer activelist={activeList === true ? 'true' : 'false'}>
              {followingsFeeds?.length > 0 ? (
                followingsFeeds?.map((item, index) => {
                  return <FeedCard key={index} item={item} />;
                })
              ) : (
                <div
                  style={{
                    width: '100%',
                    height: '500px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'rgba(255,255,255,0.3)',
                  }}
                >
                  <p>No followings feeds found!</p>
                </div>
              )}
            </ListContainer>
          </ContentContainer>
        </>
      )}
    </Container>
  );
};

export default Feeds;

const Container = styled.div`
  width: 50vw;
  min-height: 100vh;
  padding-bottom: 8vh;
  overflow: hidden;
  box-sizing: border-box;
  background: rgba(0, 0, 0, 0.3);
  margin-left: 25vw;

  @media only screen and (max-width: 600px) {
    margin-left: 0;
    width: 100%;
    min-height: 100vh;
    padding-bottom: 8vh;
    overflow: hidden;
    box-sizing: border-box;
  }
`;

const Navigator = styled.div`
  height: 45px;
  width: 100vw;

  .wrapper {
    width: 50%;
    display: flex;
    align-items: center;
    justify-content: center;

    @media only screen and (max-width: 600px) {
      width: 100%;
    }
  }

  .line {
    width: 50%;
    height: 1.5px;
    background: rgba(255, 255, 255, 0.1);

    @media only screen and (max-width: 600px) {
      width: 100%;
    }
  }
`;

const ContentContainer = styled.div`
  display: flex;
  width: 100vw;

  @media only screen and (max-width: 600px) {
    width: 200vw;
  }
`;

const ListContainer = styled.div`
  position: relative;
  transition: ease-in 200ms;
  display: flex;
  flex-direction: column;
  align-items: center;
  right: ${(props) => (props.activelist === 'false' ? '50vw' : '0')};
  width: 50vw;

  @media only screen and (max-width: 600px) {
    width: 100%;
    transition: ease-in 200ms;
    align-items: start;
    right: ${(props) => (props.activelist === 'false' ? '100vw' : '0')};
  }
`;

const FeedContainer = styled.div`
  width: 50vw;
  display: flex;
  justify-content: center;

  @media only screen and (max-width: 600px) {
    width: 100%;
  }
`;
