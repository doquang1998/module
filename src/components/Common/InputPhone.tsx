import { Box } from "@mui/material";
import React, { useRef } from "react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import "./assert/customCss/Profile.css";

interface IProps {
  formik?: any;
  field?: string;
  value?: string;
  isAuth?: boolean;
  isChangeForm?: () => void | undefined;
}

const InputPhone = ({ formik, field, value, isAuth, isChangeForm }: IProps) => {
  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleChangePhone = (phone: any) => {
    if (phone !== value) {
      isChangeForm && isChangeForm();
      formik.setFieldValue(field, phone);
    }
  };

  return (
    <Box ref={inputRef}>
      <PhoneInput
        country={"sg"}
        value={value ? value : ""}
        inputStyle={{
          width: "100%",
          border: "unset",
          height: "100%",
          paddingLeft: "50px",
          backgroundColor: isAuth ? "#FFF" : "#F8F8FA",
          fontSize: "16px"
        }}
        containerStyle={{
          paddingBlock: "6px",
          paddingInline: "12px",
          borderRadius: "12px",
          height: "50px",
          backgroundColor: isAuth ? "#FFF" : "#F8F8FA",
          border: "1px solid #EAEDF4",
        }}
        buttonClass={`${isAuth ? "my-button-phone-auth" : "my-button-phone"}`}
        onChange={handleChangePhone}
      />
    </Box>
  );
};

export { InputPhone };

