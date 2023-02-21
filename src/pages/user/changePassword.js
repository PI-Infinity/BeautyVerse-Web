import * as React from "react";
import styled from "styled-components";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { AiOutlineEyeInvisible, AiOutlineEye } from "react-icons/ai";
import { db } from "../../firebase";
import { updateDoc, doc } from "firebase/firestore";

export default function ChangePassword(props) {
  const [open, setOpen] = React.useState(false);

  const [showPassword, setShowPassword] = React.useState("");

  const [oldPassword, setOldPassword] = React.useState("");
  const [newPassword, setNewPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");

  // change password
  const Changing = () => {
    if (oldPassword === props?.user?.password) {
      if (newPassword?.length > 7) {
        if (newPassword === confirmPassword) {
          updateDoc(doc(db, "users", props?.user?.id), {
            password: newPassword,
          });
        } else {
          alert("New Passwords doesn't match!");
        }
      } else {
        alert("Password length must be min 8 symbols");
      }
    } else {
      alert("Old Password is wrong!");
    }
    setOldPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setOpen(false);
    props?.setOpen(true);
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Container>
      <Button variant="outlined" onClick={handleClickOpen}>
        Change Password
      </Button>
      <Dialog open={open} onClose={handleClose} id="dialog">
        <DialogTitle>Change Password</DialogTitle>
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
              label="Old Password"
              value={oldPassword}
              type={showPassword === "old" ? "text" : "password"}
              fullWidth
              variant="standard"
              onChange={(e) => setOldPassword(e.target.value)}
            />
            {showPassword === "old" ? (
              <AiOutlineEye
                className="eye"
                size={20}
                style={{ cursor: "pointer" }}
                onClick={() => setShowPassword("")}
              />
            ) : (
              <AiOutlineEyeInvisible
                className="eye"
                size={20}
                style={{ cursor: "pointer" }}
                onClick={() => setShowPassword("old")}
              />
            )}
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
              label="New Password"
              value={newPassword}
              type={showPassword === "new" ? "text" : "password"}
              fullWidth
              variant="standard"
              onChange={(e) => setNewPassword(e.target.value)}
            />
            {showPassword === "new" ? (
              <AiOutlineEye
                className="eye"
                size={20}
                style={{ cursor: "pointer" }}
                onClick={() => setShowPassword("")}
              />
            ) : (
              <AiOutlineEyeInvisible
                className="eye"
                size={20}
                style={{ cursor: "pointer" }}
                onClick={() => setShowPassword("new")}
              />
            )}
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
              label="Confirm Password"
              value={confirmPassword}
              type={showPassword === "confirm" ? "text" : "password"}
              fullWidth
              variant="standard"
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            {showPassword === "confirm" ? (
              <AiOutlineEye
                className="eye"
                size={20}
                style={{ cursor: "pointer" }}
                onClick={() => setShowPassword("")}
              />
            ) : (
              <AiOutlineEyeInvisible
                className="eye"
                size={20}
                style={{ cursor: "pointer" }}
                onClick={() => setShowPassword("confirm")}
              />
            )}
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={Changing}>Change</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

const Container = styled.div`
  width: 100%;
  #dialog {
    .eye {
      cursor: pointer;
      font-size: 1.2vw;
    }
  }
`;
