import React from "react";
import styled from "styled-components";
import { useSelector, useDispatch } from "react-redux";
import {
  Increment,
  Decriment,
  removeItem,
} from "../../redux/marketplace/shoppingCart";
import useWindowDimensions from "../../functions/dimensions";
import { AiOutlineDelete } from "react-icons/ai";

const Cart = () => {
  const { height, width } = useWindowDimensions();
  const dispatch = useDispatch();
  const [shoppingCart, setShoppingCart] = React.useState([]);

  // add cart in local storage
  // define cart
  const cart = useSelector((state) => state.storeShoppingCart.cart);

  React.useEffect(() => {
    const cartItems = JSON.stringify(cart);
    localStorage.setItem("BeautyVerse:shoppingCart", cartItems);
  }, [cart]);
  React.useEffect(() => {
    const items = localStorage.getItem("BeautyVerse:shoppingCart");
    // localStorage.clear();
    setShoppingCart(JSON.parse(items));
  }, [cart]);

  /**
   * Define Total of cart
   */

  const DefineTotal = () => {
    const tot = shoppingCart.reduce((totalPrice, item) => {
      if (item?.sale > 0) {
        return (totalPrice += item.sale * item.quantity);
      } else {
        return (totalPrice += item.price * item.quantity);
      }
    }, 0);
    return tot;
  };

  const total = DefineTotal();

  // define prices without discount

  const SumOfPrices = () => {
    const tot = shoppingCart.reduce(
      (totalPrice, item) => (totalPrice += item.price * item.quantity),
      0
    );
    return tot;
  };

  const sum = SumOfPrices();

  // define total quantity

  const Qnt = () => {
    const tot = shoppingCart.reduce(
      (totalPrice, item) => (totalPrice += item.quantity),
      0
    );
    return tot;
  };

  const qnt = Qnt();
  // define prices without discount

  const Discount = () => {
    const tot = sum - total;
    return tot;
  };

  const discount = Discount();

  return (
    <Container height={height}>
      <Wrapper>
        <CartContainer>
          <CartHeader>Shopping Cart</CartHeader>
          {shoppingCart?.length > 0 ? (
            <CartItemList>
              {shoppingCart?.map((item, index) => (
                <CartItem key={index}>
                  <CartImgContainer>
                    <CartImg src={item.cover} />
                  </CartImgContainer>
                  <CartItemName>{item?.name}</CartItemName>
                  <CartItemRightSection>
                    <CartItemQuantity>
                      <CartItemIncrDecr
                        onClick={() => dispatch(Decriment(item.id))}
                      >
                        -
                      </CartItemIncrDecr>
                      <Quantity>{item?.quantity}</Quantity>
                      <CartItemIncrDecr
                        onClick={() => dispatch(Increment(item.id))}
                      >
                        +
                      </CartItemIncrDecr>
                    </CartItemQuantity>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        alignItems: "end",
                      }}
                    >
                      <CartItemPrice>
                        $
                        {(item?.sale > 0 ? item?.sale : item?.price) *
                          item?.quantity}
                      </CartItemPrice>
                      {item?.sale > 0 && (
                        <CartItemSalePrice>
                          ${item?.price * item?.quantity}
                        </CartItemSalePrice>
                      )}
                    </div>
                  </CartItemRightSection>
                  <AiOutlineDelete
                    size={18}
                    color="#ccc"
                    style={{ marginTop: "1vw", cursor: "pointer" }}
                    onClick={() => dispatch(removeItem(item?.id))}
                  />
                </CartItem>
              ))}
            </CartItemList>
          ) : (
            <h4 style={{ color: "#ccc" }}>Cart is empty</h4>
          )}
        </CartContainer>
        <TotalContainer>
          <Total>
            <h2>Total: </h2>
            <h2>${total}</h2>
          </Total>
          <Sum>
            <span>Items, {qnt}pcs. </span>
            <span>${sum}</span>
          </Sum>
          <Sum>
            <span>Discount: </span>
            <span>- ${discount}</span>
          </Sum>
          <Button>Checkout</Button>
          <div style={{ display: "flex", gap: "10px" }}>
            <input type="checkbox" />{" "}
            <span style={{ fontSize: "0.7vw", color: "gray" }}>
              I agree with the terms of the Rules for using the trading platform
              and the return policy
            </span>
          </div>
        </TotalContainer>
      </Wrapper>
    </Container>
  );
};

export default Cart;

const Container = styled.div`
  width: 100%;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: start;
  gap: 1.5vw;
  padding-top: 2vw;
`;

const Wrapper = styled.div`
  width: 75%;
  height: auto;
  padding-bottom: 2vw;
  display: flex;
  justify-content: center;
  gap: 2vw;
`;

const CartContainer = styled.div`
  flex: 3.5;
  height: auto;
  display: flex;
  flex-direction: column;
  align-items: start;
  box-sizing: border-box;
  padding: 1vw 0 0 2vw;
  box-shadow: 0 0.1vw 0.3vw rgba(0, 0, 0, 0.1);
  border-radius: 1vw;
`;

const CartHeader = styled.h2`
  font-size: 1vw;
  margin-bottom: 1vw;
`;

const CartItemList = styled.div`
  list-style: none;
  width: 95%;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const CartItem = styled.div`
  width: 100%;
  box-sizing: boreder-box;
  border-bottom: 1px solid #f3f3f3;
  margin-bottom: 1vw;
  display: flex;
  justify-content: space-between;
  align-items: start;
  padding: 0.5vw;
  gap: 10px;
`;

const CartImgContainer = styled.div`
  height: 6vw;
  width: 6vw;
  background: #f7f7f;
  border-radius: 0.25vw;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const CartImg = styled.img`
  max-width: 100%;
  max-height: 100%
  object-fit: cover;
`;

const CartItemName = styled.h3`
  flex: 4;
  font-size: 0.9vw;
  font-weight: normal;
  overflow: hidden;
`;

const CartItemRightSection = styled.div`
  flex: 2;
  margin: 0.75vw 1vw;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;
const CartItemQuantity = styled.div`
  flex: 1vw;
  display: flex;
  align-items: center;
  gap: 1vw;
`;
const Quantity = styled.div`
  width: 1vw;
  height: 1vw;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  font-size: 1vw;
`;
const CartItemIncrDecr = styled.div`
  width: 2vw;
  height: 2vw;
  font-size: 1vw;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 10vw;
  background: #f7f7f7;
  cursor: pointer;
`;

const CartItemPrice = styled.div`
  font-size: 1.3vw;
  font-weight: bold;
  margin-left: 0.5vw;
`;
const CartItemSalePrice = styled.div`
  font-size: 0.8vw;
  font-weight: bold;
  margin-left: 0.5vw;
  text-decoration: line-through;
  color: gray;
`;

const TotalContainer = styled.div`
  flex: 1;
  width: 8vw;
  height: 15vw;
  border-radius: 1vw;
  box-shadow: 0 0.1vw 0.3vw rgba(0, 0, 0, 0.1);
  padding: 1vw;
  display: flex;
  flex-direction: column;
  gap: 0.5vw;
  box-sizing: border-box;
`;

const Total = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 1vw;
`;
const Sum = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 1vw;
  color: #ccc;
`;

const Button = styled.button`
  width: 100%;
  border: none;
  height: 1.7vw;
  background: #31a65e;
  color: #fff;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  margin-top: auto;
  border-radius: 0.25vw;

  @media only screen and (max-width: 600px) {
    margin-top: 5vw;
    width: 100%;
    height: 7.5vw;
    border-radius: 50vw;
  }
`;
