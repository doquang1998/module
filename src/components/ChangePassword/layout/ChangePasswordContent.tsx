import {
  Avatar,
  Box,
  ButtonBase,
  CircularProgress,
  FormControl,
  OutlinedInput,
  Stack,
} from "@mui/material";
import { useFormik } from "formik";
import React, { useState } from "react";
import * as Yup from "yup";
import { AuthService } from "../../../services/AuthService";
import { InputPassWord } from "../../Common/InputPassWord";
import { MessageError } from "../../Common/MessageError";
import { MESSAGE_ALERT, VALIDATION_MESSAGE } from "../../Common/constants/auth";
import { IProps } from "../ChangePassword";
import { toast } from "react-toastify";
import "../../Common/assert/customCss/global.css";
import useWindowSize from "../../../hooks/useWindowSize";

const ChangePasswordContent = ({ isUser, avatar, name, redirectProfile }: IProps) => {
  const { isMobile } = useWindowSize()
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isChange, setIsChange] = useState<boolean>(false);

  const formik = useFormik({
    initialValues: {
      existingPassword: "",
      newPassword: "",
      cfpassword: "",
    },
    validationSchema: Yup.object({
      existingPassword: Yup.string().required("This is a required field"),
      newPassword: Yup.string()
        .min(8, VALIDATION_MESSAGE.MIN_8)
        .max(62, VALIDATION_MESSAGE.MAXIMUM_62)
        .matches(
          /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*\d)(?=.*[" !#$%&'()*+,-./:;<=>?@[\]^_`{|}~])[A-Za-z\d" !#$%&'()*+,-./:;<=>?@[\]^_`{|}~]{8,}$/,
          VALIDATION_MESSAGE.INVALID_PASSWORD_FORMAT
        )
        .required("This is a required field"),
      cfpassword: Yup.string()
        .oneOf([Yup.ref("newPassword")], VALIDATION_MESSAGE.CF_PASSWORD)
        .required("This is a required field"),
    }),
    onSubmit: async (values) => {
      setIsLoading(true);
      try {
        await AuthService.ChangePassword(
          values.newPassword,
          values.existingPassword,
          isUser ? "user" : ""
        );
        setIsLoading(false);
        toast.success(MESSAGE_ALERT.UPDATE_SUCCESS);
        formik.resetForm()
        setIsChange(false)
      } catch (error: any) {
        if (error?.response?.data?.errors?.oldPassword) {
          formik.errors.existingPassword =
            VALIDATION_MESSAGE.OLD_PASSWORD_INCORRECT;
        }
        setIsLoading(false);
        toast.error(`${error?.response?.data?.message ?? MESSAGE_ALERT.SOMETHING_WENT_WRONG}`);
      }
    },
  });

  const handleRedirectProfile = () => {
    redirectProfile && redirectProfile();
  };

  const handleChangeInput = (e: { target: { id: string; value: any } }) => {
    if (!isChange) {
      setIsChange(true);
    }
    formik.setFieldValue(e.target.id, e.target.value);
  };

  const handleResetForm = () => {
    formik.resetForm()
  };


  return (
    <Stack flex={1}>
      <Box className={`flex ${isMobile ? "flex-col px-[16px] pb-[24px] pt-[60px] gap-[24px] items-center" : "my-[30px] mx-[40px] justify-around"}`}>
        {isUser ? (
          <Box flex={1} mt={isMobile ? "0px" : "45px"} ml={isMobile ? "0px" : "40px"}>
            <Box className="relative w-[202px] h-[202px] border border-[#9189f1] rounded-full outline outline-offset-[11px] outline-[#d3d1ea]">
              <Avatar
                alt="Avatar Profile"
                src={avatar || ""}
                sx={{ width: 180, height: 180 }}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 border-2 border-[#2869F6]"
              />
            </Box>
            <Box className="font-bold text-pageTitle mt-[35px] w-[225px] text-center">
              {name}
            </Box>
            {/* <ButtonBase
              className="h-[50px] rounded-[100px] mt-[16px] w-[225px] bg-bgBtnGray text-black"
              onClick={handleRedirectProfile}
            >
              <Box className="font-bold mr-[12px]">Profile</Box>
            </ButtonBase> */}
          </Box>
        ) : null}
        <Box flex={2}>
          {!isUser && <Box className="text-blackText text-headerTitle font-bold mb-[24px]">
            Change password
          </Box>}
          <form onSubmit={formik.handleSubmit}>
            <Box className=" flex flex-col mt-[16px]">
              <FormControl className="mb-[16px]">
                <Box className="text-loginSubTitle text-grayText mb-[5px]">
                  Existing Password
                </Box>
                <OutlinedInput
                  id="existingPassword"
                  onChange={handleChangeInput}
                  placeholder="Enter existing password"
                  value={formik.values.existingPassword}
                  className={`border border-[#EAEDF4] bg-bgInputGray rounded-[12px] ${isUser ? "" : "max-w-[560px]"}`}
                />
                {formik.errors.existingPassword &&
                  formik.touched.existingPassword && (
                    <MessageError message={formik.errors.existingPassword} />
                  )}
              </FormControl>

              <FormControl className="mb-[16px]">
                <InputPassWord
                  isUser={isUser}
                  isChange={true}
                  label="New Password"
                  field="newPassword"
                  onChange={handleChangeInput}
                  value={formik.values.newPassword}
                />
                {formik.errors.newPassword && formik.touched.newPassword && (
                  <MessageError message={formik.errors.newPassword} />
                )}
              </FormControl>

              <FormControl className="mb-[16px]">
                <InputPassWord
                  isUser={isUser}
                  isChange={true}
                  label="Confirm password"
                  field="cfpassword"
                  value={formik.values.cfpassword}
                  onChange={handleChangeInput}
                />
                {formik.errors.cfpassword && formik.touched.cfpassword && (
                  <MessageError message={formik.errors.cfpassword} />
                )}
              </FormControl>

              <Box className={`${isMobile ? "text-smallText" : "text-loginSubTitle"
                } text-grayText ${isUser ? "" : "max-w-[560px]"}`}>
                Include at least:{" "}
              </Box>
              <Box className={`ml-[20px] ${isUser ? "" : "max-w-[560px]"}`}>
                <ul className={`list-disc marker:grayText text-grayText grid grid-cols-2  ${isMobile
                  ? "text-smallTextAuth gap-x-4"
                  : "text-loginSubTitle gap-x-20"
                  }`}>
                  <li>1 Uppercase character</li>
                  <li>1 Special character</li>
                  <li>1 Lowercase character</li>
                  <li>8 Characters minimum</li>
                  <li>1 Number</li>
                </ul>
              </Box>
              <Box className={`flex ${isUser ? "justify-end" : ""}  gap-[24px]`}>
                <ButtonBase
                  className={`${isMobile ? "w-[143px] h-[44px]": "w-[160px] h-[50px]"}  rounded-[100px] mt-[24px] bg-bgBtnGray text-blackText1`}
                  disabled={!isChange}
                  onClick={handleResetForm}
                >
                  <Box className="font-bold">Cancel</Box>
                </ButtonBase>

                <ButtonBase
                  type="submit"
                  className={` ${!isChange || isLoading ? "bg-bgGray" : "bg-btnBlue"
                    } ${isMobile ? "w-[143px] h-[44px]": "w-[160px] h-[50px]"} rounded-[100px] mt-[24px] bg-btnBlue text-white`}
                  disabled={!isChange || isLoading}
                >
                  {isLoading ? (
                    <CircularProgress style={{ color: "white" }} />
                  ) : (
                    <>
                      <Box className="font-bold">Save</Box>
                    </>
                  )}
                </ButtonBase>
              </Box>
            </Box>
          </form>
        </Box>
      </Box>
    </Stack>
  );
};

export { ChangePasswordContent };
