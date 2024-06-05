import { Stack } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import React from "react";
import { ProfileContent } from "./layout/ProfileContent";

interface IWallet {
  address: string;
  createdAt: string;
  id: number;
  isPrimaryWallet: boolean;
  updatedAt: string;
  userId: number;
}
export interface IProps {
  redirectProfile?: () => void;
  handleConnectWallet: () => void;
  handleDisconnectWallet: () => void;
  handleUpdateAvatar?: (url: string) => void;
  activeAccount: string | null;
  handleSetDefaultAccount: () => void;
}

const Profile = (props: IProps) => {
  return (
    <Stack direction="row">
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <ProfileContent {...props} />
      </LocalizationProvider>
    </Stack>
  );
};

export default Profile;
