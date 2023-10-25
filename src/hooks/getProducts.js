import axios from "axios";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setRandomProductsList,
  setLoading,
  setPage,
} from "../redux/marketplace";

export const GetProducts = () => {
  // getting feeds
  const backendUrl = useSelector((state) => state.storeApp.backendUrl);
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
          backendUrl + "/api/v1/marketplace" + "?check="
        );
        if (response.data.data.products?.random) {
          dispatch(setRandomProductsList(response.data.data.products.random));
        }
      } catch (error) {
        console.log("Error fetching products:", error.response.data.message);
      }
    };

    GetProducts();
  }, [rerenderMarketplace]);
};
