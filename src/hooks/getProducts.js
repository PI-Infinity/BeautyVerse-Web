import axios from 'axios';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  setRandomProductsList,
  setLoading,
  setPage,
} from '../redux/marketplace';

export const GetProducts = () => {
  // getting feeds
  const backendUrl = useSelector((state) => state.storeApp.backendUrl);
  const currentUser = useSelector((state) => state.storeUser.currentUser);
  // dispatch
  const dispatch = useDispatch();

  // define desktop or not
  const isDesktop = window.innerWidth >= 768;

  // getting feeds
  const rerenderMarketplace = useSelector(
    (state) => state.storeMarketplace.rerenderMarketplace
  );

  useEffect(() => {
    const GetProducts = async () => {
      try {
        const response = await axios.get(
          backendUrl + '/api/v1/marketplace' + '?check=' + currentUser
            ? currentUser?._id
            : ''
        );
        console.log(response.data.data.products);
        if (response.data.data.products?.random) {
          dispatch(setRandomProductsList(response.data.data.products.random));
        }
      } catch (error) {
        console.log(error.response);
      }
    };

    GetProducts();
  }, [rerenderMarketplace, currentUser]);
};
