import React from "react";
import styled from "styled-components";

const CheckoutPage = () => {
  return (
    <Container>
      <Header>Checkout</Header>
      <Form>
        <Label>Name</Label>
        <Input type="text" name="name" />
        <Label>Address</Label>
        <Input type="text" name="address" />
        <Label>Email</Label>
        <Input type="email" name="email" />
        <Label>Card Number</Label>
        <Input type="text" name="cardNumber" />
        <Button>Submit</Button>
      </Form>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 80%;
  margin: 0 auto;
`;

const Header = styled.h2`
  margin: 20px 0;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  padding: 20px;
  border: 1px solid lightgray;
  border-radius: 10px;
`;

const Input = styled.input`
  width: 100%;
  margin: 10px 0;
  padding: 10px;
  font-size: 16px;
  border: 1px solid lightgray;
  border-radius: 5px;
`;

const Label = styled.label`
  font-size: 18px;
  margin-bottom: 5px;
`;

const Button = styled.button`
  width: 50%;
  padding: 10px;
  margin: 20px 0;
  background-color: blue;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
`;

export default CheckoutPage;
