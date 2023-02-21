import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import { setBackdropOpen } from "../redux/main";
import { useSelector, useDispatch } from "react-redux";

export default function SimpleBackdrop(props) {
  const dispatch = useDispatch();
  // import backdrop
  const backdropOpen = useSelector((state) => state.storeMain.backdrop);

  const handleClose = () => {
    dispatch(setBackdropOpen(false));
  };

  return (
    <div>
      <Backdrop
        sx={{
          color: "#fff",
          zIndex: (theme) => theme.zIndex.drawer + 1,
        }}
        open={backdropOpen}
        onClick={handleClose}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </div>
  );
}
