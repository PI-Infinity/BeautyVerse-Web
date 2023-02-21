import React from "react";
import { Chart } from "react-google-charts";

export function UserPie({ Data }) {
  const data = [
    ["Task", "Hours per Day"],
    ["Users", Data?.filter((item) => item.type === "user")?.length],
    ["Specialists", Data?.filter((item) => item.type === "specialist")?.length],
    ["Salons", Data?.filter((item) => item.type === "beautyCenter")?.length],
  ];

  const options = {
    title: "Registered User Types",
  };
  return (
    <Chart
      chartType="PieChart"
      data={data}
      options={options}
      width={"80%"}
      height={"400px"}
    />
  );
}
