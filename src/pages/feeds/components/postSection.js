import React, { useState } from 'react';

export const PostSection = ({ item }) => {
  const [open, setOpen] = useState(false);

  const handleClick = () => {
    setOpen(!open);
  };

  return (
    <div
      onClick={
        item?.post?.original.split('')?.length > 80 ? handleClick : undefined
      }
      style={{
        color: '#ccc',
        boxSizing: 'border-box',
        padding: '0px 15px',
        margin: '0 10px 15px 0',
        overflow: 'hidden',
        position: 'relative',
        height: 'auto',
        transition: '300ms ease-in', // Add a transition for smooth height changes
      }}
    >
      <h6
        style={{
          color: '#ccc',
          margin: 0,
          letterSpacing: '0.5px',
          fontSize: '14px',
          lineHeight: '18px',
          position: 'relative',
          fontWeight: '500',
        }}
      >
        {open
          ? item?.post?.original
          : `${item?.post?.original.substring(0, 80)}`}
        {item?.post?.original.split('')?.length > 80 && (
          <div
            onClick={handleClick}
            style={{
              cursor: 'pointer',
              color: '#f866b1',
              //   margin: '0 0 15px 0',
            }}
          >
            {open ? 'Read less...' : 'Read more...'}
          </div>
        )}
      </h6>
    </div>
  );
};
