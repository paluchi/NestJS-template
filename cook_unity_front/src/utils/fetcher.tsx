import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import env from "./env";

export const fetch = async <T = any,>(
  url: string,
  config: AxiosRequestConfig = {}
): Promise<AxiosResponse<T>> => {
  // Set default baseURL if it's not provided

  const baseConfig: AxiosRequestConfig = {
    baseURL: env.SERVER_URL,
    ...config, // This will now include method, headers, data, etc.
  };

  try {
    const response = await axios(url, baseConfig);
    return response;
  } catch (error) {
    // Handle or throw the error depending on your needs
    throw error;
  }
};

export default fetch;
