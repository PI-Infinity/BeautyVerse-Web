import React, { useEffect, useState } from 'react';
import { BounceLoader } from 'react-spinners';
import { qa } from '../../datas/pageTexts';

export const QA = () => {
  const [loader, setLoader] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setLoader(false);
    }, 100);
  }, []);
  return (
    <>
      {loader ? (
        <div
          style={{
            height: '500px',
            width: '100%',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <BounceLoader size={30} color="#f866b1" loading={loader} />
        </div>
      ) : (
        <div>
          <p
            style={{
              fontSize: '14px',
              color: '#f866b1',
              textAlign: 'center',
              lineHeight: '20px',
            }}
          >
            {qa}
          </p>
        </div>
      )}
    </>
  );
};
