import { Stack } from "@mui/material";
import React from "react";
import useWindowSize from "../../hooks/useWindowSize";
import { Banner } from "../Common/Banner";
import { ForgotPasswordContent } from "./layout/ForgotPasswordContent";

const ForgotPassword = () => {
  const { isMobile } = useWindowSize();

  return (
      <Stack direction="row" className="h-screen w-screen">
        {!isMobile && <Banner />}
        <ForgotPasswordContent />
      </Stack>
  );
};

export default ForgotPassword;
