import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react';
import { IoMdArrowDropdown } from 'react-icons/io';
import { useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { ProductItem } from '../../marketplace/pages/product/productItem';

const OpenedUserProductNotifications = () => {
  // navigate
  const navigate = useNavigate();
  // location
  const location = useLocation();
  //define paths
  let parts = location.pathname.split('/');
  // product id
  let productId = parts[4];

  // define product context
  const activeProductObj = useSelector(
    (state) => state.storeShowroom.openedProduct
  );

  // if outlet context isnt defined get product from db. this usually happens when user loads product by link and data does not come from Outlet context;
  const [productObj, setProductObj] = useState(null);
  const backendUrl = useSelector((state) => state.storeApp.backendUrl);

  const GetProduct = async () => {
    try {
      const response = await axios.get(
        backendUrl + '/api/v1/marketplace/' + productId
      );
      setProductObj(response.data.data.product);
    } catch (error) {
      console.log(error.response.data.message);
    }
  };

  // with this state feeds open with scale and opacity
  const [openProduct, setOpenProduct] = useState(false);

  // scroll document when load
  const scrollRef = useRef();

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
    setOpenProduct(true);
    if (!activeProductObj) {
      GetProduct();
    }
  }, [activeProductObj]);

  let product;
  if (activeProductObj) {
    product = activeProductObj;
  } else {
    product = productObj;
  }

  return (
    <div
      style={{
        background: 'rgba(1, 2, 12, 0.2)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        zIndex: 1001,
        width: '100vw',
        height: '100%',
        position: 'fixed',
        top: '0',
        left: '0',
        overflow: 'hidden',
      }}
    >
      <Container ref={scrollRef} openproduct={openProduct ? 'true' : 'false'}>
        <Header>
          <div style={{ width: '30px' }}></div>
          <div>
            <h3
              style={{
                color: '#ccc',
                margin: 0,
                padding: 0,
                letterSpacing: '0.5px',
              }}
            >
              {product?.title}
            </h3>
          </div>
          <div
            onClick={() => {
              setOpenProduct(false);
              setTimeout(() => {
                navigate('/profile/notifications');
              }, 300);
            }}
            style={{
              padding: '5px',

              zIndex: 1000,
            }}
          >
            <IoMdArrowDropdown size={30} color="#f866b1" />
          </div>
        </Header>
        <ProductItem item={product} to="/feeds/user" />
      </Container>
    </div>
  );
};

export default OpenedUserProductNotifications;

const Container = styled.div`
  width: 100vw;
  height: 100%;
  padding: 0 0 50px 0;
  z-index: 1000;
  background: rgba(1, 2, 12, 0.9);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  transform: translateY(
    ${(props) => (props.openproduct === 'true' ? 0 : '100vh')}
  );
  transition: ease-in 300ms;
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow-y: scroll;
  overflow-x: hidden;
  position: fixed;
  top: 0;
  left: 0;
`;

const Header = styled.div`
  width: 100%;
  padding: 12.5px 8px;
  box-sizing: border-box;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;
