import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { SpecialistsCard } from "../../pages/main/specialistCard";
import { useDispatch, useSelector } from "react-redux";
import useWindowDimensions from "../../functions/dimensions";
import { setLoadFeed, setRerender } from "../../redux/main";
import { setScroll } from "../../redux/scroll";
import { IsMobile } from "../../functions/isMobile";
import { Spinner } from "../../components/loader";
import { ProceduresOptions } from "../../data/registerDatas";

export const Specialists = (props) => {
  const scrollY = useSelector((state) => state.storeScroll.cardsScrollY);
  useEffect(() => {
    const Scrolling = () => {
      setTimeout(() => {
        return window.scrollTo(0, scrollY);
      }, 500);
    };
    return Scrolling();
  }, [scrollY]);
  const isMobile = IsMobile();
  const { height, width } = useWindowDimensions();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const proceduresOptions = ProceduresOptions();
  // import users
  const usersList = useSelector((state) => state.storeMain.userList);
  let users;
  if (usersList?.length > 0) {
    users = JSON.parse(usersList);
  }

  // import filters
  const cityFilter = useSelector((state) => state.storeFilter.cityFilter);
  const districtFilter = useSelector(
    (state) => state.storeFilter.districtFilter
  );
  const specialist = useSelector((state) => state.storeFilter.specialist);
  const physicalObject = useSelector((state) => state.storeFilter.object);
  const shops = useSelector((state) => state.storeFilter.shop);
  const reiting = useSelector((state) => state.storeFilter.reiting);

  const search = useSelector((state) => state.storeFilter.search);
  const filter = useSelector((state) => state.storeFilter.filter);

  // import current user & parse it
  const userUnparsed = useSelector((state) => state.storeMain.user);
  let user;
  if (userUnparsed?.length > 0) {
    user = JSON.parse(userUnparsed);
  }

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
          <SpecialistsCard
            key={index}
            index={index}
            {...item}
            filterOpen={props.filterOpen}
          />
        );
      });
    // }
    return data;
  };

  const userList = DefineUserList();

  // scrolling

  const scrollref = React.useRef(null);
  const getscroll = () => {
    const scroll = Math.abs(
      scrollref.current.getBoundingClientRect().top -
        scrollref.current.offsetTop
    );

    if (scroll > 250) {
      localStorage.setItem("BeautyVerse:scrollPosition", scroll);
    } else {
      localStorage.setItem("BeautyVerse:scrollPosition", 0);
    }

    if (isMobile) {
      if (scroll < 50 && scroll > -1) {
        dispatch(setScroll(true));
      } else {
        dispatch(setScroll(false));
      }

      if (Math.abs(scrollref.current.getBoundingClientRect().top > 230)) {
        dispatch(setRerender());
      }
    }
  };

  // go back to saved scroll position
  // useEffect(() => {
  //   const pos = localStorage.getItem("BeautyVerse:scrollPosition");
  //   const w = document.getElementById("list");
  //   w.scrollTop = pos;
  // }, [userList]);
  setTimeout(() => {
    setLoading(false);
  }, 300);

  useEffect(() => {
    if (userList?.length < 1) {
      dispatch(setLoadFeed(false));
    }
  }, [userList]);

  console.log(userList?.length);

  return (
    <Container direction={props.direction} height={height}>
      {loading ? (
        <Loader height={height}>
          <Spinner />
        </Loader>
      ) : (
        <Wrapper onScroll={getscroll} id="list" ref={scrollref}>
          {/* <div style={{ color: "orange", height: "auto", width: "auto" }}> */}
          {userList?.length > 0 ? (
            userList
          ) : (
            <div
              style={{
                width: "100%",
                height: "90vh",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                color: "orange",
              }}
            >
              Nothing found with this filter!
            </div>
          )}
          {/* </div> */}
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
  // height: 85vh;
  overflow-x: hidden;
  width: 100%;
  background: ${(props) => props.theme.background};

  @media only screen and (max-width: 600px) {
    // height: ${(props) => props.height}px;
    width: 100vw;
    display: flex;
    justify-content: center;
  }
`;

const Wrapper = styled.div`
  height: auto;
  width: 100%;
  display: flex;
  justify-content: start;
  align-items: start;
  flex-wrap: wrap;
  overflow-y: scroll;
  overflow-x: hidden;
  box-sizing: border-box;
  padding: 1.5vw 2.5vw;
  gap: 15px;

  @media only screen and (max-width: 600px) {
    width: 92vw;
    justify-content: start;
    flex-wrap: wrap;
    padding: 15vw 0 15vw 0;
    gap: 15px;
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
