import React, { useState } from 'react';
import { useSelector } from 'react-redux';

export const PostSection = ({ item }) => {
  const [open, setOpen] = useState(false);

  const handleClick = () => {
    setOpen(!open);
  };

  const lang = useSelector((state) => state.storeApp.language);

  const [original, setOriginal] = useState(false);

  let text;
  if (original) {
    text = item?.post?.original;
  } else {
    if (lang === 'en') {
      text = item?.post?.en;
    } else if (lang === 'ru') {
      text = item?.post?.ru;
    } else {
      text = item?.post?.ka;
    }
  }
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
        {open ? text : `${text?.substring(0, 80)}`}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            margin: '5px 0 0 0',
            fontSize: '12px',
          }}
        >
          {text?.split('')?.length > 80 && (
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
          <div onClick={(event) => event.stopPropagation()}>
            {item?.post?.original?.length > 0 &&
              item?.post?.originalLanguage !== lang && (
                <div
                  onClick={() => setOriginal(original ? false : true)}
                  style={{
                    cursor: 'pointer',
                    color: original ? '#f866b1' : 'rgba(255,255,255,0.3)',
                    //   margin: '0 0 15px 0',
                  }}
                >
                  See Original
                </div>
              )}
          </div>
        </div>
      </h6>
    </div>
  );
};
