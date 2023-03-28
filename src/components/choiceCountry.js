import React from 'react';
import Select from 'react-select';
import { useSelector, useDispatch } from 'react-redux';
import makeAnimated from 'react-select/animated';
import { FaGlobeEurope, FaLanguage } from 'react-icons/fa';
import { countries } from '../data/countries';
import { Button } from '../components/button';
import Error from '../snackBars/success';

const animatedComponents = makeAnimated();

const languages = [
  {
    value: 'en',
    label: 'English',
  },
  {
    value: 'ka',
    label: 'Georgian',
  },
  {
    value: 'ru',
    label: 'Russian',
  },
];

export const ChoiceCountry = () => {
  const mainDispatch = useDispatch();
  // color mode
  const theme = useSelector((state) => state.storeMain.theme);

  const [rerender, setRerender] = React.useState(false);
  const [language, setLanguage] = React.useState('');
  const [country, setCountry] = React.useState('');
  const [alert, setAlert] = React.useState(false);

  React.useEffect(() => {
    setLanguage(localStorage.getItem('BeautyVerse:Language'));
    setCountry(localStorage.getItem('BeautyVerse:Country'));
  }, [rerender]);

  const CustomStyle = {
    singleValue: (base, state) => ({
      ...base,
      color: state.isSelected
        ? theme
          ? '#333'
          : '#f3f3f3'
        : theme
        ? '#f3f3f3'
        : '#333',
      fontSize: '14px',
    }),
    placeholder: (base, state) => ({
      ...base,
      // height: "1000px",
      color: state.isSelected
        ? theme
          ? '#333'
          : '#f3f3f3'
        : theme
        ? '#f3f3f3'
        : '#333',
      maxHeight: '50px',
    }),
    input: (base, state) => ({
      ...base,
      color: theme ? '#f3f3f3' : '#333',
      fontSize: '16px',
      maxHeight: '100px',
    }),
    multiValue: (base, state) => ({
      ...base,
      backgroundColor: state.isDisabled ? null : 'lightblue',
      borderRadius: '20px',
    }),
    multiValueLabel: (base, state) => ({
      ...base,
    }),
    menuList: (base, state) => ({
      ...base,
      backgroundColor: theme ? '#333' : '#f3f3f3',
      zIndex: 1000,
    }),
    option: (base, state) => ({
      ...base,
      backgroundColor: state.isSelected
        ? theme
          ? '#f3f3f3'
          : '#333'
        : theme
        ? '#333'
        : '#f3f3f3',
      color: state.isSelected
        ? theme
          ? '#333'
          : '#f3f3f3'
        : theme
        ? '#f3f3f3'
        : '#333',
      fontSize: '14px',
    }),
    control: (baseStyles, state) => ({
      ...baseStyles,
      backgroundColor: theme ? '#333' : '#fff',
      borderColor: state.isFocused ? 'rgba(0,0,0,0)' : 'rgba(0,0,0,0.1)',
      width: '20vw',
      color: '#888',
      minHeight: '2vw',
      cursor: 'pointer',
      '@media only screen and (max-width: 1200px)': {
        width: '65vw',
        fontSize: '12px',
      },
    }),
  };
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        marginBottom: '20px',
      }}
    >
      <h2
        style={{
          color: theme ? '#fff' : '#111',
          fontSize: '24px',
          marginBottom: '30px',
        }}
      >
        Welcome Beautyverse
      </h2>
      <h3 style={{ color: theme ? '#fff' : '#111', fontSize: '14px' }}>
        აირჩიეთ ქვეყანა
      </h3>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <FaGlobeEurope size={30} color={theme ? '#fff' : '#111'} />
        <Select
          placeholder="Choice Country"
          components={animatedComponents}
          onChange={(value) => {
            localStorage.setItem(
              'BeautyVerse:Country',
              JSON.stringify(value?.value)
            );
            setRerender(!rerender);
          }}
          // value={registerFields?.categories}
          styles={CustomStyle}
          options={countries}
        />
      </div>
      <h3 style={{ color: theme ? '#fff' : '#111', fontSize: '14px' }}>
        აირჩიეთ ენა
      </h3>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <FaLanguage size={30} color={theme ? '#fff' : '#111'} />
        <Select
          placeholder="Choice Language"
          components={animatedComponents}
          onChange={(value) => {
            localStorage.setItem(
              'BeautyVerse:Language',
              JSON.stringify(value?.value)
            );
            setRerender(!rerender);
          }}
          // value={registerFields?.categories}
          styles={CustomStyle}
          options={languages}
        />
      </div>
      <div style={{ marginTop: '30px' }}>
        <Button
          title="Start"
          function={
            country?.length < 1 || country === null
              ? () =>
                  setAlert({
                    active: true,
                    title: 'Choice Country',
                  })
              : language?.length < 1 || language === null
              ? () =>
                  setAlert({
                    active: true,
                    title: 'Choice Language',
                  })
              : () => window.location.reload()
          }
        />
      </div>
      <Error
        open={alert?.active}
        setOpen={setAlert}
        type="error"
        title={alert?.title}
      />
    </div>
  );
};
