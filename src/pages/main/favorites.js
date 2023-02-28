import styled from "styled-components";
import { ImCheckmark } from "react-icons/im";
import { RiUserHeartFill } from "react-icons/ri";
import { SiHomeassistantcommunitystore } from "react-icons/si";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Language } from "../../context/language";
import Avatar from "@mui/material/Avatar";

export const Favorites = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  // import followings
  const folls = useSelector((state) => state.storeMain.followings);
  let followings;
  if (folls?.length > 0) {
    followings = JSON.parse(folls);
  }
  const language = Language();

  const usersList = useSelector((state) => state.storeMain.userList);
  let users;
  if (usersList?.length > 0) {
    users = JSON.parse(usersList);
  }

  return (
    <Container>
      <Title>
        {language?.language?.Main?.favourites?.title}{" "}
        <ImCheckmark className="likedIcon" />
      </Title>
      <List>
        {followings?.map((item, index) => {
          let us = users?.find((it) => it.id === item.id);
          return (
            <Item
              key={index}
              // onClick={() =>
              //   dispatch(setTargetUser({ id: item.id, name: item.name }))
              // }
              onClick={() => navigate(`/user/${item.id}`)}
            >
              <Avatar
                alt={us?.name}
                src={us?.cover !== undefined ? us?.cover : ""}
                sx={{ width: 30, height: 30 }}
              />
              <span>{us?.name}</span>
            </Item>
          );
        })}
      </List>
    </Container>
  );
};

const Container = styled.div`
  width: 100%;
  height: 22vw;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  padding-right: 2vw;
  padding-bottom: 0.5vw;
  overflow-y: scroll;
`;

const Title = styled.div`
  color: ${(props) => props.theme.font};
  display: flex;
  gap: 0.25vw;
  align-items: center;
  margin-top: 1.25vw;
  font-weight: bold;

  .likedIcon {
    margin-right: 2vw;
    font-size: 1.1vw;
    color: #2c976d;
  }
`;

const List = styled.div`
  padding-top: 1vw;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.3vw;
`;

const Item = styled.div`
  width: 80%;
  padding: 0.25vw;
  box-sizing: border-box;
  display: flex;
  justify-content: start;
  align-items: center;
  gap: 0.5vw;
  border-radius: 50vw;
  transition: ease-in 200ms;
  cursor: pointer;
  color: ${(props) => props.theme.font};
  background: ${(props) => props.theme.categoryItem};
  box-shadow: 0 0.1vw 0.3vw rgba(2, 2, 2, 0.05);

  &:hover {
    filter: brightness(0.8);
  }
`;
