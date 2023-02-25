import * as React from "react";
import styled from "styled-components";
import TextField from "@mui/material/TextField";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";

export default function BasicTimePicker(props) {
  const [value, setValue] = React.useState(null);

  return (
    <Container>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <TimePicker
          label={props.title}
          value={props.value}
          className="picker"
          ampm={false}
          style={{ color: "#fff", background: "red" }}
          onChange={(newValue) => {
            props.setValue(newValue);
          }}
          renderInput={(params) => <TextField {...params} />}
        />
      </LocalizationProvider>
    </Container>
  );
}

const Container = styled.div`
  .picker {
    background: ${(props) => props.theme.categoryItem};
    color: red;

    :placeholder {
      color: ${(props) => props.theme.font};
    }
  }
`;
