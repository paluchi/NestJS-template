import React, { useContext, useEffect } from "react";
import DynamicForm from "../../components/DynamicForm";
import { UserContext } from "../../contexts/userContext";
import { UserContextType } from "../../types/user";
import { useNavigate } from "react-router-dom";

const LoginFields = [
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
      return null;
    },
  },
];

const ChefLoginPage = () => {
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
      title="Login as chef"
      description={
        <span>
          Don't have an account? Register here: <br />
          <a
            href="http://localhost:4000/api-docs#/Interns%20auth/AuthController_register"
            target="_blank"
            rel="noopener noreferrer"
          >
            Register a new intern (publicly accessible as it's a PoC)
          </a>
        </span>
      }
      fields={LoginFields}
      onSubmit={async (data) => {
        try {
          const { username, password } = data;
          // await 1 second to simulate a network request
          await new Promise((resolve) => setTimeout(resolve, 1000));
          await userContext.login(username, password, "platform_intern");
        } catch (error) {
          console.log("error:", error);
        }
      }}
    />
  );
};

export default ChefLoginPage;
