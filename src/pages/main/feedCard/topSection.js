import React from 'react';
import styled from 'styled-components';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { BsThreeDots } from 'react-icons/bs';
import {
  CoverLoader,
  TitleLoader,
  TypeLoader,
  IconLoader,
} from '../../../components/loader';
import { setFeedScrollY } from '../../../redux/scroll';
import Avatar from '@mui/material/Avatar';
import { Language } from '../../../context/language';

export const TopSection = (props) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const lang = useSelector((state) => state.storeMain.language);

  // scroll to top href
  const scrollPosition = useSelector(
    (state) => state.storeScroll.scrollPosition
  );

  const AddScrollPositionToLocalStorage = () => {
    localStorage.setItem('BeautyVerse:feedsScrollPosition:', scrollPosition);
  };

  // const define type
  const [type, setType] = React.useState('');
  const language = Language();

  React.useEffect(() => {
    setType('');
    if (props?.userType.toLowerCase() === 'specialist') {
      setType(language?.language.Main.feedCard.specialist);
    } else if (props?.userType.toLowerCase() === 'beautycenter') {
      setType(language?.language.Main.feedCard.beautySalon);
    }
  }, [lang, props._id]);

  return (
    <TopSectionContainer>
      <Profile
        onClick={() => {
          dispatch(setFeedScrollY(window.scrollY));
          navigate(`/api/v1/users/${props?.id}`);
        }}
      >
        {props.loading ? (
          <div
            style={{
              width: '100%',
              height: '100%',
            }}
          >
            <CoverLoader />
          </div>
        ) : (
          <Avatar
            onClick={() => {
              navigate(`/api/v1/users/${props?.id}`);
              dispatch(setFeedScrollY(window.scrollY));
            }}
            alt={props?.name}
            src={props?.cover ? props?.cover : ''}
            sx={{
              width: 42,
              height: 42,
              cursor: 'pointer',
              '@media only screen and (max-width: 1200px)': {
                width: 40,
                height: 40,
              },
            }}
          />
        )}
      </Profile>
      <div className="link">
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div
            onClick={() => {
              navigate(`/api/v1/users/${props?.id}`);
              dispatch(setFeedScrollY(window.scrollY));
            }}
            style={{ color: 'inherit', textDecoration: 'none' }}
          >
            {props.loading ? <TitleLoader /> : <Name>{props.name}</Name>}
          </div>
        </div>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
          }}
        >
          <Category>
            {props.loading ? (
              <TypeLoader />
            ) : (
              <>{props?.username ? props?.username : type}</>
            )}
          </Category>
        </div>
      </div>
      <TopRightSection>
        {props.loading ? (
          <IconLoader />
        ) : (
          <BsThreeDots
            className="edit"
            onClick={() => props.setReports(!props.reports)}
          />
        )}
      </TopRightSection>
    </TopSectionContainer>
  );
};

const TopSectionContainer = styled.div`
  min-height: 3.5vw;
  height: auto;
  display: flex;
  align-items: center;
  padding: 0 1vw;
  background: ${(props) => props.theme.background};

  @media only screen and (max-width: 600px) {
    height: 16vw;
    padding: 0 4vw 0 4vw;
  }

  .link {
    margin-left: 1vw;
    flex: 5;
    dispaly: flex;
    flex-direction: column;
    align-items: center;

    @media only screen and (max-width: 600px) {
      margin-left: 3vw;
      gap: 10vw;
    }
  }
`;

const TopRightSection = styled.div`
  flex: 1;
  display: flex;
  justify-content: flex-end;

  .edit {
    font-size: 1.5vw;
    color: ${(props) => props.theme.icon};
    cursor: pointer;

    @media only screen and (max-width: 600px) {
      font-size: 5vw;
    }
  }
`;

const Profile = styled.div`
  width: 2.2vw;
  height: 2.2vw;
  border-radius: 50%;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;

  @media only screen and (max-width: 600px) {
    width: 10vw;
    height: 10vw;
  }
`;

const Img = styled.img`
  width: 2.2vw;
  height: 2.2vw;
  cursor: pointer;
  object-fit: cover;

  :hover {
    filter: brightness(0.97);
  }

  @media only screen and (max-width: 600px) {
    width: 9vw;
    height: 9vw;
  }
`;

const UserProfileEmpty = styled.div`
  width: 2.2vw;
  height: 2.2vw;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;

  @media only screen and (max-width: 600px) {
    width: 9vw;
    height: 9vw;
  }

  .user {
    font-size: 1.2vw;

    @media only screen and (max-width: 600px) {
      font-size: 5vw;
    }
  }
`;

const Name = styled.h2`
  font-size: 14px;
  font-weight: bold;
  letter-spacing: 0.01vw;
  cursor: pointer;
  color: ${(props) => props.theme.font};
  display: flex;
  align-items: center;
  gap: 0.25vw;
  margin: 0;

  @media only screen and (max-width: 600px) {
    letter-spacing: 0.1vw;
    margin-bottom: 0.5vw;
  }

  :hover {
    text-decoration: underline;
  }
`;

const Category = styled.span`
  flex: 6;
  font-size: 12px;
  color: ${(props) => props.theme.logo2};
  letter-spacing: 0.003w;
  margin-top: 3px;

  @media only screen and (max-width: 600px) {
    color: #aaa;
    letter-spacing: 0.1vw;
    margin-top: 1px;
  }
`;
