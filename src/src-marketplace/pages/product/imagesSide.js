import React from "react";
import styled from "styled-components";
import { BiImageAdd } from "react-icons/bi";
import { AiOutlineDelete } from "react-icons/ai";

export const ImagesSide = ({
  images,
  FileConverter,
  mainImg,
  setMainImg,
  RemoveImg,
  currentuser,
  ShopId,
}) => {
  return (
    <ImgSide>
      <MainImgBg>
        {images[0] !== undefined ? (
          <MainImg src={images[mainImg]?.url} alt={images[mainImg]?.alt} />
        ) : (
          <>
            <input
              type="file"
              id="img"
              name="file"
              style={{ display: "none" }}
              onChange={(e) => FileConverter(e.target.files[0])}
            />
            <label htmlFor="img" style={{ cursor: "pointer" }}>
              <BiImageAdd className="undefinedIcon" />
            </label>
          </>
        )}
      </MainImgBg>
      <Gallery>
        <div>
          {images[0] !== undefined && currentuser?.id === ShopId ? (
            <ImgBg>
              <input
                type="file"
                id="img"
                name="file"
                style={{ display: "none" }}
                onChange={(e) => FileConverter(e.target.files[0])}
              />
              <label htmlFor="img">
                <BiImageAdd className="undefinedIcon" />
              </label>
            </ImgBg>
          ) : null}
        </div>
        <div style={{ display: "flex", gap: "5px", flexWrap: "wrap" }}>
          {images[0] !== undefined ? (
            images?.map((item, index) => {
              return (
                <div
                  className={mainImg === index ? "active" : ""}
                  onClick={() => {
                    setMainImg(index);
                    // dispatch(setRerender());
                  }}
                >
                  {currentuser?.id === ShopId && (
                    <div style={{ position: "relative" }}>
                      <div
                        onClick={() => RemoveImg(item)}
                        style={{
                          width: "25px",
                          height: "25px",
                          position: "absolute",
                          zIndex: "100",
                          margin: "5px",
                          padding: "50xp",
                          borderRadius: "50vw",
                          background: "rgba(255,255,255,0.7)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          cursor: "pointer",
                        }}
                      >
                        <AiOutlineDelete className="removeIcon" style={{}} />
                      </div>
                    </div>
                  )}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "5px",
                      overflow: "hidden",
                    }}
                  >
                    <ImgBg key={index}>
                      <Img src={item.url} alt={item.alt} />
                    </ImgBg>
                  </div>
                </div>
              );
            })
          ) : (
            <>
              {currentuser?.id === ShopId && (
                <ImgBg>
                  <BiImageAdd className="undefinedIcon" />
                </ImgBg>
              )}
            </>
          )}
        </div>
      </Gallery>
    </ImgSide>
  );
};

const ImgSide = styled.div`
  display: flex;
  flex-direction: column;
`;

const MainImgBg = styled.div`
  width: 24vw;
  height: 24vw;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  border: 1px solid #ccc;
  border-radius: 5px;
  cursor: pointer;
  box-sizing: border-box;

  @media only screen and (max-width: 621px) {
    width: 90vw;
    height: 90vw;
    background: white;
    // margin: 1vw;
  }

  .undefinedIcon {
    font-size: 15vw;
    color: #ccc;
    cursor: pointer;
  }
`;

const MainImg = styled.img`
  width: 24vw;
  height: 24vw;
  object-fit: cover;

  @media only screen and (max-width: 621px) {
    width: 100%;
    height: 100%;
  }
`;

const Gallery = styled.div`
  width: 24vw;
  display: flex;
  margin-top: 0.5vw;
  padding: 0.25vw 0.25vw 0.25vw 0;
  box-sizing: border-box;
  gap: 5px;

  @media only screen and (max-width: 621px) {
    padding: 1vw 0;
    width: 100%;
  }

  .undefinedIcon {
    font-size: 2vw;
    color: #ccc;
    cursor: pointer;

    @media only screen and (max-width: 621px) {
      font-size: 6vw;
    }
  }

  .active {
    box-shadow: 0 0vw 0.2vw red;
    border-radius: 0.25vw;

    @media only screen and (max-width: 621px) {
      border-radius: 1vw;
      box-shadow: 0 0vw 0.5vw red;
    }
  }

  .removeIcon {
    @media only screen and (max-width: 621px) {
      font-size: 4vw;
    }
  }

  /* width */
  ::-webkit-scrollbar {
    width: 0vw;
    height: 0.25vw;
  }

  /* Track */
  ::-webkit-scrollbar-track {
    background-color: white;
  }

  /* Handle */
  ::-webkit-scrollbar-thumb {
    background-color: #222;
  }

  /* Handle on hover */
  ::-webkit-scrollbar-thumb:hover {
    background-color: #1e1e1e;
  }
`;

const ImgBg = styled.div`
  overflow: hidden;
  border-radius: 0.25vw;
  background: white;
  filter: brightness(${(props) => props.brightness});
  width: 5vw;
  height: 5vw;
  cursor: pointer;
  border: 1px solid #ccc;
  display: flex;
  align-items: center;
  justify-content: center;

  @media only screen and (max-width: 621px) {
    width: 20vw;
    height: 20vw;
    border-radius: 1vw;
  }
`;
const Img = styled.img`
  width: 100%;
  height: 100%;
  cursor: pointer;
  object-fit: cover;
`;
