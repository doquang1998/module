import axios, { AxiosResponse, InternalAxiosRequestConfig } from "axios";
import { API_URL } from "./contants";
import { useGetToken } from "../hooks";
import { AuthService } from "./AuthService";
import { toast } from "react-toastify";
import useSetToken from "../hooks/useSetToken";

const axiosClient = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const accessToken = useGetToken()[0];
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }

  return config;
});

axiosClient.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },

  async (error) => {
    const config = error.config;
    if (error?.response?.status === 401 && !config._retry) {
      config._retry = true;
      try {
        const refreshToken = useGetToken()[1]
        const { data } = await AuthService.RefreshToken(refreshToken);
        useSetToken(data)
        config.headers.Authorization = `Bearer ${data.token}`;
        return axiosClient(config);
      } catch (error:any) {
        document.cookie = `token-${window.location.host}=null;path=/`;
        toast.error(`${error?.response.data?.message}`);
        if(config?.headers?.site === "user") {
          window.location.replace("/");
        } else {
          window.location.replace("/login");
        }
        return Promise.reject(error);
      }
    }
    return Promise.reject(error);
  }
);

export { axiosClient };
