import React, { useState, useEffect, useContext, useMemo, memo } from "react";
import styled, { ThemeProvider } from "styled-components";
import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import Main from "./pages/main/main";
import { Feeds } from "./pages/main/feeds";
import { Specialists } from "./pages/main/specialists";
import AddFeed from "./pages/addFeed/addFeed";
import Login from "./pages/login";
import Register from "./pages/register/register";
import { Identify } from "./pages/register/identify";
import { BusinessRegister } from "./pages/register/businessRegister";
import Chat from "./pages/chat/main";
import UserProfile from "./pages/user/userProfilePage";
import { Services } from "./pages/user/services";
import { UserFeeds } from "./pages/user/feeds";
import { Audience } from "./pages/user/audience";
import { Contact } from "./pages/user/contact";
import { Team } from "./pages/user/team";
import Marketplace from "./src-marketplace/pages/market/marketplace";
import MarketplaceMain from "./src-marketplace/pages/market/marketplace-main";
import Market from "./src-marketplace/pages/market/market";
import Cart from "./src-marketplace/pages/cart-page";
import Product from "./src-marketplace/pages/product/product";
import NotFound from "./pages/notfound";
import { Header } from "./components/header";
import { Filter } from "./pages/main/filter";
import { OpenedFeed } from "./pages/main/feedCard/openedFeed";
import {
  collection,
  doc,
  onSnapshot,
  collectionGroup,
  getDocs,
  query,
} from "firebase/firestore";
import { ref, uploadBytes, listAll, getDownloadURL } from "firebase/storage";
import { db, storage } from "./firebase";
import { useDispatch, useSelector } from "react-redux";
import { AuthContext } from "./context/AuthContext";
import { Loading } from "./components/loading";
import { Footer } from "./components/footer";
import {
  setUser,
  setCover,
  setFeeds,
  setUserList,
  setCoverInfo,
  setLoading,
  setFollowings,
} from "./redux/main";
import { setCurrentShopProducts } from "./redux/marketplace/marketplace";
import { GlobalStyles, darkTheme, lightTheme } from "./context/theme";
import { ChatContent } from "./pages/chat/chatContent";
import { Navigator } from "./components/navigator";
import { IsMobile } from "./functions/isMobile";
import useWindowDimensions from "./functions/dimensions";
import { setCartList } from "./redux/marketplace/shoppingCart";
import SimpleBackdrop from "./components/backDrop";

function App() {
  /**
   * define some needed functions
   */
  const { height, width } = useWindowDimensions();
  const isMobile = IsMobile();
  const location = useLocation();

  // color mode
  const theme = useSelector((state) => state.storeMain.theme);

  // redux imports
  const loading = useSelector((state) => state.storeMain.loading);
  const rerender = useSelector((state) => state.storeMain.rerender);
  const openFeed = useSelector((state) => state.storeFeed.openFeed);
  const changeFeed = useSelector((state) => state.storeMain.changeFeed);
  const loadFeed = useSelector((state) => state.storeMain.loadFeed);

  // open mobile filter
  const filterOpen = useSelector((state) => state.storeMain.mobileFilter);

  /**
   * authentication // private route
   * define private route, that need to log in,
   * also define page rout that need to logout.
   */
  const { currentUser } = useContext(AuthContext);

  const RequireAuth = ({ children }) => {
    return currentUser ? children : <Navigate to="/login" />;
  };
  const RequireLogout = ({ children }) => {
    return !currentUser ? (
      children
    ) : (
      <Navigate to={`/user/${currentUser?.uid}`} />
    );
  };

  const dispatch = useDispatch();

  useEffect(() => {
    let activeTheme;
    if (theme) {
      activeTheme = "#222";
    } else {
      activeTheme = "#FCFDFF";
    }
    document
      .querySelector("meta[name='theme-color']")
      .setAttribute("content", activeTheme);
  }, [currentUser, theme]);

  /**
   * import current user from firebase
   * find by id, defined from conetext / authentication
   */
  React.useEffect(() => {
    if (currentUser) {
      const data = onSnapshot(collection(db, "users"), (snapshot) => {
        dispatch(
          setUser(
            JSON.stringify(
              snapshot.docs
                .map((doc) => doc.data())
                .find((item) => item.id == currentUser?.uid)
            )
          )
        );
      });
      return data;
    }
  }, [currentUser, rerender]);

  /*
   * import products from firesotre if current user type is shop
   * dispatch to redux for after control
   */
  React.useEffect(() => {
    const data = onSnapshot(
      collection(db, "users", `${currentUser?.uid}`, "products"),
      (snapshot) => {
        if (snapshot != undefined) {
          dispatch(
            setCurrentShopProducts(
              JSON.stringify(snapshot.docs.map((doc) => doc.data()))
            )
          );
        }
      }
    );
    return data;
  }, [rerender, currentUser]);

  /**
   // import current user's followings
   *  send to redux
   */
  React.useEffect(() => {
    const data = onSnapshot(
      collection(db, "users", `${currentUser?.uid}`, "followings"),
      (snapshot) => {
        dispatch(setFollowings(snapshot.docs.map((doc) => doc.data())));
      }
    );
    return data;
  }, [currentUser]);

  /**
   * Import all type users from firestore
   * send to redux
   */
  React.useEffect(() => {
    const data = onSnapshot(collection(db, "users"), (snapshot) => {
      dispatch(
        setUserList(JSON.stringify(snapshot.docs.map((doc) => doc.data())))
      );
      setTimeout(() => {
        dispatch(setLoading(false));
      }, 300);
    });
    return data;
  }, [currentUser]);

  /**
   * Add local storage in redux
   */
  React.useEffect(() => {
    // add cart items in redux
    let cart = localStorage.getItem("BeautyVerse:shoppingCart");
    if (cart?.length > 0) {
      dispatch(setCartList(JSON.parse(cart)));
    } else {
      dispatch(setCartList([]));
    }
  }, [currentUser]);

  /**
   * Define paths where navigator is hidden
   */
  let nav;
  if (
    window.location.pathname?.includes("/chat/") ||
    window.location.pathname?.includes("/product/") ||
    window.location.pathname == "/login" ||
    window.location.pathname == "/register" ||
    window.location.pathname == "/register/identify" ||
    window.location.pathname == "/register/business"
  ) {
    nav = undefined;
  } else {
    nav = <Navigator />;
  }

  return (
    <ThemeProvider theme={theme === false ? lightTheme : darkTheme}>
      <GlobalStyles />
      <TopLine />
      {loading ? (
        <Loading />
      ) : (
        <Container>
          <SimpleBackdrop />
          <Header />
          {isMobile &&
            (window.location.pathname === "/" ||
              window.location.pathname === "/cards") && <Filter />}
          {/* {openFeed && <OpenedFeed />} */}
          <Routes>
            <Route path="/" element={<Main />}>
              <Route
                index
                element={<Feeds height={height} filterOpen={filterOpen} />}
              />

              <Route path="cards" element={<Specialists />} direction="row" />
              <Route path="add" element={<AddFeed />} direction="row" />
            </Route>
            <Route path="/:User/feed/:Id/:ImgNumber" element={<OpenedFeed />} />
            <Route
              path="/user/:User/feed/:Id/:ImgNumber"
              element={<OpenedFeed />}
            />
            <Route
              path="/visit/user/:User/feed/:Id/:ImgNumber"
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
            <Route path="user/:Id" element={<UserProfile />}>
              <Route index element={<UserFeeds />} />
              <Route path="services" element={<Services />} />
              <Route path="team" element={<Team />} />
              <Route path="contact" element={<Contact />} />
              <Route path="audience" element={<Audience />} />
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
              path="/chat"
              element={
                <RequireAuth>
                  <Chat />
                </RequireAuth>
              }
            />
            <Route
              path="/chat/:id"
              element={
                <RequireAuth>
                  <ChatContent />
                </RequireAuth>
              }
            />
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
          <Footer />
          {nav}
        </Container>
      )}
    </ThemeProvider>
  );
}

export default App;

const Container = styled.div`
  background: ${(props) => props.theme.background};
`;

const TopLine = styled.div`
  position: fixed;
  top: 0 !important;
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
    height: 1vw;
    z-index: 10000;
    top: 0 !important;
    position: absolute;
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
