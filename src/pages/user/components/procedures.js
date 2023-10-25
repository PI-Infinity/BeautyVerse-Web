import React from "react";
import { useOutletContext } from "react-router-dom";
import styled from "styled-components";
import { ProceduresOptions } from "../../../datas/registerDatas";
import { BiTimeFive } from "react-icons/bi";

export const Procedures = () => {
  // all beauty procedures list
  const procedures = ProceduresOptions();
  // get outlet props context
  const [targetUser] = useOutletContext();
  return (
    <Container>
      {targetUser?.procedures?.map((item, index) => {
        const label = procedures?.find((i, x) => i.value === item.value).label;
        return (
          <div
            style={{
              color: "#ccc",
              background: "rgba(255,255,255,0.05)",
              borderRadius: "50px",
              padding: "8px 15px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                fontSize: "14px",
              }}
            >
              <div
                style={{
                  width: "10px",
                  height: "10px",
                  borderRadius: "10px",
                  backgroundColor: "#f866b1",
                }}
              ></div>
              {label}
            </div>
            <div
              style={{
                width: "20%",
                display: "flex",
                flexDirection: "column",
                gap: "8px",
                fontSize: "14px",
              }}
            >
              {item?.price && (
                <div>
                  {item?.price} {targetUser?.currency}
                </div>
              )}
              {item.duration && (
                <div
                  style={{ display: "flex", alignItems: "center", gap: "4px" }}
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

const Container = styled.div`
  box-sizing: border-box;
  padding: 15px;
  width: 100vw;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;
