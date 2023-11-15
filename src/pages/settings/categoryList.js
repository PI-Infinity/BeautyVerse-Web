import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { BounceLoader } from 'react-spinners';
import { Language } from '../../context/language';
import { darkTheme, lightTheme } from '../../context/theme';
import { CategoriesOptions } from '../../datas/productCategories';
import { TextField } from '@mui/material';
import { ArrowDownwardOutlined } from '@material-ui/icons';

const CategoryList = ({ setCategories, categories, setOpenCategories }) => {
  // transition
  const [transition, setTransition] = useState(true);
  useEffect(() => {
    setTransition(false);
  }, []);
  // categories list of app
  const categoriesList = CategoriesOptions();
  const [loading, setLoading] = useState(true);
  // language state
  const language = Language();
  // theme state
  const theme = useSelector((state) => state.storeApp.theme);
  const currentTheme = theme ? darkTheme : lightTheme;

  // search state
  const [search, setSearch] = useState('');

  // add category function
  const handleCategoryPress = (categoryValue) => {
    if (!categories.includes(categoryValue)) {
      setCategories((prevCategories) => [...prevCategories, categoryValue]);
    } else {
      setCategories((prev) => prev?.filter((itm) => itm !== categoryValue));
    }
  };

  // split categoris
  // split procedures value to find label
  const splited = categoriesList.filter(
    (i) => i.value?.split('-')?.length !== 1
  );

  useEffect(() => {
    setLoading(false);
  }, []);
  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        zIndex: 10000,
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        background: 'rgba(0,0,0,0.6)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        width: '100%',
        height: '100%',
      }}
    >
      <div
        style={{
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          position: 'relative',
          top: transition ? '100vh' : '0',
          transition: 'ease-in 200ms',
        }}
      >
        <div
          style={{ color: '#f866b1', margin: '30px 0 0 0' }}
          onClick={() => {
            setTransition(true);
            setTimeout(() => {
              setOpenCategories(false);
            }, 300);
          }}
        >
          <ArrowDownwardOutlined />
        </div>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            width: '90%',
            padding: '15px',
            paddingHorizontal: '20px',
            minHeight: '100vh',
          }}
        >
          {loading ? (
            <BounceLoader size={30} color={currentTheme.pink} />
          ) : (
            <div
              style={{
                width: '100%',
                height: '90vh',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '10px',
                overflowY: 'scroll',
                padding: '10px 0 30px 0',
              }}
            >
              <TextField
                id="outlined-basic"
                variant="outlined"
                type="text"
                value={search}
                label={language?.language?.Marketplace?.marketplace?.search}
                onChange={(e) => setSearch(e.target.value)}
                sx={{
                  width: '90%',
                  '& .MuiOutlinedInput-root': {
                    height: '53px',
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'rgba(255,255,255,0.1)',
                      borderRadius: '15px',
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#f866b1',
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#f866b1',
                    },
                  },
                  '& .MuiOutlinedInput-input': {
                    borderRadius: '15px',
                    color: '#ccc',
                  },
                  '& label': {
                    color: '#888',
                    fontSize: '14px',
                    letterSpacing: '0.5px',
                  },
                  '& label.Mui-focused': {
                    color: '#ccc',
                    fontSize: '14px',
                    letterSpacing: '0.5px',
                  },
                }}
              />

              {splited

                ?.filter((item) =>
                  item.label?.toLowerCase()?.includes(search?.toLowerCase())
                )
                ?.map((i, x) => {
                  let isDefined = categories?.find(
                    (it) => it?.toLowerCase() === i.value?.toLowerCase()
                  );

                  return (
                    <div
                      key={i.value}
                      style={{
                        textAlign: 'center',
                        border: '1.5px solid rgba(255,255,255,0.1)',
                        width: '95%',
                        padding: '5px',
                        borderRadius: '50px',
                        boxSizing: 'border-box',
                      }}
                      onClick={() => handleCategoryPress(i.value)}
                    >
                      <span
                        style={{
                          color: isDefined ? '#f866b1' : '#ccc',
                          fontSize: '16px',
                          letterSpacing: '0.3px',
                        }}
                      >
                        {i.label}
                      </span>
                    </div>
                  );
                })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CategoryList;
