import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { useSelector } from 'react-redux';
import axios from 'axios';

export default function ScrollDialog({
  open,
  setOpen,
  title,
  button,
  text,
  button2,
  page,
  targetUser,
}) {
  const [scroll, setScroll] = React.useState('paper');
  const theme = useSelector((state) => state.storeMain.theme);

  const handleClickOpen = (scrollType) => () => {
    setOpen(true);
    setScroll(scrollType);
  };

  const AcceptTerms = async (event) => {
    try {
      await axios.patch(
        `https://beautyverse.herokuapp.com/api/v1/users/${targetUser?._id}`,
        {
          acceptTerms: event,
        }
      );
    } catch (error) {
      console.log(error);
    }
  };
  const AcceptPrivacy = async (event) => {
    try {
      await axios.patch(
        `https://beautyverse.herokuapp.com/api/v1/users/${targetUser?._id}`,
        {
          acceptPrivacy: event,
        }
      );
    } catch (error) {
      console.log(error);
    }
  };

  const handleClose = async (event) => {
    if (targetUser) {
      if (page === 'terms and rules') {
        await AcceptTerms(event);
      } else if (page === 'privacy police') {
        await AcceptPrivacy(event);
      }
    }
    setOpen(false);
  };

  const descriptionElementRef = React.useRef(null);
  React.useEffect(() => {
    if (open) {
      const { current: descriptionElement } = descriptionElementRef;
      if (descriptionElement !== null) {
        descriptionElement.focus();
      }
    }
  }, [open]);

  return (
    <div>
      <Dialog
        open={open}
        onClose={handleClose}
        scroll={scroll}
        aria-labelledby="scroll-dialog-title"
        aria-describedby="scroll-dialog-description"
      >
        <DialogTitle
          id="scroll-dialog-title"
          style={{
            color: theme ? '#fff' : 'auto',
            backgroundColor: theme ? '#151515' : '#fff',
          }}
        >
          {title}
        </DialogTitle>
        <DialogContent
          dividers={scroll === 'paper'}
          style={{ backgroundColor: theme ? '#151515' : '#fff' }}
        >
          <DialogContentText
            id="scroll-dialog-description"
            ref={descriptionElementRef}
            tabIndex={-1}
            style={{ color: theme ? '#fff' : 'auto' }}
          >
            <p style={{ whiteSpace: 'pre-line' }}>{text}</p>
          </DialogContentText>
        </DialogContent>
        <DialogActions
          style={{
            backgroundColor: theme ? '#151515' : '#fff',
          }}
        >
          {(page === 'terms and rules' || page === 'privacy police') && (
            <Button
              onClick={() => handleClose(false)}
              style={{
                color: theme ? '#fff' : '#151515',
              }}
            >
              {button2}
            </Button>
          )}
          <Button
            onClick={() => handleClose(true)}
            style={{
              color: theme ? '#fff' : '#151515',
            }}
          >
            {button}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
