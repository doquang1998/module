import React from "react";
export interface IProps {
    title: string | null;
    biography: string | null;
    handleUpdateProfile?: (data: any) => void;
}
declare const CreatorInformation: ({ title, biography, handleUpdateProfile }: IProps) => React.JSX.Element;
export default CreatorInformation;
