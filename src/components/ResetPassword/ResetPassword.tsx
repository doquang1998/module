import { Stack } from "@mui/material";
import React from "react";
import { Banner } from "../Common/Banner";
import { ResetPasswordContent } from "./layout/ResetPasswordContent";
import useWindowSize from "../../hooks/useWindowSize";

export interface IProps {
  redirectLogin: () => void;
}

const ResetPassword = ({ redirectLogin }: IProps) => {
  const { isMobile } = useWindowSize();

  return (
    <Stack direction="row" className="h-screen">
      {!isMobile && <Banner />}
      <ResetPasswordContent redirectLogin={redirectLogin} />
    </Stack>
  );
};

export default ResetPassword;
