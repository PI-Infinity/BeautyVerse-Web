import { useState } from "react";
import styled from "styled-components";
import { useSelector } from "react-redux";
import FormDialog from "../../../components/formDialog";
import { setDoc, doc, serverTimestamp } from "firebase/firestore";
import { db } from "../../../firebase";
import Success from "../../../snackBars/success";
import { Language } from "../../../context/language";

export const Reports = (props) => {
  const [openList, setOpenList] = useState(false);
  const language = Language();

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
            <b>{language?.language.Main.feedCard.report}</b>
          </div>
          {openList && (
            <ReportList>
              <div onClick={() => SendReport("Spam")}>
                {language?.language.Main.feedCard.spam}
              </div>
              <div onClick={() => SendReport("No Thematical Feed")}>
                {language?.language.Main.feedCard.noThematical}
              </div>
              <div onClick={() => setOpenDialog(true)}>
                {language?.language.Main.feedCard.reason}
              </div>
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
        title={language?.language.Main.feedCard.aboutReason}
        send={language?.language.Main.feedCard.send}
        cancel={language?.language.Main.feedCard.cancel}
        placeholder={language?.language.Main.feedCard.writeReason}
      />
      <SuccesCont id="success">
        <Success
          open={openSuccess}
          setOpen={setOpenSuccess}
          type="success"
          title={language?.language.Main.feedCard.success}
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
  box-shadow: 0 0.1vw 0.3vw ${(props) => props.theme.shadowColor};
  padding: 0.5vw 1vw;
  display: flex;
  flex-direction: column;
  align-items: end;
  z-index: 10000;
  margin-right: 0.25vw;
  margin-top: 0.25vw;
  background: ${(props) => props.theme.secondLevel};
  color: ${(props) => props.theme.font};
  backdrop-filter: blur(40px);

  .title {
    width: auto;
    cursor: pointer;
  }

  @media only screen and (max-width: 600px) {
    width: auto;
    border-radius: 1vw;
    padding: 2vw 4vw;
    margin-right: 2vw;
    margin-top: 2vw;
    font-size: 12px;
    align-items: end;
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
  gap: 0vw;
  width: auto;

  @media only screen and (max-width: 600px) {
    margin-top: 1.5vw;
    gap: 1vw;
  }

  & > div {
    width: auto;
    cursor: pointer;
    padding: 5px;
    border-radius: 5px;
    font-size: 12px;
    white-space: nowrap;

    :hover {
      filter: brightness(0.8);
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
