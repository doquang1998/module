import React from "react";
import "react-phone-input-2/lib/style.css";
import "./assert/customCss/Profile.css";
interface IProps {
    formik?: any;
    field?: string;
    value?: string;
    isAuth?: boolean;
    isChangeForm?: () => void | undefined;
}
declare const InputPhone: ({ formik, field, value, isAuth, isChangeForm }: IProps) => React.JSX.Element;
export { InputPhone };
