import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ProductCard } from '../../../marketplace/pages/market/components/productCard';
import styled from 'styled-components';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { BounceLoader } from 'react-spinners';
import { Search } from '../../../marketplace/pages/search/search';
import Headroom from 'react-headroom';
import { Header } from './header';
import { Filter } from './filter';
import { BsListUl } from 'react-icons/bs';
import { setScrollYMarketplaceSearch } from '../../../../redux/marketplace';

const SearchList = () => {
  const location = useLocation();

  // fo to saved scroll y position
  const scrollYPosition = useSelector(
    (state) => state.storeMarketplace.scrollYSearch
  );

  useEffect(() => {
    window.scrollTo(0, scrollYPosition);
  }, []);

  const [loading, setLoading] = useState(true);

  const [list, setList] = useState([]);
  const [categories, setCategories] = useState([]);
  const [brandsList, setBrandsList] = useState([]);

  const [search, setSearch] = useState('');

  // filter states
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [categoryFilter, setCategoryFilter] = useState([]);
  const [discounts, setDiscounts] = useState('');
  const [type, setType] = useState('everyone');
  const [sex, setSex] = useState('all');
  const [brands, setBrands] = useState('');

  let minPriceTotal = minPrice === '' ? 0 : 1;
  let maxPriceTotal = maxPrice === '' ? 0 : 1;
  let typeTotal = type === 'everyone' ? 0 : 1;
  let sexTotal = sex === 'all' ? 0 : 1;
  let brandTotal = brands.length < 1 ? 0 : 1;
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

  useEffect(() => {
    const GetProducts = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          backendUrl +
            '/api/v1/marketplace?limit=8&search=' +
            search +
            '&categories=' +
            categoryFilter +
            '&brand=' +
            brands +
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
            '&from=search'
        );
        if (response.data.data.products?.random?.length > 0) {
          setList(response.data.data.products.random);
          setCategories(response.data.categories);
          setBrandsList(response.data.brands);
        }
      } catch (error) {
        console.log(error.response);
      }
    };
    GetProducts();

    setTimeout(() => {
      setLoading(false);
    }, 300);
  }, [
    search,
    categoryFilter,
    type,
    minPrice,
    maxPrice,
    brands,
    discounts,
    sex,
  ]);

  // dispatch
  const dispatch = useDispatch();

  // defines baclend url
  const backendUrl = useSelector((state) => state.storeApp.backendUrl);

  //  pages
  const [page, setPage] = useState(1);

  // add products on scroll
  const AddProducts = async (p) => {
    try {
      const response = await axios.get(
        backendUrl +
          '/api/v1/marketplace?limit=8&search=' +
          search +
          '&page=' +
          p +
          '&categories=' +
          categoryFilter +
          '&brand=' +
          brands +
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
          '&from=search'
      );

      const newProducts = response.data.data.products.random;

      if (newProducts?.length > 0) {
        setList((prev) => {
          // Filter out new products that are already in the previous list
          const filteredNewProducts = newProducts.filter(
            (newProduct) =>
              !prev.some((prevProduct) => prevProduct._id === newProduct._id)
          );

          // Return the merged array
          return [...prev, ...filteredNewProducts];
        });

        setPage(p);
      }
    } catch (error) {
      console.log('Error fetching user products:', error);
    }
  };

  useEffect(() => {
    const handleScroll = async () => {
      const { scrollY, innerHeight } = window;
      const { scrollHeight } = document.documentElement;

      dispatch(setScrollYMarketplaceSearch(scrollY));

      if (scrollY + innerHeight >= scrollHeight) {
        await AddProducts(page + 1);
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [minPrice, maxPrice, categoryFilter, brands, discounts, type, sex]);

  // open filter window
  const [openFilter, setOpenFilter] = useState(
    location.state === 'search'
      ? false
      : location.state === 'filter'
      ? true
      : false
  );

  return (
    <Container>
      <Headroom downTolerance={10} upTolerance={10} styles={{ zIndex: 1000 }}>
        <Header />
      </Headroom>
      <ContentContainer>
        <div
          style={{
            margin: '16px 0 0 0',
            width: '100%',
            display: 'flex',
            justifyContent: 'flex-end',
          }}
        >
          <Search
            search={search}
            setSearch={setSearch}
            openFilter={openFilter}
            setOpenFilter={setOpenFilter}
            total={total}
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
              brands={brandsList}
              brand={brands}
              setBrands={setBrands}
              categoryFilter={categoryFilter}
              setCategoryFilter={setCategoryFilter}
              minPrice={minPrice}
              setMinPrice={setMinPrice}
              maxPrice={maxPrice}
              setMaxPrice={setMaxPrice}
              discounts={discounts}
              setDiscounts={setDiscounts}
              sex={sex}
              setSex={setSex}
              type={type}
              setType={setType}
              total={total}
            />
          </div>
        </>
        {/* )} */}
        {loading ? (
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              width: '100%',
              height: '100vh',
              marginTop: '15px',
            }}
          >
            <BounceLoader color={'#f866b1'} loading={loading} size={35} />
          </div>
        ) : (
          <ListContainer>
            {list?.length > 0 ? (
              list?.map((item, index) => {
                return (
                  <ProductCard
                    item={item}
                    key={index}
                    to={`/marketplace/search/${item._id}`}
                  />
                );
              })
            ) : (
              <div
                style={{
                  width: 'calc(100vw - 30px)',
                  height: '200px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'rgba(255,255,255,0.3)',
                }}
              >
                <p>Not found!</p>
              </div>
            )}
          </ListContainer>
        )}
        <Outlet />
      </ContentContainer>
    </Container>
  );
};

export default SearchList;

const Container = styled.div`
  width: 100%;
  height: 100%;
  overflow: hidden;
`;

const ContentContainer = styled.div`
  min-height: 100vh;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  padding: 0 0 50px 0;
  transition: ease-in-out 200ms;

  ::-webkit-scrollbar {
    display: none !important;
  }
`;

const ListContainer = styled.div`
  width: 100%;
  box-sizing: border-box;
  display: grid;
  grid-template-columns: 1fr 1fr;
  padding: 0 15px 15px 15px;
  gap: 15px;
`;
