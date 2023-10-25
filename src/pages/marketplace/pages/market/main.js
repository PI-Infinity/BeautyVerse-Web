import React, { useEffect, useRef, useState } from "react";
import { CoverSlider } from "./components/CoverSlider";
import styled from "styled-components";
import { useSelector, useDispatch } from "react-redux";
import { PopularList } from "./components/popularList";
import { setScrollYMarketplace } from "../../../../redux/marketplace";
import { BounceLoader } from "react-spinners";
import { Search } from "../../../marketplace/components/search";

export const Main = () => {
  const dispatch = useDispatch();

  // fo to saved scroll y position
  const scrollYPosition = useSelector(
    (state) => state.storeMarketplace.scrollY
  );
  useEffect(() => {
    window.scrollTo(0, scrollYPosition);
  }, []);

  useEffect(() => {
    const handleScroll = async () => {
      const { scrollY, innerHeight } = window;
      const { scrollHeight } = document.documentElement;

      dispatch(setScrollYMarketplace(scrollY));
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // scroll to top
  const scrollToTop = useSelector((state) => state.storeApp.scrollToTop);
  const firstLoadScroll = useRef(true);
  useEffect(() => {
    if (firstLoadScroll.current) {
      firstLoadScroll.current = false;
      return;
    }
    // Perform some action when scrollToTop is true
    window.scrollTo({ top: 0, behavior: "smooth" });

    // other logic you want to perform when scrollToTop changes
  }, [scrollToTop]);

  // refresh indicator
  const [refresh, setRefresh] = useState(false);
  const rerenderMarketplace = useSelector(
    (state) => state.storeMarketplace.rerenderMarketplace
  );
  const firstLoad = useRef(true);
  useEffect(() => {
    if (firstLoad.current) {
      firstLoad.current = false;
      return;
    }
    setRefresh(true);
    setTimeout(() => {
      setRefresh(false);
    }, 1500);
  }, [rerenderMarketplace]);
  return (
    <Container>
      <div
        style={{
          height: refresh ? "60px" : 0,
          opacity: refresh ? 1 : 0,
          width: "100%",
          transition: "ease-in-out 300ms",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <BounceLoader color={"#f866b1"} loading={refresh} size={30} />
      </div>
      <div
        style={{
          margin: "16px 0",
          width: "100%",
          display: "flex",
        }}
      >
        <Search />
      </div>
      <CoverSlider />
      <PopularList />
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 100vh;
  background: rgba(0, 0, 0, 0.3);

  @media only screen and (max-width: 600px) {
    display: flex;
    flex-direction: column;
    align-items: center;
    min-height: 100vh;
    background: rgba(0, 0, 0, 0.3);
    padding-bottom: 40px;
  }
`;
