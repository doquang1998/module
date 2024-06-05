import React from "react";
interface IProps {
    label: string;
    field: string;
    value: string;
    isAuth?: boolean;
    isUser?: boolean;
    isChange?: boolean;
    onChange: React.ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>;
}
declare const InputPassWord: ({ label, field, value, isChange, isAuth, isUser, onChange }: IProps) => React.JSX.Element;
export { InputPassWord };
