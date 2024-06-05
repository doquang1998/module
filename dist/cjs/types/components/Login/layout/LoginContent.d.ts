import React from "react";
import "../../Common/assert/customCss/global.css";
interface IProps {
    role?: string;
    redirectSuccessLogin: (authResponse: any, loginAs: string, loginType: string) => void;
    redirectSignUp?: () => void;
    redirectForgotPassword?: () => void;
    disconnectWallet?: () => void;
    getSignatureLogin: () => Promise<any>;
}
declare const LoginContent: ({ role, redirectSuccessLogin, redirectSignUp, redirectForgotPassword, disconnectWallet, getSignatureLogin, }: IProps) => React.JSX.Element;
export { LoginContent };
