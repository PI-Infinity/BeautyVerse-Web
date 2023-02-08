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
import { PhoneRegister } from "./pages/register/phoneRegister";
import Chat from "./pages/chat/main";
import UserProfile from "./pages/user/userProfilePage";
import UserVisitPage from "./pages/user/userVisitPage";
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

function App() {
  /**
   * define some needed functions
   */
  const { height, width } = useWindowDimensions();
  const isMobile = IsMobile();
  const location = useLocation();

  // color mode
  const [theme, setTheme] = useState(() => true);

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
    return !currentUser ? children : <Navigate to="/" />;
  };

  const dispatch = useDispatch();

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
    console.log(currentUser);
  }, [currentUser]);

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
  const GettingUsers = async () => {
    const data = await getDocs(collection(db, "users"));
    const usersList = [];
    data.forEach(async (doc) => {
      usersList.push(doc.data());
      setTimeout(() => {
        dispatch(setLoading(false));
      }, 0);
    });
    dispatch(setUserList(JSON.stringify(usersList)));
  };

  React.useEffect(() => {
    GettingUsers();
  }, [rerender, currentUser]);

  /**
   * Add local storage in redux
   */
  React.useEffect(() => {
    // add cart items in redux
    let cart = localStorage.getItem("BeautyVerse:shoppingCart");
    console.log(cart);
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
    window.location.pathname == "/register"
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
        <>
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
            <Route
              path="/add"
              element={
                <RequireAuth>
                  <AddFeed />
                </RequireAuth>
              }
            />
            <Route
              path="/user"
              element={
                <RequireAuth>
                  <UserProfile />
                </RequireAuth>
              }
            />
            <Route path="/user/:Id" element={<UserVisitPage />} />
            <Route path="/marketplace" element={<Marketplace />}>
              <Route index element={<MarketplaceMain />} />
              <Route path="cart" element={<Cart />} />
              <Route path="market" element={<Market />}>
                <Route path=":Cetegory" element={<Market />}></Route>
              </Route>
            </Route>
            <Route
              path="/marketplace/:ShopId/product/:Id"
              element={<Product />}
            />
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
        </>
      )}
    </ThemeProvider>
  );
}

export default App;

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
