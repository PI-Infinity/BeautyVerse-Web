import axios from 'axios';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  setLoading,
  setFeeds,
  setFollowingsFeeds,
  setPage,
} from '../redux/feeds';

export const GetFeeds = () => {
  // dispatch
  const dispatch = useDispatch();
  // getting feeds
  const currentUser = useSelector((state) => state.storeUser.currentUser);
  // backend url
  const backendUrl = useSelector((state) => state.storeApp.backendUrl);
  // rerender getting feeds
  const rerenderFeeds = useSelector((state) => state.storeFeeds.rerenderFeeds);

  const GettingFeeds = async () => {
    try {
      var url = `${backendUrl}/api/v1/feeds${
        currentUser ? '?check=' + currentUser._id + '&' : '?'
      }page=1&limit=3`;
      const response = await axios.get(url);
      console.log(response.data.data.feedlist);
      dispatch(setFeeds(response.data.data.feedlist));
      dispatch(setLoading(false));
      dispatch(setPage(1));
    } catch (error) {
      console.log(error.response);
    }
  };
  //   const GettingFollowingsFeeds = async () => {
  //     try {
  //       const response = await axios.get(
  //         `${backendUrl}/api/v1/feeds/followings?page=1&limit=3`
  //       );
  //       console.log(response.data.data.feedlist);
  //       dispatch(setFollowingsFeeds(response.data.data.feedlist));
  //       dispatch(setLoading(false));
  //     } catch (error) {
  //       console.log(error.response);
  //     }
  //   };
  useEffect(() => {
    GettingFeeds();
    // GettingFollowingsFeeds()
  }, [rerenderFeeds, currentUser]);
};
