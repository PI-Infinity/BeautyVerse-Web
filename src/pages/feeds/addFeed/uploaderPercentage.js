import React from 'react';
import styled from 'styled-components';

/**
 * Video uploading percentage component
 */

export const UploaderPercentage = ({
  loading,
  setLoading,
  progress,
  setProgress,
  cancelUpload,
}) => {
  const toggleLoader = () => {
    if (progress < 100) {
      cancelUpload();
      setLoading(!loading);
      setProgress(0);
    }
  };

  return (
    <Container>
      <BackDrop>
        <LoaderContainer>
          <div
            style={{ color: '#ccc', letterSpacing: '0.5px', fontSize: '14px' }}
          >
            Uploading...
          </div>
          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              width: '35px',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div style={{ color: '#ccc' }}>{progress?.toFixed(0)}</div>
            <div style={{ color: '#ccc' }}>%</div>
          </div>
          <ProgressBarBackground>
            <ProgressBarFill
              style={{
                width: `${progress}%`,
                backgroundColor: '#f866b1',
              }}
            />
          </ProgressBarBackground>
        </LoaderContainer>
        <div
          onClick={toggleLoader}
          style={{
            width: '40%',
            borderRadius: '50px',
            padding: '2.5px 15px',
            alignItems: 'center',
            backgroundColor: '#888',
          }}
        >
          <div style={{ color: '#fff' }}>Cancel</div>
        </div>
      </BackDrop>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100vw;
  height: 100%;
  position: fixed;
  z-index: 10000;
  background: rgba(0, 0, 0, 0.5);
  back-drop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
`;

const BackDrop = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
`;

const LoaderContainer = styled.div`
  padding: 0 20px;
  width: 190px;
  background: rgba(255, 255, 255, 0.1);
  back-drop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border-radius: 20px;
  gap: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 50px;
`;

const ProgressBarBackground = styled.div`
  width: 100px;
  height: 10px;
  background: #e0e0e0;
  border-radius: 10px;
`;
const ProgressBarFill = styled.div`
  height: 100%;
  border-radius: 10px;
`;
