import React from "react";
import styled from "styled-components";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { FaUser } from "react-icons/fa";
import Avatar from "@mui/material/Avatar";

export const Header = () => {
  const navigate = useNavigate();
  // import current user & parse it
  const userUnparsed = useSelector((state) => state.storeMain.user);
  let currentuser;
  if (userUnparsed?.length > 0) {
    currentuser = JSON.parse(userUnparsed);
  }
  const cover = useSelector((state) => state.storeMain.cover);
  return (
    <Container>
      <div>
        <Avatar
          onClick={() => navigate(`/user/${currentuser?.id}`)}
          alt={currentuser?.name}
          src={currentuser?.cover !== undefined ? currentuser?.cover : ""}
          sx={{ width: 36, height: 36 }}
        />

        <h4 onClick={() => navigate(`/user/${currentuser?.id}`)}>
          {currentuser?.name}
        </h4>
      </div>

      <h3>Chat</h3>
    </Container>
  );
};

const Container = styled.div`
  padding: 10px 20px;
  box-sizing: border-box;
  height: 70px;
  width: 100%;
  border-bottom: 1px solid ${(props) => props.theme.lineColor};
  color: ${(props) => props.theme.font};
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  // background: #fff;

  h4 {
    cursor: pointer;
    font-weight: normal;
    :hover {
      text-decoration: underline;
    }
  }

  div {
    display: flex;
    align-items: center;
    gap: 10px;
    @media only screen and (max-width: 600px) {
      display: none;
    }
  }
  @media only screen and (max-width: 600px) {
    display: none;
    width: 100%;
    height: 6vh;
    border-top: 1px solid #ddd;
  }
`;

const Img = styled.img`
  width: 2vw;
  height: 2vw;
  border-radius: 50%;
  object-fit: cover;
  cursor: pointer;

  @media only screen and (max-width: 600px) {
    width: 8vw;
    height: 8vw;
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
