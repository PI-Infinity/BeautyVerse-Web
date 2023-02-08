import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { db, storage } from "../../firebase";
import { collection, deleteDoc, doc, onSnapshot } from "firebase/firestore";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  ref,
  uploadBytes,
  listAll,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import Loader from "react-js-loader";
import {
  MdAddBusiness,
  MdLocationPin,
  MdAddShoppingCart,
} from "react-icons/md";
import { AiOutlineMail, AiOutlineDelete } from "react-icons/ai";
import { BiImageAdd } from "react-icons/bi";
import useWindowDimensions from "../../functions/dimensions";
import { IsMobile } from "../../functions/isMobile";

export const Products = (props) => {
  const isMobile = IsMobile();
  const { height, width } = useWindowDimensions();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // current user info from redux
  const userUnparsed = useSelector((state) => state.storeMain.user);

  let userCurrent;
  if (userUnparsed?.length > 0) {
    userCurrent = JSON.parse(userUnparsed);
  }

  /** Define user - current user or visisted user
   */
  let user;
  if (props?.userVisit) {
    user = props?.user;
  } else {
    user = userCurrent;
  }

  // loading images
  const [loading, setLoading] = useState(true);
  // remove confirming window
  const [confirm, setConfirm] = useState("");

  // get products from firebase or from redux
  const ps = useSelector((state) => state.storeMarket.currentShopProducts);
  const [products, setProducts] = useState([]);
  React.useEffect(() => {
    if (userCurrent?.id !== user?.id) {
      const data = onSnapshot(
        collection(db, "users", `${user?.id}`, "products"),
        (snapshot) => {
          setProducts(snapshot.docs.map((doc) => doc.data()));
        }
      );
      return data;
    } else {
      // import products from redux
      // parse products list
      setProducts(JSON.parse(ps));
    }
  }, []);

  /** after getting files from firestore define list */
  const DefineList = (gall) => {
    if (gall?.length > 0) {
      let list = gall?.map((item, index) => {
        if (item?.status !== "Published" && user?.id !== userCurrent?.id) {
          return null;
        } else {
          let images;
          if (item?.images !== undefined) {
            images = item?.images;
          }
          return (
            <ProductContainer key={index}>
              {!props.userVisit && (
                <div
                  style={{
                    height: 0,
                    width: "100%",
                    display: "flex",
                    justifyContent: "end",
                  }}
                >
                  <RemoveIconContainer onClick={() => setConfirm(item.id)}>
                    <AiOutlineDelete className="removeIcon" />
                  </RemoveIconContainer>
                </div>
              )}
              <ImgContainer
                onClick={() =>
                  navigate(`/marketplace/${user?.id}/product/${item?.id}`)
                }
              >
                {images !== undefined ? (
                  <Img
                    src={images[images?.length - 1]?.url}
                    alt="item"
                    style={{ zIndex: 5 }}
                  />
                ) : (
                  <BiImageAdd className="undefinedIcon" />
                )}
              </ImgContainer>
              <ProductInfo>
                <h5
                  style={{
                    margin: "5px 0.5vw 0px 0.5vw",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                  }}
                >
                  {item?.title}
                </h5>
                <h5
                  style={{
                    // fontWeight: "normal",
                    margin: "0 0.5vw",
                    color: "green",
                  }}
                >
                  {item?.price} Gel
                </h5>
                {user?.id !== userCurrent?.id ? (
                  <AddToCart>Add to Cart</AddToCart>
                ) : (
                  <PublishButton
                    status={item.status}
                    onClick={() =>
                      navigate(`/marketplace/${user?.id}/product/${item?.id}`)
                    }
                  >
                    <>
                      {item.status === "Not Published"
                        ? "გამოუქვეყნებელი"
                        : "გამოქვეყნებული"}
                    </>
                  </PublishButton>
                )}
              </ProductInfo>
            </ProductContainer>
          );
        }
      });
      return list;
    }
  };

  const list = DefineList(products);

  /** delete image from firestore and cloud */

  const Deleting = async (deleteItem) => {
    /** delete from firestore
     */
    const coll = collection(db, `users/${user?.id}/products/`);
    setConfirm("");
    if (coll !== undefined) {
      await deleteDoc(doc(coll, `${deleteItem}`));
      /** delete from cloude
       */
      // Create a reference to the file to delete
      const desertRef = await ref(
        storage,
        `images/${user?.id}/products/${deleteItem}`
      );
      // Delete the file
      if (deleteItem?.length > 0 && deleteItem != undefined) {
        await deleteObject(desertRef)
          .then(() => {
            // File deleted successfully
          })
          .catch((error) => {
            console.log(error);
          });
      }
    }
    // window.location.reload();
  };

  React.useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 300);
  }, []);

  return (
    <>
      {confirm?.length > 0 && (
        <Confirm>
          <ConfirmCont>
            <ConfirmText>Are you sure to delete this file?</ConfirmText>
            <Answers>
              <Answer name="no" onClick={() => setConfirm("")}>
                Cancel
              </Answer>
              <Answer name="yes" onClick={() => Deleting(confirm)}>
                Delete
              </Answer>
            </Answers>
          </ConfirmCont>
        </Confirm>
      )}
      <Container height={height}>
        <Content listLength={list?.length}>
          {user?.type != "user" && (
            <>
              {!props.userVisit && (
                <AddProduct onClick={props.setAdd}>
                  <MdAddShoppingCart className="uploaderIcon" />
                </AddProduct>
              )}
              {list?.length > 0 == true ? list : ""}
            </>
          )}
        </Content>
      </Container>
    </>
  );
};

const Confirm = styled.div`
  width: 100%;
  height: 100vh;
  overflow: hidden;
  background: rgba(2, 2, 2, 0.1);
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  transition: ease-in-out 300ms;
`;

const ConfirmCont = styled.div`
  width: 50%;
  height: 20vw;
  border-radius: 0.5vw;
  box-shadow: 0 0.1vw 0.3vw rgba(2, 2, 2, 0.1);
  background: rgba(255, 255, 255, 0.95);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap 3vw;

  animation: fadeIn 0.25s;
  -webkit-animation: fadeIn 0.25s;
  -moz-animation: fadeIn 0.25s;
  -o-animation: fadeIn 0.25s;
  -ms-animation: fadeIn 0.25s;

  @keyframes fadeIn {
    0% {
      opacity: 0;
    }
    100% {
      opacity: 1;
    }
  }

  @-moz-keyframes fadeIn {
    0% {
      opacity: 0;
    }
    100% {
      opacity: 1;
    }
  }

  @-webkit-keyframes fadeIn {
    0% {
      opacity: 0;
    }
    100% {
      opacity: 1;
    }
  }

  @-o-keyframes fadeIn {
    0% {
      opacity: 0;
    }
    100% {
      opacity: 1;
    }
  }

  @-ms-keyframes fadeIn {
    0% {
      opacity: 0;
    }
    100% {
      opacity: 1;
    }
  }

  @media only screen and (max-width: 600px) {
    width: 80vw;
    height: 50vw;
    border-radius: 1.5vw;
    gap: 6vw;
  }
`;

const ConfirmText = styled.h2`
  @media only screen and (max-width: 600px) {
    font-size: 3.6vw;
  }
`;

const Answers = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-evenly;
  width: 20vw;

  @media only screen and (max-width: 600px) {
    width: 60vw;
  }
`;

const Answer = styled.div`
  border-radius: 0.5vw;
  box-shadow: 0 0.1vw 0.3vw rgba(2, 2, 2, 0.1);
  background: ${(props) => (props.name != "yes" ? "#35B453" : "#de4360")};
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 8vw;
  height: 2vw;
  cursor: pointer;

  @media only screen and (max-width: 600px) {
    width: 25vw;
    height: 7vw;
    border-radius: 1.5vw;
  }

  :hover {
    filter: ${(props) =>
      props.name === "yes" ? "brightness(1.05)" : "brightness(0.95)"};
  }
`;

const Container = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  overflow-y: scroll;
  overflow-x: hidden;
  height: 28.5vw;
  padding-bottom: 13vw;

  @media only screen and (max-width: 600px) {
    height: calc(${(props) => props.height}px - 70vw);
    box-sizing: border-box;
    padding: 2vw 4vw;
  }
`;

const AddProduct = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 14vw;
  height: 19vw;
  border: 0.25vw solid #fff;
  border-radius: 0.5vw;
  cursor: pointer;

  @media only screen and (max-width: 600px) {
    width: 27vw;
    height: 27vw;
    border-radius: 1.5vw;
    border: 0.75vw solid #fff;
  }

  .uploaderIcon {
    font-size: 5vw;
    color: #ccc;

    @media only screen and (max-width: 600px) {
      font-size: 12vw;
    }
  }
`;

const Content = styled.div`
  display: flex;
  align-items: start;
  justify-content: start;
  padding-top: 1vw;
  padding-left: 1.5vw;
  width: 100%;
  height: 100%;
  min-height: 50vh;
  flex-wrap: wrap;
  gap: 0.5vw;
  height: auto;
  margin-bottom: 5vw;

  @media only screen and (max-width: 600px) {
    min-height: auto;
    gap: 1.5vw;
    padding-left: 1vw;
  }

  .loadingIcon {
    font-size: 3vw;
  }
`;

const ProductContainer = styled.div`
  width: 14vw;
  height: auto;
  border-radius: 0.5vw;
  box-shadow: 0 0.1vw 0.3vw rgba(2, 2, 2, 0.1);
  overflow: hidden;
  border: 0.25vw solid #fff;
  display: flex;
  flex-direction: column;
  align-items: start;
  justify-content: start;

  animation: fadeIn 1s;
  -webkit-animation: fadeIn 1s;
  -moz-animation: fadeIn 1s;
  -o-animation: fadeIn 1s;
  -ms-animation: fadeIn 1s;

  @keyframes fadeIn {
    0% {
      opacity: 0;
    }
    100% {
      opacity: 1;
    }
  }

  @-moz-keyframes fadeIn {
    0% {
      opacity: 0;
    }
    100% {
      opacity: 1;
    }
  }

  @-webkit-keyframes fadeIn {
    0% {
      opacity: 0;
    }
    100% {
      opacity: 1;
    }
  }

  @-o-keyframes fadeIn {
    0% {
      opacity: 0;
    }
    100% {
      opacity: 1;
    }
  }

  @-ms-keyframes fadeIn {
    0% {
      opacity: 0;
    }
    100% {
      opacity: 1;
    }
  }

  @media only screen and (max-width: 600px) {
    width: 27vw;
    height: auto;
    border-radius: 1.5vw;
    border: 0.75vw solid #fff;
  }
`;

const RemoveIconContainer = styled.div`
  background: rgba(2, 2, 2, 0.1);
  width: 2vw;
  height: 2vw;
  z-index: 6;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  cursor: pointer;
  transition: ease-in-out 200ms;

  position: relative;
  top: 0.5vw;
  right: 0.5vw;

  @media only screen and (max-width: 600px) {
    width: 6vw;
    height: 6vw;
    top: 1.5vw;
    right: 1.5vw;
  }

  :hover {
    background: rgba(2, 2, 2, 0.2);
  }

  .removeIcon {
    font-size: 1.2vw;
    color: #fff;
    transition: ease-in-out 200ms;

    @media only screen and (max-width: 600px) {
      font-size: 3.6vw;
    }

    :hover {
      color: #de4360;
    }
  }
`;

const ImgContainer = styled.div`
  width: 14vw;
  height: 14vw;
  oveflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;

  @media only screen and (max-width: 600px) {
    width: 28vw;
    height: 28vw;
    border-radius: 1.5vw;
  }

  .undefinedIcon {
    font-size: 6vw;
    color: #ccc;
  }
`;

const Img = styled.img`
  object-fit: cover;
  width: 14vw;
  height: 14vw;
  z-index: 5;
  background: #fff;
  cursor: pointer;

  :hover {
    filter: brightness(1.1);
  }

  @media only screen and (max-width: 600px) {
    width: 28vw;
    height: 28vw;
  }
`;

const LoadingContainer = styled.div`
  height: 60vh;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ProductInfo = styled.div`
  width: 100%;
  height: auto;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 5px;
}}
`;

const AddToCart = styled.div`
  width: 100%;
  border: none;
  height: 1.7vw;
  background: #050505;
  color: #fff;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  margin-top: 5px;

  @media only screen and (max-width: 600px) {
    width: 100%;
    height: 4.5vw;
    font-size: 12px;
  }
`;
const PublishButton = styled.div`
  width: 100%;
  border: none;
  height: 1.7vw;
  background: ${(props) => (props.status === "Published" ? "green" : "#ccc")};
  color: ${(props) => (props.status === "Published" ? "white" : "black")};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  margin-top: 5px;

  @media only screen and (max-width: 600px) {
    width: 100%;
    height: 4.5vw;
    font-size: 12px;
  }
`;
