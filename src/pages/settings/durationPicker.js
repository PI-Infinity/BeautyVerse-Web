import { Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import React, { useEffect, useState } from 'react';

export const DurationPicker = ({ duration, value, setValue, setDuration }) => {
  const [transition, setTransition] = useState(true);
  useEffect(() => {
    setTransition(false);
  }, []);
  // Generate time duration options
  const generateDurations = () => {
    const durations = [];
    for (let i = 0; i <= 12; i++) {
      if (i === 0) {
        durations.push({ label: '15 min', value: 15 });
        durations.push({ label: '30 min', value: 30 });
        durations.push({ label: '45 min', value: 45 });
      } else {
        const hourLabel = i === 1 ? 'hour' : 'hours';
        durations.push({ label: `${i} ${hourLabel}`, value: i * 60 });
        durations.push({ label: `${i}:15 ${hourLabel}`, value: i * 60 + 15 });
        durations.push({ label: `${i}:30 ${hourLabel}`, value: i * 60 + 30 });
        durations.push({ label: `${i}:45 ${hourLabel}`, value: i * 60 + 45 });
      }
    }
    return durations;
  };

  // Function to handle the change of the select value
  const handleChange = (event) => {
    const updatedDuration = generateDurations().find(
      (d) => d.value.toString() === event.target.value
    );
    console.log(updatedDuration);
    if (updatedDuration) {
      let updatedList = value.map((item) => {
        console.log(item?.value);
        if (item.value === duration.item.value) {
          return { ...item, duration: updatedDuration.value };
        }
        return item;
      });
      console.log(updatedList);
      setValue(updatedList);
    }
    setTransition(true);
    setTimeout(() => {
      setDuration(false);
    }, 300);
  };
  return (
    <div
      onClick={() => {
        setTransition(true);
        setTimeout(() => {
          setDuration(false);
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
        }}
      >
        <FormControl fullWidth style={{ margin: '20px 0' }}>
          <InputLabel id="duration-label" sx={{ color: '#888' }}>
            Duration
          </InputLabel>
          <Select
            labelId="duration-label"
            id="duration-select"
            value={`${duration?.item?.duration}` || ''}
            label="Add Procedure's duration..."
            onChange={handleChange}
            sx={{
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
              '& .MuiSelect-select': {
                borderRadius: '15px',
                color: '#ccc',
                '&:focus': {
                  borderRadius: '15px',
                },
              },
            }}
          >
            {/* Map your durations to menu items */}
            {generateDurations().map((duration, index) => (
              <MenuItem key={index} value={duration.value.toString()}>
                {duration.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </div>
    </div>
  );
};
