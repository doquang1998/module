import React from "react";
export interface IProps {
    role?: string;
    redirectSuccessLogin: (authResponse: any, loginAs: string, loginType: string) => void;
    redirectSignUp?: () => void;
    redirectForgotPassword?: () => void;
    disconnectWallet?: () => void;
    getSignatureLogin: () => Promise<any>;
}
declare const Login: ({ role, redirectSuccessLogin, redirectSignUp, redirectForgotPassword, disconnectWallet, getSignatureLogin, }: IProps) => React.JSX.Element;
export default Login;
