import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useSelector, useDispatch } from 'react-redux';
import { setLoadFeed } from '../../redux/main';
import { setCardsScrollY } from '../../redux/scroll';
import { FaUser } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { BiStar } from 'react-icons/bi';
import { ProceduresOptions } from '../../data/registerDatas';
import { FaUserEdit } from 'react-icons/fa';
import { MdAddBusiness } from 'react-icons/md';
import { BsBrush } from 'react-icons/bs';
import Tooltip from '@mui/material/Tooltip';
import { Language } from '../../context/language';
import {
  TitleLoader,
  IconLoader,
  CardImageLoader,
} from '../../components/loader';

export const SpecialistsCard = (props) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const language = Language();
  const proceduresOptions = ProceduresOptions();
  const loadFeed = useSelector((state) => state.storeMain.loadFeed);
  const rerender = useSelector((state) => state.storeMain.rerender);

  // import filters
  const cityFilter = useSelector((state) => state.storeFilter.cityFilter);
  const districtFilter = useSelector(
    (state) => state.storeFilter.districtFilter
  );

  /**
   * Define start total
   */
  const [stars, setStars] = useState([]);

  async function GetStars() {
    const response = await fetch(
      `https://beautyverse.herokuapp.com/api/v1/users/${props?._id}/stars`
    )
      .then((response) => response.json())
      .then(async (data) => {
        setStars(data.data.stars);
      })
      .catch((error) => {
        console.log('Error fetching data:', error);
      });
  }

  useEffect(() => {
    GetStars();
  }, []);

  // capitalize first letters

  function capitalizeFirstLetter(string) {
    return string?.charAt(0).toUpperCase() + string?.slice(1);
  }

  const name = capitalizeFirstLetter(props?.name);
  let type;
  if (props?.type === 'beautycenter') {
    type = language?.language.Main.feedCard.beautySalon;
  } else if (props?.type === 'specialist') {
    type = language?.language.Main.feedCard.specialist;
  }
  const username = capitalizeFirstLetter(props?.username);

  let procedures;

  /**
   * define user type icon
   */
  let icon;
  if (props?.type === 'user') {
    icon = <FaUserEdit />;
  } else if (props?.type === 'specialist') {
    icon = <BsBrush />;
  } else if (props?.type === 'beautycenter') {
    icon = <MdAddBusiness />;
  }

  // define full address
  const fullAddress = (
    <div>
      {props?.address[0]?.region?.length > 0 && props?.address[0]?.region}
      {props?.address[0]?.city?.length > 0 && ', ' + props?.address[0]?.city}
      {props?.address[0]?.district?.length > 0 &&
        ', ' + props?.address[0]?.district}
      {props?.address[0]?.street?.length > 0 &&
        ', ' + props?.address[0]?.street + ' '}
      {props?.address[0]?.number}
    </div>
  );

  // define all procedures
  const allProcedures = props?.filterCategories
    ?.map((u) => {
      let lab = proceduresOptions?.find((item) => {
        if (item.value === u) {
          return item.label;
        }
      });
      return lab.label;
    })
    .join(', ');

  setTimeout(() => {
    if (props.index === 0) {
      dispatch(setLoadFeed(false));
    }
  }, 200);

  return (
    <Card ref={props.lastFeedRef}>
      <Title
        onClick={() => {
          navigate(`/api/v1/users/${props._id}`);
        }}
      >
        {props.loading ? (
          <TitleLoader />
        ) : (
          <>
            {icon}
            {name.substring(0, name.indexOf(' '))?.length > 0
              ? name.substring(0, name.indexOf(' '))
              : name}
          </>
        )}
      </Title>
      <ImgContainer
        onClick={() => {
          navigate(`/api/v1/users/${props._id}`);
        }}
      >
        {props.loading ? (
          <CardImageLoader />
        ) : (
          <>
            {props.cover ? (
              <Img src={props?.cover} />
            ) : (
              <IconCont>
                <FaUser className="undefinedUserIcon" />
              </IconCont>
            )}
          </>
        )}
      </ImgContainer>
      <Tooltip title={fullAddress}>
        {props.loading ? (
          <TitleLoader />
        ) : (
          <City>
            <div>
              {props?.address[0]?.city === "T'bilisi"
                ? 'Tbilisi'
                : props?.address[0]?.city}
            </div>
          </City>
        )}
      </Tooltip>
      <Tooltip title={fullAddress}>
        {props.loading ? (
          <TitleLoader />
        ) : (
          <City>
            <div>
              {props?.address[0]?.district?.length > 0 &&
                props?.address[0]?.district + ' '}
              {props?.address[0]?.street?.length > 0 &&
                props?.address[0]?.street + ' '}
              {props?.address[0]?.number}
            </div>
          </City>
        )}
      </Tooltip>
      <Tooltip title={allProcedures}>
        {props.loading ? (
          <TitleLoader />
        ) : (
          <Category>{props?.username ? username : type}</Category>
        )}
      </Tooltip>
      <Review>
        {props.loading ? (
          <IconLoader />
        ) : (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              marginBottom: '3px',
              fontSize: '14px',
            }}
          >
            <BiStar className="likedIcon" />
            <span>{stars}</span>
          </div>
        )}
      </Review>
    </Card>
  );
};

const Card = styled.div`
  background: ${(props) => props.theme.background};
  box-shadow: 0 0.1vw 0.3vw ${(props) => props.theme.lineColor};
  width: 10vw;
  border-radius: 0.5vw;
  display: flex;
  flex-direction: column;
  justify-content: start;
  align-items: center;
  padding: 0.25vw 0 0.5vw 0;
  position: relative;
  gap: 5px;

  @media only screen and (max-width: 600px) {
    box-shadow: 0 0.2vw 0.6vw ${(props) => props.theme.lineColor};
    // border: 1px solid ${(props) => props.theme.lineColor};
    width: 39.5vw;
    gap: 1.5vw;
    border-radius: 1.5vw;
    // box-shadow: none;
    padding: 2vw;
    height: auto;
  }

  .undefinedUserIcon {
    font-size: 4vw;
    color: #ccc;

    @media only screen and (max-width: 600px) {
      font-size: 20vw;
    }
  }
`;

const Title = styled.h2`
  font-size: 16px;
  margin: 0;
  font-weight: bold;
  padding: 0.5vw 0 0.3vw 0;
  transition: ease-in 200ms;
  cursor: pointer;
  overflow: hidden;
  display: flex;
  align-items: center;
  gap: 5px;
  color: ${(props) => props.theme.font};

  @media only screen and (max-width: 600px) {
    font-size: 16px;
    padding: 1.25vw;
  }

  &:hover {
    text-decoration: underline;
  }
`;

const City = styled.div`
  width: 85%;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 1.1vw;
  margin-top: 0.25vw;
  overflow: hidden;

  @media only screen and (max-width: 600px) {
    min-height: 5.2vw;
    padding: 0 1vw;
  }

  & div {
    box-sizing: border-box;
    background: ${(props) => props.theme.secondLevel};
    padding: 0 0 0.1vw 0.3vw;
    border-radius: 50vw;
    color: ${(props) => props.theme.font};
    font-size: 12px;
    z-index: 9;
    width: 100%;
    white-space: nowrap;
    text-align: center;
    overflow: hidden;

    @media only screen and (max-width: 600px) {
      font-size: 12px;
      padding: 0.5vw 1.5vw;
      border-radius: 1vw;
    }
  }
`;

const ImgContainer = styled.div`
  border-radius: 15px;
  overflow: hidden;
  border: 1px solid ${(props) => props.theme.lineColor};
  margin: 0.5vw 0;
  height: 6vw;
  width: 6vw;
  cursor: pointer;

  :hover {
    filter: brightness(0.9);
  }

  @media only screen and (max-width: 600px) {
    height: 35vw;
    width: 35vw;
    display: flex;
    justify-content: center;
    align-items: center;
  }
`;

const Img = styled.img`
  height: 6vw;
  width: 6vw;
  object-fit: cover;
  transition: ease-in 200ms;

  @media only screen and (max-width: 600px) {
    width: 35vw;
    height: 35vw;
  }
`;
const IconCont = styled.div`
  height: 6vw;
  width: 6vw;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;

  @media only screen and (max-width: 600px) {
    width: 12vw;
    height: 12vw;
  }

  :hover {
    filter: brightness(0.9);
  }
`;

const Category = styled.div`
  margin-top: 0.5vw;
  width: 85%;
  height: 1vw;
  overflow: hidden;
  display: flex;
  align-items: center;
  white-space: nowrap;
  justify-content: center;
  padding: 0 0 0.5vw 0.3vw;
  font-size: 12px;
  font-weight: bold;
  border-bottom: 1px solid #ccc;
  color: ${(props) => props.theme.font};

  @media only screen and (max-width: 600px) {
    width: 35vw;
    height: 6vw;
    padding: 0 0 0vw 1vw;
    font-size: 12px;
  }
`;

const Review = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.25vw;
  padding: 0.5vw 0 0.2vw 0;
  color: ${(props) => props.theme.font};

  @media only screen and (max-width: 600px) {
    gap: 5px;
    padding: 1.5vw 0 0vw 0;
  }

  .likedIcon {
    color: #bb3394;
    font-size: 1.2vw;
    margin-right: 0.25vw;
    cursor: pointer;

    @media only screen and (max-width: 600px) {
      font-size: 4vw;
      margin-right: 1vw;
    }
  }
`;
