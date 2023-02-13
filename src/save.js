import React, { useState, useEffect, useContext, useMemo, memo } from "react";
import styled, { ThemeProvider } from "styled-components";
import {
  Routes,
  Route,
  useLocation,
  Navigate,
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
} from "react-router-dom";
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
import { Followers } from "./pages/user/followers";
import { Followings } from "./pages/user/followings";
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
import { RootLayout } from "./layouts/RootLayout";

function App() {
  /**
   * define some needed functions
   */
  const { height, width } = useWindowDimensions();
  const isMobile = IsMobile();
  // const location = useLocation();

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
    return !currentUser ? children : <Navigate to="/user" />;
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

  const MainRouter = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" element={<RootLayout />}>
        <Route index element={<Main />}>
          <Route index />
          <Route path="cards" />
        </Route>
        <Route
          path="login"
          element={
            <RequireLogout>
              <Login />
            </RequireLogout>
          }
        />
        <Route
          path="user/:Id"
          element={
            <RequireAuth>
              <UserProfile />
            </RequireAuth>
          }
        >
          <Route path="user/:Id/feeds" element={<UserFeeds />}>
            <Route path=":Id/:ImgNumber" element={<OpenedFeed />} />
            {/* <Route
              path="user/:Id/:ImgNumber"
              element={<OpenedFeed />}
            /> */}
          </Route>
          <Route path="services" element={<Services />} />
          <Route path="team" element={<Team />} />
          <Route path="contact" element={<Contact />} />
          <Route path="followers" element={<Followers />} />
          <Route path="followings" element={<Followings />} />
        </Route>
        <Route
          path="chat"
          element={
            <RequireAuth>
              <Chat />
            </RequireAuth>
          }
        >
          <Route
            path=":id"
            element={
              <RequireAuth>
                <ChatContent />
              </RequireAuth>
            }
          />
        </Route>
        <Route
          path="register"
          element={
            <RequireLogout>
              <Register />
            </RequireLogout>
          }
        >
          <Route
            path="identify"
            element={
              <RequireLogout>
                <Identify />
              </RequireLogout>
            }
          />
          <Route
            path="business"
            element={
              <RequireLogout>
                <BusinessRegister />
              </RequireLogout>
            }
          />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Route>
    )
  );

  return (
    <ThemeProvider theme={theme === false ? lightTheme : darkTheme}>
      <GlobalStyles />
      {loading ? <Loading /> : <RouterProvider router={MainRouter} />}
    </ThemeProvider>
  );
}

export default App;
