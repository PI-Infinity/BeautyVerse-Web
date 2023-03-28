import React from 'react';
import styled from 'styled-components';
import MuiButton from '@mui/material/Button';
import { AiOutlineEyeInvisible, AiOutlineEye } from 'react-icons/ai';
import { updateDoc, doc } from 'firebase/firestore';
import { db, auth } from '../../firebase';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import TextField from '@mui/material/TextField';
import DialogTitle from '@mui/material/DialogTitle';
import { updatePassword } from 'firebase/auth';

export default function ChangePassword(props) {
  const [showPassword, setShowPassword] = React.useState('');

  const [oldPassword, setOldPassword] = React.useState('');
  const [newPassword, setNewPassword] = React.useState('');
  const [confirmPassword, setConfirmPassword] = React.useState('');

  console.log(auth.currentUser);
  // change password
  const Changing = () => {
    if (oldPassword === props?.randomPass) {
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
          updateDoc(doc(db, 'users', authUser?.uid, 'secret', 'password'), {
            password: newPassword,
          });
          setOldPassword('');
          setNewPassword('');
          setConfirmPassword('');
          props?.setOpen(false);
          alert('changed');
        } else {
          alert("New Passwords doesn't match!");
        }
      } else {
        alert('Password length must be min 8 symbols');
      }
    } else {
      alert('Old Password is wrong!');
    }
  };

  return (
    <Cont>
      <Dialog
        open={props?.open}
        onClose={() => {
          props.setOpen(false);
          setOldPassword('');
          setNewPassword('');
          setConfirmPassword('');
          props?.setOpen(false);
        }}
        id="dialog"
      >
        <DialogTitle>
          {props?.language?.language.User.userPage.changePassword}
        </DialogTitle>
        <DialogContent>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              width: '300px',
            }}
          >
            <TextField
              autoFocus
              margin="dense"
              id="name"
              label={props?.language?.language.Auth.auth.verifyCode}
              value={oldPassword}
              type={showPassword === 'old' ? 'text' : 'password'}
              fullWidth
              variant="standard"
              onChange={(e) => setOldPassword(e.target.value)}
            />
            {showPassword === 'old' ? (
              <AiOutlineEye
                className="eye"
                size={20}
                style={{ cursor: 'pointer' }}
                onClick={() => setShowPassword('')}
              />
            ) : (
              <AiOutlineEyeInvisible
                className="eye"
                size={20}
                style={{ cursor: 'pointer' }}
                onClick={() => setShowPassword('old')}
              />
            )}
          </div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              width: '300px',
            }}
          >
            <TextField
              margin="dense"
              id="name"
              label={props?.language?.language.User.userPage.newPassword}
              value={newPassword}
              type={showPassword === 'new' ? 'text' : 'password'}
              fullWidth
              variant="standard"
              onChange={(e) => setNewPassword(e.target.value)}
            />
            {showPassword === 'new' ? (
              <AiOutlineEye
                className="eye"
                size={20}
                style={{ cursor: 'pointer' }}
                onClick={() => setShowPassword('')}
              />
            ) : (
              <AiOutlineEyeInvisible
                className="eye"
                size={20}
                style={{ cursor: 'pointer' }}
                onClick={() => setShowPassword('new')}
              />
            )}
          </div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              width: '300px',
            }}
          >
            <TextField
              margin="dense"
              id="name"
              label={props?.language?.language.User.userPage.confirmPassword}
              value={confirmPassword}
              type={showPassword === 'confirm' ? 'text' : 'password'}
              fullWidth
              variant="standard"
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            {showPassword === 'confirm' ? (
              <AiOutlineEye
                className="eye"
                size={20}
                style={{ cursor: 'pointer' }}
                onClick={() => setShowPassword('')}
              />
            ) : (
              <AiOutlineEyeInvisible
                className="eye"
                size={20}
                style={{ cursor: 'pointer' }}
                onClick={() => setShowPassword('confirm')}
              />
            )}
          </div>
        </DialogContent>
        <DialogActions>
          <MuiButton
            onClick={() => {
              props.setOpen(false);
              setOldPassword('');
              setNewPassword('');
              setConfirmPassword('');
              props?.setOpen(false);
            }}
          >
            {props?.language?.language.User.userPage.cancel}
          </MuiButton>
          <MuiButton onClick={Changing}>
            {props?.language?.language.User.userPage.change}
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
