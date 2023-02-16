import React from "react";
import styled from "styled-components";
import Loader from "react-js-loader";
import {
  collection,
  doc,
  setDoc,
  deleteDoc,
  onSnapshot,
} from "firebase/firestore";
import {
  ref,
  uploadBytes,
  listAll,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import { db, storage } from "../../firebase";
import { AuthContext } from "../../context/AuthContext";
import { FaUser } from "react-icons/fa";
import { Link } from "react-router-dom";
import { HiOutlineUserRemove } from "react-icons/hi";
import { useSelector, useDispatch } from "react-redux";
import { setContentChanger } from "../../redux/user";
import { IsMobile } from "../../functions/isMobile";
import { useOutletContext, useNavigate } from "react-router-dom";
import Avatar from "@mui/material/Avatar";
import AvatarGroup from "@mui/material/AvatarGroup";
import UserListDialogMain from "../../pages/user/userListPopup";

export const Audience = () => {
  const [user] = useOutletContext();
  const isMobile = IsMobile();
  const navigate = useNavigate();
  const { currentUser } = React.useContext(AuthContext);

  const [loading, setLoading] = React.useState(true);

  const [followers, setFollowers] = React.useState([]);
  const [followings, setFollowings] = React.useState([]);

  React.useEffect(() => {
    const data = onSnapshot(
      collection(db, "users", `${user?.id}`, "followers"),
      (snapshot) => {
        setFollowers(snapshot.docs.map((doc) => doc.data()));
      }
    );
  }, []);
  React.useEffect(() => {
    const data = onSnapshot(
      collection(db, "users", `${user?.id}`, "followings"),
      (snapshot) => {
        setFollowings(snapshot.docs.map((doc) => doc.data()));
      }
    );
  }, []);

  setTimeout(() => {
    setLoading(false);
  }, 300);

  return (
    <Content>
      {followers?.length < 1 && followings?.length < 1 ? (
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#ccc",
          }}
        >
          0 User
        </div>
      ) : (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "15px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
            {followers?.length > 0 && (
              <UserListDialogMain
                title="Followers"
                users={followers}
                type="followers"
                user={user}
              />
            )}
            <AvatarGroup total={followers?.length}>
              {followers?.map((item, index) => {
                return (
                  <Avatar
                    alt={item?.name}
                    src={item?.cover}
                    onClick={() => navigate(`/user/${item?.id}`)}
                    style={{ cursor: "pointer" }}
                  />
                );
              })}
            </AvatarGroup>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
            {followings?.length > 0 && (
              <UserListDialogMain
                title="Followings"
                users={followings}
                type="followings"
                user={user}
              />
            )}
            <AvatarGroup total={followings?.length}>
              {followings?.map((item, index) => {
                return (
                  <Avatar
                    alt={item?.name}
                    src={item?.cover}
                    onClick={() => navigate(`/user/${item?.id}`)}
                    style={{ cursor: "pointer" }}
                  />
                );
              })}
            </AvatarGroup>
          </div>
        </div>
      )}
    </Content>
  );
};

const Content = styled.div`
  display: flex;
  align-items: start;
  justify-content: start;
  padding-top: 1vw;
  padding-left: 3vw;
  width: 100%;
  height: 100%;
  min-height: 50vh;
  flex-wrap: wrap;
  gap: 0.5vw;
  height: auto;
  margin-bottom: 5vw;
  overflow-x: hidden;

  .loadingIcon {
    font-size: 3vw;
  }

  @media only screen and (max-width: 600px) {
    justify-content: start;
    padding-top: 6vw;
    padding-left: 12vw;
  }
`;

const List = styled.div`
  display: flex;
  flex-direction: column;
  align-items: start;
  justify-content: start;
  padding: 0.5vw;
  gap: 0.5vw;

  & span {
    @media only screen and (max-width: 600px) {
      margin: 3vw;
      font-size: 3.5vw;
      font-weight: normal;
      font-style: italic;
      color: ${(props) => props.theme.disabled};
    }
  }

  @media only screen and (max-width: 600px) {
    gap: 2vw;
  }
`;

/**  following item
 */

// const FollowingItem = ({ user }) => {
//   const { currentUser } = React.useContext(AuthContext);
//   const dispatch = useDispatch();

//   // remove following

//   const DeleteFollowing = async () => {
//     const coll = collection(db, `users/${user?.id}/followers`);
//     await deleteDoc(doc(coll, `${user?.id}`));
//     dispatch(setContentChanger(3));
//   };

//   // capitalize first letters
//   function capitalizeFirstLetter(string) {
//     return string?.charAt(0).toUpperCase() + string?.slice(1);
//   }

//   const name = capitalizeFirstLetter(user?.name);
//   const type = capitalizeFirstLetter(user?.type);

//   return (
//     <Link
//       to={`/user/${user?.id}`}
//       style={{
//         color: "inherit",
//         textDecoration: "none",
//         display: "flex",
//         alignItems: "center",
//       }}
//     >
//       <Item>
//         <ImgContainer>
//           {user?.cover === undefined ? (
//             <UserProfileEmpty>
//               <FaUser className="user" />
//             </UserProfileEmpty>
//           ) : (
//             <Img src={user?.cover} alt="cover" />
//           )}
//         </ImgContainer>
//         <Name>{name}</Name>
//         <Type>{type}</Type>
//       </Item>
//       {user?.id === currentUser?.uid && (
//         <Remover onClick={DeleteFollowing}>
//           <HiOutlineUserRemove className="remove" />
//         </Remover>
//       )}
//     </Link>
//   );
// };

// const Item = styled.div`
//   border-radius: 10vw 2vw 2vw 10vw;
//   width: 25vw;
//   height: 3vw;
//   display: flex;
//   align-items: center;
//   padding-left: 0.4vw;
//   background: rgba(255, 255, 255, 0.7);

//   @media only screen and (max-width: 600px) {
//     width: 85vw;
//     height: 8vw;
//     border-radius: 50vw;
//     padding: 0;
//     font-size: 4vw;
//   }

//   animation: fadeIn 1s;
//   -webkit-animation: fadeIn 1s;
//   -moz-animation: fadeIn 1s;
//   -o-animation: fadeIn 1s;
//   -ms-animation: fadeIn 1s;

//   @keyframes fadeIn {
//     0% {
//       opacity: 0;
//     }
//     100% {
//       opacity: 1;
//     }
//   }

//   @-moz-keyframes fadeIn {
//     0% {
//       opacity: 0;
//     }
//     100% {
//       opacity: 1;
//     }
//   }

//   @-webkit-keyframes fadeIn {
//     0% {
//       opacity: 0;
//     }
//     100% {
//       opacity: 1;
//     }
//   }

//   @-o-keyframes fadeIn {
//     0% {
//       opacity: 0;
//     }
//     100% {
//       opacity: 1;
//     }
//   }

//   @-ms-keyframes fadeIn {
//     0% {
//       opacity: 0;
//     }
//     100% {
//       opacity: 1;
//     }
//   }

//   :hover {
//     background: rgba(255, 255, 255, 0.5);
//   }
// `;

// const ImgContainer = styled.div`
//   width: 2.5vw;
//   height: 2.5vw;
//   border-radius: 50%;
//   overflow: hidden;
//   display: flex;
//   align-items: center;
//   justify-content: center;

//   @media only screen and (max-width: 600px) {
//     width: 8vw;
//     height: 8vw;
//     border-radius: 50vw;
//   }

//   .user {
//     font-size: 1.3vw;
//   }
// `;

// const Img = styled.img`
//   width: 2.5vw;
//   height: 2.5vw;
//   object-fit: cover;

//   @media only screen and (max-width: 600px) {
//     width: 8vw;
//     height: 8vw;
//     border-radius: 50vw;
//   }
// `;

// const UserProfileEmpty = styled.div`
//   width: 2.2vw;
//   height: 2.2vw;
//   cursor: pointer;
//   display: flex;
//   align-items: center;
//   justify-content: center;

//   @media only screen and (max-width: 600px) {
//     width: 9vw;
//     height: 9vw;
//   }

//   .user {
//     font-size: 1.2vw;

//     @media only screen and (max-width: 600px) {
//       font-size: 5vw;
//     }
//   }
// `;

// const Name = styled.h4`
//   margin-left: 1vw;

//   @media only screen and (max-width: 600px) {
//     margin-left: 3vw;
//   }
// `;

// const Type = styled.p`
//   margin-left: 1vw;
//   color: ${(props) => props.theme.disabled};

//   @media only screen and (max-width: 600px) {
//     margin-left: 3vw;
//     font-size: 3vw;
//   }
// `;

// const Remover = styled.div`
//   margin-left: 0.5vw;
//   color: ${(props) => props.theme.disabled};
//   .remove {
//     font-size: 1.3vw;

//     @media only screen and (max-width: 600px) {
//       font-size: 4vw;
//     }

//     :hover {
//       color: #aaa;
//     }
//   }
// `;
