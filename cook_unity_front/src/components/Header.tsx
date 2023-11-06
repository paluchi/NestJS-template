import React, { useState, FC } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import logo from "../assets/logo.svg";
import {
  AppBar,
  Toolbar,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";

const Logo = styled.img`
  width: 150px;
  cursor: pointer;

  // Under 600px, the logo will be smaller
  @media (max-width: 600px) {
    width: 90px;
  }
`;

const NavItems = styled.ul`
  display: flex;
  gap: 20px;
  align-items: center;
`;

const NavItem = styled.li`
  cursor: pointer;
  list-style-type: none;
`;

const Spacer = styled.div`
  flex-grow: 1;
`;

const DrawerContent = styled.div`
  width: 250px;
  min-height: 100vh;
  display: flex; // Set as a flex container
  flex-direction: column; // Arrange children in a column
`;

const DrawerHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding: 8px;
`;

const HeaderContent = styled.div`
  height: 100%;
  width: 100%;
  max-width: 1200px; // The maximum width for the content
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px; // The padding on the sides
  margin: auto; // This will center the HeaderContent inside the Toolbar
`;

interface HeaderItem {
  label: string | JSX.Element;
  callback?: () => void;
  hideMobile?: boolean; // Optional property to hide the item on mobile view
}

interface BottomDrawerItem {
  label: string | JSX.Element;
  callback?: () => void;
}

interface HeaderProps {
  items: HeaderItem[];
  bottomDrawerItems?: BottomDrawerItem[]; // Optional property for items at the bottom of the drawer
}

const Header: FC<HeaderProps> = ({ items, bottomDrawerItems }) => {
  const [isDrawerOpen, setDrawerOpen] = useState(false);
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const handleDrawerOpen = () => {
    setDrawerOpen(true);
  };

  const handleDrawerClose = () => {
    setDrawerOpen(false);
  };

  const handleNavigate = (callback?: () => void) => {
    callback && callback();
    handleDrawerClose();
  };

  return (
    <>
      <AppBar position="fixed">
        <Toolbar>
          <HeaderContent>
            <Logo
              src={logo}
              alt="CookUnity Logo"
              onClick={() => navigate("/")}
            />
            {/* Spacer to push the navigation items and menu icon to the edges */}
            <Spacer />
            {/* Desktop NavItems will only show when isMobile is false */}
            {!isMobile && (
              <NavItems>
                {items.map((item, index) => (
                  <NavItem
                    key={index}
                    onClick={item.callback ? item.callback : undefined}
                  >
                    {item.label}
                  </NavItem>
                ))}
              </NavItems>
            )}
            {/* MenuIcon and Drawer will only show when isMobile is true */}
            {isMobile && (
              <IconButton
                color="inherit"
                aria-label="open drawer"
                edge="end"
                onClick={handleDrawerOpen}
              >
                <MenuIcon />
              </IconButton>
            )}
          </HeaderContent>
        </Toolbar>
      </AppBar>

      <Drawer anchor="right" open={isDrawerOpen} onClose={handleDrawerClose}>
        <DrawerContent>
          <DrawerHeader>{/* ... */}</DrawerHeader>
          <List>
            {items
              .filter((item) => !item.hideMobile)
              .map((item, index) => (
                <ListItem
                  button
                  key={index}
                  onClick={() => handleNavigate(item.callback)}
                >
                  <ListItemText primary={item.label} />
                </ListItem>
              ))}
          </List>
          <div style={{ flexGrow: 1 }} />
          <List>
            {bottomDrawerItems &&
              bottomDrawerItems.map((item, index) => (
                <ListItem
                  button
                  key={`bottom-${index}`}
                  onClick={() => handleNavigate(item.callback)}
                >
                  <ListItemText primary={item.label} />
                </ListItem>
              ))}
          </List>
        </DrawerContent>
      </Drawer>

      {/* This div is used to add space at the top of the page content, so it is not hidden under the AppBar. */}
      <div style={{ marginTop: 64 }}>{/* Page content goes here */}</div>
    </>
  );
};

export default Header;
