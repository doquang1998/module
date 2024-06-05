import {
  Box,
  ButtonBase,
  CircularProgress,
  FormControl,
  Stack,
  TextField
} from "@mui/material";
import { useFormik } from "formik";
import React, { useRef, useState } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import { toast } from "react-toastify";
import * as Yup from "yup";
import useWindowSize from "../../../hooks/useWindowSize";
import { AuthService } from "../../../services/AuthService";
import { RECAPTCHA_SITE_KEY } from "../../../services/contants";
import "../../Common/assert/customCss/global.css";
import { IconArrowRight } from "../../Common/assert/icons/IconArrowRight";
import { IconEmail } from "../../Common/assert/icons/IconEmail";
import LogoAuth from "../../Common/assert/images/LogoAuth.png";
import { MESSAGE_ALERT, VALIDATION_MESSAGE } from "../../Common/constants/auth";
import { MessageError } from "../../Common/MessageError";
import { ModalAuth } from "../../Common/ModalAuth";
import { checkExitEmailDomain } from "../../helpers/functions";

const ForgotPasswordContent = () => {
  const { isMobile } = useWindowSize();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isverified, setIsverified] = useState<boolean>(false);
  const recaptchaRef = useRef<ReCAPTCHA>(null);
  const [token, setToken] = useState("");
  const [isOpenModal, setIsOpenModal] = useState<boolean>(false);
  const formik = useFormik({
    initialValues: {
      email: "",
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email(VALIDATION_MESSAGE.INVALID_EMAIL)
        .matches(
          /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
          VALIDATION_MESSAGE.INVALID_EMAIL
        )
        .max(62, VALIDATION_MESSAGE.MAXIMUM_62)
        .required("This is a required field"),
    }),
    onSubmit: async (values) => {
      setIsLoading(true);
      const emailDomain = values.email.substring(values.email.indexOf("@") + 1);
      const exitEmailDomain = await checkExitEmailDomain(emailDomain);
      if (exitEmailDomain) {
        toast.error("Email invalid!");
        return;
      }
      try {
        await AuthService.ForgotPassword(values.email, token);
        setIsLoading(false);
        setIsOpenModal(true);
      } catch (err: any) {
        setIsLoading(false);
        if (err?.response?.data?.message?.includes("emailNotExists")) {
          formik.errors.email = VALIDATION_MESSAGE.EMAIL_NOT_FOUND;
          return;
        }
        toast.error(
          `${
            err?.response?.data?.message ?? MESSAGE_ALERT.SOMETHING_WENT_WRONG
          }`
        );
      }
    },
  });

  async function handleCaptchaSubmission(token: string | null) {
    setToken(token ? token : "");
    setIsverified(true);
  }

  const handleKeyDown = (e: { code: string; preventDefault: () => void }) => {
    if (e.code === "Space") e.preventDefault();
  };

  
  return (
    <Stack flex={1} className="custom-form">
      <Box
        className={`${
          isMobile
            ? ""
            : "relative right-[80px] rounded-tl-[60px] rounded-bl-[60px] min-w-[580px]"
        } bg-bgCourse h-full`}
      >
        <Box className={`${isMobile ? "px-[32px]" : "ml-[80px]"} my-[70px] `}>
          <Box className="flex justify-center">
            <img src={LogoAuth} alt="LogoAuth" />
          </Box>
          <Box className="text-blackText text-loginTitle text-center font-bold mt-[32px]">
            Forgot Password
          </Box>
          <Box className="my-[20px] flex text-blackText">
            <Box>
              Please enter email address. We will send a confirmation code to
              your email address.
            </Box>
          </Box>
          <form onSubmit={formik.handleSubmit}>
            <Box className=" flex flex-col mt-[16px]">
              <FormControl className="mb-[16px]">
                <Box className="leading-6 mb-[7px] ml-[5px] text-grayText text-sm">
                  Email address
                </Box>
                <TextField
                  id="email"
                  placeholder="Enter email address"
                  onChange={formik.handleChange}
                  value={formik.values.email}
                  onKeyDown={handleKeyDown}
                  inputProps={{
                    maxLength: 62,
                  }}
                  InputProps={{
                    className:
                      "border border-[#EAEDF4] bg-white rounded-[12px]",
                    startAdornment: (
                      <Box className="mr-[10px]">
                        <IconEmail />
                      </Box>
                    ),
                  }}
                />
                {formik.errors.email && formik.touched.email && (
                  <MessageError message={formik.errors.email} />
                )}
              </FormControl>
              
              <ReCAPTCHA
                size="normal"
                sitekey={RECAPTCHA_SITE_KEY}
                onChange={handleCaptchaSubmission}
                ref={recaptchaRef}
              />

              <ButtonBase
                type="submit"
                className={`${isLoading || !isverified ? "bg-bgGray" : "bg-btnBlue"} h-[50px] rounded-[100px] mt-[24px]  text-white`}
                disabled={isLoading || !isverified}
              >
                {isLoading ? (
                  <CircularProgress style={{ color: "white" }} />
                ) : (
                  <>
                    <Box className="font-bold mr-[12px]">Continue</Box>
                    <IconArrowRight />
                  </>
                )}
              </ButtonBase>
            </Box>
          </form>
        </Box>
      </Box>
      <ModalAuth
        isOpen={isOpenModal}
        onClose={() => {
          formik.resetForm();
          setIsOpenModal(false);
        }}
        email={formik.values.email}
      />
    </Stack>
  );
};

export { ForgotPasswordContent };

