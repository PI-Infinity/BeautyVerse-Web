import React, { useEffect, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import styled from 'styled-components';
import { ProceduresOptions } from '../../../datas/registerDatas';
import { BiTimeFive } from 'react-icons/bi';

const Procedures = () => {
  // all beauty procedures list
  const procedures = ProceduresOptions();
  // get outlet props context
  const [targetUser] = useOutletContext();
  // defines categories
  const [filter, setFilter] = useState('');

  return (
    <Container>
      <Navigator
        procedures={targetUser?.procedures}
        filter={filter}
        setFilter={setFilter}
      />
      {targetUser?.procedures
        ?.filter((i) => i.value.startsWith(filter))
        ?.map((item, index) => {
          const label = procedures?.find(
            (i, x) => i.value === item.value
          ).label;
          return (
            <div
              key={index}
              style={{
                color: '#ccc',
                background: 'rgba(255,255,255,0.05)',
                borderRadius: '50px',
                padding: '8px 15px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontSize: '14px',
                  letterSpacing: '0.5px',
                }}
              >
                <div
                  style={{
                    width: '10px',
                    height: '10px',
                    borderRadius: '10px',
                    backgroundColor: '#f866b1',
                  }}
                ></div>
                {label}
              </div>
              <div
                style={{
                  width: '20%',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px',
                  fontSize: '14px',
                  letterSpacing: '0.5px',
                }}
              >
                {item?.price && (
                  <div>
                    {item?.price} {targetUser?.currency}
                  </div>
                )}
                {item.duration && (
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                    }}
                  >
                    <BiTimeFive size={18} color="red" /> {item?.duration} Min.
                  </div>
                )}
              </div>
            </div>
          );
        })}
    </Container>
  );
};

export default Procedures;

const Container = styled.div`
  box-sizing: border-box;
  padding: 5px 15px;
  width: 100vw;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

/**
 * Navigator
 */

const Navigator = ({ procedures, setFilter, filter }) => {
  let categories = procedures?.map((i, x) => {
    return i.value.split('-')[0];
  });

  // Convert the array to a Set to eliminate duplicates, then convert it back to an array
  categories = [...new Set(categories)];

  return (
    <div
      style={{
        display: 'flex',
        gap: '10px',
        width: '100vw',
        overflowX: 'scroll',
        padding: '5px',
      }}
    >
      <div
        onClick={() => setFilter('')}
        style={{
          color: '#ccc',
          width: '200px',
          whiteSpace: 'nowrap',
          borderRadius: '50px',
          padding: '5px 10px',
          border:
            filter === '' ? '1.5px solid #f866b1' : '1.5px solid rgba(0,0,0,0)',
        }}
      >
        All
      </div>
      {categories?.map((item, index) => {
        return (
          <div
            onClick={() => setFilter(item)}
            key={index}
            style={{
              color: '#ccc',
              width: '200px',
              whiteSpace: 'nowrap',
              borderRadius: '50px',
              padding: '5px 10px',
              border:
                item === filter
                  ? '1.5px solid #f866b1'
                  : '1.5px solid rgba(0,0,0,0)',
              fontSize: '14px',
              letterSpacing: '0.5px',
              fontWeight: 500,
            }}
          >
            {item}
          </div>
        );
      })}
    </div>
  );
};
