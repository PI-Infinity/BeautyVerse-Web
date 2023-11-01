import React, { useState, useEffect } from 'react';

export const FadeInVideo = ({ src }) => {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setLoaded(true);
  }, []);

  return (
    <video
      height="100%"
      width="100%"
      autoPlay="autoplay"
      muted
      loop
      style={{
        opacity: loaded ? 1 : 0,
        transition: 'opacity 500ms ease-in',
        objectFit: 'cover',
      }}
    >
      <source src={src} type="video/mp4" />
    </video>
  );
};
