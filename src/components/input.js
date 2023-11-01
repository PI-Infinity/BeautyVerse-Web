import { TextField } from '@mui/material';
import React from 'react';

export const Input = ({ type, label, value, onChange }) => {
  return (
    <TextField
      id="outlined-basic"
      label="Password"
      variant="outlined"
      value={password}
      type={showPassword ? 'text' : 'password'}
      onChange={(e) => setPassword(e.target.value)}
      sx={{
        width: '75%',
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
  );
};
