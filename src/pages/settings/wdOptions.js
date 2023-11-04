import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useSelector } from 'react-redux';
import { workingDaysOptions } from '../../datas/registerDatas';
import { HoursPicker } from './hoursPicker';

// Main component
export const WDOptions = ({ value, setValue }) => {
  // current user
  const currentUser = useSelector((state) => state.storeUser.currentUser);

  const lang = useSelector((state) => state.storeApp.language);

  const handleSelect = (option) => {
    if (value.some((o) => o.value === option.value)) {
      setValue((prev) => prev.filter((item) => item.value !== option.value));
    } else {
      if (option.value === 'everyDay' || option.value === 'workingDays') {
        setValue([{ value: option.value, hours: '' }]);
      } else {
        setValue((prev) =>
          prev
            .filter(
              (item) =>
                item.value !== 'everyDay' && item.value !== 'workingDays'
            )
            .concat({ value: option.value, hours: '' })
        );
      }
    }
  };

  return (
    <Container>
      {workingDaysOptions.map((option, index) => {
        let active;
        if (value?.some((i) => i.value === option.value)) {
          active = true;
        }
        let hours = value?.find((day) => day.value === option.value)?.hours;

        return (
          <WDItem
            key={index}
            option={option}
            handleSelect={handleSelect}
            hours={hours}
            value={value}
            setValue={setValue}
            active={active}
            lang={lang}
          />
        );
      })}
    </Container>
  );
};

const WDItem = ({
  option,
  handleSelect,
  value,
  setValue,
  active,
  lang,
  hours,
}) => {
  /**
   * hours state
   */
  const [openHoursPicker, setOpenHoursPicker] = useState(null);
  const [startingHours, setStartingHours] = useState(null);
  const [endingHours, setEndingHours] = useState(null);

  let valueIsDefined = value?.some((i) => i.value === option.value);

  return (
    <Option
      bordercolor={'rgba(255,255,255,0.1)'}
      color={valueIsDefined ? '#f866b1' : '#ccc'}
      onClick={() => handleSelect(option)}
    >
      {openHoursPicker?.active && openHoursPicker?.item === option?.value && (
        <div
          onClick={(e) => e.stopPropagation()}
          style={{ width: '0', position: 'absolute' }}
        >
          <HoursPicker
            setOpenHoursPicker={setOpenHoursPicker}
            startingHours={startingHours}
            setStartingHours={setStartingHours}
            endingHours={endingHours}
            setEndingHours={setEndingHours}
            value={value}
            setValue={setValue}
            option={option}
          />
        </div>
      )}
      <span
        style={{
          padding: '4px 8px',
        }}
      >
        {lang === 'en' ? option.en : lang === 'ru' ? option.ru : option.ka}
      </span>
      {hours ? (
        <div onClick={(e) => e.stopPropagation()}>
          <div
            onClick={() => {
              setOpenHoursPicker({ active: true, item: option.value });
            }}
            style={{
              padding: '4px 8px',
              borderRadius: '50px',
              background: 'rgba(255,255,255,0.1)',
              color: valueIsDefined ? '#ccc' : '#888',
            }}
          >
            {hours}
          </div>
        </div>
      ) : (
        <div onClick={(e) => e.stopPropagation()}>
          <div
            style={{
              padding: '4px 8px',
              borderRadius: '50px',
              background: 'rgba(255,255,255,0.1)',
              color: valueIsDefined ? '#ccc' : '#888',
            }}
            onClick={() =>
              valueIsDefined
                ? setOpenHoursPicker({ active: true, item: option.value })
                : undefined
            }
          >
            Add Hours
          </div>
        </div>
      )}
    </Option>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 90%;
  gap: 5px;
`;

const Option = styled.button`
  box-sizing: borde-box;
  padding: 8px;
  border-radius: 50px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border: none;
  cursor: pointer;
  outline: none;
  font-size: 14px;
  font-weight: bold;
  letter-spacing: 0.5px;
  border: 1.5px solid ${(props) => props.bordercolor};
  background: none;
  color: ${(props) => props.color};
`;
