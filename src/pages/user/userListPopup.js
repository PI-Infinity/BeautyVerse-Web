import React, { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { db } from "../../firebase";
import { doc, deleteDoc } from "firebase/firestore";
import PropTypes from "prop-types";
import Button from "@mui/material/Button";
import Avatar from "@mui/material/Avatar";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import DialogTitle from "@mui/material/DialogTitle";
import Dialog from "@mui/material/Dialog";
import PersonIcon from "@mui/icons-material/Person";
import { blue } from "@mui/material/colors";
import { useNavigate } from "react-router-dom";
import DeleteIcon from "@mui/icons-material/Delete";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";

function UserListDialog(props) {
  const { onClose, selectedValue, open } = props;
  const { currentUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleClose = () => {
    onClose(selectedValue);
  };

  const handleListItemClick = (value) => {
    onClose(value);
  };

  // delete user from firestore
  const Deleting = async (type, targetId) => {
    const ref = doc(db, "users", currentUser?.uid, type, targetId);
    await deleteDoc(ref);
  };

  return (
    <Dialog onClose={handleClose} open={open}>
      <DialogTitle>{props?.title}</DialogTitle>
      <List sx={{ pt: 0 }}>
        {props?.users?.map((item) => (
          <ListItem disableGutters sx={{ pr: 3, pl: 3 }}>
            <ListItemButton
              onClick={() => navigate(`/user/${item.id}`)}
              key={item.name}
            >
              <ListItemAvatar>
                <Avatar
                  sx={{ bgcolor: blue[100], color: blue[600] }}
                  src={item?.cover}
                >
                  <PersonIcon />
                </Avatar>
              </ListItemAvatar>
              <ListItemText primary={item.name} />
            </ListItemButton>
            {props.user?.id === currentUser?.uid && (
              <Tooltip
                title={props?.language?.language.User.userPage.remove}
                onClick={() => Deleting(props.type, item.id)}
              >
                <IconButton>
                  <DeleteIcon />
                </IconButton>
              </Tooltip>
            )}
          </ListItem>
        ))}
      </List>
    </Dialog>
  );
}

UserListDialog.propTypes = {
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  selectedValue: PropTypes.string.isRequired,
};

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
        onClick={handleClickOpen}
        sx={{ width: "150px", color: "purple" }}
      >
        {props.title}
      </Button>
      <UserListDialog
        users={props.users}
        selectedValue={selectedValue}
        open={open}
        onClose={handleClose}
        user={props.user}
        type={props.type}
        title={props.title}
        language={props?.language}
      />
    </div>
  );
}
