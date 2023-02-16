import React, { useState } from "react";
import styled from "styled-components";
import { BsSave2 } from "react-icons/bs";
import { useSelector, useDispatch } from "react-redux";
import FormDialog from "../../../components/formDialog";
import { setDoc, doc, serverTimestamp } from "firebase/firestore";
import { db } from "../../../firebase";
import Success from "../../../snackBars/success";

export const Reports = (props) => {
  const [openList, setOpenList] = useState(false);

  const [openDialog, setOpenDialog] = useState(false);
  const [inputText, setInputText] = useState("");
  const [openSuccess, setOpenSuccess] = useState(false);
  // import current user from redux state
  const userUnparsed = useSelector((state) => state.storeMain.user);

  let user;
  if (userUnparsed?.length > 0) {
    user = JSON.parse(userUnparsed);
  }

  // send report
  const SendReport = async (reason) => {
    await setOpenDialog(false);
    var docId = reason + "-" + user?.id + "-" + new Date().toString();
    await setDoc(doc(db, `reports`, docId), {
      id: docId,
      userId: user?.id,
      feed: props?.path,
      text: reason,
      date: serverTimestamp(),
    });
    await setInputText("");
    setOpenSuccess(true);
  };

  return (
    <>
      <div
        style={{
          position: "relative",
          display: "flex",
          justifyContent: "flex-end",
        }}
      >
        <Container onClick={() => setOpenList(!openList)}>
          <div className="title">
            <b>პოსტის გასაჩივრება</b>
          </div>
          {openList && (
            <ReportList>
              <span onClick={() => SendReport("Spam")}>ეს არის სპამი</span>
              <span onClick={() => SendReport("No Thematical Feed")}>
                არათემატური პოსტი
              </span>
              <span onClick={() => setOpenDialog(true)}>მიზეზის აღწერა</span>
            </ReportList>
          )}
        </Container>
      </div>
      <FormDialog
        open={openDialog}
        setOpen={setOpenDialog}
        inputText={inputText}
        setInputText={setInputText}
        function={() => SendReport(inputText)}
        title="აღწერე საჩივრის მიზეზი"
        placeholder="ჩაწერე საჩივარი"
      />
      <SuccesCont id="success">
        <Success
          open={openSuccess}
          setOpen={setOpenSuccess}
          type="success"
          title="საჩივარი წარმატებით გაიგზავნა!"
        />
      </SuccesCont>
    </>
  );
};

const Container = styled.div`
  position: absolute;
  width: auto;
  height: auto;
  border-radius: 0.25vw;
  box-shadow: 0 0.1vw 0.3vw rgba(0, 0, 0, 0.1);
  padding: 0.5vw 1vw;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: end;
  z-index: 10000;
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
    width: 50vw;
    border-radius: 1vw;
    padding: 1.75vw;
    margin-right: 2vw;
    margin-top: 2vw;
    align-items: center;
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
  align-items: end;
  gap: 0.1vw;

  @media only screen and (max-width: 600px) {
    margin-top: 1.5vw;
    gap: 1vw;
  }

  & span {
    cursor: pointer;
    padding: 5px;
    border-radius: 5px;

    :hover {
      background: #f1f1f1;
    }
  }
`;

const SuccesCont = styled.div`
  position: absolute;
  z-index: 10009;

  @media only screen and (max-width: 600px) {
    bottom: 10vw;
  }
`;
