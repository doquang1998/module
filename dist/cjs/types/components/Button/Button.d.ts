import React from "react";
export interface ButtonProps {
    label: string;
    userName: string;
    passWord: string;
}
declare const Button: ({ label, userName, passWord }: ButtonProps) => React.JSX.Element;
export default Button;
