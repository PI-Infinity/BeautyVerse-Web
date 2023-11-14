import React, { useEffect, useState } from 'react';
import { IoMdArrowDropdown, IoMdArrowDropleft } from 'react-icons/io';
import styled from 'styled-components';
import { Input } from './input';
import { BounceLoader } from 'react-spinners';
import { Button } from '@mui/material';
import { useSelector } from 'react-redux';

export const AddProduct = ({ openAddProduct, setOpenAddProduct }) => {
  // current user redux state
  const currentUser = useSelector((state) => state.storeUser.currentUser);
  const [currency, setCurrency] = useState(currentUser?.currency);

  // transition
  const [transition, setTransition] = useState(true);

  useEffect(() => {
    setTransition(false);
  }, []);

  // loading when adding product
  const [loading, setLoading] = useState(false);
  // field states
  const [title, setTitle] = useState('');
  const [categories, setCategories] = useState([]);
  const [type, setType] = useState('everyone');
  const [brand, setBrand] = useState('');
  const [price, setPrice] = useState(null);

  const [sale, setSale] = useState(null);
  const [inStock, setInStock] = useState(null);
  const [sex, setSex] = useState('all');
  const [shortDescription, setShortDescription] = useState('');
  const [shortDescriptionRu, setShortDescriptionRu] = useState('');
  const [shortDescriptionKa, setShortDescriptionKa] = useState('');
  const [fullDescription, setFullDescription] = useState('');
  const [fullDescriptionRu, setFullDescriptionRu] = useState('');
  const [fullDescriptionKa, setFullDescriptionKa] = useState('');
  const [howToUse, setHowToUse] = useState('');
  const [howToUseRu, setHowToUseRu] = useState('');
  const [howToUseKa, setHowToUseKa] = useState('');
  const [compositons, setCompositions] = useState('');
  const [compositonsRu, setCompositionsRu] = useState('');
  const [compositonsKa, setCompositionsKa] = useState('');
  const [variants, setVariants] = useState([]);
  const [files, setFiles] = useState([]);
  const [cover, setCover] = useState(0);

  return (
    <div
      style={{
        background: 'rgba(1, 2, 12, 0.2)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        zIndex: 1002,
        width: '100vw',
        height: '100%',
        position: 'fixed',
        top: '0',
        left: '0',
      }}
    >
      <Container openpage={transition ? 'true' : 'false'}>
        <Header>
          <div
            onClick={() => {
              setTransition(true);
              setTimeout(() => {
                setOpenAddProduct(false);
              }, 300);
            }}
            style={{
              padding: '5px',

              zIndex: 1000,
            }}
          >
            <IoMdArrowDropdown size={30} color="#f866b1" />
          </div>
          <div>
            <h3
              style={{
                color: '#ccc',
                margin: 0,
                padding: 0,
                letterSpacing: '0.5px',
              }}
            >
              Add Product
            </h3>
          </div>
          <div
            style={{ width: '40px', display: 'flex', alignItems: 'center' }}
          ></div>
        </Header>
        <Inputs>
          <InputContainer>
            <h4>Files</h4>
            <div className="inputButton">Choice file</div>
          </InputContainer>
          <InputContainer>
            <h4>Product Title</h4>
            <Input
              type="text"
              label="Add Product title"
              value={title}
              onChange={setTitle}
              width="100%"
            />
          </InputContainer>
          <InputContainer>
            <h4>Product Type</h4>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-evenly',
                gap: '10px',
              }}
            >
              <div className="inputButton">For Everyone</div>
              <div className="inputButton">For Professionals</div>
            </div>
          </InputContainer>
          <InputContainer>
            <h4>Sex</h4>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-evenly',
                gap: '10px',
              }}
            >
              <div className="inputButton">All</div>
              <div className="inputButton">Women</div>
              <div className="inputButton">Men</div>
            </div>
          </InputContainer>
          <InputContainer>
            <h4>Categories</h4>
            <div className="inputButton">Choice Categories</div>
          </InputContainer>
          <InputContainer>
            <h4>Brand</h4>
            <Input
              type="text"
              label="Add Product brand"
              value={brand}
              onChange={setBrand}
              width="100%"
            />
          </InputContainer>
          <InputContainer>
            <h4>Price</h4>
            <Input
              type="number"
              label="Add Product price"
              value={price}
              onChange={setPrice}
              width="100%"
            />
          </InputContainer>
          <InputContainer>
            <h4>Sale</h4>
            <Input
              type="number"
              label="Add sale"
              value={sale}
              onChange={setSale}
              width="100%"
            />
          </InputContainer>
          <InputContainer>
            <h4>In Stock</h4>
            <Input
              type="number"
              label="In stock"
              value={inStock}
              onChange={setInStock}
              width="100%"
            />
          </InputContainer>
          <InputContainer>
            <h4>Variants</h4>
            <div className="inputButton">Choice Variants</div>
          </InputContainer>
          <InputContainer>
            <h4>Short Description</h4>
            <Input
              type="text"
              multiline={true}
              minRows={8}
              label="Add Short Description"
              value={inStock}
              onChange={setInStock}
              width="100%"
            />
          </InputContainer>
          <InputContainer>
            <h4>Full Description (Optional)</h4>
            <Input
              type="text"
              multiline={true}
              minRows={8}
              label="Add full Description"
              value={inStock}
              onChange={setInStock}
              width="100%"
            />
          </InputContainer>
          <InputContainer>
            <h4>How To Use?! (Optional)</h4>
            <Input
              type="text"
              multiline={true}
              minRows={8}
              label="Add instruction how to use"
              value={inStock}
              onChange={setInStock}
              width="100%"
            />
          </InputContainer>
          <InputContainer>
            <h4>Compositions (Optional)</h4>
            <Input
              type="text"
              multiline={true}
              minRows={8}
              label="Add product's compositions"
              value={inStock}
              onChange={setInStock}
              width="100%"
            />
          </InputContainer>
          <Button
            variant="contained"
            style={{
              backgroundColor: loading ? '#ccc' : '#f866b1',
              color: 'white',
            }}
            className="button"
            sx={{
              width: '40%',
              borderRadius: '50px',
              marginTop: '20px',
              height: '40px',
            }}
            //   onClick={Login}
            //   {...props}
          >
            {loading ? (
              <BounceLoader color={'#f866b1'} loading={loading} size={20} />
            ) : (
              'Add Product'
            )}
          </Button>
        </Inputs>
      </Container>
    </div>
  );
};

const Container = styled.div`
  width: 100vw;
  height: 100%;
  padding: 0 0 50px 0;
  z-index: 1000;
  background: rgba(1, 2, 12, 0.9);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  transition: ease-in 200ms;
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow-y: scroll;
  overflow-x: hidden;
  position: fixed;
  top: ${(props) => (props.openpage === 'false' ? 0 : '100vh')};
`;

const Header = styled.div`
  width: 100%;
  padding: 12.5px 8px;
  box-sizing: border-box;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Inputs = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  box-sizing: border-box;
  width: 100%;
  padding: 10px 15px;
  padding-bottom: 50px;
`;

const InputContainer = styled.div`
  color: #ccc;
  border-radius: 15px;
  border: 1.5px solid rgba(255, 255, 255, 0.1);
  padding: 8px;
  width: 100%;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  gap: 8px;

  h4 {
    margin: 5px 10px;
    letter-spacing: 0.5px;
  }

  .inputButton {
    padding: 8px 15px;
    border-radius: 50px;
    border: 1.5px solid rgba(255, 255, 255, 0.1);
    width: 100%;
    text-align: center;
    font-size: 14px;
    letter-spacing: 0.5px;
    font-weight: 500;
    white-space: nowrap;
    overflow: hidden;
    box-sizing: border-box;
  }
`;
