import * as React from "react";
import styled from "styled-components";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Divider from "@mui/material/Divider";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { updateDoc, doc } from "firebase/firestore";
import { db } from "../firebase";
import { BsStars, BsLayoutTextSidebarReverse } from "react-icons/bs";
import AgreementDialog from "../components/agreementDialog";

export default function Notifications(props) {
  const handleClose = () => {
    props?.setOpen(false);
  };

  return (
    <div>
      <Dialog open={props?.open} onClose={handleClose}>
        <DialogTitle>შეტყობინებები</DialogTitle>
        <DialogContent>
          <AlignItemsList notifications={props.notifications} />
        </DialogContent>
      </Dialog>
    </div>
  );
}

function AlignItemsList(props) {
  const navigate = useNavigate();

  // import current user from redux state
  const userUnparsed = useSelector((state) => state.storeMain.user);

  let currentuser;
  if (userUnparsed?.length > 0) {
    currentuser = JSON.parse(userUnparsed);
  }

  // read notification
  const ReadNotification = async (id) => {
    await updateDoc(doc(db, "users", currentuser?.id, "notifications", id), {
      status: "read",
    });
  };

  // agreement dialog
  const [agreementDialog, setAgreementDialog] = React.useState(false);

  const UpdateOffer = async (senderId) => {
    await updateDoc(doc(db, "users", senderId, "team", currentuser?.id), {
      confirm: true,
    });
  };

  return (
    <List sx={{ width: "100%", maxWidth: 360, bgcolor: "background.paper" }}>
      {props?.notifications?.map((item, index) => {
        return (
          <>
            <Container>
              <ListItem
                alignItems="flex-start"
                className="item"
                onClick={() => {
                  if (item?.status === "unread") {
                    if (item?.type === "offer") {
                      setAgreementDialog(true);
                      ReadNotification(item?.id);
                    } else {
                      return ReadNotification(item?.id);
                    }
                  } else {
                    return navigate(item?.feed);
                  }
                }}
              >
                <ListItemAvatar>
                  {item?.senderName === "Beautyverse" ? (
                    <BsStars className="logo" onClick={() => navigate("/")} />
                  ) : (
                    <Avatar alt="Remy Sharp" src={item?.cover} />
                  )}
                </ListItemAvatar>

                <ListItemText
                  primary={
                    <span
                      style={{
                        fontWeight:
                          item?.status === "unread" ? "bold" : "normal",
                      }}
                    >
                      {item?.type === "welcome"
                        ? "მოგესალმებით!"
                        : "შეტყობინება"}
                    </span>
                  }
                  secondary={
                    <React.Fragment>
                      <Typography
                        sx={{
                          display: "inline",
                          fontWeight:
                            item?.status === "unread" ? "bold" : "normal",
                        }}
                        component="span"
                        variant="body2"
                        color="text.primary"
                      >
                        {item?.type !== "welcome" && item?.senderName}{" "}
                      </Typography>
                      <span
                        style={{
                          fontWeight:
                            item?.status === "unread" ? "bold" : "normal",
                        }}
                      >
                        {item?.text}
                      </span>
                    </React.Fragment>
                  }
                />
                {item?.type === "offer" ? (
                  <AgreementDialog
                    title="დაადასტურეთ!"
                    text="გსურთ შეთავაზებულ გუნდში გაწევრიანება?"
                    setOpen={setAgreementDialog}
                    open={agreementDialog}
                    function={() => UpdateOffer(item.senderId)}
                  />
                ) : (
                  ""
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
