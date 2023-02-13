import React from "react";
import styled from "styled-components";
import { BsSave2 } from "react-icons/bs";

export const Reports = () => {
  const [openList, setOpenList] = React.useState(false);

  // save post user
  const SavePost = async () => {
    // await setDoc(
    //   doc(db, `users`, `${currentUser?.uid}`, "Saved Feeds", `${props?.id}`),
    //   {
    //     ...props,
    //   }
    // );
    // handleSelect();
  };

  // // function to unfollow user
  // const UnFollowToUser = async () => {
  //   const coll = collection(db, `users`, `${currentUser?.uid}`, "followings");

  //   deleteDoc(doc(coll, `${props?.id}`));
  // };

  return (
    <div
      style={{
        position: "relative",
        display: "flex",
        justifyContent: "flex-end",
      }}
    >
      <Container onClick={() => setOpenList(!openList)}>
        {/* <div onClick={() => SavePost(!openList)} className="title">
          <b>Save Feed</b>
          <BsSave2 id="save" />
        </div> */}
        <div className="title">
          <b>Report</b>
        </div>
        {openList && (
          <ReportList>
            <span>It is Span</span>
            <span>No thematical feed</span>
          </ReportList>
        )}
      </Container>
    </div>
  );
};

const Container = styled.div`
  position: absolute;
  width: 10vw;
  height: auto;
  border-radius: 0.25vw;
  box-shadow: 0 0.1vw 0.3vw rgba(0, 0, 0, 0.1);
  padding: 0.5vw 0 0.5vw 1vw;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: start;
  z-index: 100;
  margin-right: 0.25vw;
  margin-top: 0.25vw;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(40px);

  .title {
    cursor: pointer;
    gap: 10px;
    display: flex;
    align-items: center;
  }

  @media only screen and (max-width: 600px) {
    width: 45vw;
    border-radius: 1vw;
    padding: 1.5vw 0 1.5vw 3vw;
    margin-right: 1vw;
    margin-top: 1vw;
  }

  animation: fadeIn 0.5s;
  -webkit-animation: fadeIn 0.5s;
  -moz-animation: fadeIn 0.5s;
  -o-animation: fadeIn 0.5s;
  -ms-animation: fadeIn 0.5s;

  @keyframes fadeIn {
    0% {
      opacity: 0;
    }
    100% {
      opacity: 1;
    }
  }

  @-moz-keyframes fadeIn {
    0% {
      opacity: 0;
    }
    100% {
      opacity: 1;
    }
  }

  @-webkit-keyframes fadeIn {
    0% {
      opacity: 0;
    }
    100% {
      opacity: 1;
    }
  }

  @-o-keyframes fadeIn {
    0% {
      opacity: 0;
    }
    100% {
      opacity: 1;
    }
  }

  @-ms-keyframes fadeIn {
    0% {
      opacity: 0;
    }
    100% {
      opacity: 1;
    }
  }
`;

const ReportList = styled.div`
  margin-top: 0.5vw;
  display: flex;
  flex-direction: column;
  gap: 0.25vw;

  & span {
    cursor: pointer;
  }
`;
