import { Stack } from "@mui/material";
import React from "react";
import { CreatorInformationContent } from "./layout/CreatorInformationContent";

export interface IProps {
  title: string | null
  biography: string | null
  handleUpdateProfile?: (data: any) => void;
}

const CreatorInformation = ({ title, biography, handleUpdateProfile }: IProps) => {
  return (
    <Stack direction="row">
      <CreatorInformationContent title={title} biography={biography} handleUpdateProfile={handleUpdateProfile} />
    </Stack>
  );
};

export default CreatorInformation;
