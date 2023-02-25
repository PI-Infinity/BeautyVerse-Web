import styled from "styled-components";
import MuiButton from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";

export default function UpdatePhoneButton({
  emailInput,
  setEmailInput,
  language,
  SendEmail,
  setOpenPhoneChange,
  openInput,
  setOpenInput,
  title,
}) {
  const handleClickOpen = () => {
    setOpenInput(true);
  };

  return (
    <div>
      <ForgottPass onClick={handleClickOpen}>{title}</ForgottPass>
      <Dialog open={openInput} onClose={() => setOpenInput(false)}>
        <DialogTitle>Update phone number</DialogTitle>
        <DialogContent>
          <DialogContentText>
            after verify, phone number will change in 1-3 days
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label={language?.language.Auth.auth.email}
            type="email"
            fullWidth
            variant="standard"
            onChange={(e) => setEmailInput(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <MuiButton onClick={() => setOpenInput(false)}>
            {language?.language.Auth.auth.cancel}
          </MuiButton>
          <MuiButton onClick={SendEmail}>
            {language?.language.Auth.auth.send}
          </MuiButton>
        </DialogActions>
      </Dialog>
    </div>
  );
}

const ForgottPass = styled.p`
  padding: 0;
  margin: 0;
  letter-spacing: 0.05vw;
  font-size: 0.8vw;
  cursor: pointer;

  @media only screen and (max-width: 600px) {
    font-size: 3.3vw;
    letter-spacing: 0.2vw;
  }

  :hover {
    text-decoration: underline;
  }
`;
