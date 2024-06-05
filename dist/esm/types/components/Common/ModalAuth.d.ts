import React from "react";
interface IProps {
    isOpen: boolean;
    email: string;
    isSignUp?: boolean;
    onClose: () => void;
}
declare const ModalAuth: ({ isOpen, email, isSignUp, onClose }: IProps) => React.JSX.Element;
export { ModalAuth };
