import * as React from "react";
import styled from "styled-components";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { AiOutlineEyeInvisible, AiOutlineEye } from "react-icons/ai";
import { db, auth } from "../../firebase";
import { updateDoc, doc } from "firebase/firestore";
import { updatePassword } from "firebase/auth";

export default function ChangePassword(props) {
  const [open, setOpen] = React.useState(false);

  const [showPassword, setShowPassword] = React.useState("");

  const [oldPassword, setOldPassword] = React.useState("");
  const [newPassword, setNewPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");

  // change password
  const Changing = () => {
    if (oldPassword === props?.password) {
      if (newPassword?.length > 7) {
        if (newPassword === confirmPassword) {
          const authUser = auth.currentUser;
          updatePassword(authUser, newPassword)
            .then(() => {
              // Update successful.
            })
            .catch((error) => {
              // An error ocurred
              // ...
            });
          updateDoc(doc(db, "users", authUser?.uid, "secret", "password"), {
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
      {!props.forgot && (
        <Button
          variant="outlined"
          onClick={handleClickOpen}
          sx={{ fontSize: "14px" }}
        >
          {props?.language?.language.User.userPage.changePassword}
        </Button>
      )}
      <Dialog open={open} onClose={handleClose} id="dialog">
        <DialogTitle>
          {props?.language?.language.User.userPage.changePassword}
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
              label={props?.language?.language.User.userPage.oldPassword}
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
              label={props?.language?.language.User.userPage.newPassword}
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
              label={props?.language?.language.User.userPage.confirmPassword}
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
          <Button onClick={handleClose}>
            {props?.language?.language.User.userPage.cancel}
          </Button>
          <Button onClick={Changing}>
            {props?.language?.language.User.userPage.change}
          </Button>
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
