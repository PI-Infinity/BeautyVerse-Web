import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react';
import {
  IoMdArrowDropdown,
  IoMdArrowDropleft,
  IoMdArrowDropright,
} from 'react-icons/io';
import { useDispatch, useSelector } from 'react-redux';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { ProceduresOptions } from '../../datas/registerDatas';
import { setOpenedProduct } from '../../redux/marketplace';
import { Search } from './search';
import { BounceLoader } from 'react-spinners';
import { AiFillEye, AiFillEyeInvisible } from 'react-icons/ai';
import { MdAdd } from 'react-icons/md';
import { AddProduct } from './addProduct';
import { EditProduct } from './editProduct';
import { CategoriesOptions } from '../../datas/productCategories';
import { Language } from '../../context/language';

export const Products = ({ activePage, setActivePage }) => {
  // navigate
  const navigate = useNavigate();
  // location
  const location = useLocation();
  // dispatch
  const dispatch = useDispatch();
  // language
  const language = Language();

  useEffect(() => {
    // Disable body scroll when the component is open
    if (activePage) {
      document.body.style.overflowY = 'hidden';
    }

    return () => {
      // Re-enable body scroll when the component is closed
      document.body.style.overflowY = 'visible';
    };
  }, [activePage]);

  // transition
  const [transition, setTransition] = useState(true);

  useEffect(() => {
    setTransition(false);
  }, []);

  // loading state
  const [loading, setLoading] = useState(true);

  // get current user
  const currentUser = useSelector((state) => state.storeUser.currentUser);

  // get user products
  const backendUrl = useSelector((state) => state.storeApp.backendUrl);

  // product list
  const [list, setList] = useState([]);

  // search state
  const [search, setSearch] = useState('');

  // get data page
  const [page, setPage] = useState(1);

  // categories
  const categoryList = CategoriesOptions();

  // rerender products list
  const rerenderProducts = useSelector(
    (state) => state.storeShowroom.rerenderProducts
  );

  useEffect(() => {
    const GetUserProducts = async () => {
      try {
        const response = await axios.get(
          backendUrl +
            '/api/v1/marketplace/' +
            currentUser._id +
            '/products?page=1&search=' +
            search +
            '&from=settings' +
            '&check=' +
            currentUser._id
        );
        if (response.data.data.products) {
          console.log(response.data.data.products);
          setPage(1);
          setList(response.data.data.products);
          setLoading(false);
        }
      } catch (error) {
        console.log(error.response);
      }
    };

    if (currentUser?._id) {
      GetUserProducts();
    }
  }, [rerenderProducts, search]);

  const AddUserProducts = async (p) => {
    // Helper function to merge two arrays while ensuring uniqueness based on _id
    try {
      const response = await axios.get(
        backendUrl +
          '/api/v1/marketplace/' +
          currentUser._id +
          '/products?page=' +
          parseInt(page + 1) +
          '&search=' +
          search +
          '&from=settings' +
          '&check=' +
          currentUser._id
      );
      if (response.data.data.products?.length > 0) {
        const newProducts = response.data.data.products;
        setList((prev) => {
          return newProducts.reduce((acc, curr) => {
            const existingProductIndex = acc.findIndex(
              (product) => product._id === curr._id
            );
            if (existingProductIndex !== -1) {
              // User already exists, merge the data
              const mergedUser = { ...acc[existingProductIndex], ...curr };
              return [
                ...acc.slice(0, existingProductIndex),
                mergedUser,
                ...acc.slice(existingProductIndex + 1),
              ];
            } else {
              // User doesn't exist, add to the end of the array
              return [...acc, curr];
            }
          }, prev);
        });
      } else {
        setPage(page);
      }
    } catch (error) {
      console.log('Error fetching user products:', error);
    }
  };

  const scrollRef = useRef();

  const handleScroll = async () => {
    if (scrollRef.current) {
      const { scrollTop, clientHeight, scrollHeight } = scrollRef.current;

      // Check if the user has scrolled to the bottom of the container
      if (scrollTop + clientHeight >= scrollHeight - 200) {
        await AddUserProducts(page + 1);
      }
    }
  };

  useEffect(() => {
    const container = scrollRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
    }

    // Cleanup function to remove the event listener
    return () => {
      if (container) {
        container.removeEventListener('scroll', handleScroll);
      }
    };
  }, [page, handleScroll]);

  /**
   * add and edit product states
   */
  const [openAddProduct, setOpenAddProduct] = useState(false);
  const [openEditProduct, setOpenEditProduct] = useState({
    active: false,
    product: null,
  });

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
      }}
    >
      {openAddProduct && (
        <AddProduct
          openAddProduct={openAddProduct}
          setOpenAddProduct={setOpenAddProduct}
        />
      )}
      {openEditProduct?.active && (
        <EditProduct
          setList={setList}
          openEditProduct={openEditProduct}
          setOpenEditProduct={setOpenEditProduct}
          setProducts={setList}
        />
      )}
      <Container ref={scrollRef} openpage={transition ? 'true' : 'false'}>
        <Header>
          <div
            onClick={() => {
              setTransition(true);
              setTimeout(() => {
                setActivePage({ active: false, page: null, data: null });
              }, 300);
            }}
            style={{
              padding: '5px',

              zIndex: 1000,
            }}
          >
            <IoMdArrowDropleft size={30} color="#f866b1" />
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
              {language?.language?.User?.userPage?.products}
            </h3>
          </div>
          <div
            style={{ width: '40px', display: 'flex', alignItems: 'center' }}
            onClick={() => setOpenAddProduct(true)}
          >
            <MdAdd color="#f866b1" size={24} />
          </div>
        </Header>
        <div style={{ width: '100%', margin: '0 0 15px 0' }}>
          <Search search={search} setSearch={setSearch} />
        </div>
        {loading ? (
          <div
            style={{
              width: '100%',
              height: '500px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <BounceLoader color="#f866b1" size={30} />
          </div>
        ) : (
          <ListContainer>
            {list.filter(
              (i) =>
                i?.title.toLowerCase().includes(search?.toLocaleLowerCase()) ||
                i?.brand.toLowerCase().includes(search?.toLocaleLowerCase()) ||
                i?.categories?.some((it) =>
                  it.toLowerCase().includes(search?.toLocaleLowerCase())
                )
            ).length > 0 ? (
              list
                .filter(
                  (i) =>
                    i?.title
                      .toLowerCase()
                      .includes(search?.toLocaleLowerCase()) ||
                    i?.brand
                      .toLowerCase()
                      .includes(search?.toLocaleLowerCase()) ||
                    i?.categories?.some((it) =>
                      it.toLowerCase().includes(search?.toLocaleLowerCase())
                    )
                )
                .map((item, index) => {
                  let label = categoryList?.find(
                    (i, x) =>
                      i?.value?.toLowerCase() ===
                      item?.categories[0]?.toLowerCase()
                  )?.label;
                  return (
                    <ProductItem
                      key={index}
                      onClick={() => {
                        setOpenEditProduct({ active: true, product: item });
                      }}
                    >
                      <div
                        style={{
                          width: '32vw',
                          aspectRatio: 1,
                          borderRadius: '15px',
                          objectFit: 'cover',
                          background: 'rgba(255,255,255,0.05)',
                          overflow: 'hidden',
                        }}
                      >
                        <img
                          src={item?.gallery[item?.cover]?.url}
                          style={{
                            width: '100%',
                            aspectRatio: 1,
                            borderRadius: '15px',
                            objectFit: 'cover',
                            opacity: 1,
                            transition: 'ease-in 500ms',
                          }}
                          // onLoad={() => setOpacity(true)}
                        />
                      </div>
                      <div
                        style={{
                          height: '100%',
                          color: '#ccc',
                          letterSpacing: '0.5px',
                          width: '60vw',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                        }}
                      >
                        <div
                          style={{
                            width: '100%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                          }}
                        >
                          <h3 style={{ margin: '8px 0', fontSize: '16px' }}>
                            {item?.title}
                          </h3>
                          {item?.active ? (
                            <AiFillEye color="#f866b1" size={22} />
                          ) : (
                            <AiFillEyeInvisible color="#888" size={22} />
                          )}
                        </div>
                        <p style={{ margin: '8px 0', fontSize: '14px' }}>
                          {item.brand}
                        </p>
                        <p style={{ margin: '8px 0', fontSize: '14px' }}>
                          {label}
                        </p>
                        <div
                          style={{
                            display: 'flex',
                            gap: '10px',
                            fontSize: '16px',
                          }}
                        >
                          <p
                            style={{
                              margin: '8px 0',
                              fontWeight: 'bold',
                              color: '#f866b1',
                            }}
                          >
                            {item?.sale
                              ? (
                                  item?.price -
                                  (item.price / 100) * item.sale
                                ).toFixed(2)
                              : item.price}{' '}
                            {item?.owner?.currency}
                          </p>
                          {item?.sale && (
                            <p
                              style={{
                                margin: '8px 0',
                                textDecorationLine: 'line-through',
                                color: '#888',
                                fontWeight: 'bold',
                              }}
                            >
                              {item?.price} {item?.owner.currency}
                            </p>
                          )}
                        </div>
                      </div>
                    </ProductItem>
                  );
                })
            ) : (
              <div
                style={{
                  width: '100%',
                  height: '300px',
                  color: 'rgba(255,255,255,0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  letterSpacing: '0.5px',
                  fontWeight: 500,
                }}
              >
                Not found!
              </div>
            )}
            <Outlet />
          </ListContainer>
        )}
      </Container>
    </div>
  );
};

const Container = styled.div`
  width: 100vw;
  height: 100%;
  padding: 0 0 50px 0;
  z-index: 1000;
  background: rgba(1, 2, 12, 0.3);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  transition: ease-in 200ms;
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow-y: scroll;
  overflow-x: hidden;
  position: fixed;
  left: ${(props) => (props.openpage === 'false' ? 0 : '100vw')};
`;

const Header = styled.div`
  width: 100%;
  padding: 12.5px 8px;
  box-sizing: border-box;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const ListContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  padding: 0 0 30px 0;
`;

const ProductItem = styled.div`
  width: 90%;
  padding: 8px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 20px;
  margin: 0 5%;
  display: flex;
  align-items: center;
  gap: 15px;

  &:hover {
    opacity: 0.9;
  }
`;
