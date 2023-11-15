import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react';
import {
  IoMdArrowDropdown,
  IoMdArrowDropleft,
  IoMdArrowDropright,
} from 'react-icons/io';
import { useDispatch, useSelector } from 'react-redux';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { darkTheme, lightTheme } from '../../context/theme';
import { ProceduresOptions } from '../../datas/registerDatas';
import { setOpenedProduct } from '../../redux/marketplace';
import { BounceLoader } from 'react-spinners';
import { FeedCard } from '../feeds/components/feedCard';

export const SavedItems = ({ activePage, setActivePage }) => {
  // navigate
  const navigate = useNavigate();
  // location
  const location = useLocation();

  useEffect(() => {
    // Disable body scroll when the component is open
    if (activePage) {
      document.body.style.overflowY = 'hidden';
    }

    return () => {
      // Re-enable body scroll when the component is closed
      document.body.style.overflowY = 'visible';
    };
  }, [activePage]);

  // transition
  const [transition, setTransition] = useState(true);

  useEffect(() => {
    setTransition(false);
  }, []);

  // defines theme context
  const theme = useSelector((state) => state.storeApp.theme);
  const currentTheme = theme ? darkTheme : lightTheme;

  // defines redux dispatch
  const dispatch = useDispatch();

  // defines current user from redux
  const currentUser = useSelector((state) => state.storeUser.currentUser);

  /*
   * users states with last feed
   */
  const [feeds, setFeeds] = useState([]);
  const [products, setProducts] = useState([]);

  // categories
  const categoryList = ProceduresOptions();

  // defines navigator of for you list or followings list
  const [activeList, setActiveList] = useState(true);

  const [page, setPage] = useState(1);

  /**
   * Get users function when screen loads
   */
  useEffect(() => {
    // Function to get feed data from server
    const Getting = async () => {
      try {
        const response = await axios.get(
          `${backendUrl}/api/v1/feeds/${currentUser._id}/saved?&page=1&limit=2`
        );
        setFeeds(response.data.data.feeds);
        setTimeout(() => {
          setLoading(false);
          setPage(1);
        }, 500);
      } catch (error) {
        console.log(error.response.data.message);

        setPage(1);
      }
    };
    Getting();
  }, []);

  /**
   * Function to get new users with feeds and adding them in user state while user scrolling to bottom
   *  */
  const AddUsersWithFeeds = async (currentPage) => {
    try {
      const response = await axios.get(
        `${backendUrl}/api/v1/feeds/${currentUser._id}/saved?&page=${currentPage}&limit=2`
      );

      // Update users' state with new feed data

      const newUsers = response.data.data.feeds;

      if (newUsers?.length > 0) {
        setFeeds((prev) => {
          return newUsers.reduce((acc, curr) => {
            const existingUserIndex = acc.findIndex(
              (user) => user._id === curr._id
            );
            if (existingUserIndex !== -1) {
              // User already exists, merge the data
              const mergedUser = { ...acc[existingUserIndex], ...curr };
              return [
                ...acc.slice(0, existingUserIndex),
                mergedUser,
                ...acc.slice(existingUserIndex + 1),
              ];
            } else {
              // User doesn't exist, add to the end of the array
              return [...acc, curr];
            }
          }, prev);
        });
        setPage(currentPage);
      }
    } catch (error) {
      console.log(error.response.data.message);
    }
  };

  /*
  page defines query for backend
  this state used to add new users on scrolling. when page changes, in state adds new users with last feeds
  */

  const [productsPage, setProductsPage] = useState(1);

  // defines backend url
  const backendUrl = useSelector((state) => state.storeApp.backendUrl);

  const [loading, setLoading] = useState(true);

  // getting followings feeds
  useEffect(() => {
    // Function to get feed data from server
    const Getting = async () => {
      try {
        const response = await axios.get(
          `${backendUrl}/api/v1/marketplace/${currentUser._id}/saved?&page=1&limit=4`
        );
        setProducts(response.data.data.products);

        setTimeout(() => {
          setProductsPage(1);
        }, 500);
      } catch (error) {
        console.log(error.response.data.message);
        setLoading(false);
        setProductsPage(1);
      }
    };
    Getting();
  }, []);

  const AddProducts = async (currentPage) => {
    try {
      const response = await axios.get(
        `${backendUrl}/api/v1/marketplace/${currentUser._id}/saved?&page=${currentPage}&limit=4`
      );

      // Update users' state with new feed data
      const newProducts = response.data.data.products;
      if (newProducts) {
        setProducts((prev) => {
          return newProducts.reduce((acc, curr) => {
            const existingUserIndex = acc.findIndex(
              (pr) => pr._id === curr._id
            );
            if (existingUserIndex !== -1) {
              // User already exists, merge the data
              const mergedUser = { ...acc[existingUserIndex], ...curr };
              return [
                ...acc.slice(0, existingUserIndex),
                mergedUser,
                ...acc.slice(existingUserIndex + 1),
              ];
            } else {
              // User doesn't exist, add to the end of the array
              return [...acc, curr];
            }
          }, prev);
        });
        setProductsPage(currentPage);
      }
    } catch (error) {
      console.log(error.response.data.message);
    }
  };

  const scrollRef = useRef();

  const handleScroll = async () => {
    if (scrollRef.current) {
      const { scrollTop, clientHeight, scrollHeight } = scrollRef.current;

      // Check if the user has scrolled to the bottom of the container
      if (scrollTop + clientHeight >= scrollHeight - 200) {
        if (activeList) {
          console.log('run feeds');
          await AddUsersWithFeeds(page + 1);
        } else {
          await AddProducts(productsPage + 1);
        }
      }
    }
  };

  useEffect(() => {
    const container = scrollRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
    }

    // Cleanup function to remove the event listener
    return () => {
      if (container) {
        container.removeEventListener('scroll', handleScroll);
      }
    };
  }, [page, handleScroll]); // Add dependencies here

  return (
    <div
      style={{
        background: 'rgba(1, 2, 12, 0.2)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        zIndex: 1001,
        width: '100vw',
        height: '100%',
        position: 'fixed',
        top: '0',
        left: '0',
      }}
    >
      <Container ref={scrollRef} openpage={transition ? 'true' : 'false'}>
        <Header>
          <div
            onClick={() => {
              setTransition(true);
              setTimeout(() => {
                setActivePage({ active: false, page: null, data: null });
              }, 300);
            }}
            style={{
              padding: '5px',

              zIndex: 1000,
            }}
          >
            <IoMdArrowDropleft size={30} color="#f866b1" />
          </div>
          <div>
            <h3
              style={{
                color: '#ccc',
                margin: 0,
                padding: 0,
                letterSpacing: '0.5px',
              }}
            >
              Saved Items
            </h3>
          </div>
          <div style={{ width: '40px' }}></div>
        </Header>
        <div
          style={{
            width: '100%',
            alignItems: 'center',
            display: 'flex',
            justifyContent: 'center',
            gap: '10px',
            color: '#ccc',
            fontWeight: 500,
          }}
        >
          <div
            style={{
              padding: '5px 10px',
              borderRadius: '50px',
              boxSizing: 'border-box',
              width: '45%',
              border: `1px solid ${
                activeList ? '#f866b1' : 'rgba(255,255,255,0.1)'
              }`,
              color: `${activeList ? '#f866b1' : '#ccc'}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              letterSpacing: '0.5px',
              fontWeight: 500,
            }}
            onClick={() => {
              setPage(1);
              setActiveList(true);
            }}
          >
            Feeds
          </div>
          <div
            style={{
              padding: '5px 10px',
              borderRadius: '50px',
              boxSizing: 'border-box',
              width: '45%',
              border: `1px solid ${
                !activeList ? '#f866b1' : 'rgba(255,255,255,0.1)'
              }`,
              color: `${!activeList ? '#f866b1' : '#ccc'}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              letterSpacing: '0.5px',
              fontWeight: 500,
            }}
            onClick={() => {
              setPage(1);
              setActiveList(false);
            }}
          >
            Products
          </div>
        </div>
        {loading ? (
          <BounceLoader
            color="#f866b1"
            size={30}
            style={{ position: 'absolute', left: '46%', top: '200px' }}
          />
        ) : (
          <div style={{ margin: '15px 0 0 0' }}>
            {activeList ? (
              <ListContainer>
                {feeds?.length > 0 ? (
                  feeds.map((item, index) => {
                    return (
                      <div
                        data-id={item._id}
                        data-owner-id={item?.owner._id}
                        key={index}
                        style={{ width: '100%' }}
                      >
                        <FeedCard item={item} />
                      </div>
                    );
                  })
                ) : (
                  <div
                    style={{
                      width: '100%',
                      height: '300px',
                      color: 'rgba(255,255,255,0.3)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      letterSpacing: '0.5px',
                      fontWeight: 500,
                    }}
                  >
                    Saved feeds not found!
                  </div>
                )}
              </ListContainer>
            ) : (
              <ListContainer>
                {products?.length > 0 ? (
                  products.map((item, index) => {
                    let label = categoryList?.find(
                      (i, x) =>
                        i?.value?.toLowerCase() ===
                        item?.categories[0]?.toLowerCase()
                    ).label;
                    return (
                      <ProductItem
                        key={index}
                        onClick={() => {
                          dispatch(setOpenedProduct(item));
                          if (location.pathname?.startsWith('/profile')) {
                            navigate(`product/${item._id}`);
                          } else {
                            navigate(
                              `/user/${item?.owner?._id}/showroom/${item._id}`
                            );
                          }
                        }}
                      >
                        <div
                          style={{
                            width: '32vw',
                            aspectRatio: 1,
                            borderRadius: '15px',
                            objectFit: 'cover',
                            background: 'rgba(255,255,255,0.05)',
                            overflow: 'hidden',
                          }}
                        >
                          <img
                            src={item?.gallery[0]?.url}
                            style={{
                              width: '100%',
                              aspectRatio: 1,
                              borderRadius: '15px',
                              objectFit: 'cover',
                              opacity: 1,
                              transition: 'ease-in 500ms',
                            }}
                            // onLoad={() => setOpacity(true)}
                          />
                        </div>
                        <div
                          style={{
                            height: '100%',
                            color: '#ccc',
                            letterSpacing: '0.5px',
                            width: '60vw',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                          }}
                        >
                          <h3 style={{ margin: '8px 0', fontSize: '16px' }}>
                            {item?.title}
                          </h3>
                          <p style={{ margin: '8px 0', fontSize: '14px' }}>
                            {item.brand}
                          </p>
                          <p style={{ margin: '8px 0', fontSize: '14px' }}>
                            {label}
                          </p>
                          <div
                            style={{
                              display: 'flex',
                              gap: '10px',
                              fontSize: '16px',
                            }}
                          >
                            <p
                              style={{
                                margin: '8px 0',
                                fontWeight: 'bold',
                                color: '#f866b1',
                              }}
                            >
                              {item?.sale
                                ? (
                                    item?.price -
                                    (item.price / 100) * item.sale
                                  ).toFixed(2)
                                : item.price}{' '}
                              {item?.owner?.currency}
                            </p>
                            {item?.sale && (
                              <p
                                style={{
                                  margin: '8px 0',
                                  textDecorationLine: 'line-through',
                                  color: '#888',
                                  fontWeight: 'bold',
                                }}
                              >
                                {item?.price} {item?.owner.currency}
                              </p>
                            )}
                          </div>
                        </div>
                      </ProductItem>
                    );
                  })
                ) : (
                  <div
                    style={{
                      width: '100%',
                      height: '300px',
                      color: 'rgba(255,255,255,0.3)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      letterSpacing: '0.5px',
                      fontWeight: 500,
                    }}
                  >
                    Saved products not found!
                  </div>
                )}
                <Outlet />
              </ListContainer>
            )}
          </div>
        )}
      </Container>
    </div>
  );
};

const Container = styled.div`
  width: 100vw;
  height: 100%;
  padding: 0 0 50px 0;
  z-index: 1000;
  background: rgba(1, 2, 12, 0.9);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  transition: ease-in 200ms;
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow-y: scroll;
  overflow-x: hidden;
  position: fixed;
  left: ${(props) => (props.openpage === 'false' ? 0 : '100vw')};
`;

const Header = styled.div`
  width: 100%;
  padding: 12.5px 8px;
  box-sizing: border-box;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const ListContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
`;

const ProductItem = styled.div`
  width: 90%;
  padding: 8px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 20px;
  margin: 0 5%;
  display: flex;
  align-items: center;
  gap: 15px;

  &:hover {
    opacity: 0.9;
  }
`;
