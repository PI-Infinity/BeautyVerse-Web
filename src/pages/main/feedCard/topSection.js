import React, { useContext } from "react";
import styled from "styled-components";
import { AuthContext } from "../../../context/AuthContext";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { FaUser } from "react-icons/fa";
import { ImCheckmark } from "react-icons/im";
import { BsThreeDots } from "react-icons/bs";
import {
  CoverLoader,
  TitleLoader,
  TypeLoader,
  IconLoader,
} from "../../../components/loader";

export const TopSection = (props) => {
  const { currentUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const followingLength = props.following?.id?.length;

  // scroll to top href
  const scrollPosition = useSelector(
    (state) => state.storeScroll.scrollPosition
  );

  const AddScrollPositionToLocalStorage = () => {
    localStorage.setItem("BeautyVerse:feedsScrollPosition:", scrollPosition);
  };

  return (
    <TopSectionContainer following={followingLength?.toString()}>
      <Profile
        onClick={
          currentUser?.uid === props?.id
            ? () => {
                AddScrollPositionToLocalStorage();
                navigate("/user");
              }
            : () => {
                AddScrollPositionToLocalStorage();
                navigate(`/user/${props?.id}`);
              }
        }
      >
        {props.loading ? (
          <CoverLoader />
        ) : (
          <>
            {props.cover?.length < 1 || props?.cover == undefined ? (
              <UserProfileEmpty
                onClick={
                  currentUser?.uid === props?.id
                    ? () => navigate("/user")
                    : () => navigate(`/user/${props?.id}`)
                }
              >
                <FaUser className="user" />
              </UserProfileEmpty>
            ) : (
              <Img
                src={props?.cover}
                onClick={
                  currentUser?.uid === props?.id
                    ? () => navigate("/user")
                    : () => navigate(`/user/${props?.id}`)
                }
              />
            )}
          </>
        )}
      </Profile>
      <div className="link">
        <div style={{ display: "flex", alignItems: "center" }}>
          <Link
            to={currentUser?.uid === props?.id ? "/user" : `/user/${props?.id}`}
            style={{ color: "inherit", textDecoration: "none" }}
          >
            {props.loading ? <TitleLoader /> : <Name>{props.name}</Name>}
          </Link>

          {currentUser?.uid !== props?.id && !props.loading && (
            <>
              {props.following?.id?.length > 0 ? (
                <ImCheckmark
                  className="followIcon"
                  following="true"
                  onClick={props.UnFollowToUser}
                />
              ) : (
                <ImCheckmark
                  className="followIcon"
                  onClick={
                    currentUser != undefined
                      ? props.FollowToUser
                      : () => navigate("/login")
                  }
                />
              )}
            </>
          )}
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
          }}
        >
          <Category>
            {props.loading ? <TypeLoader /> : <>{props.userType}</>}
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
    padding: 0 3vw 0 3vw;
  }

  .followIcon {
    font-size: 1.1vw;
    color: ${(props) => (props.following > 0 ? "#2bdfd9" : "#ddd")};
    margin-left: 0.5vw;
    cursor: pointer;

    @media only screen and (max-width: 600px) {
      font-size: 4.5vw;
      margin-left: 1.5vw;
      margin-bottom: 1vw;
    }
  }

  .link {
    margin-left: 1vw;
    flex: 2;
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
    color: ${(props) => props.theme.secondLevel};
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

  @media only screen and (max-width: 600px) {
    width: 9vw;
    height: 9vw;
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
  font-size: 0.8vw;
  font-weight: bold;
  letter-spacing: 0.01vw;
  cursor: pointer;
  color: ${(props) => props.theme.mainFont};
  display: flex;
  align-items: center;
  gap: 0.25vw;
  margin: 0;

  @media only screen and (max-width: 600px) {
    font-size: 3.8vw;
    letter-spacing: 0.1vw;
    margin-bottom: 0.5vw;
  }

  :hover {
    text-decoration: underline;
  }
`;

const Category = styled.span`
  flex: 6;
  font-size: 0.6vw;
  color: ${(props) => props.theme.secondLevel};
  letter-spacing: 0.003w;

  @media only screen and (max-width: 600px) {
    color: #aaa;
    font-size: 2.8vw;
    letter-spacing: 0.1vw;
  }
`;
