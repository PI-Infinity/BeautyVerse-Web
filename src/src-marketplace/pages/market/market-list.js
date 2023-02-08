import React, { useEffect, useState, useContext } from "react";
import styled from "styled-components";
import { useSelector, useDispatch } from "react-redux";
import { db } from "../../../firebase";
import {
  collectionGroup,
  query,
  where,
  getDocs,
  getDoc,
  collection,
} from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import Rating from "@mui/material/Rating";
import Loader from "react-js-loader";
import { AuthContext } from "../../../context/AuthContext";

export const ProductList = () => {
  /*
  / get all products of shops from firebase
  */
  const [products, setProducts] = useState([]);

  const GetShops = async () => {
    const products = query(collectionGroup(db, "products"));
    const querySnapshot = await getDocs(products);
    let list = [];
    await querySnapshot.forEach((doc) => {
      const product = doc.data();
      if (product?.status === "Published") {
        list.push(product);
      }
    });
    setProducts(shuffle(list));

    // set products by random sort
    function shuffle(array) {
      let currentIndex = array.length,
        randomIndex;

      // While there remain elements to shuffle.
      while (currentIndex != 0) {
        // Pick a remaining element.
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        // And swap it with the current element.
        [array[currentIndex], array[randomIndex]] = [
          array[randomIndex],
          array[currentIndex],
        ];
      }

      return array;
    }
  };

  useEffect(() => {
    GetShops();
  }, []);

  return (
    <Container>
      {products?.map((item, index) => {
        return <ProductCard key={index} {...item} />;
      })}
    </Container>
  );
};

const Container = styled.div`
  height: auto;
  display: flex;
  flex-wrap: wrap;
  gap: 1vw;
  padding: 0 0.5vw 7vw 1vw;
  margin-top: 0.5vw;
  width: 80vw;
`;

/**
 * define product Card
 *  */

const ProductCard = (props) => {
  const { currentUser } = useContext(AuthContext);
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  //define shop
  const [shop, setShop] = useState("");
  const DefineShopName = async () => {
    const docref = query(
      collection(db, "users"),
      where("id", "==", props.shop)
    );
    const nm = await getDocs(docref);
    nm.forEach((doc) => {
      setShop(doc.data());
    });
  };
  useEffect(() => {
    DefineShopName();
  }, [props]);

  setTimeout(() => {
    if (shop?.name?.length > 0) {
      setLoading(false);
    }
  }, 500);
  return (
    <ProductCardContainer>
      {loading ? (
        <Loader
          type="rectangular-ping"
          bgColor={"#050505"}
          color={"#050505"}
          size={100}
        />
      ) : (
        <Wrapper>
          <div
            style={{
              width: "100%",
              background: "#f3f3f3",
              borderRadius: "50vw",
              boxSizing: "border-box",
              padding: "0.1vw 0.5vw",
              marginBottom: "0.5vw",
              display: "flex",
              alignItems: "center",
              gap: "5px",
            }}
          >
            <ShopTitle
              onClick={
                currentUser?.uid === shop?.id
                  ? () => navigate("/user")
                  : () => navigate(`/user/${shop?.id}`)
              }
            >
              {shop?.name}
            </ShopTitle>
            {" / "}
            <ShopTitle
              style={{
                color: "#ccc",
                fontWeight: "normal",
              }}
            >
              {props?.categories[0]?.label}
            </ShopTitle>
          </div>
          <ImgContainer
            onClick={() =>
              navigate(`/marketplace/${props?.shop}/product/${props?.id}`)
            }
          >
            <Img
              src={props?.images[props?.images?.length - 1]?.url}
              alt={props?.images[props?.images?.length - 1]?.name}
            />
          </ImgContainer>
          <Title>{props?.title}</Title>
          <div
            style={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              gap: "5px",
            }}
          >
            <Price
              style={{
                color: props?.sale > 0 ? "#ccc" : null,
              }}
            >
              {props?.price} ლარი
            </Price>
            {props?.sale > 0 ? (
              <>
                {"/"}
                <Price>{props?.sale} ლარი </Price>
              </>
            ) : null}
          </div>
          <RatingContainer>
            <Rating name="simple-controlled" />
          </RatingContainer>
        </Wrapper>
      )}
    </ProductCardContainer>
  );
};

const ProductCardContainer = styled.div`
  width: 15vw;
  height: 25vw;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-radius: 0.5vw;
  box-shadow: 0 0.1vw 0.3vw rgba(0, 0, 0, 0.1);
  padding: 1vw;
  box-sizing: border-box;

  margin-top: 0.5vw;

  @media only screen and (max-width: 621px) {
    width: 40vw;
    padding: 0 2vw;
    border-radius: 1vw;
  }
`;

const Wrapper = styled.div`
  width: 100%;
  height: auto;
  display: flex;
  flex-direction: column;
  align-items: start;
  justify-content: start;
  overflow: hidden;
  box-sizing: border-box;

  @media only screen and (max-width: 621px) {
    box-sizing: border-box;
    text-align: center;
    white-space: nowrap;
    overflow: hidden;
    height: 60vw;
    gap: 1vw;
  }
`;

const ShopTitle = styled.h5`
  margin: 0.25vw 0;
  color: #333;
  cursor: pointer;

  :hover {
    text-decoration: underline;
  }
`;
const ImgContainer = styled.div`
  background: white;
  width: 13vw;
  height: 13vw;
  cursor: pointer;
  z-index: 0;
`;
const Img = styled.img`
  width: 13vw;
  height: 13vw;
  object-fit: cover;

  @media only screen and (max-width: 621px) {
    width: 40vw;
  }
`;

const Title = styled.div`
  font-weight: bold;
  font-size: 0.8vw;
  width: 100%;
  overflow: hidden;
  text-align: start;
  white-space: nowrap;
  margin: 0.5vw 0;

  @media only screen and (max-width: 621px) {
    font-size: 2.8vw;
  }
`;

const Price = styled.div`
  font-weight: bold;
  font-size: 0.8vw;
  color: green;
  margin: 0;

  @media only screen and (max-width: 621px) {
    font-size: 2.8vw;
  }
`;

const RatingContainer = styled.div`
  margin-top: 0.5vw;
  width: 100%;
`;

const BottomSectionContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  overflow: hidden;
  border-radius: 0.5vw;
  gap: 0.5vw;
  margin: 0.5vw 0 0 0;

  @media only screen and (max-width: 621px) {
    width: 100%;
    gap: 0;
    left: 0;
    bottom: 6.5vw;
  }

  #info {
    background: #f9f9f9;
    color: orange;
  }
`;

const Button = styled.div`
  width: 100%;
  height: 100%;
  text-align: center;
  background: #f3f3f3;
  padding: 0.3vw 0;
  cursor: pointer;
  font-weight: bold;
  color: ${(props) => (props.add ? "#ccc" : "#31a65e")};
  display: flex;
  align-items: center;
  justify-content: center;

  .button {
    font-size: 1.2vw;
    color: ${(props) => (props.add ? "#ccc" : "#31a65e")};

    @media only screen and (max-width: 621px) {
      font-size: 3.6vw;
    }
  }

  @media only screen and (max-width: 621px) {
    height: 6vw;
    font-size: 2.7vw;
  }
`;
