import React from "react";
import { Chart } from "react-google-charts";
import styled from "styled-components";
import { UserPie } from "../../pages/adminDashboard/statistics-userPie";
import { useSelector, useDispatch } from "react-redux";

export default function Statistics() {
  const users = useSelector((state) => state.storeMain.userList);
  let Data;
  if (users?.length > 0) {
    Data = JSON.parse(users);
  }

  const data = [
    ["Year", "Users", "Salons", "Specialists"],
    ["2014", 1000, 400, 200],
    ["2015", 1170, 460, 250],
    ["2016", 660, 1120, 300],
    ["2017", 1030, 540, 350],
  ];

  const options = {
    chart: {
      title: "Registrations",
    },
  };

  return (
    <Container>
      <Chart
        chartType="Bar"
        width="80%"
        height="400px"
        data={data}
        options={options}
      />
      <UserPie Data={Data} />
    </Container>
  );
}

const Container = styled.div`
  padding: 20px;
`;
