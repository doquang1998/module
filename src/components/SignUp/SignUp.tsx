import { Stack } from "@mui/material";
import React from "react";
import { Banner } from "../Common/Banner";
import { SignUpContent } from "./layout/SignUpContent";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import useWindowSize from "../../hooks/useWindowSize";

export interface IProps {
  redirectLogin: () => void;
}

const SignUp = ({ redirectLogin }: IProps) => {
  const { isMobile } = useWindowSize();

  return (
      <Stack direction="row">
        {!isMobile && <Banner />}
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <SignUpContent redirectLogin={redirectLogin} />
        </LocalizationProvider>
      </Stack>
  );
};

export default SignUp;
