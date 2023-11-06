import React from "react";
import styled from "styled-components";

interface ButtonProps {
  onClick?: () => void;
  text?: string;
  color?: string;
  children?: React.ReactNode;
}

const StyledButton = styled.button`
  padding: 10px 20px;
  margin: 10px;
  border: none;
  cursor: pointer;
  background-color: ${(props) => props.color || "#FFFFFF"};
  transition: background-color 0.3s ease, box-shadow 0.3s ease;

  &:hover {
    background-color: ${(props) => props.color || "#eee"};
    box-shadow: inset 0 0 0 1000px rgba(0, 0, 0, 0.1); // This will apply a slight dark overlay
  }
`;

const Button: React.FC<ButtonProps> = ({ onClick, text, color, children }) => {
  return (
    <StyledButton onClick={onClick ? onClick : undefined} color={color}>
      {text || children}
    </StyledButton>
  );
};

export default Button;
