import React, { useState } from "react";
import styled from "styled-components";

const CoverSlider = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const slides = [
    {
      id: 1,
      src: "https://res.cloudinary.com/mimino/image/upload/v1673281337/ELAN/products/brow-liner-pro-2-900x900-min_ckbqxc.jpg",
    },
    {
      id: 2,
      src: "https://res.cloudinary.com/mimino/image/upload/v1673281469/ELAN/products/deep-brow-tint-6-900x900-min_jpygwm.jpg",
    },
    {
      id: 3,
      src: "https://res.cloudinary.com/mimino/image/upload/v1673281337/ELAN/products/brow-liner-pro-2-900x900-min_ckbqxc.jpg",
    },
  ];

  return (
    <SliderContainer>
      <Image src={slides[currentSlide].src} alt="slide" />
      <Arrows>
        <Arrow
          disabled={currentSlide === 0}
          onClick={() => setCurrentSlide(currentSlide - 1)}
        >
          ←
        </Arrow>
        <Arrow
          disabled={currentSlide === slides.length - 1}
          onClick={() => setCurrentSlide(currentSlide + 1)}
        >
          →
        </Arrow>
      </Arrows>
      <Dots>
        {slides.map((slide, index) => (
          <Dot
            key={slide.id}
            className={index === currentSlide ? "active" : ""}
            onClick={() => setCurrentSlide(index)}
          >
            &bull;
          </Dot>
        ))}
      </Dots>
    </SliderContainer>
  );
};

export default CoverSlider;

const SliderContainer = styled.div`
  position: relative;
  width: 100%;
  height: 400px;
  overflow: hidden;
`;

const Image = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: ease 300;

  :hover {
    transform: scale(1.03);
  }
`;

const Arrows = styled.div`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  justify-content: space-between;
  width: 100%;
  padding: 0 20px;
`;

const Arrow = styled.button`
  background: transparent;
  border: none;
  font-size: 36px;
  color: white;
  cursor: pointer;

  &:disabled {
    opacity: 0.3;
    cursor: not-allowed;
  }
`;

const Dots = styled.div`
  position: absolute;
  bottom: 20px;
  display: flex;
  justify-content: center;
  width: 100%;
`;

const Dot = styled.span`
  margin: 0 10px;
  font-size: 36px;
  color: white;
  cursor: pointer;

  &.active {
    color: red;
  }
`;
