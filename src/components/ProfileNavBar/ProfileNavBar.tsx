import { Stack } from "@mui/material";
import React from "react";
import { ProfileNavBarContent } from "./layout/ProfileNavBarContent";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

export interface IProps {
  handleUpdateAvatar?: (url: string) => void;
  handleUpdateProfile?: (data: any) => void;
}

const ProfileNavBar = ({ handleUpdateAvatar, handleUpdateProfile }: IProps) => {
  return (
    <Stack direction="row">
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <ProfileNavBarContent
          handleUpdateAvatar={handleUpdateAvatar}
          handleUpdateProfile={handleUpdateProfile}
        />
      </LocalizationProvider>
    </Stack>
  );
};

export default ProfileNavBar;
