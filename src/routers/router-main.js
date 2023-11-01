import React, { lazy, Suspense } from 'react';
import { useSelector } from 'react-redux';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { BounceLoader } from 'react-spinners';
import OpenedFeed from '../pages/feeds/components/openedFeed';
import OpenedProduct from '../pages/marketplace/components/openedProduct';
import OpenedProductFromList from '../pages/marketplace/pages/listPage/openedProduct';
import Showroom from '../pages/user/components/showroom';
import OpenedUserProduct from '../pages/user/components/openedUserProduct';
import OpenedUserFeed from '../pages/user/components/openedUserFeed';
import UserFeeds from '../pages/user/components/feeds';
import Contact from '../pages/user/components/contact';
import Procedures from '../pages/user/components/procedures';
import WorkingInfo from '../pages/user/components/workingInfo';
import Audience from '../pages/user/components/audience';
import OpenedUserFeedNotifications from '../pages/user/notifications/openedUserFeed';
import OpenedUserProductNotifications from '../pages/user/notifications/openedUserProduct';
import OpenedProductFromSearch from '../pages/marketplace/pages/search/openedProduct';

const Welcome = lazy(() => import('../pages/welcome/welcome'));
const Feeds = lazy(() => import('../pages/feeds/list'));
const Cards = lazy(() => import('../pages/cards/list'));
const Main = lazy(() => import('../pages/marketplace/pages/market/main'));

const SearchList = lazy(() => import('../pages/marketplace/pages/search/list'));
const List = lazy(() => import('../pages/marketplace/pages/listPage/list'));
const User = lazy(() => import('../pages/user/user'));
const UserProfile = lazy(() => import('../pages/user/userProfile'));
const AddFeed = lazy(() => import('../pages/feeds/addFeed/addFeed'));
const Settings = lazy(() => import('../pages/settings/main'));

const Notifications = lazy(() =>
  import('../pages/user/notifications/notifications')
);

const Login = lazy(() => import('../pages/authentication/login'));
const ChangePassword = lazy(() =>
  import('../pages/authentication/changePassword')
);
const Identify = lazy(() => import('../pages/authentication/identify'));
const Type = lazy(() => import('../pages/authentication/type'));
const PersonalInfo = lazy(() => import('../pages/authentication/personalInfo'));
const Services = lazy(() => import('../pages/authentication/servicesInfo'));
const Accept = lazy(() => import('../pages/authentication/accept'));

export const Routers = () => {
  const location = useLocation();

  const currentUserLocal = localStorage.getItem('Beautyverse:currentUser')
    ? JSON.parse(localStorage.getItem('Beautyverse:currentUser'))
    : null;

  function RequireLogout({ children }) {
    if (currentUserLocal) {
      return <Navigate to="/feeds" state={{ from: location }} />;
    }
    return children;
  }

  const LoadingFallback = () => (
    <div
      style={{
        width: '100vw',
        height: '80vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <BounceLoader size={50} color="#f866b1" />;
    </div>
  );

  return (
    <Suspense fallback={<LoadingFallback />}>
      <Routes>
        <Route path="/" element={<Welcome />} />

        <Route path="/feeds" element={<Feeds />}>
          <Route path=":feedId" element={<OpenedFeed />} />
        </Route>

        <Route path="/cards" element={<Cards />} />

        <Route path="/marketplace" element={<Main />}>
          <Route path=":productId" element={<OpenedProduct />} />
        </Route>

        <Route path="/marketplace/search" element={<SearchList />}>
          <Route path=":productId" element={<OpenedProductFromSearch />} />
        </Route>

        <Route path="/marketplace/list" element={<List />}>
          <Route path=":productId" element={<OpenedProductFromList />} />
        </Route>

        <Route path="/user/:userId" element={<User />}>
          <Route path="showroom" element={<Showroom />}>
            <Route path=":productId" element={<OpenedUserProduct />} />
          </Route>
          <Route path="feeds" element={<UserFeeds />}>
            <Route path=":feedId" element={<OpenedUserFeed />} />
          </Route>
          <Route path="contact" element={<Contact />} />
          <Route path="procedures" element={<Procedures />} />
          <Route path="workinginfo" element={<WorkingInfo />} />
          <Route path="audience" element={<Audience />} />
        </Route>

        <Route
          path="/login"
          element={
            <RequireLogout>
              <Login />
            </RequireLogout>
          }
        />
        <Route
          path="/resetPassword/:id"
          element={
            <RequireLogout>
              <ChangePassword />
            </RequireLogout>
          }
        />
        <Route
          path="/register/identify"
          element={
            <RequireLogout>
              <Identify />
            </RequireLogout>
          }
        />
        <Route
          path="/register/type"
          element={
            <RequireLogout>
              <Type />
            </RequireLogout>
          }
        />
        <Route
          path="/register/personalinfo"
          element={
            <RequireLogout>
              <PersonalInfo />
            </RequireLogout>
          }
        />
        <Route
          path="/register/services"
          element={
            <RequireLogout>
              <Services />
            </RequireLogout>
          }
        />
        <Route
          path="/register/accept"
          element={
            <RequireLogout>
              <Accept />
            </RequireLogout>
          }
        />

        <Route
          path="/profile"
          element={currentUserLocal ? <UserProfile /> : <Login />}
        >
          <Route path="showroom" element={<Showroom />}>
            <Route path=":productId" element={<OpenedUserProduct />} />
          </Route>
          <Route path="feeds" element={<UserFeeds />}>
            <Route path=":feedId" element={<OpenedUserFeed />} />
          </Route>
          <Route path="contact" element={<Contact />} />
          <Route path="procedures" element={<Procedures />} />
          <Route path="workinginfo" element={<WorkingInfo />} />
          <Route path="audience" element={<Audience />} />
        </Route>
        <Route
          path="/profile/addfeed"
          element={currentUserLocal ? <AddFeed /> : <Login />}
        />
        <Route
          path="/profile/settings"
          element={currentUserLocal ? <Settings /> : <Login />}
        />
        <Route
          path="/profile/notifications"
          element={currentUserLocal ? <Notifications /> : <Login />}
        >
          <Route
            path="feed/:feedId"
            element={<OpenedUserFeedNotifications />}
          />
          <Route
            path="product/:productId"
            element={<OpenedUserProductNotifications />}
          />
        </Route>
      </Routes>
    </Suspense>
  );
};
