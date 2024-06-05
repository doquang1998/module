import React from "react";
import "../../Common/assert/customCss/global.css";
interface IProps {
    redirectLogin: () => void;
}
declare const SignUpContent: ({ redirectLogin }: IProps) => React.JSX.Element;
export { SignUpContent };
