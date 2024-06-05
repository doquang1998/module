import { Stack } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import React from "react";
import { ChangePasswordContent } from "./layout/ChangePasswordContent";

export interface IProps {
  isUser?: boolean
  avatar?: string | null
  name?: string | null
  redirectProfile?: () => void;
}

const ChangePassword = ({ isUser, avatar, name, redirectProfile }: IProps) => {
  return (
    <Stack direction="row">
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <ChangePasswordContent isUser={isUser} avatar={avatar} name={name} redirectProfile={redirectProfile} />
      </LocalizationProvider>
    </Stack>
  );
};

export default ChangePassword;
