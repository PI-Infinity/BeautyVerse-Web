import React from 'react';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import PersonIcon from '@mui/icons-material/Person';
import { blue } from '@mui/material/colors';
import { useNavigate } from 'react-router-dom';
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import { IsMobile } from '../../functions/isMobile';

function UserListDialog(props) {
  const {
    onClose,
    selectedValue,
    open,
    users,
    title,
    language,
    render,
    setRender,
    type,
    targetUser,
  } = props;
  const currentUser = JSON.parse(
    localStorage.getItem('Beautyverse:currentUser')
  );

  const navigate = useNavigate();
  const isMobile = IsMobile();

  const handleClose = () => {
    onClose(selectedValue);
  };

  const handleListItemClick = (value) => {
    onClose(value);
  };

  const DeleteUser = async (followerId, followingId) => {
    //
    try {
      const url = `https://beautyverse.herokuapp.com/api/v1/users/${followerId}/followings/${followingId}`;
      await fetch(url, { method: 'DELETE' })
        .then((response) => response.json())
        .then(async (data) => {})
        .catch((error) => {
          console.log('Error fetching data:', error);
        });
      const url2 = `https://beautyverse.herokuapp.com/api/v1/users/${followingId}/followers/${followerId}`;
      await fetch(url2, { method: 'DELETE' })
        .then((response) => response.json())
        .then(async (data) => {})
        .catch((error) => {
          console.log('Error fetching data:', error);
        });

      // const data = await response.data;
    } catch (error) {
      console.error(error);
    }
    setRender(!render);
  };

  return (
    <Dialog onClose={handleClose} open={open}>
      <DialogTitle>
        {title} ({users?.length})
      </DialogTitle>
      <List sx={{ pt: 0 }}>
        {users?.map((item) => {
          return (
            <ListItem disableGutters key={item._doc._id} sx={{ pr: 3, pl: 3 }}>
              <ListItemButton
                onClick={
                  item?.followingType === 'user' ||
                  item?.followerType === 'user'
                    ? () =>
                        navigate(
                          `/api/v1/users/${
                            type === 'followers'
                              ? item._doc.followerId
                              : item._doc.followingId
                          }/contact`
                        )
                    : () =>
                        navigate(
                          `/api/v1/users/${
                            type === 'followings'
                              ? item._doc.followingId
                              : item._doc.followerId
                          }`
                        )
                }
              >
                <ListItemAvatar>
                  <Avatar
                    sx={{ bgcolor: blue[100], color: blue[600] }}
                    src={
                      type === 'followings'
                        ? item?.followingCover
                        : item?.followerCover
                    }
                  >
                    <PersonIcon />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={
                    type === 'followings'
                      ? item?.followingName
                      : item?.followerName
                  }
                />
              </ListItemButton>
              {targetUser?._id === currentUser?._id && (
                <Tooltip
                  title={language?.language.User.userPage.remove}
                  onClick={() =>
                    DeleteUser(
                      item._doc.followerId,
                      item._doc.followingId,
                      item._id
                    )
                  }
                >
                  <IconButton>
                    <DeleteIcon />
                  </IconButton>
                </Tooltip>
              )}
            </ListItem>
          );
        })}
      </List>
    </Dialog>
  );
}

// UserListDialog.propTypes = {
//   onClose: PropTypes.func.isRequired,
//   open: PropTypes.bool.isRequired,
//   selectedValue: PropTypes.string.isRequired,
// };

export default function UserListDialogMain(props) {
  const [open, setOpen] = React.useState(false);
  const [selectedValue, setSelectedValue] = React.useState();

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = (value) => {
    setOpen(false);
    setSelectedValue(value);
  };

  return (
    <div>
      <Button
        variant="outlined"
        color="secondary"
        onClick={props.users?.length !== 0 && handleClickOpen}
        sx={{ width: '150px', color: 'purple', gap: '5px' }}
      >
        {props.title}{' '}
        <span style={{ fontWeight: 'normal' }}> ({props.users?.length})</span>
      </Button>
      <UserListDialog
        users={props.users}
        selectedValue={selectedValue}
        open={open}
        onClose={handleClose}
        targetUser={props.targetUser}
        type={props.type}
        title={props.title}
        setRender={props.setRender}
        render={props.render}
        language={props.language}
      />
    </div>
  );
}
