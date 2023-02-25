import React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { Language } from "../context/language";

export default function AlertDialog(props) {
  const language = Language();
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = async () => {
    await props?.function();
    props?.setOpen(false);
  };

  const handleClose = () => {
    props?.setOpen(false);
  };

  return (
    <div>
      <Dialog
        open={props?.open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{props?.title}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {props?.text}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>
            {language?.language.User.userPage.cancel}
          </Button>
          <Button onClick={handleClickOpen} autoFocus>
            {language?.language.User.userPage.remove}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
