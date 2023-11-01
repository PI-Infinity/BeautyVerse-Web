import { TextField } from '@mui/material';
import React from 'react';

export const Input = ({ type, label, value, onChange, multiline, minRows }) => {
  return (
    <TextField
      id="outlined-basic"
      label={label}
      variant="outlined"
      value={value}
      type={type}
      multiline={multiline}
      minRows={minRows}
      onChange={(e) => onChange(e.target.value)}
      sx={{
        width: '70%',
        '& .MuiOutlinedInput-root': {
          height: multiline ? 'auto' : '53px',
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
          letterSpacing: '0.5px',
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
