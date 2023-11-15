import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Language } from '../../context/language';
import { MdArrowDropDown } from 'react-icons/md';
import { Input } from './input';
import { BounceLoader } from 'react-spinners';

const Variants = ({
  setIsModalVisible,
  isModalVisible,
  setVariants,
  variants,
  currentProduct,
}) => {
  const [loading, setLoading] = useState(true);
  // language state
  const language = Language();

  // currentuser
  const currentUser = useSelector((state) => state.storeUser.currentUser);

  // defines baclend url
  const backendUrl = useSelector((state) => state.storeApp.backendUrl);

  // search state
  const [search, setSearch] = useState('');
  const [list, setList] = useState([]);

  // add category function
  const handleCategoryPress = (variantValue) => {
    if (!variants?.some((i) => i._id === variantValue?._id)) {
      setVariants((prevvariants) => [...prevvariants, variantValue]);
    } else {
      setVariants((prev) =>
        prev?.filter((itm) => itm._id !== variantValue._id)
      );
    }
  };

  /**
   * get user products
   */
  useEffect(() => {
    const GetUserProducts = async () => {
      // setLoading(true);
      try {
        const response = await axios.get(
          backendUrl +
            '/api/v1/marketplace/' +
            currentUser._id +
            '/products?page=1limit=20&search=' +
            search +
            '&from=settings'
        );
        if (response.data.data.products) {
          setList(response.data.data.products);
          setLoading(false);
        }
      } catch (error) {
        console.log('Error fetching user products:', error);
      }
    };

    try {
      if (currentUser) {
        GetUserProducts();
      }
    } catch (error) {
      console.log('Error in useEffect:', error);
    }
  }, [search]);

  return (
    <div
      style={{
        background: 'rgba(1, 2, 12, 0.2)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        zIndex: 100100,
        width: '100vw',
        height: '100%',
        position: 'fixed',
        top: '0',
        left: '0',
      }}
    >
      <div
        style={{
          width: '100%',
          height: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          paddingTop: '20px',
          gap: '15px',
        }}
      >
        <div
          style={{ width: '100%', display: 'flex', justifyContent: 'center' }}
          onClick={() => setIsModalVisible(false)}
        >
          <MdArrowDropDown size={30} color="#f866b1" />
        </div>
        <div style={{ padding: '0 15px', width: '100%' }}>
          <div
            style={{
              width: '100%',
              height: '40px',
              borderRadius: '50px',
              boxSizing: 'border-box',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '0 15px',
            }}
          >
            <Input
              value={search}
              label="Search..."
              width={search?.length > 0 ? '95%' : '100%'}
              height="100%"
              onChange={setSearch}
            />
            {search?.length > 0 && (
              <div onClick={() => setSearch('')}>
                <span style={{ color: 'red' }}>X</span>
              </div>
            )}
          </div>
        </div>
        {loading ? (
          <BounceLoader color="#f866b1" size={22} loading={loading} />
        ) : (
          <div
            style={{
              width: '100%',
              overflowY: 'scroll',
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
              padding: '0 25px 50px 25px',
              boxSizing: 'border-box',
            }}
          >
            {list?.length > 0 ? (
              list?.map((i, x) => {
                if (i._id === currentProduct?._id) {
                  return;
                }
                let isDefined = variants?.find((it) => it._id === i._id);

                return (
                  <div
                    key={i._id}
                    style={{
                      borderWidth: `1.5 px solid ${
                        isDefined ? '#f866b1' : 'rgba(255,255,255,0.1)'
                      }`,
                      borderRadius: '50px',
                      display: 'flex',

                      alignItems: 'center',
                      gap: '15px',
                      padding: '8px',
                    }}
                    onClick={() => handleCategoryPress(i)}
                  >
                    <img
                      src={i.gallery[i.cover].url}
                      style={{
                        height: '40px',
                        width: '40px',
                        borderRadius: '50px',
                      }}
                    />
                    <span
                      style={{
                        color: isDefined ? '#f866b1' : '#ccc',
                        fontSize: '16px',
                        letterSpacing: '0.3px',
                        fontWeight: 'bold',
                      }}
                    >
                      {i.title}
                    </span>
                  </div>
                );
              })
            ) : (
              <div
                style={{
                  width: '100%',
                  display: 'flex',
                  justifyContent: 'center',
                  marginTop: '50px',
                }}
              >
                <span style={{ color: '#888' }}>No products found!</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Variants;
