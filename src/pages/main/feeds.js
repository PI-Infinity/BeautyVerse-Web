import React, { useEffect } from "react";
import styled from "styled-components";
import { FeedCard } from "../../pages/main/feedCard/feedCard";
import { useSelector, useDispatch } from "react-redux";
import { setRerender } from "../../redux/main";
import { setFeedScrollY } from "../../redux/scroll";
// import { setScroll } from "../../redux/scroll";
import useWindowDimensions from "../../functions/dimensions";
import { IsMobile } from "../../functions/isMobile";
import { ProceduresOptions } from "../../data/registerDatas";

export const Feeds = (props) => {
  const proceduresOptions = ProceduresOptions();

  const { height, width } = useWindowDimensions();
  const isMobile = IsMobile();
  const dispatch = useDispatch();

  // import users
  const usersList = useSelector((state) => state.storeMain.userList);
  let users;
  if (usersList?.length > 0) {
    users = JSON.parse(usersList);
  }

  const enterSearch = useSelector((state) => state.storeMain.enterSearch);

  // import filters
  const cityFilter = useSelector((state) => state.storeFilter.cityFilter);
  const districtFilter = useSelector(
    (state) => state.storeFilter.districtFilter
  );
  const search = useSelector((state) => state.storeFilter.search);
  const filter = useSelector((state) => state.storeFilter.filter);

  const specialist = useSelector((state) => state.storeFilter.specialist);
  const physicalObject = useSelector((state) => state.storeFilter.object);
  const shops = useSelector((state) => state.storeFilter.shop);
  const loadFeed = useSelector((state) => state.storeMain.loadFeed);
  // import current user & parse it
  const userUnparsed = useSelector((state) => state.storeMain.user);
  let user;
  if (userUnparsed?.length > 0) {
    user = JSON.parse(userUnparsed);
  }

  const scrollY = useSelector((state) => state.storeScroll.feedScrollY);
  useEffect(() => {
    const Scrolling = () => {
      setTimeout(() => {
        return window.scrollTo(0, scrollY);
      }, 500);
    };
    return Scrolling();
  }, [scrollY]);

  const DefineUserList = () => {
    let data;
    // if (user != undefined) {
    data = users

      ?.filter((item, index) => {
        return item.type != "user";
      })

      ?.filter((item, index) => {
        if (specialist) {
          return item;
        } else {
          return item.type !== "specialist";
        }
      })
      ?.filter((item, index) => {
        if (physicalObject) {
          return item;
        } else {
          return item.type !== "beautyCenter";
        }
      })
      ?.filter((item, index) => {
        if (shops) {
          return item;
        } else {
          return item.type !== "shop";
        }
      })
      ?.filter((item, index) => {
        if (
          districtFilter == "უბანი" ||
          districtFilter === "District" ||
          districtFilter === "Район"
        ) {
          return item;
        } else if (item.address.district === districtFilter) {
          return item;
        }
      })
      ?.filter((item, index) => {
        if (
          cityFilter == "ქალაქი" ||
          cityFilter === "City" ||
          cityFilter === "Город"
        ) {
          return item;
        } else if (item.address.city === cityFilter) {
          return item;
        }
      })
      ?.filter((item, index) => {
        let proceds = item.filterCategories?.find((it) =>
          it?.toLowerCase().includes(filter?.toLowerCase())
        );
        if (filter === "") {
          return item;
        } else if (proceds?.toLowerCase().includes(filter?.toLowerCase())) {
          return item;
        }
      })
      // ?.filter((item, index) => {
      //   if (item?.id != user?.id) {
      //     return item;
      //   }
      // })
      ?.filter((item, index) => {
        if (item?.type != "user") {
          return item;
        }
      })
      ?.filter((val) => {
        let procedure = proceduresOptions?.find((item) =>
          item.label?.toLowerCase()?.includes(search?.toLowerCase())
        );
        let proceds = val.filterCategories?.find((item) =>
          item?.toLowerCase()?.includes(procedure.value?.toLowerCase())
        );
        if (search == "") {
          return val;
        } else if (
          val.name?.toLowerCase()?.includes(search?.toLowerCase()) ||
          proceds?.toLowerCase()?.includes(procedure.value?.toLowerCase())
        ) {
          return val;
        } else {
          return "";
        }
      })
      ?.sort((a, b) => {
        return b?.lastPost?.seconds - a?.lastPost?.seconds;
      })
      .map((item, index) => {
        return (
          <FeedCard
            key={index}
            {...item}
            index={index}
            filterOpen={props.filterOpen}
          />
        );
      });
    return data;
  };

  const userList = DefineUserList();

  // const memorizeld = React.useMemo(() => Scrolling(), [userList]);

  return (
    <Container height={height}>
      <Wrapper id="feed">
        {/* <button onClick={Scrolling}>scroll</button> */}
        <div style={{ color: "orange", height: "auto" }}>
          {userList?.length > 0 ? (
            userList
          ) : (
            <div
              style={{ height: "90vh", display: "flex", alignItems: "center" }}
            >
              Nothing found with this filter!
            </div>
          )}
        </div>
      </Wrapper>
    </Container>
  );
};

const Container = styled.div`
  z-index: 800;
  // height: 83vh;
  width: 100%;

  @media only screen and (max-width: 600px) {
    // height: ${(props) => props.height}px;
    width: 100vw;
  }
`;

const Wrapper = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: start;
  // overflow-y: scroll;
  overflow-x: hidden;
  box-sizing: border-box;
  padding: 1.5vw 0;

  @media only screen and (max-width: 600px) {
    padding: 13vw 0 12vw 0;
  }

  .empty {
    display: none;
    @media only screen and (max-width: 600px) {
      display: flex;
      height: 27vw;
    }
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
