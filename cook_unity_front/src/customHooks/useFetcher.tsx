import { useContext } from "react";
import { AxiosRequestConfig, AxiosResponse } from "axios";
import { UserContext } from "../contexts/userContext";
import doFetch from "../utils/fetcher";

const useApi = () => {
  const { checkExpiration, logout, token } = useContext(UserContext);

  const fetch = async <T = any,>(
    url: string,
    config: AxiosRequestConfig = {}
  ): Promise<AxiosResponse<T>> => {
    try {
      const { expired: sessionHasExpired } = checkExpiration();
      if (sessionHasExpired) {
        // If the token is expired, handle it according to your app's logic
        // e.g., logging out the user or redirecting to a login page
        logout();
        throw new Error("Session expired");
      }

      // Set default baseURL if it's not provided
      const aggConfig: AxiosRequestConfig = {
        ...config, // This will now include method, headers, data, etc.
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json", // Ensure you're setting the content type
          ...(config.headers || {}),
        },
      };

      const response = await doFetch(url, aggConfig);
      return response;
    } catch (error) {
      // Handle or throw the error depending on your needs
      throw error;
    }
  };

  return fetch;
};

export default useApi;
