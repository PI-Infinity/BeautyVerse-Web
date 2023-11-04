import axios from 'axios';
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { FeedCard } from './components/feedCard';
import { BounceLoader } from 'react-spinners';
import { Outlet } from 'react-router-dom';
import { setPage, AddFeeds, setScrollYFeeds } from '../../redux/feeds';
import { Options } from './components/options';

const Feeds = () => {
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

  useEffect(() => {
    const handleScroll = async () => {
      const { scrollY, innerHeight } = window;
      const { scrollHeight } = document.documentElement;

      dispatch(setScrollYFeeds(scrollY));

      if (scrollY + innerHeight >= scrollHeight - 200) {
        await AddUsersFeeds(page + 1);
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

  // navigation between for you and followings feeds state
  const [activeList, setActiveList] = useState(false);

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
            console.log(itemId);
            try {
              if (userId !== currentUser?._id) {
                const response = await axios.patch(
                  backendUrl + '/api/v1/feeds/' + itemId + '/view',
                  {
                    view: machineId,
                  }
                );
                console.log(response);
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
          {/* <Navigator>
            <div
              onClick={() => setActiveList(true)}
              style={{
                color: activeList ? "#f866b1" : "#ccc",
                borderBottom: `1.5px solid ${
                  activeList ? "#f866b1" : "#050505"
                }`,
              }}
            >
              For You
            </div>
            <div
              onClick={() => setActiveList(false)}
              style={{
                color: !activeList ? "#f866b1" : "#ccc",
                borderBottom: `1.5px solid ${
                  !activeList ? "#f866b1" : "#050505"
                }`,
              }}
            >
              Followings
            </div>
          </Navigator> */}
          <div style={{ display: 'flex', width: '100vw' }}>
            <ListContainer activelist={activeList === true ? 'true' : 'false'}>
              {feeds?.map((item, index) => {
                return (
                  <div
                    ref={addToRefs}
                    data-id={item._id}
                    data-owner-id={item?.owner._id}
                    key={index}
                    style={{ width: '100%' }}
                  >
                    <FeedCard item={item} />
                  </div>
                );
              })}
            </ListContainer>
            {/* <ListContainer activelist={activeList === true ? "true" : "false"}>
              {feeds?.map((item, index) => {
                return <FeedCard key={index} item={item} />;
              })}
            </ListContainer> */}
          </div>
        </>
      )}
    </Container>
  );
};

export default Feeds;

const Container = styled.div`
  width: 100%;
  min-height: 100vh;
  padding-bottom: 8vh;
  overflow: hidden;
  box-sizing: border-box;
  background: rgba(0, 0, 0, 0.3);

  @media only screen and (max-width: 600px) {
    width: 100%;
    min-height: 100vh;
    padding-bottom: 8vh;
    overflow: hidden;
    box-sizing: border-box;
  }
`;

const Navigator = styled.div`
  display: flex;
  height: 50px;
  width: 100vw;

  div {
    width: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    font-weight: bold;
    letter-spacing: 0.5px;
  }
`;

const ListContainer = styled.div`
  position: relative;
  transition: ease-in 300ms;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;

  @media only screen and (max-width: 600px) {
    position: relative;
    transition: ease-in 300ms;
    align-items: start;
    right: ${(props) => (props.activelist === 'true' ? '100vw' : '0')};
  }
`;
