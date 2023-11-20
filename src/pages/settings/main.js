import React, { useEffect, useState } from 'react';
import { Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { Header } from './header';
import { MenuItems } from './menuItems';
import Headroom from 'react-headroom';
import { PersonalInfo } from './personalInfo';
import { Addresses } from './addresses';
import { Products } from './products';
import { WorkingInfo } from './workingInfo';
import { SavedItems } from './savedItems';
import { Support } from './support';
import { Security } from './security';
import { Languages } from './languages';
import { TermsRules } from './t&r';
import { QA } from './q&a';
import { PrivacyPolice } from './pp';
import { HW } from './hw';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { setCurrentUser } from '../../redux/user';
import { Procedures } from './procedures';
import { Language } from '../../context/language';

const Settings = () => {
  // navigation
  const navigate = useNavigate();

  // dispatch
  const dispatch = useDispatch();

  // language
  const language = Language();

  // Initialize the currentUser state with the user data from localStorage
  const currentUser = useSelector((state) => state.storeUser.currentUser);

  // open page
  const [activePage, setActivePage] = useState({
    active: false,
    page: null,
    data: null,
  });

  const backendUrl = useSelector((state) => state.storeApp.backendUrl);
  /**
   * change user active in feeds and cards or not
   */
  const ControlActivity = async () => {
    try {
      // Update the activity status in the current user object
      const updatedUser = {
        ...currentUser,
        active: !currentUser?.active,
      };

      // Update the currentUser state with the updated user data
      dispatch(setCurrentUser(updatedUser));

      // Update the user data in localStorage
      localStorage.setItem(
        'Beautyverse:currentUser',
        JSON.stringify(updatedUser)
      );

      await axios.patch(`${backendUrl}/api/v1/users/${currentUser?._id}`, {
        active: !currentUser?.active,
      });
    } catch (error) {
      console.error(error);
    }
  };

  /**
   *
   * Logout function
   */

  const Logout = async () => {
    try {
      localStorage.removeItem('Beautyverse:currentUser');
      dispatch(setCurrentUser(null));
      navigate('/login');
    } catch (error) {
      console.log(error.response.data.message);
    }
  };

  // animation
  const [animation, setAnimation] = useState(false);
  useEffect(() => {
    setAnimation(true);
  }, []);

  return (
    <>
      <Headroom>
        <Header
          back={`/profile/${
            currentUser?.type === 'shop'
              ? 'showroom'
              : currentUser?.type === 'user'
              ? 'contact'
              : 'feeds'
          }`}
        />
      </Headroom>
      <Container transition={animation ? 'true' : 'false'}>
        <MenuItems
          activePage={activePage}
          setActivePage={setActivePage}
          currentUser={currentUser}
          ControlActivity={ControlActivity}
        />
        <Button
          variant="contained"
          className="button"
          style={{ backgroundColor: '#f866b1', color: 'white' }}
          sx={{ width: '40%', borderRadius: '50px', margin: '30px 0 0 0' }}
          onClick={Logout}
          //   {...props}
        >
          {language?.language?.User?.userPage?.logout}
        </Button>
      </Container>
      {activePage.active && activePage.page === 'personalInfo' && (
        <PersonalInfo
          activePage={activePage}
          setActivePage={setActivePage}
          currentUser={currentUser}
        />
      )}
      {activePage.active && activePage.page === 'addresses' && (
        <Addresses
          activePage={activePage}
          setActivePage={setActivePage}
          currentUser={currentUser}
        />
      )}
      {activePage.active && activePage.page === 'procedures' && (
        <Procedures
          activePage={activePage}
          setActivePage={setActivePage}
          currentUser={currentUser}
        />
      )}
      {activePage.active && activePage.page === 'products' && (
        <Products
          activePage={activePage}
          setActivePage={setActivePage}
          currentUser={currentUser}
        />
      )}
      {activePage.active && activePage.page === 'workingInfo' && (
        <WorkingInfo
          activePage={activePage}
          setActivePage={setActivePage}
          currentUser={currentUser}
        />
      )}
      {activePage.active && activePage.page === 'savedItems' && (
        <SavedItems
          activePage={activePage}
          setActivePage={setActivePage}
          currentUser={currentUser}
        />
      )}
      {activePage.active && activePage.page === 'support' && (
        <Support
          activePage={activePage}
          setActivePage={setActivePage}
          currentUser={currentUser}
        />
      )}
      {activePage.active && activePage.page === 'security' && (
        <Security
          activePage={activePage}
          setActivePage={setActivePage}
          currentUser={currentUser}
        />
      )}
      {activePage.active && activePage.page === 'languages' && (
        <Languages
          activePage={activePage}
          setActivePage={setActivePage}
          currentUser={currentUser}
        />
      )}
      {activePage.active && activePage.page === 'terms&rules' && (
        <TermsRules
          activePage={activePage}
          setActivePage={setActivePage}
          currentUser={currentUser}
        />
      )}
      {activePage.active && activePage.page === 'q&a' && (
        <QA
          activePage={activePage}
          setActivePage={setActivePage}
          currentUser={currentUser}
        />
      )}
      {activePage.active && activePage.page === 'pp' && (
        <PrivacyPolice
          activePage={activePage}
          setActivePage={setActivePage}
          currentUser={currentUser}
        />
      )}
      {activePage.active && activePage.page === 'hw' && (
        <HW
          activePage={activePage}
          setActivePage={setActivePage}
          currentUser={currentUser}
        />
      )}
    </>
  );
};

export default Settings;

const Container = styled.div`
  width: 100vw;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  right: ${(props) => (props.transition === 'true' ? 0 : '-100vw')};
  opacity: ${(props) => (props.transition === 'true' ? '1' : '0')};
  transition: ease-in 200ms;
  padding: 0 0 100px 0;

  .button {
    &:hover {
      filter: brightness(1.1);
    }
  }
`;
