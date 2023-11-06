import React, { useContext, useState } from "react";
import { Routes, Route } from "react-router-dom";
import styled from "styled-components";
import Header from "./components/Header";
import { useNavigate } from "react-router-dom";
import RegisterPage from "./pages/user/Register";
import HomePage from "./pages/Home";
import { Button, Menu, MenuItem } from "@mui/material";
import AccountCircle from "@mui/icons-material/AccountCircle";
import "./utils/globalStyles.css";
import { UserContext } from "./contexts/userContext";
import LoginPage from "./pages/user/Login";
import PrivateRoute from "./components/PrivateRoute";
import MealsPage from "./pages/user/Meals";
import ChefLoginPage from "./pages/chef/Login";
import MenuPage from "./pages/chef/Menu";

const About = () => <h2>About</h2>;

const App = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useNavigate();
  const userContext = useContext(UserContext);

  // Show loading component while loading user data
  if (userContext.loading) return <div>Loading...</div>;

  const handleMenu = (event: any) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    handleClose();
    userContext.logout();
  };

  const headerItems = !userContext.isLogged
    ? [
        {
          label: "Register",
          callback: () => navigate("/register"),
        },
        {
          label: "Log in",
          callback: () => navigate("/login"),
        },
        {
          label: "I'm a Chef",
          callback: () => navigate("/chefs_login"),
          hideMobile: true,
        },
      ]
    : [
        {
          label: (
            <>
              <Button
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleMenu}
                color="inherit"
                startIcon={<AccountCircle />}
              >
                {userContext.user!.username}
                {/* Assuming you have a userName in your context */}
              </Button>
              <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "right",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                style={{ marginTop: "18px" }} // Adjust the top margin to control the distance below the icon
                MenuListProps={{
                  style: {
                    minWidth: "200px", // Set the minimum width of the menu list
                  },
                }}
                open={Boolean(anchorEl)}
                onClose={handleClose}
              >
                <MenuItem onClick={handleLogout}>Log out</MenuItem>
              </Menu>
            </>
          ),
          hideMobile: true,
        },
      ];

  const StyledAppContainer = styled.div`
    height: 100%;
    width: 100%;
    background-color: #f2f2f2;
    padding-top: 40px;
    box-sizing: border-box;
    max-width: 1200px;
    padding-inline: 20px;
  `;

  const bottomDrawerItems = !userContext.isLogged
    ? [
        {
          label: "I'm a Chef",
          callback: () => navigate("/chefs_login"),
        },
      ]
    : [{ label: "Log Out", callback: handleLogout }];

  const NotFound = () => <h1>Not Found</h1>;

  return (
    <>
      <Header items={headerItems} bottomDrawerItems={bottomDrawerItems} />
      <StyledAppContainer>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/chefs_login" element={<ChefLoginPage />} />
          <Route
            path="/chef_menu"
            element={
              <PrivateRoute
                component={<MenuPage />}
                allowAccessTo={"platform_intern"}
              />
            }
          />
          <Route
            path="/meals"
            element={<PrivateRoute component={<MealsPage />} />}
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </StyledAppContainer>
    </>
  );
};

export default App;
