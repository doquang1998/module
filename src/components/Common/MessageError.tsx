import { Box } from "@mui/material";
import React from "react";

interface IProps {
  message: string;
}

const MessageError = ({ message }: IProps) => {
  return <Box className="mt-[5px] text-red">{message}</Box>;
};

export { MessageError };
