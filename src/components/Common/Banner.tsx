import { Stack } from "@mui/material";
import React from "react";
import BannerAuth from "./assert/images/BannerAuth.png";

const Banner = () => {
  return (
    <Stack flex={3}>
        <img src={BannerAuth} alt="Logo" className="h-full"/>
    </Stack>
  );
};

export { Banner };

