import React from "react";
import styled from "styled-components";
import MuiButton from "@mui/material/Button";
import { AiOutlineEyeInvisible, AiOutlineEye } from "react-icons/ai";
import { setDoc, serverTimestamp, doc } from "firebase/firestore";
import { db, auth } from "../../firebase";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import TextField from "@mui/material/TextField";
import DialogTitle from "@mui/material/DialogTitle";

export default function UpdatePhone(props) {
  const [code, setCode] = React.useState("");
  const [oldPhone, setOldPhone] = React.useState("");
  const [newPhone, setNewPhone] = React.useState("");
  const [confirmPhone, setConfirmPhone] = React.useState("");

  // change password
  const Changing = () => {
    if (code === props?.randomPass) {
      if (newPhone?.length > 7) {
        if (newPhone === confirmPhone) {
          setDoc(doc(db, "phoneUpdateRequests", props.targetUser?.id), {
            userId: props.targetUser?.id,
            old: oldPhone,
            new: newPhone,
            date: serverTimestamp(),
          });
          setOldPhone("");
          setNewPhone("");
          setConfirmPhone("");
          setCode("");
          props?.setOpen(false);
          alert("Sent");
        } else {
          alert("New Passwords doesn't match!");
        }
      } else {
        alert("Password length must be min 8 symbols");
      }
    } else {
      alert("Old Password is wrong!");
    }
  };

  return (
    <Cont>
      <Dialog
        open={props?.open}
        onClose={() => {
          props.setOpen(false);
          setOldPhone("");
          setNewPhone("");
          setConfirmPhone("");
          setCode("");
          props?.setOpen(false);
        }}
        id="dialog"
      >
        <DialogTitle>
          Update Phone
          {/* {props?.language?.language.User.userPage.changePassword} */}
        </DialogTitle>
        <DialogContent>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              width: "300px",
            }}
          >
            <TextField
              autoFocus
              margin="dense"
              id="name"
              label={props?.language?.language.Auth.auth.verifyCode}
              placeholder={props?.language?.language.Auth.auth.verifyCode}
              value={code}
              type="text"
              fullWidth
              variant="standard"
              onChange={(e) => setCode(e.target.value)}
            />
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              width: "300px",
            }}
          >
            <TextField
              margin="dense"
              id="name"
              label="Enter Old Phone Number"
              value={oldPhone}
              type="text"
              fullWidth
              variant="standard"
              onChange={(e) => setOldPhone(e.target.value)}
            />
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              width: "300px",
            }}
          >
            <TextField
              margin="dense"
              id="name"
              label="Enter New Phone Number"
              value={newPhone}
              type="text"
              fullWidth
              variant="standard"
              onChange={(e) => setNewPhone(e.target.value)}
            />
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              width: "300px",
            }}
          >
            <TextField
              margin="dense"
              id="name"
              label="Confirm New Phone Number"
              value={confirmPhone}
              type="text"
              fullWidth
              variant="standard"
              onChange={(e) => setConfirmPhone(e.target.value)}
            />
          </div>
        </DialogContent>
        <DialogActions>
          <MuiButton
            onClick={() => {
              props.setOpen(false);
              setOldPhone("");
              setNewPhone("");
              setConfirmPhone("");
              setCode("");
              props?.setOpen(false);
            }}
          >
            {props?.language?.language.User.userPage.cancel}
          </MuiButton>
          <MuiButton onClick={Changing}>
            {/* {props?.language?.language.User.userPage.change} */}
            Send request
          </MuiButton>
        </DialogActions>
      </Dialog>
    </Cont>
  );
}

const Cont = styled.div`
  width: 100%;
  #dialog {
    .eye {
      cursor: pointer;
      font-size: 1.2vw;
    }
  }
`;
