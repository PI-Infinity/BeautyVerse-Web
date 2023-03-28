import React, { useEffect } from 'react';
import styled, { ThemeProvider } from 'styled-components';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import Main from './pages/main/main';
import { Feeds } from './pages/main/feeds';
import { Specialists } from './pages/main/specialists';
import { FilterMobile } from './pages/main/filterMobile';
import { Recomended } from './pages/main/recomended';
import AddFeed from './pages/addFeed/addFeed';
import Login from './pages/login/login';
import Register from './pages/register/register';
import { Identify } from './pages/register/identify';
import { BusinessRegister } from './pages/register/businessRegister';
import UserProfile from './pages/user/userProfilePage';
import { Services } from './pages/user/services';
import { UserFeeds } from './pages/user/feeds';
import { Audience } from './pages/user/audience';
import { Settings } from './pages/user/settings';
import { UserStatistics } from './pages/user/statistics/statistics';
import { Contact } from './pages/user/contact';
import AdminDashboard from './pages/adminDashboard/main';
import Users from './pages/adminDashboard/users';
import Notifications from './pages/adminDashboard/notifications';
import Reports from './pages/adminDashboard/reports';
import Statistics from './pages/adminDashboard/statistics';
import Messages from './pages/adminDashboard/messages';
import AllFeeds from './pages/adminDashboard/feeds';
import NotFound from './pages/notfound';
import { Header } from './components/header';
import { Filter } from './pages/main/filter';
import { OpenedFeed } from './pages/main/feedCard/openedFeed';
import { useDispatch, useSelector } from 'react-redux';
import { Footer } from './components/footer';
import {
  setUserList,
  setTheme,
  setLanguage,
  setCountry,
  setLoadFeeds,
} from './redux/main';
import { GlobalStyles, darkTheme, lightTheme } from './context/theme';
import { Navigator } from './components/navigator';
import { IsMobile } from './functions/isMobile';
import useWindowDimensions from './functions/dimensions';
import SimpleBackdrop from './components/backDrop';
import { ChoiceCountry } from './components/choiceCountry';

const SOCKET_SERVER = 'http://localhost:5000';

function App() {
  /**
   * define some needed functions
   */
  const { height, width } = useWindowDimensions();
  const isMobile = IsMobile();
  const location = useLocation();
  const dispatch = useDispatch();

  // redux imports
  const loading = useSelector((state) => state.storeMain.loading);
  const rerenderUserList = useSelector(
    (state) => state.storeRerenders.rerenderUserList
  );
  const rerenderCurrentUser = useSelector(
    (state) => state.storeRerenders.rerenderCurrentUser
  );
  const openFeed = useSelector((state) => state.storeFeed.openFeed);
  const changeFeed = useSelector((state) => state.storeMain.changeFeed);
  const loadFeed = useSelector((state) => state.storeMain.loadFeed);

  const language = useSelector((state) => state.storeMain.language);
  const country = useSelector((state) => state.storeMain.country);

  // open mobile filter
  const filterOpen = useSelector((state) => state.storeMain.mobileFilter);

  /**
   * get user
   */

  const currentUser = JSON?.parse(
    localStorage.getItem('Beautyverse:currentUser')
  );

  console.log(process.env.REACT_APP_HOST);

  /**
   * Import current user
   */
  async function GetUser() {
    const response = await fetch(
      `https://beautyverse.herokuapp.com/api/v1/users/${currentUser._id}`
    )
      .then((response) => response.json())
      .then((data) => {
        localStorage.setItem(
          'Beautyverse:currentUser',
          JSON.stringify(data.data.user)
        );
      })
      .catch((error) => {
        console.log('Error fetching data:', error);
      });
  }

  React.useEffect(() => {
    if (currentUser) {
      GetUser();
    }
  }, [rerenderCurrentUser]);

  // // connect socket connection
  // const [socket, setSocket] = useState(null);
  // const [room, setRoom] = useState('');

  // useEffect(() => {
  //   setRoom('');
  // }, []);

  // /**
  //  * connect to socket, get messages, join to room
  //  *  */

  // const handleRoomChange = (x) => {
  //   setRoom(x);
  //   socket?.emit('join', { room: x });
  // };

  // useEffect(() => {
  //   const socketConnection = socketIOClient(SOCKET_SERVER);
  //   setSocket(socketConnection);

  //   socketConnection.on('connect', () => {
  //     socketConnection.emit('join', { room: room });
  //   });

  //   return () => {
  //     socketConnection.disconnect();
  //   };
  // }, [SOCKET_SERVER]);

  // /**
  //  * get chats
  //  *  */

  // useEffect(() => {
  //   console.log('get chats');
  //   if (!socket) return;
  //   socket?.emit('getchats', (data) => {
  //     console.log('getchats:', data);
  //   });
  //   socket?.on('sendChats', (data) => {
  //     dispatch(setUserChats(data));
  //   });

  //   return () => {
  //     socket.off('getchats');
  //   };
  // }, [socket]);

  /**
   * get users with last feed
   */

  const search = useSelector((state) => state.storeFilter.search);
  const filter = useSelector((state) => state.storeFilter.filter);
  const city = useSelector((state) => state.storeFilter.cityFilter);
  const district = useSelector((state) => state.storeFilter.districtFilter);
  const specialist = useSelector((state) => state.storeFilter.specialist);
  const beautyCenter = useSelector((state) => state.storeFilter.object);

  React.useEffect(() => {
    async function GetUsersWithOneFeed() {
      await dispatch(setLoadFeeds(true));
      const response = await fetch(
        `https://beautyverse.herokuapp.com/api/v1/feeds?type=${
          specialist ? 'specialist' : ''
        }${
          beautyCenter ? 'beautyCenter' : ''
        }&city=${city}&district=${district}&filter=${filter}&search=${search}`
      )
        .then((response) => response.json())
        .then((data) => {
          console.log(data.data);
          dispatch(setUserList(data.data.feedList));
        })
        .then(() => {
          setTimeout(() => {
            dispatch(setLoadFeeds(false));
          }, 200);
        })
        .catch((error) => {
          console.log('Error fetching data:', error);
        });
    }
    GetUsersWithOneFeed();
  }, [
    currentUser,
    search,
    filter,
    city,
    district,
    specialist,
    beautyCenter,
    rerenderUserList,
  ]);

  /**
   * define authentication requred routes
   */

  const RequireAdminAuth = ({ children }) => {
    return currentUser.admin ? children : <Navigate to="/" />;
  };
  const RequireAuth = ({ children }) => {
    return currentUser ? children : <Navigate to="/login" />;
  };
  const RequireLogout = ({ children }) => {
    return !currentUser ? (
      children
    ) : (
      <Navigate
        to={`https://beautyverse.herokuapp.com/api/v1/users/${currentUser?._id}`}
      />
    );
  };

  /**
   * get local storage datas
   */
  useEffect(() => {
    JSON.parse(localStorage.getItem('BeautyVerse:ThemeMode')) !== null &&
      dispatch(
        setTheme(JSON.parse(localStorage.getItem('BeautyVerse:ThemeMode')))
      );
    localStorage.getItem('BeautyVerse:Language') !== null &&
      dispatch(
        setLanguage(JSON.parse(localStorage.getItem('BeautyVerse:Language')))
      );
    localStorage.getItem('BeautyVerse:Country') !== null &&
      dispatch(
        setCountry(JSON.parse(localStorage.getItem('BeautyVerse:Country')))
      );
  }, [currentUser, country, language]);

  /**
   * Define active theme mode
   */
  const theme = useSelector((state) => state.storeMain.theme);

  useEffect(() => {
    let activeTheme;
    if (theme) {
      activeTheme = 'rgba(15,15,15,15)';
    } else {
      activeTheme = '#FCFDFF';
    }
    document
      .querySelector("meta[name='theme-color']")
      .setAttribute('content', activeTheme);
    document.body.style.background = activeTheme;
  }, [currentUser, country, theme]);

  /**
   * Add local storage in redux
   */
  // React.useEffect(() => {
  //   // add cart items in redux
  //   let cart = localStorage.getItem('BeautyVerse:shoppingCart');
  //   if (cart?.length > 0) {
  //     dispatch(setCartList(JSON.parse(cart)));
  //   } else {
  //     dispatch(setCartList([]));
  //   }
  // }, [currentUser, country]);

  /**
   * Define paths where mobile navigator is hidden
   */
  let nav;
  if (
    window.location.pathname?.includes('/chat/') ||
    window.location.pathname?.includes('/product/') ||
    window.location.pathname == '/login' ||
    window.location.pathname == '/register' ||
    window.location.pathname == '/register/identify' ||
    window.location.pathname == '/register/business'
  ) {
    nav = undefined;
  } else {
    nav = <Navigator />;
  }

  return (
    <ThemeProvider theme={theme === false ? lightTheme : darkTheme}>
      {(country?.length < 1 || language?.length < 1) && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: '#111',
            backdropFilter: 'blur(20px)',
            zIndex: 10000,
            overflow: 'hidden',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <ChoiceCountry />
        </div>
      )}
      <GlobalStyles />
      <TopLine />
      {/* {loading && <Loading />} */}
      <Container>
        <SimpleBackdrop />
        {!window.location.pathname?.includes('admin') && <Header />}
        {isMobile &&
          (window.location.pathname === '/' ||
            window.location.pathname === '/cards') && <Filter />}
        <Routes>
          <Route path="/" element={<Main />}>
            <Route
              index
              element={<Feeds height={height} filterOpen={filterOpen} />}
            />
            <Route path="cards" element={<Specialists />} direction="row" />
            <Route
              path="filterMobile"
              element={<FilterMobile />}
              direction="row"
            />
            <Route path="add" element={<AddFeed />} direction="row" />
            <Route path="recomended" element={<Recomended />} direction="row" />
          </Route>
          <Route
            path="api/v1/users/:id/feeds/:feedId"
            element={<OpenedFeed />}
          />
          <Route
            path="api/v1/users/:id/feeds/:feedId/profile"
            element={<OpenedFeed />}
          />
          <Route
            path="/login"
            element={
              <RequireLogout>
                <Login />
              </RequireLogout>
            }
          />
          <Route path="api/v1/users/:id" element={<UserProfile />}>
            <Route index element={<UserFeeds />} />
            <Route path="services" element={<Services />} />
            {/* <Route path="team" element={<Team />} /> */}
            <Route path="contact" element={<Contact />} />
            <Route path="audience" element={<Audience />} />
            <Route path="statistics" element={<UserStatistics />} />
            <Route
              path="settings"
              element={
                <RequireAuth>
                  <Settings />
                </RequireAuth>
              }
            />
            {/* <Route path="followings" element={<Followings />} /> */}
          </Route>
          {/* <Route path="/marketplace" element={<Marketplace />}>
              <Route index element={<MarketplaceMain />} />
              <Route path="cart" element={<Cart />} />
              <Route path="market" element={<Market />}>
                <Route path=":Cetegory" element={<Market />}></Route>
              </Route>
            </Route>
            <Route
              path="/marketplace/:ShopId/product/:Id"
              element={<Product />}
            /> */}
          <Route
            path="admin"
            element={
              <RequireAdminAuth>
                <AdminDashboard />
              </RequireAdminAuth>
            }
          >
            <Route
              index
              element={
                <RequireAdminAuth>
                  <Users />
                </RequireAdminAuth>
              }
            />
            <Route
              path="statistics"
              element={
                <RequireAdminAuth>
                  <Statistics />
                </RequireAdminAuth>
              }
            />
            <Route
              path="notifications"
              element={
                <RequireAdminAuth>
                  <Notifications />
                </RequireAdminAuth>
              }
            />
            <Route
              path="reports"
              element={
                <RequireAdminAuth>
                  <Reports />
                </RequireAdminAuth>
              }
            />
            <Route
              path="messages"
              element={
                <RequireAdminAuth>
                  <Messages />
                </RequireAdminAuth>
              }
            />
            <Route
              path="feeds"
              element={
                <RequireAdminAuth>
                  <AllFeeds />
                </RequireAdminAuth>
              }
            />
          </Route>
          {/* <Route
            path="/chat"
            element={
              <RequireAuth>
                <Chat
                  socket={socket}
                  SOCKET_SERVER={SOCKET_SERVER}
                  handleRoomChange={handleRoomChange}
                  room={room}
                />
              </RequireAuth>
            }
          /> */}
          {/* <Route
            path="/chat/:id"
            element={
              <RequireAuth>
                <ChatContent />
              </RequireAuth>
            }
          /> */}
          <Route
            path="/register"
            element={
              <RequireLogout>
                <Register />
              </RequireLogout>
            }
          ></Route>
          <Route
            path="/register/identify"
            element={
              <RequireLogout>
                <Identify />
              </RequireLogout>
            }
          ></Route>
          <Route
            path="/register/business"
            element={
              <RequireLogout>
                <BusinessRegister />
              </RequireLogout>
            }
          ></Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
        {!window.location.pathname?.includes('admin') && <Footer />}
        {!window.location.pathname?.includes('admin') &&
          !window.location.pathname?.includes('feed/') && <>{nav}</>}
      </Container>
      {/* )} */}
    </ThemeProvider>
  );
}

export default App;

const Container = styled.div`
  background: ${(props) => props.theme.background};
`;

const TopLine = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  width: 100%;
  height: 0.22vw;
  background: linear-gradient(
    226deg,
    #2bdf61,
    #dfc32b,
    #ce2bdf,
    #2bc6df,
    #df2bb8,
    #2b8edf,
    #d3df2b,
    #2bdfd9,
    #df8c2b,
    #2bbedf,
    #df2bb0,
    #c3df2b,
    #ea7c7c,
    #2bdf61,
    #dfc32b
  );
  background-size: 800% 800%;
  z-index: 10;

  @media only screen and (max-width: 600px) {
    height: 0;
    display: none;
  }

  -webkit-animation: AnimationName 30s ease infinite;
  -moz-animation: AnimationName 30s ease infinite;
  -o-animation: AnimationName 30s ease infinite;
  animation: AnimationName 30s ease infinite;

  @-webkit-keyframes AnimationName {
    0% {
      background-position: 0% 50%;
    }
    50% {
      background-position: 100% 50%;
    }
    100% {
      background-position: 0% 50%;
    }
  }
  @-moz-keyframes AnimationName {
    0% {
      background-position: 0% 50%;
    }
    50% {
      background-position: 100% 50%;
    }
    100% {
      background-position: 0% 50%;
    }
  }
  @-o-keyframes AnimationName {
    0% {
      background-position: 0% 50%;
    }
    50% {
      background-position: 100% 50%;
    }
    100% {
      background-position: 0% 50%;
    }
  }
  @keyframes AnimationName {
    0% {
      background-position: 0% 50%;
    }
    50% {
      background-position: 100% 50%;
    }
    100% {
      background-position: 0% 50%;
    }
  }
`;
