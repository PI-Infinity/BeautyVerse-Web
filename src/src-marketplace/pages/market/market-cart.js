// import React from "react";
// import styled from "styled-components";
// import { useSelector, useDispatch } from "react-redux";
// import { Increment, Decriment } from "../../../redux/marketplace/shoppingCart";

// export const ShoppingCart = () => {
//   const dispatch = useDispatch();
//   const [shoppingCart, setShoppingCart] = React.useState([]);

//   const cart = useSelector((state) => state.storeShoppingCart.cart);

//   console.log(cart);

//   React.useEffect(() => {
//     const items = localStorage.getItem("BeautyVerse:shoppingCart");
//     // localStorage.clear();
//     console.log(items);
//     setShoppingCart(JSON.parse(items));
//   }, [cart]);

//   return (
//     <CartContainer>
//       <CartHeader>Shopping Cart</CartHeader>
//       <CartItemList>
//         {shoppingCart?.map((item, index) => (
//           <CartItem key={index}>
//             <CartItemName>{item?.name}</CartItemName>
//             <CartItemRightSection>
//               <CartItemIncrDecr onClick={() => dispatch(Decriment(item.id))}>
//                 -
//               </CartItemIncrDecr>
//               <CartItemQuantity>{item?.quantity}</CartItemQuantity>
//               <CartItemIncrDecr onClick={() => dispatch(Increment(item.id))}>
//                 +
//               </CartItemIncrDecr>
//               <CartItemPrice>${item?.price}</CartItemPrice>
//             </CartItemRightSection>
//           </CartItem>
//         ))}
//       </CartItemList>
//     </CartContainer>
//   );
// };

// const CartContainer = styled.div`
//   flex: 1;
//   width: 100%;
//   height: auto;
//   display: flex;
//   flex-direction: column;
//   align-items: center;
//   box-sizing: border-box;
//   padding: 1vw;
//   border-left: 1px solid #eee;
// `;

// const CartHeader = styled.h2`
//   font-size: 0.9vw;
//   margin-bottom: 2vw;
// `;

// const CartItemList = styled.div`
//   list-style: none;
//   width: 90%;
//   display: flex;
//   flex-direction: column;
//   align-items: center;
// `;

// const CartItem = styled.div`
//   width: 100%;
//   box-sizing: boreder-box;
//   border-bottom: 1px solid gray;
//   margin-bottom: 1vw;
//   display: flex;
//   justify-content: space-between;
//   align-items: center;
//   padding: 0.5vw;
// `;

// const CartItemName = styled.div`
//   flex: 4;
//   font-size: 0.8vw;
//   font-weight: bold;
//   overflow: hidden;
// `;

// const CartItemRightSection = styled.div`
//   flex: 3;
//   display: flex;
//   justify-content: space-between;
//   align-items: center;
// `;
// const CartItemQuantity = styled.div`
//   width: 1vw;
//   height: 1vw;
//   display: flex;
//   justify-content: center;
//   align-items: center;
//   cursor: pointer;
// `;
// const CartItemIncrDecr = styled.div`
//   width: 1vw;
//   height: 1vw;
//   display: flex;
//   justify-content: center;
//   align-items: center;
//   border-radius: 10vw;
//   background: #f3f3f3;
//   cursor: pointer;
// `;

// const CartItemPrice = styled.div`
//   font-size: 0.8vw;
//   margin-left: 0.5vw;
// `;
