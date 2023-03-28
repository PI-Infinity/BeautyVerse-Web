import * as React from 'react';
import styled from 'styled-components';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Divider from '@mui/material/Divider';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { BsStars } from 'react-icons/bs';
import AgreementDialog from '../components/agreementDialog';
import { Language } from '../context/language';
import axios from 'axios';
import { setRerenderNotifications } from '../redux/rerenders';

export default function Notifications(props) {
  const language = Language();
  const handleClose = () => {
    props?.setOpen(false);
  };

  document.body.style.overflowY = 'hidden';
  return (
    <div
      style={{
        position: 'absolute',
        top: '0',
        left: 0,
        width: '100%',
        height: '100vh',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 10000,
        background: 'rgba(0,0,0,0.5)',
      }}
      onClick={handleClose}
    >
      <div>
        <DialogTitle>{language?.language.Main.menu.notifications}</DialogTitle>
        <DialogContent>
          <AlignItemsList
            notifications={props.notifications}
            setOpen={props.setOpen}
          />
        </DialogContent>
      </div>
    </div>
  );
}

function AlignItemsList(props) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  // import current user from redux state
  const currentUser = JSON.parse(
    localStorage.getItem('Beautyverse:currentUser')
  );

  document.body.style.overflowY = 'hidden';

  const ReadNotification = async (id) => {
    try {
      const response = await axios.patch(
        `/api/v1/users/${currentUser?._id}/notifications/${id}`,
        {
          status: 'read',
        }
      );
      const data = await response.data;
      dispatch(setRerenderNotifications());
    } catch (error) {}
  };

  // agreement dialog
  const [agreementDialog, setAgreementDialog] = React.useState(false);

  return (
    <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
      {props?.notifications?.map((item, index) => {
        // const user = users?.find((it) => it?.id === item?.senderId);
        return (
          <>
            <Container>
              <ListItem
                alignItems="flex-start"
                className="item"
                onClick={(event) => {
                  event.stopPropagation();
                  // handle list item click logic here

                  if (item?.status === 'unread') {
                    if (item?.type === 'offer') {
                      setAgreementDialog(true);
                    }
                    return ReadNotification(item?._id);
                  } else {
                    props.setOpen(false);
                    return navigate(item?.feed);
                  }
                }}
              >
                <ListItemAvatar>
                  {item?.senderId === 'beautyVerse' ? (
                    <BsStars className="logo" onClick={() => navigate('/')} />
                  ) : (
                    <Avatar alt="Remy Sharp" src={currentUser?.cover} />
                  )}
                </ListItemAvatar>

                <ListItemText
                  primary={
                    <span
                      style={{
                        fontWeight:
                          item?.status === 'unread' ? 'bold' : 'normal',
                      }}
                    >
                      {item?.type === 'welcome'
                        ? 'მოგესალმებით!'
                        : 'შეტყობინება'}
                    </span>
                  }
                  secondary={
                    <React.Fragment>
                      <Typography
                        sx={{
                          display: 'inline',
                          fontWeight:
                            item?.status === 'unread' ? 'bold' : 'normal',
                        }}
                        component="span"
                        variant="body2"
                        color="text.primary"
                      >
                        {item?.type !== 'welcome' && currentUser?.name}{' '}
                      </Typography>
                      <span
                        style={{
                          fontWeight:
                            item?.status === 'unread' ? 'bold' : 'normal',
                        }}
                      >
                        {item?.text}
                      </span>
                    </React.Fragment>
                  }
                />
                {item?.type === 'offer' ? (
                  <AgreementDialog
                    title="დაადასტურეთ!"
                    text="გსურთ შეთავაზებულ გუნდში გაწევრიანება?"
                    setOpen={setAgreementDialog}
                    open={agreementDialog}
                    // function={() => UpdateOffer(item.senderId)}
                  />
                ) : (
                  ''
                )}
              </ListItem>
            </Container>
            <Divider variant="inset" component="li" />
          </>
        );
      })}
    </List>
  );
}

const Container = styled.div`
  cursor: pointer;

  .item {
    :hover {
      background: #f3f3f3;
    }
  }

  .text {
    font-weight: bold;
  }

  .logo {
    font-size: 1.7vw;
    margin-right: 0.25vw;
    // color: #c743e4;

    @media only screen and (max-width: 600px) {
      font-size: 6.5vw;
      margin-right: 1vw;
    }
  }
`;
