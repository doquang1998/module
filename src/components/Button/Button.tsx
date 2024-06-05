import React from "react";
export interface ButtonProps {
    label: string;
    userName: string;
    passWord: string;
}

const Button = ({ label, userName, passWord }: ButtonProps) => {
    const handleClick = () => {
        const test = {
            id: 1
        }
    }
    return <button className="bg-bgBtn" onClick={handleClick}>{label}</button>
}

export default Button;