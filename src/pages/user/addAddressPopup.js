import React from "react";
import styled from "styled-components";
import { db } from "../../firebase";
import { useDispatch, useSelector } from "react-redux";
import { updateDoc, doc, deleteField, deleteDoc } from "firebase/firestore";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { Language } from "../../context/language";
import { BiLocationPlus } from "react-icons/bi";
import { GrMapLocation, GrLocation } from "react-icons/gr";
import MapAutocomplete from "../../components/mapAutocomplete";
import { MdDeleteForever } from "react-icons/md";
import { setMap } from "../../redux/register";

export default function AddAddress({
  language,
  currentuser,
  type,
  address,
  setAddress,
}) {
  const dispatch = useDispatch();

  const [open, setOpen] = React.useState(false);
  const map = useSelector((state) => state.storeRegister.map);

  const handleClickOpen = async () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  // address

  function findValueByPrefix(object, prefix) {
    let addressesList = [];
    for (var property in object) {
      if (
        object.hasOwnProperty(property) &&
        property.toString().startsWith(prefix)
      ) {
        addressesList?.push(object[property]);
      }
    }
    return addressesList?.sort((a, b) => a?.number - b?.number);
  }

  const addresses = findValueByPrefix(currentuser, "address");

  const Add = async () => {
    if (address?.length > 0) {
      await updateDoc(doc(db, "users", currentuser?.id), {
        [`address${addresses[addresses?.length - 1]?.number + 1}`]: {
          number: addresses[addresses?.length - 1]?.number + 1,
          country: map.country,
          region: map.region,
          city: map.city,
          district: map.district,
          address: map.street,
          streetNumber: map.number,
          latitude: map.latitude,
          longitude: map.longitude,
        },
      });
      setAddress("");
      dispatch(setMap(""));
    } else {
      alert("Add address...");
      setAddress("");
      dispatch(setMap(""));
    }
  };

  const DeleteDoc = async (x) => {
    const docRef = doc(db, "users", currentuser?.id);
    const data = {
      [`address${x}`]: deleteField(),
    };

    updateDoc(docRef, data)
      .then(() => {
        console.log("Code Field has been deleted successfully");
      })
      .catch(() => {
        console.log("error");
      });
  };

  return (
    <Container>
      <Button>
        <BiLocationPlus color="orange" size={28} onClick={handleClickOpen} />
      </Button>
      <Dialog
        PaperProps={{
          style: {
            width: "100%",
            height: "50vh",
            display: "flex",
            justifyContent: "center",
          },
        }}
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          <GrMapLocation /> {language?.language.User.userPage.address}
        </DialogTitle>
        <DialogContent>
          <p style={{ margin: "0 auto 10px auto", fontSize: "14px" }}>
            {language?.language.User.userPage.addAddress}{" "}
            {addresses?.length + 1}
          </p>
          <MapAutocomplete
            language={language}
            address={address}
            setAddress={setAddress}
            userMobile={type}
          />
          <List>
            {addresses?.map((item, index) => {
              return (
                <div
                  key={index}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    margin: "5px 0",
                    gap: "5px",
                  }}
                >
                  <GrLocation />
                  <b>
                    {language?.language.User.userPage.address}
                    {index === 0 ? "" : index}:
                  </b>
                  <div
                    style={{
                      borderRadius: "5px",
                      boxShadow: "0 0.1vw 0.2vw rgba(0,0,0,0.1)",
                    }}
                  >
                    {item?.city}
                    {item?.district?.length > 0 && ", " + item?.district}
                    {item?.address?.length > 0 && ", " + item?.address}
                    {item?.streetNumber?.length > 0 &&
                      ", " + item?.streetNumber}
                  </div>
                  {item?.number !== 1 && (
                    <MdDeleteForever
                      size={20}
                      style={{
                        cursor: "pointer",
                        color: "red",
                      }}
                      onClick={() => DeleteDoc(item?.number)}
                    />
                  )}
                </div>
              );
            })}
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>
            {language?.language.User.userPage.cancel}
          </Button>
          <Button onClick={Add} autoFocus>
            {language?.language.User.userPage.add}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

const Container = styled.div``;
const List = styled.div`
  font-size: 14px;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 5px;
  margin-top: 30px;

  @media only screen and (max-width: 600px) {
    font-size: 12px;
    margin-top: 3vw;
  }
`;
