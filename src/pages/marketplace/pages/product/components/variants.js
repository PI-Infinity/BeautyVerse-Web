import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import { setOpenedProduct } from '../../../../../redux/marketplace';

export const Variants = ({ product, scrollRef }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const splited = location.pathname.split('/');
  let newPath = splited.slice(0, -1).join('/');

  const backendUrl = useSelector((state) => state.storeApp.backendUrl);
  const [variants, setVariants] = useState([]);
  const ProductVariants = async () => {
    try {
      // Map through the variants and return an array of promises
      const lstPromises = product.variants?.map((i) => {
        return axios.get(backendUrl + '/api/v1/marketplace/' + i._id);
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
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          gap: '4px',
        }}
      >
        {variants?.map((item, index) => {
          return (
            <div
              onClick={() => {
                dispatch(setOpenedProduct(item));

                // Check if the scrollRef.current is available
                if (scrollRef.current) {
                  // Scroll to the top of the container smoothly
                  scrollRef.current.scrollTo({
                    top: 0,
                    behavior: 'smooth',
                  });
                }

                // Navigate based on the current pathname
                if (location.pathname.includes('/settings')) {
                  navigate(newPath + '/' + item._id);
                } else {
                  navigate(newPath + '/' + item._id);
                }
              }}
              key={index}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                padding: '8px',
                borderRadius: '50px',
              }}
            >
              <img
                key={item.gallery[item.cover].url}
                src={item.gallery[item.cover].url}
                style={{ height: '35px', width: '35px', borderRadius: '50px' }}
              />
              <p
                style={{
                  fontSize: '14px',
                  margin: '0 15px',
                  letterSpacing: '0.5px',
                  color: '#ccc',
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
