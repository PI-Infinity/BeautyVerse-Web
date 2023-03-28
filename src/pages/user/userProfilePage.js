import { useEffect, useState } from 'react';
import styled from 'styled-components';
import CoverSection from '../../pages/user/coverSection';
import { Links } from '../../pages/user/links';
import { Navigator } from '../../pages/user/navigator';
import { useSelector, useDispatch } from 'react-redux';
import { IsMobile } from '../../functions/isMobile';
import { Outlet, useNavigate } from 'react-router-dom';
import { Language } from '../../context/language';
// import VisitorId from '../../functions/deviceUniqueId';
import { setTargetUser } from '../../redux/user';
import { setCoverUrl } from '../../redux/main';

const UserProfile = () => {
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const language = Language();
  const navigate = useNavigate();

  const path = window.location.pathname;
  const splited = path.split('/');
  const userId = splited[4];

  const targetUser = useSelector((state) => state.storeUser.targetUser);

  const currentUser = JSON.parse(
    localStorage.getItem('Beautyverse:currentUser')
  );

  useEffect(() => {
    if (targetUser?.active === false && currentUser?._id !== targetUser?._id) {
      navigate('notfound');
    }
    dispatch(setTargetUser([]));
    window.scrollTo(0, 0);
  }, []);

  document.body.style.overflowY = 'hidden';
  /**
   *   // define user list
   */
  const rerenderCurrentUser = useSelector(
    (state) => state.storeRerenders.rerenderCurrentUser
  );

  useEffect(() => {
    async function GetUser(id) {
      const response = await fetch(
        `https://beautyverse.herokuapp.com/api/v1/users/${id}`
      )
        .then((response) => response.json())
        .then((data) => {
          if (
            data.data.user.active ||
            data.data.user._id === currentUser?._id
          ) {
            console.log(data.data.user);
            dispatch(setTargetUser(data.data.user));
            dispatch(setCoverUrl(''));
          }
        })
        .catch((error) => {
          console.log('Error fetching data:', error);
        });
    }
    GetUser(userId);
  }, [userId, rerenderCurrentUser]);

  // define mobile or desktop
  const isMobile = IsMobile();

  return (
    <Container>
      {/* {targetUser && targetUser?._id !== currentUser?._id && (
        <VisitorId path="visitors-profile" targetUserId={targetUser._id} />
      )} */}
      <CoverSection
        language={language}
        loading={loading}
        setLoading={setLoading}
        targetUser={targetUser}
      />
      <ContentSide>
        <div className="links">
          <Links
            targetUser={targetUser}
            language={language}
            loading={loading}
          />
        </div>
        <ContentRightSide>
          <Navigator
            loading={loading}
            type={targetUser?.type}
            targetUser={targetUser}
            currentUser={currentUser}
            language={language}
          />
          {/* {loading ? (
            <LoadingContainer>
              <Spinner />
            </LoadingContainer>
          ) : ( */}
          <Outlet context={[targetUser, language, loading]} />
          {/* )} */}
        </ContentRightSide>
      </ContentSide>
    </Container>
  );
};

export default UserProfile;

const LoadingContainer = styled.div`
  height: 60vh;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Container = styled.div`
  width: 100%;
  min-height: 90vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 2.9vw;
  z-index: 5;
  overflow-x: hidden;
  overflow-y: scroll;
  background: ${(props) => props.theme.background};

  @media only screen and (max-width: 600px) {
    padding-top: 14vw;
    box-sizing: border-box;
  }

  /* width */
  ::-webkit-scrollbar {
    width: 0vw;
  }

  /* Track */
  ::-webkit-scrollbar-track {
    background-color: white;
  }

  /* Handle */
  ::-webkit-scrollbar-thumb {
    background-color: #222;
  }

  /* Handle on hover */
  ::-webkit-scrollbar-thumb:hover {
    background-color: #1e1e1e;
  }
`;

const ContentSide = styled.div`
  width: 70%;
  height: auto;
  height: 100%;
  display: flex;

  @media only screen and (max-width: 600px) {
    width: 100vw;
    box-sizing: border-box;
  }

  .links {
    @media only screen and (max-width: 600px) {
      display: none;
    }
  }
`;

const ContentRightSide = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  border-left: 1px solid ${(props) => props.theme.lineColor};

  @media only screen and (max-width: 600px) {
    box-sizing: border-box;
  }
`;
