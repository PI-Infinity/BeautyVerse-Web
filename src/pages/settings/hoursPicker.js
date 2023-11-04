import React, { useEffect, useState } from 'react';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { format } from 'date-fns';
import { Button } from '@mui/material';
import dayjs from 'dayjs';

export const HoursPicker = ({
  setOpenHoursPicker,
  startingHours,
  setStartingHours,
  endingHours,
  setEndingHours,
  value,
  setValue,
  option,
}) => {
  // Function to parse duration and set initial values
  const parseAndSetDurations = () => {
    const hours = value?.find((i) => i.value === option.value).hours;
    console.log(hours);
    if (hours) {
      const [start, end] = hours?.split(' - ');
      setStartingHours(dayjs(start, 'HH:mm'));
      setEndingHours(dayjs(end, 'HH:mm'));
    }
  };

  const [transition, setTransition] = useState(true);
  useEffect(() => {
    parseAndSetDurations();
    setTransition(false);
  }, []);

  const [isStartingPickerActive, setIsStartingPickerActive] = useState(false);
  const [isEndingPickerActive, setIsEndingPickerActive] = useState(false);

  const handleFocusStartingPicker = () => {
    setIsStartingPickerActive(true);
  };

  const handleBlurStartingPicker = () => {
    setIsStartingPickerActive(false);
  };

  const handleFocusEndingPicker = () => {
    setIsEndingPickerActive(true);
  };

  const handleBlurEndingPicker = () => {
    setIsEndingPickerActive(false);
  };

  // on save function
  const OnSave = () => {
    if (endingHours) {
      let starting = startingHours?.format('HH:mm');
      let ending = endingHours?.format('HH:mm');
      let hoursString = `${starting} - ${ending}`;

      const updatedValues = value?.map((item) => {
        if (item.value === option.value) {
          return { ...item, hours: hoursString };
        } else {
          return item;
        }
      });
      setValue(updatedValues);
    }
  };

  return (
    <div
      style={{
        background: 'red',
        position: 'fixed',
        left: 0,
        top: '10vh',
        width: '100%',
        height: '90vh',
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
      onClick={() => {
        setTransition(true);
        setTimeout(() => {
          setOpenHoursPicker(null);
        }, 200);
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
        <ThemeProvider theme={theme}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DemoContainer components={['TimePicker']}>
              <TimePicker
                label="Startig hours"
                inputFormat="HH:mm"
                ampm={false}
                value={startingHours}
                onOpen={handleFocusStartingPicker}
                onClose={handleBlurStartingPicker}
                disabled={isEndingPickerActive}
                onChange={(momentDate) => {
                  setStartingHours(momentDate);
                }}
                sx={{
                  '& label': {
                    color: '#ccc',
                    fontSize: '14px',
                    letterSpacing: '0.5px',
                  },
                  '& label.Mui-focused': {
                    color: '#ccc',
                    fontSize: '14px',
                    letterSpacing: '0.5px',
                  },
                  '& .MuiOutlinedInput-input': {
                    borderRadius: '15px',
                    color: '#ccc',
                  },
                  '& .MuiOutlinedInput-root': {
                    // height: '53px',
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
                  '& .MuiButtonBase-root': {
                    // Styles for the icon button
                    color: '#f866b1', // Change the icon color here if not using a custom endAdornment
                  },
                }}
              />
            </DemoContainer>
            <DemoContainer components={['TimePicker']}>
              <TimePicker
                label="Ending hours"
                inputFormat="HH:mm"
                ampm={false}
                value={endingHours}
                onOpen={handleFocusEndingPicker}
                onClose={handleBlurEndingPicker}
                disabled={isStartingPickerActive}
                onChange={(momentDate) => {
                  setEndingHours(momentDate);
                }}
                sx={{
                  '& label': {
                    color: '#ccc',
                    fontSize: '14px',
                    letterSpacing: '0.5px',
                  },
                  '& label.Mui-focused': {
                    color: '#ccc',
                    fontSize: '14px',
                    letterSpacing: '0.5px',
                  },
                  '& .MuiOutlinedInput-input': {
                    borderRadius: '15px',
                    color: '#ccc',
                  },
                  '& .MuiOutlinedInput-root': {
                    // height: '53px',
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
                  '& .MuiButtonBase-root': {
                    // Styles for the icon button
                    color: '#f866b1', // Change the icon color here if not using a custom endAdornment
                  },
                }}
              />
            </DemoContainer>
          </LocalizationProvider>
        </ThemeProvider>
      </div>
      <Button
        variant="contained"
        style={{
          backgroundColor: '#f866b1',
          color: 'white',
        }}
        className="button"
        sx={{
          position: 'fixed',
          top: transition ? '100vh' : '60vh',
          opacity: transition ? '0' : '1',
          transition: 'ease-in 200ms',
          width: '55%',
          borderRadius: '50px',
        }}
        onClick={() => {
          OnSave();
          setTransition(true);
          setTimeout(() => {
            setOpenHoursPicker(null);
          }, 200);
        }}
      >
        Save
      </Button>
    </div>
  );
};

const theme = createTheme({
  components: {
    MuiPickersClockNumber: {
      styleOverrides: {
        root: {
          background: 'red',
          // Style overrides for individual clock numbers (the list items)
        },
      },
    },
    // Override styles for the list container if there's one
    MuiPickerStaticWrapper: {
      styleOverrides: {
        root: {
          background: 'red',
          // Override styles for the picker container that might hold the list
        },
      },
    },
    MuiPickersDay: {
      styleOverrides: {
        root: {
          width: '100%',
          // Styles for the days in the TimePicker list
          '&:hover': {
            backgroundColor: '#f866b1',
          },
          '&.Mui-selected': {
            backgroundColor: '#f866b1',
            color: 'white',
            '&:hover': {
              backgroundColor: '#f866b1',
            },
          },
        },
      },
    },
  },
});
