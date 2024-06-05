import axios from "axios";
import { axiosClient } from "./axiosClient";
import useGetRef from "../hooks/useGetRef";

interface ISingUpParams {
  email: string;
  password: string;
  role: string;
  fullName: string;
  phoneNumber?: string;
  dateOfBirth: string | null;
  ref?: string | null;
  token?: string;
}

interface IProfile {
  email: string;
  fullName: string;
  phoneNumber?: string;
  dateOfBirth: string | null;
  walletAddress?: string | null;
  paypalId: string | null;
}

export const AuthService = {
  loginEmail: (
    username: string,
    password: string,
    token: string,
    role?: string
  ) => {
    const url = role ? `/auth/email/login/${role}` : `/auth/email/login`;
    return axiosClient.post(url, {
      username,
      password,
      token,
    });
  },
  SignUp: (
    email: string,
    password: string,
    role: string,
    fullName: string,
    phoneNumber: string,
    dateOfBirth: string | null,
    token: string
  ) => {
    const url = `/auth/email/register`;
    const data: ISingUpParams = {
      email,
      password,
      role,
      fullName,
      dateOfBirth,
      ref: useGetRef() ? useGetRef() : null,
      token,
    };
    if (Number(phoneNumber)) {
      data.phoneNumber = phoneNumber;
    }
    return axiosClient.post(url, {
      ...data,
    });
  },
  ForgotPassword: (email: string, token: string) => {
    const url = `/auth/forgot/password`;
    return axiosClient.post(url, {
      email,
      token,
    });
  },
  UserProfile: () => {
    const url = `/auth/me`;
    axiosClient.interceptors.request.use((config: any) => {
      config.headers.site = "user";
      return config;
    });
    return axiosClient.get(url);
  },
  ChangePassword: (password: string, oldPassword: string, site?: string) => {
    const url = `/auth/change/password`;
    if (site === "user") {
      axiosClient.interceptors.request.use((config: any) => {
        config.headers.site = "user";
        return config;
      });
    }
    return axiosClient.post(url, {
      password,
      oldPassword,
    });
  },
  ResetPassword: (password: string, hash: string) => {
    const url = `/auth/reset/password`;
    return axiosClient.post(url, {
      password,
      hash,
    });
  },
  EditProfile: (params: IProfile, site?: string) => {
    const url = `/auth/me`;
    const { phoneNumber, ...rest } = params;
    const data: IProfile = { ...rest };
    if (Number(params.phoneNumber)) {
      data.phoneNumber = params.phoneNumber;
    }
    if (site === "user") {
      axiosClient.interceptors.request.use((config: any) => {
        config.headers.site = "user";
        return config;
      });
    }
    return axiosClient.put(url, {
      ...data,
    });
  },
  EditCreatorInfo: (title: string | null, biography: string | null) => {
    const url = `/auth/me`;
    return axiosClient.put(url, {
      title,
      biography,
    });
  },
  confirmEmail: (hash: string) => {
    const url = `/auth/email/confirm`;
    return axiosClient.post(url, { hash });
  },
  checkHashForgot: (hash: string) => {
    const url = `auth/hash/check?hash=${hash}&type=forgot`;
    return axiosClient.get(url);
  },
  RefreshToken: (refreshToken: string) => {
    const axiosClientRefresh = axios.create({
      baseURL: process.env.NEXT_PUBLIC_API_URL,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${refreshToken}`,
      },
    });
    return axiosClientRefresh.post("auth/refresh");
  },
  VerifyCaptcha: (token: string | null) => {
    const url = `auth/verify-recaptcha/${token}`;
    return axiosClient.post(url);
  },
  walletLogin: (data: any) => {
    const url = `/auth/wallet/login`;
    return axiosClient.post(url, data);
  },
  setDefaultWallet: (data: any) => {
    const url = `/auth/wallet/set-default`;
    return axiosClient.post(url, data);
  },
};
