import React, { useState } from "react";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export default function Success(props) {
  const handleClick = () => {
    props?.setOpen(true);
  };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    props?.setOpen(false);
  };

  return (
    <Stack
      spacing={2}
      sx={{
        width: "100%",
        position: "absolute",
        zIndex: 10000,
        bottom: "100px",
      }}
    >
      <Snackbar
        open={props?.open}
        autoHideDuration={6000}
        onClose={handleClose}
      >
        <Alert
          onClose={handleClose}
          severity={props?.type}
          sx={{ width: "100%", marginBottom: "50px" }}
        >
          {props.title}
        </Alert>
      </Snackbar>
    </Stack>
  );
}
