import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import { BiSolidImage, BiSolidVideos } from 'react-icons/bi';

export const TextEditor = ({ text, setText, language }) => {
  const [addCounter, setAddCounter] = useState(false);
  const maxLength = 600;

  const handleTextChange = (e) => {
    const inputText = e.target.value;
    if (inputText.length <= maxLength) {
      setText(inputText);
    }
  };

  return (
    <div
      style={{
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        margin: '25px 0 0 0',
        zIndex: 0,
      }}
    >
      <TextField
        id="outlined-multiline-static"
        label={`${language?.language?.Main?.filter?.typeHere} ${
          addCounter ? text.length : ''
        }${addCounter ? '/' : ''}${addCounter ? maxLength : ''} `}
        multiline
        minRows={5}
        variant="outlined"
        value={text}
        type="text"
        onChange={handleTextChange}
        onFocus={() => setAddCounter(true)}
        onBlur={() => setAddCounter(false)}
        sx={{
          width: '90%',
          '& .MuiOutlinedInput-root': {
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
            // borderRadius: '15px',
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
        inputProps={{ maxLength: maxLength }}
      />
    </div>
  );
};
