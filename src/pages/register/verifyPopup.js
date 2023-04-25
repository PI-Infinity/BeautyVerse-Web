import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { useNavigate } from 'react-router-dom';
import {
  setName,
  setUserType,
  setEmail,
  setPhoneNumber,
  setPassword,
  setConfirmPassowrd,
  setCurrentUser,
} from '../../redux/register';
import { useDispatch } from 'react-redux';

export default function VerifyEmail({
  open,
  setOpen,
  Verify,
  verifyCode,
  email,
  language,
  code,
  setCode,
}) {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    navigate('/login');
    dispatch(setName(''));
    dispatch(setUserType(''));
    dispatch(setEmail(''));
    dispatch(setPhoneNumber(''));
    dispatch(setPassword(''));
    dispatch(setConfirmPassowrd(''));
  };

  return (
    <div>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{language?.language.Auth.auth.verification}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {language?.language.Auth.auth.verifyCodeSent}: {email}
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label={language?.language.Auth.auth.verificationCode}
            type="numbers"
            fullWidth
            value={code}
            onChange={(e) => setCode(e.target.value)}
            variant="standard"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>
            {language?.language.Auth.auth.cancel}
          </Button>
          <Button onClick={Verify}>
            {language?.language.Auth.auth.register}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
