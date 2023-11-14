import React, { lazy, Suspense } from 'react';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { BounceLoader } from 'react-spinners';
import OpenedFeed from '../pages/feeds/components/openedFeed';
import OpenedProduct from '../pages/marketplace/components/openedProduct';
import OpenedProductFromList from '../pages/marketplace/pages/listPage/openedProduct';
import OpenedProductFromSearch from '../pages/marketplace/pages/search/openedProduct';
import Audience from '../pages/user/components/audience';
import Contact from '../pages/user/components/contact';
import UserFeeds from '../pages/user/components/feeds';
import OpenedUserFeed from '../pages/user/components/openedUserFeed';
import OpenedUserProduct from '../pages/user/components/openedUserProduct';
import Procedures from '../pages/user/components/procedures';
import Showroom from '../pages/user/components/showroom';
import WorkingInfo from '../pages/user/components/workingInfo';
import OpenedUserFeedNotifications from '../pages/user/notifications/openedUserFeed';
import OpenedUserProductNotifications from '../pages/user/notifications/openedUserProduct';
import Feeds from '../pages/feeds/list';
import User from '../pages/user/user';
import { Redirect } from '../pages/redirect';
import OpenedUserFeedSaved from '../pages/settings/openedUserFeed';
import OpenedUserProductSaved from '../pages/settings/openedUserProduct';
import { Dashboard } from '../admin/dashboard/dashboard';
import styled from 'styled-components';
import { useDeviceType } from '../functions/device';
import { Admin } from '../admin/admin';

const FeedsBundle = lazy(() => import('../bundles/feedsBundle'));

const Welcome = lazy(() => import('../pages/welcome/welcome'));

const Cards = lazy(() => import('../pages/cards/list'));
const Main = lazy(() => import('../pages/marketplace/pages/market/main'));

const SearchList = lazy(() => import('../pages/marketplace/pages/search/list'));
const List = lazy(() => import('../pages/marketplace/pages/listPage/list'));

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

  // device type
  const device = useDeviceType();

  return (
    <>
      <Suspense fallback={<LoadingFallback />}>
        {device === 'Mobile' && (
          <Routes>
            {/**
             * Welcome  routes
             */}
            <Route path="/" element={<Welcome />} />
            {/**
             * Feeds routes
             */}
            <Route path="/feeds" element={<Feeds />}>
              <Route path=":feedId" element={<OpenedFeed />} />
            </Route>
            {/**
             * Cards routes
             */}
            <Route path="/cards" element={<Cards />} />
            {/**
             * Marketplace routes
             */}
            <Route path="/marketplace" element={<Main />}>
              <Route path=":productId" element={<OpenedProduct />} />
            </Route>
            <Route path="/marketplace/search" element={<SearchList />}>
              <Route path=":productId" element={<OpenedProductFromSearch />} />
            </Route>
            <Route path="/marketplace/list" element={<List />}>
              <Route path=":productId" element={<OpenedProductFromList />} />
            </Route>
            {/**
             * User visit routes
             */}
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
            {/**
             * authentication routes
             */}
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
            {/**
             * Profile routes
             */}
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
            >
              <Route path="feed/:feedId" element={<OpenedUserFeedSaved />} />
              <Route
                path="product/:productId"
                element={<OpenedUserProductSaved />}
              />
            </Route>
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
        )}
        {device === 'Desktop' && (
          <Routes>
            {/**
             * Welcome  routes
             */}
            <Route path="/" element={<Welcome />} />
            <Route path="/admin" element={<Admin />} />
          </Routes>
        )}
      </Suspense>
      {!location.pathname.includes('admin') && device === 'Desktop' && (
        <DesktopText>
          <h1 style={{ color: '#ccc' }}>
            The App <span style={{ color: '#f866b1' }}>"Beauty</span>Verse" is
            available only for Mobile Devices!
          </h1>
        </DesktopText>
      )}
    </>
  );
};

const DesktopText = styled.div`
  position: absolute;
  width: 100vw;
  height: 90vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;
