import React, { useContext } from "react";
import styled from "styled-components";
import Button from "../components/Button";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../contexts/userContext";

const HomePageContainer = styled.div`
  display: flex;
  flex-direction: column;
  background-color: #f2f2f2;
  max-width: 900px;
`;

const ButtonsContainer = styled.div`
  display: flex;
  flex-direction: row;
  margin: 20px 0;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  margin-bottom: 20px;
`;

const RegisterButton = styled(Button)`
  font-size: 1.5rem;
  padding: 15px 30px;
`;

const HomePage = () => {
  const navigate = useNavigate();
  const userContext = useContext(UserContext);

  const buttons = !userContext.isLogged ? (
    <>
      <RegisterButton
        color="lightGreen"
        onClick={() => {
          navigate("/register");
        }}
      >
        Register
      </RegisterButton>
      <Button
        onClick={() => {
          navigate("/login");
        }}
      >
        Login
      </Button>
    </>
  ) : userContext.user?.type === "platform_user" ? (
    <>
      <Button
        color="lightGreen"
        onClick={() => {
          navigate("/meals");
        }}
      >
        Go to Meals
      </Button>
    </>
  ) : (
    <>
      <Button
        color="lightGreen"
        onClick={() => {
          navigate("/chef_menu");
        }}
      >
        Go to Menu
      </Button>
    </>
  );

  return (
    <HomePageContainer>
      <Title>
        Welcome to
        <br />
        Gonzalo Alessandrelli's Technical test
      </Title>
      <ButtonsContainer>{buttons}</ButtonsContainer>
    </HomePageContainer>
  );
};

export default HomePage;
