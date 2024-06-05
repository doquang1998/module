import React from "react";
export interface IProps {
    redirectLogin: () => void;
}
declare const SignUp: ({ redirectLogin }: IProps) => React.JSX.Element;
export default SignUp;
