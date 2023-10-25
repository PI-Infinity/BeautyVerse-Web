import React, { useState } from 'react';
import Skeleton from '@mui/material/Skeleton';

export const FadeInImage = ({ src }) => {
  const [loaded, setLoaded] = useState(false);

  return (
    <>
      <img
        src={src}
        height="100%"
        width="100%"
        style={{
          objectFit: 'cover',
          opacity: loaded ? 1 : 0,
          transition: 'opacity 300ms ease-in',
        }}
        onLoad={() => setLoaded(true)}
      />
    </>
  );
};
