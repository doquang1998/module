import React from "react";
export interface IProps {
    isUser?: boolean;
    avatar?: string | null;
    name?: string | null;
    redirectProfile?: () => void;
}
declare const ChangePassword: ({ isUser, avatar, name, redirectProfile }: IProps) => React.JSX.Element;
export default ChangePassword;
