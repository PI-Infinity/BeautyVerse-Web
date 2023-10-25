import React, { useEffect, useState } from "react";
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { Header } from "./header";

export const Settings = () => {
  // navigation
  const navigate = useNavigate();

  const currentUser = JSON.parse(
    localStorage.getItem("Beautyverse:currentUser")
  );

  /**
   *
   * Logout function
   */

  const Logout = async () => {
    try {
      localStorage.removeItem("Beautyverse:currentUser");
      navigate("/login");
    } catch (error) {
      console.log(error.response.data.message);
    }
  };

  // animation
  const [animation, setAnimation] = useState(false);
  useEffect(() => {
    setAnimation(true);
  }, []);
  return (
    <Container transition={animation ? "true" : "false"}>
      <Header
        back={`/profile/${
          currentUser?.type === "shop"
            ? "showroom"
            : currentUser?.type === "user"
            ? "contact"
            : "feeds"
        }`}
      />
      <Button
        variant="contained"
        className="button"
        style={{ backgroundColor: "#f866b1", color: "white" }}
        sx={{ width: "40%", borderRadius: "50px", marginTop: "10px" }}
        onClick={Logout}
        //   {...props}
      >
        Logout
      </Button>
    </Container>
  );
};

const Container = styled.div`
  height: 80vh;
  width: 100vw;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  right: ${(props) => (props.transition === "true" ? 0 : "-100vw")};
  opacity: ${(props) => (props.transition === "true" ? "1" : "0")};
  transition: ease-in 200ms;

  .button {
    &:hover {
      filter: brightness(1.1);
    }
  }
`;
