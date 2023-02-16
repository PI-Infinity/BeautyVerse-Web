import * as React from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

export default function FormDialog(props) {
  const handleClickOpen = async () => {
    await props?.function();
    props?.setOpen(false);
  };

  const handleClose = () => {
    props?.setOpen(false);
  };

  return (
    <div>
      <Dialog open={props?.open} onClose={handleClose}>
        <DialogTitle>{props?.title}</DialogTitle>
        <DialogContent>
          <DialogContentText>{props?.text}</DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label={props?.placeholder}
            type="text"
            fullWidth
            variant="standard"
            value={props?.inputText}
            onChange={(e) => props?.setInputText(e.target.value)}
            required
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>გაუქმება</Button>
          <Button onClick={handleClickOpen}>გაგზავნა</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
