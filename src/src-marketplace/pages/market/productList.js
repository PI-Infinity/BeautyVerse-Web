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
  // get all products of shops from firebase
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
  flex: 3.5;
  border-radius: 0.5vw;
  width: 75vw;
  box-sizing: border-box;
  height: auto;
  display: flex;
  flex-wrap: wrap;
  gap: 1vw;
  padding: 1vw;

  @media only screen and (max-width: 621px) {
    width: 95vw;
    border-radius: 1vw;
    padding: 3vw;
    gap: 3vw;
  }
`;

/**
 * define product Card
 *  */

const ProductCard = (props) => {
  const { currentUser } = useContext(AuthContext);

  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  //define shop name
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
          <PriceContainer>
            {props?.sale > 0 ? (
              <>
                <Price>{props?.sale} ლარი </Price>
                {"/"}
              </>
            ) : null}
            <Price>{props?.price} ლარი</Price>
          </PriceContainer>
          <Title>{props?.title}</Title>
        </Wrapper>
      )}
    </ProductCardContainer>
  );
};

const ProductCardContainer = styled.div`
  flex: 1;
  height: 15vw;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  box-shadow: 0 0.1vw 0.3vw rgba(0, 0, 0, 0.1);
  box-sizing: border-box;
  border-radius: 0.5vw;
  overflow: hidden;

  @media only screen and (max-width: 621px) {
    flex: auto;
    width: 27.66vw;
    max-width: 27.66vw;
    height: 38vw;
    padding: 1.5vw;
    border-radius: 1vw;
  }
`;

const Wrapper = styled.div`
  width: 100%;
  height: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: start;
  overflow: hidden;
  box-sizing: border-box;
`;

const ShopTitle = styled.h5`
  margin: 0.25vw 0;
  color: #333;
  cursor: pointer;

  :hover {
    text-decoration: underline;
  }

  @media only screen and (max-width: 621px) {
    font-size: 2vw;
  }
`;
const ImgContainer = styled.div`
  background: white;
  width: 11.32vw;
  height: 11.32vw;
  cursor: pointer;

  @media only screen and (max-width: 621px) {
    flex: auto;
    width: 100%;
    max-width: 21.66vw;
    height: auto;
    padding: 0;
    border-radius: 1vw;
  }
`;
const Img = styled.img`
  width: 11.32vw;
  height: 11.32vw;
  object-fit: cover;

  transition: ease 300ms;
  cursor: pointer;

  :hover {
    transform: scale(1.05);
    filter: brightness(0.95);
  }

  @media only screen and (max-width: 621px) {
    flex: auto;
    width: 100%;
    height: auto;
    padding: 0;
    border-radius: 1vw;
  }
`;

const Title = styled.div`
  font-size: 0.7vw;
  width: 90%;
  overflow: hidden;
  text-align: center;
  white-space: nowrap;
  margin: 0.5vw 0;
  color: #ccc;

  @media only screen and (max-width: 621px) {
    font-size: 2.8vw;
  }
`;

const PriceContainer = styled.div`
  width: 100%;
  display: flex;
  align-tems: center;
  justify-contet: center;
  @media only screen and (max-width: 621px) {
    flex-direction: column;
  }
`;

const Price = styled.div`
  width: 90%;
  font-weight: bold;
  font-size: 0.8vw;
  color: black;
  margin: 0.5vw 0 0 0;
  text-align: center;

  @media only screen and (max-width: 621px) {
    font-size: 2.5vw;
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
