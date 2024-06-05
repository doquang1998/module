import React from 'react';

interface ButtonProps {
    label: string;
    userName: string;
    passWord: string;
}
declare const Button: ({ label, userName, passWord }: ButtonProps) => React.JSX.Element;

interface IProps$6 {
    title: string | null;
    biography: string | null;
    handleUpdateProfile?: (data: any) => void;
}
declare const CreatorInformation: ({ title, biography, handleUpdateProfile }: IProps$6) => React.JSX.Element;

declare const ForgotPassword: () => React.JSX.Element;

interface IProps$5 {
    isUser?: boolean;
    avatar?: string | null;
    name?: string | null;
    redirectProfile?: () => void;
}
declare const ChangePassword: ({ isUser, avatar, name, redirectProfile }: IProps$5) => React.JSX.Element;

interface IProps$4 {
    role?: string;
    redirectSuccessLogin: (authResponse: any, loginAs: string, loginType: string) => void;
    redirectSignUp?: () => void;
    redirectForgotPassword?: () => void;
    disconnectWallet?: () => void;
    getSignatureLogin: () => Promise<any>;
}
declare const Login: ({ role, redirectSuccessLogin, redirectSignUp, redirectForgotPassword, disconnectWallet, getSignatureLogin, }: IProps$4) => React.JSX.Element;

interface IProps$3 {
    redirectProfile?: () => void;
    handleConnectWallet: () => void;
    handleDisconnectWallet: () => void;
    handleUpdateAvatar?: (url: string) => void;
    activeAccount: string | null;
    handleSetDefaultAccount: () => void;
}
declare const Profile: (props: IProps$3) => React.JSX.Element;

interface IProps$2 {
    handleUpdateAvatar?: (url: string) => void;
    handleUpdateProfile?: (data: any) => void;
}
declare const ProfileNavBar: ({ handleUpdateAvatar, handleUpdateProfile }: IProps$2) => React.JSX.Element;

interface IProps$1 {
    redirectLogin: () => void;
}
declare const ResetPassword: ({ redirectLogin }: IProps$1) => React.JSX.Element;

interface IProps {
    redirectLogin: () => void;
}
declare const SignUp: ({ redirectLogin }: IProps) => React.JSX.Element;

declare const useGetToken: () => any[];

export { Button, ChangePassword, CreatorInformation, ForgotPassword, Login, Profile, ProfileNavBar, ResetPassword, SignUp, useGetToken };
