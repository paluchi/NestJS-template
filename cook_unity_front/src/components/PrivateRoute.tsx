import React, { FC, useContext } from "react";
import { Navigate } from "react-router-dom";
import { UserContext } from "../contexts/userContext";
import { toast } from "react-toastify";

const PrivateRoute: FC<any> = ({
  component,
  allowAccessTo = "platform_user",
}) => {
  const { isLogged, user } = useContext(UserContext); // Use the isLogged state from context

  if (!isLogged) {
    return <Navigate to="/" replace />;
  } else if (user?.type !== allowAccessTo) {
    toast.info("You don't have access to this page");
    return <Navigate to="/" replace />;
  }

  return <>{component}</>;
};

export default PrivateRoute;
