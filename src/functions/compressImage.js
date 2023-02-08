import React, { useState, useEffect } from "react";
import LazyLoad from "react-lazyload";

const LazyImage = ({ src, alt, width, height }) => {
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    const img = new Image();
    img.src = src;
    img.onload = () => {
      setImageLoaded(true);
    };
  }, [src]);

  return (
    <LazyLoad once={true} height={height}>
      {imageLoaded ? (
        <img src={src} alt={alt} width={width} height={height} />
      ) : (
        <div style={{ width, height }} />
      )}
    </LazyLoad>
  );
};

export default LazyImage;
