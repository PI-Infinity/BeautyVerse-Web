import * as React from "react";
import PropTypes from "prop-types";
import Button from "@mui/material/Button";
import { styled } from "@mui/material/styles";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import Typography from "@mui/material/Typography";
import { BsListCheck } from "react-icons/bs";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase";

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
}));

function BootstrapDialogTitle(props) {
  const { children, onClose, ...other } = props;

  return (
    <DialogTitle sx={{ m: 0, p: 2 }} {...other}>
      {children}
      {onClose ? (
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </DialogTitle>
  );
}

BootstrapDialogTitle.propTypes = {
  children: PropTypes.node,
  onClose: PropTypes.func.isRequired,
};

export default function ProceduresList({ id }) {
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  // user procedures
  const [procedures, setProcedures] = React.useState([]);
  React.useEffect(() => {
    console.log(id);
    const Getting = async () => {
      const ref = collection(db, "users", `${id}`, "procedures");
      const querySnapshot = await getDocs(ref);
      let list = [];
      querySnapshot.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots
        list.push(doc.data());
      });
      setProcedures(list);
    };
    id && Getting();
  }, [id]);

  return (
    <div>
      <Button variant="outlined" onClick={handleClickOpen}>
        <BsListCheck /> Procedures
      </Button>
      <BootstrapDialog
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={open}
      >
        <BootstrapDialogTitle
          id="customized-dialog-title"
          onClose={handleClose}
        >
          Procedures
        </BootstrapDialogTitle>
        <div
          style={{
            padding: "20px",
            display: "flex",
            flexDirection: "column",
            gap: "10px",
          }}
        >
          {procedures?.map((item, index) => {
            return (
              <div key={index}>
                <b>{index + 1}.</b> {item?.value}{" "}
                <b>
                  {item?.price}
                  {item?.price?.length > 0 && " Gel"}
                </b>
              </div>
            );
          })}
        </div>
        <DialogActions>
          <Button autoFocus onClick={handleClose}>
            Save changes
          </Button>
        </DialogActions>
      </BootstrapDialog>
    </div>
  );
}
