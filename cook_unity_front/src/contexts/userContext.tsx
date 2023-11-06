import React, { createContext, useState, useEffect } from "react";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import fetch from "../utils/fetcher";
import { UserContextType, User, UserType } from "../types/user"; // Ensure these are properly defined in your types
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export const UserContext = createContext<UserContextType>(null as any);

export const UserProvider: React.FC<any> = ({ children }) => {
  const [userData, setUserData] = useState<User | null>(null);
  const [jwt, setJwt] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const navigate = useNavigate();

  const checkExpiration = (token: string | null = jwt) => {
    if (!token) return { expired: true, decodedJwt: null };

    // Decode the JWT token
    const decoded = jwtDecode(token) as any;

    // Optionally check if the token is expired based on current time
    // This is client side only, you should verify the token server-side as well
    const currentTime = Date.now() / 1000;

    const hasExpired = decoded.exp ? decoded.exp < currentTime : false;

    return { expired: hasExpired, decodedJwt: decoded };
  };

  const loadContext = (jwt?: string) => {
    try {
      if (!jwt) jwt = Cookies.get("jwt");
      if (!jwt) throw new Error("No JWT found");

      const { expired, decodedJwt } = checkExpiration(jwt);

      if (expired) {
        // Token expired, handle accordingly
        logout();
        throw new Error("Session expired");
      }

      // Token valid, you can make a request to your server to validate and fetch user details
      Cookies.set("jwt", jwt, {
        expires: 100,
        path: "/",
        secure: true,
        sameSite: "Strict",
      });
      // const response = await fetch("/current-user", {
      //   headers: { Authorization: `Bearer ${token}` },
      // });
      setJwt(jwt);
      setUserData(decodedJwt);

      return decodedJwt;
    } catch (error) {
      logout();
      return false;
    }
  };

  useEffect(() => {
    setLoading(true);
    const checkUserLoggedIn = async () => {
      const context = loadContext();
      if (context) {
        toast.success(`Welcome back ${context.username}!`);
        setLoading(false);
      }
    };

    checkUserLoggedIn();
  }, []);

  const register = async (username: string, password: string) => {
    setLoading(true);
    try {
      const payload = {
        username: username,
        password: password,
      };

      await fetch("/user/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json", // Ensure you're setting the content type
        },
        data: payload, // Pass the corrected payload here
      });
      login(username, password);
    } catch (error: any) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  const login = async (
    username: string,
    password: string,
    as: UserType = "platform_user"
  ) => {
    setLoading(true);
    try {
      const payload = {
        username: username,
        password: password,
      };

      const path =
        as === "platform_user" ? "/user/auth/login" : "/intern/auth/login";

      const response = await fetch(path, {
        method: "POST",
        data: payload,
      });

      // Assuming the JWT is returned in the response under the token key
      const { jwt } = response.data;

      if (jwt) {
        // Securely set the JWT in a cookie
        // You might want to set additional options, like `expires` or `secure` based on your requirements
        const context = loadContext(jwt);
        return context;
      }
    } catch (error: any) {
      logout();
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      //   await fetch("/logout", { method: "POST" });
      setUserData(null);
      setJwt(null);
      setError(null);

      toast.info(`Session ended, please log in again`);
      Cookies.remove("jwt");
      navigate("/");
    } catch (error: any) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  // isLogged can be directly derived from user's presence
  return (
    <UserContext.Provider
      value={{
        user: userData,
        isLogged: userData !== null,
        loading,
        error,
        token: jwt,
        register,
        login,
        logout,
        checkExpiration,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;
