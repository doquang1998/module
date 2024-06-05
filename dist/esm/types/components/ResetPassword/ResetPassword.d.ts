import React from "react";
export interface IProps {
    redirectLogin: () => void;
}
declare const ResetPassword: ({ redirectLogin }: IProps) => React.JSX.Element;
export default ResetPassword;
