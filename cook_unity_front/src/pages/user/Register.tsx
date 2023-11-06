import React, { useContext, useEffect } from "react";
import DynamicForm from "../../components/DynamicForm";
import { UserContext } from "../../contexts/userContext";
import { UserContextType } from "../../types/user";
import { useNavigate } from "react-router-dom";

const registerFields = [
  {
    label: "Username",
    key: "username",
    required: true,
    validate: async (value: string) => {
      if (value.length < 3) {
        return "Username should be at least 3 characters";
      }
      return null;
    },
  },
  {
    label: "Password",
    key: "password",
    type: "password",
    required: true,
    validate: async (value: string) => {
      if (value.length < 8) {
        return "Password should be at least 8 characters";
      }
      if (!/[A-Z]/.test(value)) {
        return "Password should have at least one uppercase letter";
      }
      if (!/[a-z]/.test(value)) {
        return "Password should have at least one lowercase letter";
      }
      if (!/[0-9]/.test(value)) {
        return "Password should have at least one number";
      }
      return null;
    },
  },
];

const RegisterPage = () => {
  const userContext: UserContextType = useContext(UserContext);
  const navigate = useNavigate();

  // Redirect to / if user is logged in
  useEffect(() => {
    if (userContext.isLogged) {
      navigate("/");
    }
  }, [userContext.isLogged]);

  if (userContext.loading || userContext.isLogged) return <div>Loading...</div>;

  return (
    <DynamicForm
      title="Register"
      fields={registerFields}
      onSubmit={async (data: any) => {
        try {
          const { username, password } = data;
          await userContext.register(username, password);
          await userContext.login(username, password);
          // Registration successful
          // You may navigate to the login page or home page post registration
          navigate("/");
        } catch (error) {
          console.log("error:", error);
          // Handle registration error
          // Show an error message to the user
        }
      }}
    />
  );
};

export default RegisterPage;
