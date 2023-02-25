import { useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import useWindowDimensions from "../../functions/dimensions";
import { GiFlexibleStar } from "react-icons/gi";
import { Spinner } from "../../components/loader";
import Rating from "@mui/material/Rating";
import { MdLocationPin } from "react-icons/md";
import { FaUser } from "react-icons/fa";

export const Recomended = () => {
  const list = useSelector((state) => state.storeMain.userList);
  const navigate = useNavigate();
  let recomendedList;
  if (list?.length > 0) {
    recomendedList = JSON.parse(list);
  }

  const { height, width } = useWindowDimensions();
  const [loading, setLoading] = useState(true);
  setTimeout(() => {
    setLoading(false);
  }, 300);

  return (
    <Container height={height}>
      {loading ? (
        <Loader height={height}>
          <Spinner />
        </Loader>
      ) : (
        <Wrapper>
          <Title>
            <GiFlexibleStar id="recomendedIcon" /> Find Best Procedures Here
          </Title>
          <RecomendedList>
            {recomendedList
              ?.filter((item) => item?.type !== "user")
              .map((item, index) => {
                return (
                  <RecomendedItem
                    key={item?.id}
                    onClick={() => navigate(`/user/${item.id}`)}
                  >
                    <UserCover>
                      {item.cover?.length > 0 ? (
                        <img
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                          }}
                          src={item.cover}
                          alt={item.name}
                        />
                      ) : (
                        <FaUser id="undefined" />
                      )}
                    </UserCover>
                    <Info>
                      <Name>{item?.name}</Name>
                      <Adress>
                        <MdLocationPin size={24} color="red" />
                        {item?.adress?.city +
                          ", " +
                          item?.adress?.destrict +
                          ", " +
                          item?.adress?.adress +
                          ", " +
                          item?.adress?.streetNumber}
                      </Adress>
                      <Procedure>წარბების ლამინირება</Procedure>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "10px",
                        }}
                      >
                        <Rating name="size-small" readOnly defaultValue={5} />
                      </div>
                    </Info>
                  </RecomendedItem>
                );
              })}
          </RecomendedList>
        </Wrapper>
      )}
    </Container>
  );
};

const Loader = styled.div`
  z-index: 800;
  height: 85vh;
  width: 100%;
  background: ${(props) => props.theme.background};
  display: flex;
  justify-content: center;
  align-items: center;

  @media only screen and (max-width: 600px) {
    height: ${(props) => props.height}px;
    width: 100vw;
  }
`;

const Container = styled.div`
  z-index: 800;
  height: 85vh;
  width: 100%;
  margin-left: 2px;
  background: ${(props) => props.theme.background};

  @media only screen and (max-width: 600px) {
    height: calc(${(props) => props.height}px - 30vw);
    width: 100vw;
    display: flex;
    justify-content: center;
    margin-top: 17vw;
  }
`;

const Wrapper = styled.div`
  height: auto;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: start;
  align-items: center;
  overflow-y: scroll;
  overflow-x: hidden;
  box-sizing: border-box;
  padding: 1vw 2.5vw;
  //   gap: 15px;

  @media only screen and (max-width: 600px) {
    border-top: 1px solid ${(props) => props.theme.lineColor};
    width: 92vw;
    // gap: 15px;
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

const Title = styled.h3`
  color: ${(props) => props.theme.font};
  display: flex;
  align-items: center;
  gap: 10px;
  letter-spacing: 0.05vw;

  #recomendedIcon {
    color: #f2cd38;
    @media only screen and (max-width: 600px) {
      font-size: 4.5vw;
    }
  }
  @media only screen and (max-width: 600px) {
    letter-spacing: 0.2vw;
    font-size: 3.5vw;
  }
`;

const RecomendedList = styled.li`
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  gap: 2%;
  margin-top: 0.5vw;

  @media only screen and (max-width: 600px) {
    flex-direction: column;
    justify-content: start;
    align-items: center;
    flex-wrap: nowrap;
    gap: 1vw;
  }
`;
const RecomendedItem = styled.div`
  width: 49%;
  height: 8vw;
  background: ${(props) => props.theme.secondLevel};
  box-shadow: 0 0.1vw 0.2vw ${(props) => props.theme.shadowColor};
  margin-bottom: 0.8vw;
  border-radius: 0.5vw;
  display: flex;
  overflow: hidden;
  cursor: pointer;
  color: ${(props) => props.theme.font};

  @media only screen and (max-width: 600px) {
    box-shadow: 0 0.2vw 0.4vw ${(props) => props.theme.shadowColor};
    width: 88vw;
    height: 35vw;
    border-radius: 1.5vw;
  }
`;

const UserCover = styled.div`
  width: 40%;
  height: 100%;
  overflow: hidden;
  border-radius: 0.5vw 0 0 0.5vw;
  filter: brightness(0.8);
  display: flex;
  align-items: center;
  justify-content: center;

  & > img {
    transition: ease 400ms;
  }

  :hover {
    filter: brightness(1);
  }

  #undefined {
    color: #fff;
    font-size: 2vw;

    @media only screen and (max-width: 600px) {
      font-size: 12vw;
    }
  }
`;

const Info = styled.div`
  width: 60%;
  height: 100%;
  box-sizing: border-box;
  padding: 0.5vw 0.5vw 0.5vw 1vw;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 5px;
  overflow: hidden;

  @media only screen and (max-width: 600px) {
    padding: 2vw 1.5vw 2vw 3vw;
  }
`;

const Name = styled.h4`
  margin: 0;

  @media only screen and (max-width: 600px) {
    font-size: 3.5vw;
    letter-spacing: 0.15vw;
  }
`;

const Adress = styled.div`
  font-size: 0.6vw;
  display: flex;
  align-items: start;
  gap: 3px;
  margin: 5px 0;

  @media only screen and (max-width: 600px) {
    font-size: 2.5vw;
  }
`;
const Procedure = styled.div`
  background: ${(props) => props.theme.background};
  padding: 3px 0 4px 0;
  border-radius: 5px;
  width: auto;
  font-size: 0.7vw;
  display: flex;
  justify-content: center;

  @media only screen and (max-width: 600px) {
    font-size: 2.7vw;
  }
`;
