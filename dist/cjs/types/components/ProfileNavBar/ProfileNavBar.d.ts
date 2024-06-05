import React from "react";
export interface IProps {
    handleUpdateAvatar?: (url: string) => void;
    handleUpdateProfile?: (data: any) => void;
}
declare const ProfileNavBar: ({ handleUpdateAvatar, handleUpdateProfile }: IProps) => React.JSX.Element;
export default ProfileNavBar;
