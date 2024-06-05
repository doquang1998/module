import { Stack } from "@mui/material";
import React from "react";
import useWindowSize from "../../hooks/useWindowSize";
import { Banner } from "../Common/Banner";
import { LoginContent } from "./layout/LoginContent";

export interface IProps {
  role?: string;
  redirectSuccessLogin: (
    authResponse: any,
    loginAs: string,
    loginType: string
  ) => void;
  redirectSignUp?: () => void;
  redirectForgotPassword?: () => void;
  disconnectWallet?: () => void;
  getSignatureLogin: () => Promise<any>;
}

const Login = ({
  role,
  redirectSuccessLogin,
  redirectSignUp,
  redirectForgotPassword,
  disconnectWallet,
  getSignatureLogin,
}: IProps) => {
  const { isMobile } = useWindowSize();

  return (
    <Stack direction="row" className="2xl:h-screen">
      {!isMobile && <Banner />}
      <LoginContent
        role={role}
        getSignatureLogin={getSignatureLogin}
        disconnectWallet={disconnectWallet}
        redirectSuccessLogin={redirectSuccessLogin}
        redirectSignUp={redirectSignUp}
        redirectForgotPassword={redirectForgotPassword}
      />
    </Stack>
  );
};

export default Login;
