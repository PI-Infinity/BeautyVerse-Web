import React from "react";
import { createGlobalStyle } from "styled-components";

export const darkTheme = {
  background: "#FCFDFF",
  icon: "#292846",
  mainFont: "#050505",
  disabled: "#ddd",
  secondLevel: "",
};
export const lightTheme = {
  background: "#FCFDFF",
  icon: "blue",
  mainFont: "#050505",
  disabled: "#ddd",
  secondLevel: "#65676b",
};

export const GlobalStyles = createGlobalStyle`

    body {
        background-color: ${(props) => props.theme.body}
    }

`;
