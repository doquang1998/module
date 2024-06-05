import React from "react";
export interface IProps {
    redirectProfile?: () => void;
    handleConnectWallet: () => void;
    handleDisconnectWallet: () => void;
    handleUpdateAvatar?: (url: string) => void;
    activeAccount: string | null;
    handleSetDefaultAccount: () => void;
}
declare const Profile: (props: IProps) => React.JSX.Element;
export default Profile;
