import { Checkbox, FormControlLabel, Button, Alert } from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import SimpleBackdrop from "../../components/backdrop";

export const Accept = () => {
  // accept state
  const [accept, setAccept] = useState(false);
  const [acceptP, setAcceptP] = useState(false);

  // navigate
  const navigate = useNavigate();

  // current user
  const currentUser = useSelector((state) => state.storeAuth.currentUser);
  useEffect(() => {
    if (!currentUser) {
      navigate("/login");
    }
  }, []);
  // user type
  const type = useSelector((state) => state.storeAuth.userType);

  // loading state
  const [loading, setLoading] = useState(false);

  // alert message
  const [alert, setAlert] = useState({ active: false, text: "", type: "" });

  // backend url
  const backendUrl = useSelector((state) => state.storeApp.backendUrl);
  /**
   * accept terms and rules and confirm register
   */

  const Confirm = async () => {
    setLoading(true);
    if (accept && acceptP) {
      try {
        const response = await axios.patch(
          backendUrl + "/api/v1/users/" + currentUser._id,
          {
            type: type,
            acceptPrivacy: true,
            acceptTerms: true,
            active: true,
            registerStage: "done",
            notifications: [
              {
                senderId: "Beautyverse",
                text: "Welcome Beautyverse",
                date: new Date(),
                type: "welcome",
                status: "unread",
                feed: "",
              },
            ],
            verifyedEmail: true,
          }
        );
        localStorage.setItem(
          "Beautyverse:currentUser",
          JSON.stringify(response.data.data.updatedUser)
        );
        navigate("/feeds");
        setLoading(false);
      } catch (error) {
        console.log(error);
      }
    } else {
      setLoading(false);
      setAlert({
        status: true,
        text: "You have to accept Tearms & Rules and Privacy Police to confirm Register",
        type: "error",
      });
    }
  };
  // page animation transition
  const [transition, setTransition] = useState(false);

  useEffect(() => {
    setTransition(true);
  }, []);
  return (
    <Container transition={transition ? "true" : "false"}>
      <Inputs>
        <FormControlLabel
          control={
            <Checkbox
              checked={accept}
              onChange={() => setAccept(!accept)}
              sx={{
                color: "#f866b1",
                "&.Mui-checked": { color: "#f866b1" },
              }}
            />
          }
          label="Accept Terms & Rules"
          labelPlacement="end"
          style={{ color: "#ccc", letterSpacing: "0.5px" }}
        />

        <FormControlLabel
          control={
            <Checkbox
              checked={acceptP}
              onChange={() => setAcceptP(!acceptP)}
              sx={{
                color: "#f866b1",
                "&.Mui-checked": { color: "#f866b1" },
              }}
            />
          }
          label="Accept Privacy"
          labelPlacement="end"
          style={{ color: "#ccc", letterSpacing: "0.5px" }}
        />
        <div
          style={{
            width: "100%",
            display: "flex",
            justifyContent: "center",
            marginTop: "20px",
          }}
        >
          <Button
            className="button"
            variant="contained"
            style={{ backgroundColor: "#f866b1", color: "white" }}
            sx={{ width: "80%", borderRadius: "50px" }}
            onClick={Confirm}
            //   {...props}
          >
            Confirm Register
          </Button>
        </div>
      </Inputs>
      <SimpleBackdrop open={loading} setOpen={setLoading} />
      {alert?.status && (
        <Alert
          onClick={() => setAlert({ type: "", text: "", status: false })}
          style={{
            position: "absolute",
            bottom: "10px",
            width: "60vw",
          }}
          severity={alert?.type}
        >
          {alert?.text}
        </Alert>
      )}
    </Container>
  );
};

const Container = styled.div`
  height: 80vh;
  width: 100vw;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  right: ${(props) => (props.transition === "true" ? 0 : "-100vw")};
  opacity: ${(props) => (props.transition === "true" ? "1" : "0")};
  transition: ease-in-out 200ms;
`;
const Inputs = styled.div`
  width: 60%;
  height: 80vh;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 4px;
  transition: ease-in 300ms;

  div {
    color: #ccc;
    display: flex;
    align-items: center;
    gap: 8px;

    h4 {
      margin: 0;
    }
  }
  .button {
    &:hover {
      filter: brightness(1.1);
    }
  }
`;
