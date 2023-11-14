import React, { useEffect, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import styled from 'styled-components';
import { ProceduresOptions } from '../../../datas/registerDatas';
import { BiTimeFive } from 'react-icons/bi';
import { IoMdClose } from 'react-icons/io';

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
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
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
                  width: '91%',
                  maxWidth: '100%',
                  borderRadius: '20px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  border: '1.5px solid rgba(255,255,255,0.1)',
                  padding: '8px 4%',
                  color: '#ccc',
                  letterSpacing: '0.5px',
                  fontWeight: '500',
                  fontSize: '14px',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <span>{label}</span>
                </div>
                {(item.duration || item.price) && (
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '5px',
                      background: 'rgba(255,255,255,0.1)',
                      borderRadius: '50px',
                      margin: '8px 0 4px 0',
                      boxSizing: 'border-box',
                      padding: '5px 10px',
                      gap: '25px',
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '5px',
                      }}
                    >
                      {item?.duration && (
                        <span>
                          <span>Duration: </span>
                          <span style={{ color: '#f866b1' }}>
                            {item.duration < 60
                              ? item.duration + ' min.'
                              : item.duration >= 60
                              ? Math.floor(item.duration / 60) +
                                'h' +
                                (item.duration % 60 > 0
                                  ? ' ' + (item.duration % 60) + ' min.'
                                  : '')
                              : '0h'}
                          </span>
                        </span>
                      )}
                    </div>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                      }}
                    >
                      {item?.price && (
                        <span>
                          Price:{' '}
                          <span style={{ color: '#f866b1' }}>
                            {item.price}{' '}
                            {targetUser?.currency && (
                              <>
                                {targetUser?.currency === 'Dollar'
                                  ? '$'
                                  : targetUser?.currency === 'Euro'
                                  ? '€'
                                  : '₾'}
                              </>
                            )}
                          </span>
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
      </div>
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

  useEffect(() => {
    if (categories?.length < 2) {
      setFilter(categories[0]);
    }
  }, []);

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
      {categories?.length > 1 && (
        <div
          onClick={() => setFilter('')}
          style={{
            color: '#ccc',
            width: '200px',
            whiteSpace: 'nowrap',
            borderRadius: '50px',
            padding: '5px 10px',
            border:
              filter === ''
                ? '1.5px solid #f866b1'
                : '1.5px solid rgba(0,0,0,0)',
          }}
        >
          All
        </div>
      )}
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
              textAlign: 'center',
            }}
          >
            {item}
          </div>
        );
      })}
    </div>
  );
};
