import styled from 'styled-components';
import { BsListCheck } from 'react-icons/bs';
import { useNavigate } from 'react-router-dom';
import {
  MdOutlinePhotoSizeSelectActual,
  MdContactPhone,
  MdShoppingCart,
} from 'react-icons/md';
import { FaUsers } from 'react-icons/fa';
import { FiSettings } from 'react-icons/fi';
import { useSelector, useDispatch } from 'react-redux';
import { IsMobile } from '../../functions/isMobile';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import { NavigatorLoader } from '../../components/loader';

export const Navigator = (props) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const contentChanger = useSelector((state) => state.storeUser.contentChanger);
  const isMobile = IsMobile();

  const list = [
    {
      id: 1,
      value: 'posts',
      title: props?.language?.language.User.userPage.feeds,
      onClick: () => navigate(`/api/v1/users/${props?.targetUser?._id}`),
      className:
        window.location.pathname === `/api/v1/users/${props?.targetUser?._id}`
          ? 'active'
          : 'btn',
      icon: <MdOutlinePhotoSizeSelectActual className="icon" />,
    },
    {
      id: 2,
      value: 'contact',
      title: props?.language?.language.User.userPage.contact,
      onClick: () => navigate(`contact`),
      className:
        window.location.pathname ===
        `/api/v1/users/${props?.targetUser?._id}/contact`
          ? 'active'
          : 'btn',
      id: 'contact',
      icon: <MdContactPhone className="icon" />,
    },
    // {
    //   id: 3,
    //   value: 'team',
    //   title: props?.language?.language.User.userPage.team,
    //   onClick: () => navigate(`team`),
    //   className:
    //     window.location.pathname ===
    //     `/api/v1/users/${props?.targetUser?._id}/team`
    //       ? 'active'
    //       : 'btn',
    //   id: 'team',
    //   icon: <AiOutlineTeam className="icon" />,
    // },
    {
      id: 4,
      value: props?.targetUser?.type == 'shop' ? 'products' : 'services',
      title:
        props?.targetUser?.type == 'shop'
          ? 'პროდუქტები'
          : props?.language?.language.User.userPage.service,
      onClick: () =>
        navigate(`/api/v1/users/${props?.targetUser?._id}/services`),
      className:
        window.location.pathname ===
        `/api/v1/users/${props?.targetUser?._id}/services`
          ? 'active'
          : 'btn',
      icon:
        props?.targetUser?.type == 'shop' ? (
          <MdShoppingCart className="icon" />
        ) : (
          <BsListCheck className="icon" />
        ),
    },
    {
      id: 5,
      value: 'audience',
      title: props?.language?.language.User.userPage.audience,
      onClick: () =>
        navigate(`/api/v1/users/${props?.targetUser?._id}/audience`),
      className:
        window.location.pathname ===
        `/api/v1/users/${props?.targetUser?._id}/audience`
          ? 'active'
          : 'btn',
      icon: <FaUsers className="icon" />,
    },
    {
      id: 6,
      value: 'statistics',
      title: props?.language?.language.User.userPage.statistics,
      onClick: () =>
        navigate(`/api/v1/users/${props?.targetUser?._id}/statistics`),
      className:
        window.location.pathname ===
        `/api/v1/users/${props?.targetUser?._id}/statistics`
          ? 'active'
          : 'btn',
      icon: <ShowChartIcon className="icon" />,
    },
    {
      id: 7,
      value: 'settings',
      title: props?.language?.language.User.userPage.settings,
      onClick: () =>
        navigate(`/api/v1/users/${props?.targetUser?._id}/settings`),
      className:
        window.location.pathname ===
        `/api/v1/users/${props?.targetUser?._id}/settings`
          ? 'active'
          : 'btn',
      icon: <FiSettings className="icon" />,
    },
  ];

  /* 
  // DEFINE content categories
  */

  // change index positions for shop page
  // products goes to null position, posts goes to two position

  function array_move(arr, fromIndex, toIndex) {
    let a = arr;
    var element = a[fromIndex];
    a.splice(fromIndex, 1);
    a.splice(toIndex, 0, element);
    return a;
  }

  // mapping content categories

  const DefineList = () => {
    let withoutSettings = list?.filter((item, index) => {
      if (
        props?.currentUser == null ||
        props?.currentUser?.uid !== props?.targetUser?._id
      ) {
        return item.value !== 'settings' && item.value !== 'statistics';
      } else {
        return item;
      }
    });
    let content;
    content = withoutSettings?.filter((item, index) => {
      if (props?.targetUser?.type == 'user') {
        return (
          item.value !== 'team' &&
          item.value !== 'services' &&
          item.value !== 'posts' &&
          item.value !== 'statistics'
        );
      } else if (props?.targetUser?.type == 'specialist') {
        return item.value !== 'team';
      } else {
        return item;
      }
    });

    // } else if (type == "shop") {
    //   content = list
    //     ?.filter((item) => item.value !== "team")
    //     .map((item, index) => {
    //       return (
    //         <Button
    //           key={index}
    //           className={item?.className}
    //           onClick={item?.onClick}
    //           id={item?.id}
    //         >
    //           {item?.icon}
    //           {item?.title}
    //         </Button>
    //       );
    //     });

    return content.map((item, index) => {
      return (
        <Button
          key={index}
          className={item?.className}
          onClick={item?.onClick}
          id={item?.id}
        >
          {item?.icon}
          {item?.title}
        </Button>
      );
    });
  };

  const DefinedContet = DefineList();

  return (
    <Container>
      {props?.loading ? <NavigatorLoader /> : DefinedContet}
    </Container>
  );
};

const Container = styled.div`
  width: 97%;
  padding-left: 3%;
  height: 3.5vw;
  border-bottom: 1px solid ${(props) => props.theme.lineColor};
  display: flex;
  align-items: center;
  gap: 1vw;

  @media only screen and (max-width: 600px) {
    gap: 3vw;
    overflow-x: scroll;
    width: 100vw;
    height: 10vw;
    padding: 0 4vw;
    box-sizing: border-box;

    /* width */
    ::-webkit-scrollbar {
      width: 0vw;
      height: 0vw;
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
  }

  #contact {
    display: none;
    @media only screen and (max-width: 600px) {
      display: flex;
    }
  }

  .active {
    border: 1px solid ${(props) => props.theme.secondLevel};
    border-radius: 0.2vw;
    height: 1.8vw;
    padding: 0 0.5vw;
    display: flex;
    align-items: center;
    justify-content: start;
    gap: 0.5vw;
    cursor: pointer;

    @media only screen and (max-width: 600px) {
      height: 6vw;
      gap: 1.5vw;
      padding: 0 1.5vw;
      border-radius: 1vw;
    }

    :hover {
      filter: brightness(0.98);
    }

    .icon {
      font-size: 16px;
    }
  }
`;

const Button = styled.div`
  border: 1px solid rgba(0, 0, 0, 0);
  border-radius: 0.2vw;
  height: 1.8vw;
  padding: 0 0.5vw;
  display: flex;
  align-items: center;
  justify-content: start;
  gap: 0.5vw;
  cursor: pointer;
  color: ${(props) => props.theme.font};
  font-size: 14px;

  @media only screen and (max-width: 600px) {
    height: 6vw;
    gap: 1.5vw;
    padding: 0 1.5vw;
    border-radius: 1vw;
  }

  :hover {
    filter: brightness(0.98);
  }

  .icon {
    font-size: 16px;
  }
`;
