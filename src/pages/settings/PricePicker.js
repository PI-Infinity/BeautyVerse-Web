import {
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  TextField,
  Button,
} from '@mui/material';
import React, { useEffect, useState } from 'react';

export const PricePicker = ({ price, value, setValue, setPrice }) => {
  const [priceInput, setPriceInput] = useState(null);
  const [transition, setTransition] = useState(true);
  useEffect(() => {
    setPriceInput(price.item.price);
    setTransition(false);
  }, []);

  // Function to handle the change of the select value
  const handleChange = (event) => {
    if (event) {
      let updatedList = value.map((item) => {
        if (item.value === price.item.value) {
          return { ...item, price: event };
        }
        return item;
      });
      setValue(updatedList);
    }
    setTransition(true);
    setTimeout(() => {
      setPrice(false);
    }, 300);
  };
  return (
    <div
      onClick={() => {
        setTransition(true);
        setTimeout(() => {
          setPrice(false);
        }, 300);
      }}
      style={{
        background: 'red',
        position: 'fixed',
        left: 0,
        top: '0',
        width: '100%',
        height: '100vh',
        boxSizing: 'border-box',
        padding: '10vw',
        background: 'rgba(1, 2, 12, 0.3)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1002,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: 'rgba(255,255,255,0.1)',
          width: '80%',
          boxSizing: 'border-box',
          padding: '7.5vw',
          borderRadius: '20px',
          position: 'fixed',
          top: transition ? '100vh' : '30vh',
          transition: 'ease-in 200ms',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <FormControl fullWidth style={{ margin: '20px 0', display: 'flex' }}>
          <TextField
            id="outlined-basic"
            label="Price"
            variant="outlined"
            type="number"
            value={priceInput}
            onChange={(e) => setPriceInput(e.target.value)}
            sx={{
              width: '100%',
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
        </FormControl>
        {priceInput > 0 && (
          <Button
            variant="contained"
            style={{
              backgroundColor: '#f866b1',
              color: 'white',
            }}
            className="button"
            sx={{
              width: priceInput < 1 ? '0' : '40%',
              borderRadius: '50px',
              transition: 'ease-in-out 200ms',
              transform: `scale(${priceInput < 1 ? 0 : 1})`,
              opacity: priceInput < 1 ? 0 : 1,
              height: priceInput < 1 ? '0' : '40px',
              margin: priceInput < 1 ? '0' : '10px 0 0 0',
              cursor: 'pointer',
            }}
            onClick={() => handleChange(priceInput)}
          >
            Save
          </Button>
        )}
      </div>
    </div>
  );
};
