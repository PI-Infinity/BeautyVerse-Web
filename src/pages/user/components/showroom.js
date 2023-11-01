import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import {
  useLocation,
  useNavigate,
  useOutletContext,
  Outlet,
} from 'react-router-dom';
import { setLoading, setScrollYUser } from '../../../redux/user';
import { BounceLoader } from 'react-spinners';
import { ProceduresOptions } from '../../../datas/registerDatas';
import { setOpenedProduct } from '../../../redux/marketplace';
import { Search } from './showroomSearch';
import { AddList, setSearch } from '../../../redux/showroom';
import { Filter } from './showroomFilter';
import {
  setPage,
  setList,
  setCategoriesList,
  setBrandsList,
} from '../../../redux/showroom';

const Showroom = () => {
  // get outlet props context
  const [targetUser] = useOutletContext();

  // navigate
  const navigate = useNavigate();

  // location
  const location = useLocation();

  // redux dispatch
  const dispatch = useDispatch();

  // loading state
  const [productsLoading, setProductsLoading] = useState(true);

  // categories
  const categoryList = ProceduresOptions();

  // get user products
  const backendUrl = useSelector((state) => state.storeApp.backendUrl);

  // State for minimum and maximum price range
  const search = useSelector((state) => state.storeShowroom.search);
  const minPrice = useSelector((state) => state.storeShowroom.minPrice);
  const maxPrice = useSelector((state) => state.storeShowroom.maxPrice);
  const categoryFilter = useSelector((state) => state.storeShowroom.categories);
  const discounts = useSelector((state) => state.storeShowroom.discounts);
  const type = useSelector((state) => state.storeShowroom.type);
  const sex = useSelector((state) => state.storeShowroom.sex);
  const brand = useSelector((state) => state.storeShowroom.brands);

  //
  const page = useSelector((state) => state.storeShowroom.page);
  const list = useSelector((state) => state.storeShowroom.list);
  const brands = useSelector((state) => state.storeShowroom.brandsList);
  const categories = useSelector((state) => state.storeShowroom.categoriesList);

  useEffect(() => {
    const GetUserProducts = async () => {
      try {
        const response = await axios.get(
          backendUrl +
            '/api/v1/marketplace/' +
            targetUser._id +
            '/products?page=1&limit=6&search=' +
            search +
            '&categories=' +
            categoryFilter +
            '&brand=' +
            brand +
            '&discounts=' +
            discounts +
            '&minPrice=' +
            minPrice +
            '&maxPrice=' +
            maxPrice +
            '&sex=' +
            sex +
            '&type=' +
            type +
            '&from=showroom' +
            '&check='
        );
        if (response.data.data.products) {
          dispatch(setPage(1));
          dispatch(setList(response.data.data.products));
          dispatch(setCategoriesList(response.data.categories));
          dispatch(setBrandsList(response.data.brands));
          dispatch(setLoading(false));
          setProductsLoading(false);
        }
      } catch (error) {
        console.log(error.response);
      }
    };

    try {
      if (targetUser?._id) {
        GetUserProducts();
      }
    } catch (error) {
      console.log('Error in useEffect:', error);
    }
  }, [
    // rerenderProducts,
    search,
    categoryFilter,
    sex,
    type,
    minPrice,
    maxPrice,
    brand,
    discounts,
    targetUser,
  ]);

  const AddUserProducts = async (p) => {
    // Helper function to merge two arrays while ensuring uniqueness based on _id
    try {
      const response = await axios.get(
        backendUrl +
          '/api/v1/marketplace/' +
          targetUser._id +
          `/products?page=${p}&limit=6&search=` +
          search +
          '&categories=' +
          categoryFilter +
          '&brand=' +
          brand +
          '&discounts=' +
          discounts +
          '&minPrice=' +
          minPrice +
          '&maxPrice=' +
          maxPrice +
          '&sex=' +
          sex +
          '&type=' +
          type +
          '&from=showroom' +
          '&check='
      );
      if (response.data.data.products) {
        const newProducts = response.data.data.products;
        dispatch(AddList(newProducts));
        dispatch(setCategoriesList(response.data.categories));
        dispatch(setBrandsList(response.data.brands));
        dispatch(setPage(p));
      }
    } catch (error) {
      console.log('Error fetching user products:', error);
    }
  };

  useEffect(() => {
    const handleScroll = async () => {
      const { scrollY, innerHeight } = window;
      const { scrollHeight } = document.documentElement;

      dispatch(setScrollYUser(scrollY));

      if (scrollY + innerHeight >= scrollHeight - 200) {
        await AddUserProducts(page + 1);
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [
    search,
    targetUser,
    categoryFilter,
    sex,
    type,
    minPrice,
    maxPrice,
    brand,
    discounts,
    page,
  ]);

  // badge options

  // const [total, setTotal] = useState(0);
  let minPriceTotal = minPrice === '' ? 0 : 1;
  let maxPriceTotal = maxPrice === '' ? 0 : 1;
  let typeTotal = type === 'everyone' ? 0 : 1;
  let sexTotal = sex === 'all' ? 0 : 1;
  let brandTotal = brand.length < 1 ? 0 : 1;
  let categoryTotal = categoryFilter?.length < 1 ? 0 : 1;
  let discountsTotal = discounts?.length < 1 ? 0 : 1;

  let total =
    minPriceTotal +
    maxPriceTotal +
    typeTotal +
    sexTotal +
    brandTotal +
    discountsTotal +
    categoryTotal;

  // fade in product image
  const [opacity, setOpacity] = useState(false);

  // open filter
  const [openFilter, setOpenFilter] = useState(false);

  return (
    <Container>
      <div style={{ margin: '8px 0', width: '100%' }}>
        <Search
          search={search}
          setSearch={setSearch}
          total={total}
          openFilter={openFilter}
          setOpenFilter={setOpenFilter}
        />
      </div>
      {/* {openFilter && ( */}
      <>
        <div
          style={{
            width: '100%',
            position: 'relative',
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          <Filter
            openFilter={openFilter}
            setOpenFilter={setOpenFilter}
            categories={categories}
            brands={brands}
            brand={brands}
            categoryFilter={categoryFilter}
            minPrice={minPrice}
            maxPrice={maxPrice}
            discounts={discounts}
            sex={sex}
            type={type}
            total={total}
          />
        </div>
      </>
      {productsLoading ? (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100vw',
            height: '37vh',
          }}
        >
          <BounceLoader color={'#f866b1'} loading={productsLoading} size={50} />
        </div>
      ) : (
        <ListContainer>
          {list.map((item, index) => {
            let label = categoryList?.find(
              (i, x) =>
                i?.value?.toLowerCase() === item?.categories[0]?.toLowerCase()
            ).label;
            return (
              <ProductItem
                key={index}
                onClick={() => {
                  dispatch(setOpenedProduct(item));
                  if (location.pathname?.startsWith('/profile')) {
                    navigate(`/profile/showroom/${item._id}`);
                  } else {
                    navigate(
                      `/${location.pathname.split('/')[1]}/user/${
                        targetUser?._id
                      }/showroom/${item._id}`
                    );
                  }
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
                    src={item?.gallery[0]?.url}
                    style={{
                      width: '100%',
                      aspectRatio: 1,
                      borderRadius: '15px',
                      objectFit: 'cover',
                      opacity: opacity ? 1 : 0,
                      transition: 'ease-in 500ms',
                    }}
                    onLoad={() => setOpacity(true)}
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
                  <h3 style={{ margin: '8px 0', fontSize: '16px' }}>
                    {item?.title}
                  </h3>
                  <p style={{ margin: '8px 0', fontSize: '14px' }}>
                    {item.brand}
                  </p>
                  <p style={{ margin: '8px 0', fontSize: '14px' }}>{label}</p>
                  <div
                    style={{ display: 'flex', gap: '10px', fontSize: '16px' }}
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
          })}
        </ListContainer>
      )}
      <Outlet />
    </Container>
  );
};

export default Showroom;

const Container = styled.div`
  width: 100vw;
  height: 100%;
  box-sizing: border-box;
  padding-bottom: 40px;
`;

const ListContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
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
