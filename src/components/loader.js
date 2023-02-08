import React from "react";
import ContentLoader from "react-content-loader";
import { IsMobile } from "../functions/isMobile";
import { TailSpin } from "react-loader-spinner";

export const Spinner = () => {
  return (
    <TailSpin
      height="80"
      width="80"
      color="#4fa94d"
      ariaLabel="tail-spin-loading"
      radius="1"
      wrapperStyle={{}}
      wrapperClass=""
      visible={true}
    />
  );
};

export const LineLoader = (props) => {
  const isMobile = IsMobile();
  return (
    <ContentLoader
      speed={1}
      width={isMobile ? 700 : 700}
      height={isMobile ? 15 : 15}
      backgroundColor="#f3f3f3"
      foregroundColor="#F7E6FF"
      {...props}
    >
      <rect
        x={isMobile ? 0 : 0}
        y={isMobile ? 5 : 5}
        rx={isMobile ? 0 : 0}
        ry={isMobile ? 0 : 0}
        width={isMobile ? 700 : 700}
        height={isMobile ? 15 : 15}
      />
    </ContentLoader>
  );
};
export const IconLoader = (props) => {
  const isMobile = IsMobile();
  return (
    <ContentLoader
      speed={1}
      width={isMobile ? 25 : 50}
      height={isMobile ? 15 : 15}
      backgroundColor="#f3f3f3"
      foregroundColor="#F7E6FF"
      {...props}
    >
      <rect
        x={isMobile ? 0 : 0}
        y={isMobile ? 5 : 5}
        rx={isMobile ? 0 : 0}
        ry={isMobile ? 0 : 0}
        width={isMobile ? 25 : 50}
        height={isMobile ? 15 : 15}
      />
    </ContentLoader>
  );
};
export const TextLoader = (props) => {
  const isMobile = IsMobile();
  return (
    <ContentLoader
      speed={1}
      width={isMobile ? 300 : 300}
      height={isMobile ? 15 : 18}
      backgroundColor="#f3f3f3"
      foregroundColor="#F7E6FF"
      {...props}
    >
      <rect
        x={isMobile ? 0 : 0}
        y={isMobile ? 5 : 5}
        rx={isMobile ? 0 : 0}
        ry={isMobile ? 0 : 0}
        width={isMobile ? 300 : 300}
        height={isMobile ? 15 : 18}
      />
    </ContentLoader>
  );
};
export const TitleLoader = (props) => {
  const isMobile = IsMobile();
  return (
    <ContentLoader
      speed={1}
      width={isMobile ? 150 : 150}
      height={isMobile ? 15 : 18}
      backgroundColor="#f3f3f3"
      foregroundColor="#F7E6FF"
      {...props}
    >
      <rect
        x={isMobile ? 0 : 0}
        y={isMobile ? 5 : 5}
        rx={isMobile ? 0 : 0}
        ry={isMobile ? 0 : 0}
        width={isMobile ? 150 : 150}
        height={isMobile ? 15 : 18}
      />
    </ContentLoader>
  );
};
export const TypeLoader = (props) => {
  const isMobile = IsMobile();
  return (
    <ContentLoader
      speed={1}
      width={isMobile ? 100 : 100}
      height={isMobile ? 12 : 15}
      backgroundColor="#f3f3f3"
      foregroundColor="#F7E6FF"
      {...props}
    >
      <rect
        x={isMobile ? 0 : 0}
        y={isMobile ? 5 : 5}
        rx={isMobile ? 0 : 0}
        ry={isMobile ? 0 : 0}
        width={isMobile ? 100 : 100}
        height={isMobile ? 12 : 15}
      />
    </ContentLoader>
  );
};
export const CoverLoader = (props) => {
  const isMobile = IsMobile();
  return (
    <ContentLoader
      speed={1}
      width={isMobile ? 80 : 80}
      height={isMobile ? 80 : 80}
      backgroundColor="#f3f3f3"
      foregroundColor="#F7E6FF"
      {...props}
    >
      <circle
        cx={isMobile ? 0 : 0}
        cy={isMobile ? 0 : 0}
        r={isMobile ? 50 : 50}
      />
    </ContentLoader>
  );
};
export const ImgLoader = (props) => {
  const isMobile = IsMobile();
  return (
    <ContentLoader
      speed={1}
      width={isMobile ? 800 : 800}
      height={isMobile ? 300 : 400}
      backgroundColor="#f3f3f3"
      foregroundColor="#F7E6FF"
      {...props}
    >
      <rect
        x={isMobile ? 0 : 0}
        y={isMobile ? 0 : 0}
        rx={isMobile ? 0 : 0}
        ry={isMobile ? 0 : 0}
        width={isMobile ? 800 : 800}
        height={isMobile ? 300 : 400}
      />
    </ContentLoader>
  );
};
