import React from "react";
import styled from "styled-components";
import CostumizedList from "../../pages/adminDashboard/categoryList";
import { Outlet, useNavigate } from "react-router-dom";

export default function AdminDashboard() {
  document.body.style.overflowY = "hidden";
  return (
    <Container>
      <CostumizedList />
      <Content>
        <Outlet />
      </Content>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
`;

const Content = styled.div`
  width: 100%;
  height: 100vh;
  background: #fff;
`;
