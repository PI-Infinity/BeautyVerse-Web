import React from "react";
import styled from "styled-components";
import { Header } from "../components/header";
import { Footer } from "../components/footer";
import { Navigator } from "../components/navigator";
import { Filter } from "../pages/main/filter";
import { IsMobile } from "../functions/isMobile";
import { Outlet } from "react-router-dom";

export const RootLayout = () => {
  const isMobile = IsMobile();

  /**
   * Define paths where navigator is hidden
   */
  let nav;
  if (
    window.location.pathname?.includes("/chat/") ||
    window.location.pathname?.includes("/product/") ||
    window.location.pathname == "/login" ||
    window.location.pathname == "/register" ||
    window.location.pathname == "/register/identify" ||
    window.location.pathname == "/register/business"
  ) {
    nav = undefined;
  } else {
    nav = <Navigator />;
  }

  console.log(window.location.pathname);

  return (
    <>
      <TopLine />
      <Header />
      {isMobile &&
        (window.location.pathname === "/" ||
          window.location.pathname === "/cards") && <Filter />}
      <Outlet />
      <Footer />
      {nav}
    </>
  );
};

const TopLine = styled.div`
  position: fixed;
  top: 0 !important;
  left: 0;
  right: 0;
  width: 100%;
  height: 0.22vw;
  background: linear-gradient(
    226deg,
    #2bdf61,
    #dfc32b,
    #ce2bdf,
    #2bc6df,
    #df2bb8,
    #2b8edf,
    #d3df2b,
    #2bdfd9,
    #df8c2b,
    #2bbedf,
    #df2bb0,
    #c3df2b,
    #ea7c7c,
    #2bdf61,
    #dfc32b
  );
  background-size: 800% 800%;
  z-index: 10;

  @media only screen and (max-width: 600px) {
    height: 1vw;
    z-index: 10000;
    top: 0 !important;
    position: absolute;
  }

  -webkit-animation: AnimationName 30s ease infinite;
  -moz-animation: AnimationName 30s ease infinite;
  -o-animation: AnimationName 30s ease infinite;
  animation: AnimationName 30s ease infinite;

  @-webkit-keyframes AnimationName {
    0% {
      background-position: 0% 50%;
    }
    50% {
      background-position: 100% 50%;
    }
    100% {
      background-position: 0% 50%;
    }
  }
  @-moz-keyframes AnimationName {
    0% {
      background-position: 0% 50%;
    }
    50% {
      background-position: 100% 50%;
    }
    100% {
      background-position: 0% 50%;
    }
  }
  @-o-keyframes AnimationName {
    0% {
      background-position: 0% 50%;
    }
    50% {
      background-position: 100% 50%;
    }
    100% {
      background-position: 0% 50%;
    }
  }
  @keyframes AnimationName {
    0% {
      background-position: 0% 50%;
    }
    50% {
      background-position: 100% 50%;
    }
    100% {
      background-position: 0% 50%;
    }
  }
`;
