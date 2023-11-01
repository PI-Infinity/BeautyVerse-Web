import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import {
  FacebookShareButton,
  TwitterShareButton,
  EmailShareButton,
  TelegramShareButton,
  WhatsappShareButton,
  FacebookIcon,
  TwitterIcon,
  EmailIcon,
  TelegramIcon,
  WhatsappIcon,
} from 'react-share';
import Tooltip from '@mui/material/Tooltip';
import { setFeeds } from '../../../redux/feeds';

const ShareComponent = (props) => {
  const dispatch = useDispatch();
  const location = useLocation();
  const backendUrl = useSelector((state) => state.storeApp.backendUrl);
  const currentUser = useSelector((state) => state.storeUser.currentUser);
  const feeds = useSelector((state) => state.storeFeeds.feeds);

  const {
    userId,
    feedId,
    val,
    user,
    feed,
    transition,
    setTransition,
    shares,
    setShares,
  } = props;

  const UpdatePost = async () => {
    setShares(shares + 1);
    try {
      const resp = await axios.patch(`${backendUrl}/api/v1/feeds/${feedId}`, {
        shares: shares + 1,
      });
      const updatedFeeds = feeds.map((feed) =>
        feed._id === feedId ? { ...feed, shares: shares + 1 } : feed
      );
      dispatch(setFeeds(updatedFeeds));
      // Add additional logic here as per your requirements
    } catch (error) {
      console.log(error.response.data.message);
    }
  };

  const [isTooltipOpen, setIsTooltipOpen] = useState(false);

  const handleCopyClick = () => {
    const textToCopy = 'https://beautyverse.ge' + location.pathname;
    const textArea = document.createElement('textarea');
    textArea.value = textToCopy;

    // Prevent scrolling to bottom of page in MS Edge.
    textArea.style.position = 'fixed';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    try {
      const successful = document.execCommand('copy');
      if (successful) {
        console.log('Text successfully copied to clipboard');
        UpdatePost();
        setIsTooltipOpen(true);
        setTimeout(() => {
          setIsTooltipOpen(false);
        }, 2000);
      } else {
        console.error('Failed to copy text.');
      }
    } catch (err) {
      console.error('Could not copy text: ', err);
    }

    document.body.removeChild(textArea);
  };

  useEffect(() => {
    setTransition(false);
  }, []);

  return (
    <div
      style={{
        height: transition ? 0 : '50px',
        opacity: transition ? 0 : '1',
        transform: `scale(${transition ? 0 : '1'})`,
        transition: 'ease 200ms',
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: `${transition ? '0' : '10px 0 0 0'}`,
        gap: '10px',
      }}
    >
      {/* Fallback social media share buttons */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '10px',
        }}
      >
        <FacebookShareButton
          onClick={() => UpdatePost()}
          url={`https://beautyverse.ge${location.pathname}`}
        >
          <FacebookIcon size={32} round />
        </FacebookShareButton>
        <TwitterShareButton
          onClick={() => UpdatePost()}
          url={`https://beautyverse.ge${location.pathname}`}
        >
          <TwitterIcon size={32} round />
        </TwitterShareButton>
        <EmailShareButton
          onClick={() => UpdatePost()}
          url={`https://beautyverse.ge${location.pathname}`}
        >
          <EmailIcon size={32} round />
        </EmailShareButton>
        <TelegramShareButton
          onClick={() => UpdatePost()}
          url={`https://beautyverse.ge${location.pathname}`}
        >
          <TelegramIcon size={32} round />
        </TelegramShareButton>
        <WhatsappShareButton
          onClick={() => UpdatePost()}
          url={`https://beautyverse.ge${location.pathname}`}
        >
          <WhatsappIcon size={32} round />
        </WhatsappShareButton>
      </div>
      <Tooltip title="Copied!" open={isTooltipOpen}>
        <button
          onClick={handleCopyClick}
          style={{
            padding: ' 5px 8px',
            borderRadius: '10px',
            background: '#ccc',
            outline: 'none',
          }}
        >
          Copy
        </button>
      </Tooltip>
    </div>
  );
};

export default ShareComponent;
