import { Box, FormControl, TextField } from "@mui/material";
import React, { useState } from "react";
import { IconLock } from "./assert/icons/IconLock";
import { IconShow } from "./assert/icons/IconShow";
import { IconOpenShow } from "./assert/icons/IconOpenShow";

interface IProps {
  label: string;
  field: string;
  value: string;
  isAuth?: boolean;
  isUser?: boolean;
  isChange?: boolean;
  onChange: React.ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>;
}

const InputPassWord = ({ label, field, value, isChange, isAuth, isUser, onChange }: IProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const handleClickShowPassword = () => setShowPassword((show) => !show);

  return (
    <>
      <Box className="leading-6 mb-[7px] ml-[5px] text-grayText text-sm">
        {label}
      </Box>
      <TextField
        id={field}
        type={showPassword ? "text" : "password"}
        onChange={onChange}
        value={value}
        inputProps={{
          maxLength: 62,
        }}
        InputProps={{
          className: `${isAuth ? "bg-white" : "bg-bgInputGray"
            } border border-[#EAEDF4] rounded-xl ${isUser ? "" : "max-w-[560px]"} h-[50px]`,
          placeholder:
            field === "cfpassword" ?
              isChange ? "Re-enter your new password" : "Re-enter your password"
              : isChange ? "Enter your new password" : "Enter your password",
          startAdornment: (
            <Box className="mr-[10px]">
              <IconLock />
            </Box>
          ),
          endAdornment: (
            <Box className="cursor-pointer ml-[10px]" onClick={handleClickShowPassword}>
              {showPassword ? <IconOpenShow /> : <IconShow />}
            </Box>
          ),
        }}
      />
    </>
  );
};

export { InputPassWord };
