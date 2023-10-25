import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import { setOpenedProduct } from "../../../../../redux/marketplace";

export const Variants = ({ product }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const splited = location.pathname.split("/");
  let newPath;
  if (splited?.length === 4) {
    newPath = splited.slice(0, 3).join("/");
  } else if (splited?.length === 3) {
    newPath = splited.slice(0, 2).join("/");
  } else {
    newPath = splited.slice(0, 5).join("/");
  }
  const backendUrl = useSelector((state) => state.storeApp.backendUrl);
  const [variants, setVariants] = useState([]);
  const ProductVariants = async () => {
    try {
      // Map through the variants and return an array of promises
      const lstPromises = product.variants?.map((i) => {
        return axios.get(backendUrl + "/api/v1/marketplace/" + i._id);
      });

      // Wait for all the promises to resolve
      const responses = await Promise.all(lstPromises);

      // Extract the product from each response and log them
      const lst = responses.map((response) => response.data.data.product);
      setVariants(lst);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (product) {
      ProductVariants();
    }
  }, [product]);
  return (
    <Container>
      <div>Variants:</div>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          gap: "4px",
        }}
      >
        {variants?.map((item, index) => {
          return (
            <div
              onClick={() => {
                dispatch(setOpenedProduct(item));
                navigate(newPath + "/" + item._id);
                console.log(newPath + "/" + item._id);
              }}
              key={index}
              style={{
                flexDirection: "row",
                alignItems: "center",
                padding: "8px",
                borderRadius: "50px",
              }}
            >
              <img
                key={item.gallery[item.cover].url}
                src={item.gallery[item.cover].url}
                style={{ height: "35px", width: "35px", borderRadius: "50px" }}
              />
              <p
                style={{
                  fontSize: "14px",
                  margin: "0 15px",
                  letterSpacing: "0.5px",
                  color: "#ccc",
                }}
              >
                {item.title}
              </p>
            </div>
          );
        })}
      </div>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  align-items: center;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  padding: 0 0 10px 0;
  font-size: 14px;
`;
