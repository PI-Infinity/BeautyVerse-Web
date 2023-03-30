import * as React from 'react';
import styled from 'styled-components';
import ListItem from '@mui/material/ListItem';
import Divider from '@mui/material/Divider';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { BsStars } from 'react-icons/bs';
import AgreementDialog from '../components/agreementDialog';
import { Language } from '../context/language';
import axios from 'axios';
import {
  setRerenderCurrentUser,
  setRerenderNotifications,
} from '../redux/rerenders';

export default function Notifications(props) {
  const language = Language();
  const dispatch = useDispatch();

  const handleClose = () => {
    props?.setOpen(false);
  };

  return (
    <BG onClick={handleClose}>
      <Container onClick={(event) => event.stopPropagation()}>
        <Title>{language?.language.Main.menu.notifications}</Title>
        <List>
          {props.notifications.map((item, index) => {
            return (
              <Item
                {...item}
                notifications={props.notifications}
                setNotifications={props.setNotifications}
                setOpen={props.setOpen}
              />
            );
          })}
        </List>
      </Container>
    </BG>
  );
}

const BG = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 10000;
  background: rgba(0, 0, 0, 0.5);
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: start;
  margin-top: 3vh;
  width: 50vw;
  height: 80vh;
  background: ${(props) => props.theme.background};
  border-radius: 10px;
  box-sizing: border-box;
  padding: 1.5vw;

  @media only screen and (max-width: 600px) {
    width: 80vw;
    height: 80vh;
    padding: 2vw;
  }
`;

const List = styled.ul`
  width: 100%;
  overflow-y: scroll;
  list-style: none;

  @media only screen and (max-width: 600px) {
  }
`;

function Item(props) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  // import current user from redux state
  const currentUser = JSON.parse(
    localStorage.getItem('Beautyverse:currentUser')
  );

  const theme = useSelector((state) => state.storeMain.theme);

  const ReadNotification = async (id) => {
    try {
      const response = await axios.patch(
        `https://beautyverse.herokuapp.com/api/v1/users/${currentUser?._id}/notifications/${id}`,
        {
          status: 'read',
        }
      );
      await findNotificationByIdAndMarkAsRead(id);
    } catch (error) {}
  };

  // agreement dialog
  const [agreementDialog, setAgreementDialog] = React.useState(false);

  const findNotificationByIdAndMarkAsRead = (id) => {
    const updatedNotifications = props.notifications.map((notification) => {
      if (notification._id === id) {
        return { ...notification, status: 'read' };
      }
      dispatch(setRerenderNotifications());
      return notification;
    });

    props.setNotifications(updatedNotifications);
  };

  return (
    <>
      <ItemContainer>
        <ListItem
          alignItems="flex-start"
          className="item"
          onClick={(event) => {
            event.stopPropagation();
            // handle list item click logic here

            if (props.status === 'unread') {
              if (props.type === 'offer') {
                setAgreementDialog(true);
              }

              return ReadNotification(props._id);
            } else {
              props.setOpen(false);
              return navigate(props.feed);
            }
          }}
        >
          <ListItemAvatar>
            {props.senderId === 'beautyVerse' ? (
              <BsStars className="logo" onClick={() => navigate('/')} />
            ) : (
              <Avatar alt="Remy Sharp" src={currentUser?.cover} />
            )}
          </ListItemAvatar>

          <ListItemText
            primary={
              <span
                style={{
                  fontWeight: props.status === 'unread' ? 'bold' : 'normal',
                  color: props.status === 'unread' ? 'green' : 'orange',
                }}
              >
                {props.type === 'welcome' ? 'მოგესალმებით!' : 'შეტყობინება'}
              </span>
            }
            secondary={
              <React.Fragment>
                <Typography
                  sx={{
                    display: 'inline',
                    fontWeight: 'bold',
                    color: theme ? '#fff' : '#111',
                  }}
                  component="span"
                  variant="body2"
                  color="text.primary"
                >
                  {props.type !== 'welcome' && currentUser?.name}{' '}
                </Typography>
                <span
                  style={{
                    fontWeight: props.status === 'unread' ? 'bold' : 'normal',
                    color: props.status === 'unread' ? 'green' : '#ccc',
                  }}
                >
                  {props.text}
                </span>
              </React.Fragment>
            }
          />
          {props.type === 'offer' ? (
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
      </ItemContainer>
      <Divider variant="inset" component="li" />
    </>
  );
}

const Title = styled.h3`
  color: ${(props) => props.theme.font};
`;

const ItemContainer = styled.div`
  width: 90%;
  height: auto;
  display: flex;
  align-items: center;
  cursor: pointer;
  background: ${(props) => props.theme.background};
  font-size: 12px;

  :hover {
    filter: brightness(1.4);
  }
`;
