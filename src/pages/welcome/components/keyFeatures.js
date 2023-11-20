import React from 'react';
import {
  FaBlog,
  FaBuilding,
  FaCalendarPlus,
  FaChartBar,
  FaCommentDots,
  FaPaintBrush,
  FaPhotoVideo,
  FaRegCalendarAlt,
  FaRegNewspaper,
  FaRobot,
  FaShare,
  FaShoppingBag,
  FaUserCircle,
} from 'react-icons/fa';
import { MdDeliveryDining } from 'react-icons/md';
import styled, { keyframes } from 'styled-components';
import { Language } from '../../../context/language';

export const KeyFeatures = () => {
  const language = Language();
  return (
    <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
      <Container>
        <h1 className="title">{language?.language?.Auth?.auth?.keyFeatures}</h1>
        <div>
          <Wrapper>
            {/* <img src={App1Image} style={{ width: '100px', objectFit: 'cover' }} /> */}
            <div>
              <h4>{language?.language?.Auth?.auth?.socialMedia}:</h4>
              <p>
                <FaPhotoVideo size={18} />
                {language?.language?.Auth?.auth?.content}
              </p>
              <p>
                <FaRegNewspaper size={18} />
                {language?.language?.Auth?.auth?.blogs}
              </p>
              <p>
                <FaShare size={18} /> {language?.language?.Auth?.auth?.sharing}
              </p>
              <p>
                <FaCommentDots size={18} />
                {language?.language?.Auth?.auth?.chat}
              </p>
            </div>
          </Wrapper>
          <Wrapper>
            {/* <img src={App1Image} style={{ width: '100px', objectFit: 'cover' }} /> */}

            <div>
              <h4>{language?.language?.Auth?.auth?.personalProfile}:</h4>
              <p>
                <FaPaintBrush size={18} />
                {language?.language?.Auth?.auth?.specialists}
              </p>
              <p>
                <FaBuilding size={18} />
                {language?.language?.Auth?.auth?.businesses}
              </p>
              <p>
                <FaShoppingBag size={18} />
                {language?.language?.Auth?.auth?.shops}
              </p>
              <p>
                <FaBlog size={18} />
                {language?.language?.Auth?.auth?.bloggers}
              </p>
              <p>
                <FaUserCircle size={18} />
                {language?.language?.Auth?.auth?.simpleUsers}
              </p>
            </div>
          </Wrapper>
          <Wrapper>
            {/* <img src={App1Image} style={{ width: '100px', objectFit: 'cover' }} /> */}

            <div>
              <h4>{language?.language?.Auth?.auth?.onlineBookings}:</h4>
              <p>
                <FaCalendarPlus size={18} />
                {language?.language?.Auth?.auth?.appointments}
              </p>
              <p>
                <FaRegCalendarAlt size={18} />
                {language?.language?.Auth?.auth?.bms}
              </p>
              <p>
                <FaChartBar size={18} />
                {language?.language?.Auth?.auth?.statistics}
              </p>
            </div>
          </Wrapper>
          <Wrapper>
            {/* <img src={App1Image} style={{ width: '100px', objectFit: 'cover' }} /> */}
            <div>
              <h4>{language?.language?.Auth?.auth?.marketplace}:</h4>
              <p>
                <FaShoppingBag size={18} />
                {language?.language?.Auth?.auth?.products}
              </p>
              <p style={{ gap: '5px' }}>
                <MdDeliveryDining size={22} />
                {language?.language?.Auth?.auth?.delivery}
              </p>
            </div>
          </Wrapper>
          <Wrapper>
            {/* <img src={App1Image} style={{ width: '100px', objectFit: 'cover' }} /> */}
            <div>
              <h4>{language?.language?.Auth?.auth?.aiTools}:</h4>
              <p>
                <FaRobot size={18} />{' '}
                {language?.language?.Auth?.auth?.aiAssistant}
              </p>
              <p>
                <FaRobot size={18} />
                {language?.language?.Auth?.auth?.aiBusiness}
              </p>
            </div>
          </Wrapper>
        </div>
      </Container>
    </div>
  );
};

const slideInFromRight = keyframes`
  from {
    transform: translateY(100%);
  }
  to {
    transform: translateY(0);
  }
`;

const Container = styled.div`
  width: 90%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 6vh 0;
  box-sizing: border-box;
  gap: 3vh;

  animation: ${slideInFromRight} 0.75s forwards;

  @media only screen and (max-width: 600px) {
    width: 90%;
    padding-horizontal: 5vw;
  }

  div {
    display: flex;
    flex-direction: column;
    gap: 15px;

    @media only screen and (max-width: 600px) {
      gap: 10px;
      width: 100%;
    }
  }

  h1 {
    color: #f866b1;
    letter-spacing: 0.5px;
    padding: 0;

    @media only screen and (max-width: 600px) {
      line-height: 7.5vw;
      font-size: 4.5vw;
    }
  }
`;

const Wrapper = styled.div`
  box-sizing: border-box;
  width: 100%;
  display: flex;
  // justify-content: center;
  gap: 20px;
  border: 1.5px solid rgba(255, 255, 255, 0.1);
  padding: 20px;
  border-radius: 15px;

  div {
    display: flex;
    flex-direction: column;
  }

  h4 {
    color: #f866b1;
    margin: 0;
    letter-spacing: 0.5px;
  }

  p {
    margin: 0 0 0 15px;
    color: #ccc;
    letter-spacing: 0.5px;
    // font-weight: 500;
    display: flex;
    align-items: center;
    gap: 8px;
    overflow: hidden;
  }
`;
