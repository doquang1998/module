import {
  Box,
  ButtonBase,
  CircularProgress,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { AxiosResponse } from "axios";
import { useFormik } from "formik";
import React, { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import * as Yup from "yup";
import useWindowSize from "../../../hooks/useWindowSize";
import { AuthService } from "../../../services/AuthService";
import { InputPassWord } from "../../Common/InputPassWord";
import { MessageError } from "../../Common/MessageError";
import "../../Common/assert/customCss/global.css";
import { IconArrowRight } from "../../Common/assert/icons/IconArrowRight";
import { IconEmail } from "../../Common/assert/icons/IconEmail";
import { IconFacebook } from "../../Common/assert/icons/IconFacebook";
import { IconGoogle } from "../../Common/assert/icons/IconGoogle";
import { IconMetaMask } from "../../Common/assert/icons/IconMetaMask";
import { IconWalletConnect } from "../../Common/assert/icons/IconWalletConnect";
import LogoAuth from "../../Common/assert/images/LogoAuth.png";
import { MESSAGE_ALERT, VALIDATION_MESSAGE } from "../../Common/constants/auth";
import ReCAPTCHA from "react-google-recaptcha";
import { RECAPTCHA_SITE_KEY } from "../../../services/contants";
import { checkExitEmailDomain } from "../../helpers/functions";
import PhantomIcon from "../../Common/assert/images/Phantom.png";
import useSetToken from "../../../hooks/useSetToken";
interface IProps {
  role?: string;
  redirectSuccessLogin: (
    authResponse: any,
    loginAs: string,
    loginType: string
  ) => void;
  redirectSignUp?: () => void;
  redirectForgotPassword?: () => void;
  disconnectWallet?: () => void;
  getSignatureLogin: () => Promise<any>;
}

const LoginContent = ({
  role,
  redirectSuccessLogin,
  redirectSignUp,
  redirectForgotPassword,
  disconnectWallet,
  getSignatureLogin,
}: IProps) => {
  const currentHost = typeof window !== "undefined" ? window.location.host : "";
  const { isMobile } = useWindowSize();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const recaptchaRef = useRef<ReCAPTCHA>(null);
  const [isverified, setIsverified] = useState<boolean>(false);
  const [token, setToken] = useState("");
  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
      loginRole: !role ? "learner" : "creator",
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .required("This is a required field")
        .email(VALIDATION_MESSAGE.INVALID_EMAIL)
        .matches(
          /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
          VALIDATION_MESSAGE.INVALID_EMAIL
        )
        .max(62, VALIDATION_MESSAGE.MAXIMUM_62),
      password: Yup.string()
        .required("This is a required field")
        .min(6, VALIDATION_MESSAGE.INVALID_EMAIL_PASSWORD)
        .max(62, VALIDATION_MESSAGE.MAXIMUM_62),
    }),
    onSubmit: async () => {
      try {
        setIsLoading(true);
        const emailDomain = formik.values.email.substring(
          formik.values.email.indexOf("@") + 1
        );
        const exitEmailDomain = await checkExitEmailDomain(emailDomain);

        if (exitEmailDomain) {
          toast.error("Email invalid!");
          recaptchaRef.current?.reset();
          return;
        }
        const response: AxiosResponse = await AuthService.loginEmail(
          formik.values.email,
          formik.values.password,
          token,
          role === "admin"
            ? role
            : formik.values.loginRole === "creator"
            ? "instructor"
            : undefined
        );
        disconnectWallet && disconnectWallet();
        redirectSuccessLogin(response.data, formik.values.loginRole, "email");
      } catch (err: any) {
        if (err?.response?.data?.message?.includes("Password")) {
          formik.errors.password = VALIDATION_MESSAGE.INVALID_EMAIL_PASSWORD;
          return;
        }
        if (
          err?.response?.data?.message?.includes("email") ||
          err?.response?.data?.errors?.username
        ) {
          formik.errors.password = VALIDATION_MESSAGE.INVALID_EMAIL_PASSWORD;
          return;
        }
        toast.error(
          `${
            err?.response?.data?.message ?? MESSAGE_ALERT.SOMETHING_WENT_WRONG
          }`
        );
        recaptchaRef.current?.reset();
      } finally {
        setIsLoading(false);
      }
    },
  });
  const loginRole = formik.values.loginRole;

  let hash =
    typeof window !== "undefined"
      ? window.location?.search?.split("hash=")[1]
      : "";

  useEffect(() => {
    if (hash) {
      handleConfirmEmail();
    }
  }, [hash]);

  const handleConfirmEmail = async () => {
    try {
      await AuthService.confirmEmail(hash);
      toast.success(MESSAGE_ALERT.VERIFY_EMAIL_SUCCESS);
    } catch (err: any) {
      toast.error(
        `${err?.response?.data?.message ?? MESSAGE_ALERT.SOMETHING_WENT_WRONG}`
      );
    }
  };

  const handleKeyDown = (e: { code: string; preventDefault: () => void }) => {
    if (e.code === "Space") e.preventDefault();
  };

  async function handleCaptchaSubmission(token: string | null) {
    setToken(token ? token : "");
    setIsverified(true);
  }

  const handleLoginPhantom = async () => {
    const data = await getSignatureLogin();
    if (data) {
      try {
        setIsLoading(true);
        const response: AxiosResponse = await AuthService.walletLogin(data);
        redirectSuccessLogin(response.data, formik.values.loginRole, "wallet");
      } catch (err: any) {
        if (err?.response?.data?.message === "addressNotFound") {
          toast.error(MESSAGE_ALERT.ADDRESS_NOT_FOUND);
          return;
        }
        toast.error(
          `${
            err?.response?.data?.message ?? MESSAGE_ALERT.SOMETHING_WENT_WRONG
          }`
        );
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <Stack flex={1} className="custom-form">
      <Box
        className={`${
          isMobile
            ? "overflow-y-scroll"
            : "relative right-[80px] rounded-tl-[60px] rounded-bl-[60px] min-w-[580px]"
        } bg-bgCourse h-full `}
      >
        <Box
          className={`${
            isMobile ? "px-[32px] pt-[35px]" : "ml-[80px] my-[70px]"
          } `}
        >
          <Box className="flex justify-center">
            <img src={LogoAuth} alt="LogoAuth" />
          </Box>
          <Box
            className={`${
              isMobile ? "text-subtitle" : "text-loginTitle"
            } text-blackText text-center font-bold mt-[32px]`}
          >
            Sign in to AcademicLabs
          </Box>
          {(role === "admin" || role === "instructor") && (
            <Box
              className={`${
                isMobile ? "text-subtitle" : "text-loginTitle"
              } text-blackText text-center font-bold`}
            >
              {role === "admin" ? "Admin Portal" : "Creator Portal"}
            </Box>
          )}
          {role !== "admin" && (
            <Box className="flex flex-row text-loginSubTitle text-grayText justify-center mt-[5px]">
              Don’t have an account?{" "}
              <Typography
                className="text-blue ml-[10px] cursor-pointer text-loginSubTitle font-bold"
                onClick={redirectSignUp}
              >
                Sign up
              </Typography>
            </Box>
          )}
          {role !== "admin" && (
            <Box className="bg-btnNature h-[1px] flex-1 my-4" />
          )}
          <form onSubmit={formik.handleSubmit}>
            <Box className=" flex flex-col mt-[16px]">
              {role !== "admin" && (
                <FormControl className="mb-[16px]">
                  <Box className="leading-6 mb-2 ml-[5px] text-grayText text-sm">
                    Login as
                  </Box>
                  <RadioGroup
                    className="flex-row gap-4 sm:gap-5"
                    value={loginRole}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      formik.setFieldValue("loginRole", e.target.value);
                    }}
                  >
                    <FormControlLabel
                      value="learner"
                      control={
                        <Radio
                          sx={{
                            color: "#EAEDF4",
                            "&.Mui-checked": {
                              color: "#2869F6",
                            },
                          }}
                        />
                      }
                      label="Learner"
                      name="loginRole"
                      className={`flex-none sm:flex-1 h-11 pl-2 pr-5 py-[13px] border ${
                        loginRole === "learner"
                          ? "border-main text-blackText"
                          : "border-lightNature text-grayText"
                      } rounded-xl ml-0`}
                    />
                    <FormControlLabel
                      value="creator"
                      control={
                        <Radio
                          sx={{
                            color: "#EAEDF4",
                            "&.Mui-checked": {
                              color: "#2869F6",
                            },
                          }}
                        />
                      }
                      label="Content Creator"
                      name="loginRole"
                      className={`flex-1 h-11 px-2 py-[13px] border ${
                        loginRole === "creator"
                          ? "border-main text-blackText"
                          : "border-lightNature text-grayText"
                      } rounded-xl mr-0`}
                    />
                  </RadioGroup>
                </FormControl>
              )}
              <FormControl className="mb-[16px]">
                <Box className="leading-6 mb-2 ml-[5px] text-grayText text-sm">
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
                      "border border-[#EAEDF4] rounded-xl bg-white h-[50px]",
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

              <FormControl className="mb-[16px]">
                <InputPassWord
                  isAuth={true}
                  label="Password"
                  field="password"
                  onChange={formik.handleChange}
                  value={formik.values.password}
                />
                {formik.errors.password && formik.touched.password && (
                  <MessageError message={formik.errors.password} />
                )}
              </FormControl>

              {role !== "admin" && (
                <Box className="flex justify-end">
                  <Box
                    className="font-bold text-blueText text-end cursor-pointer"
                    onClick={redirectForgotPassword}
                  >
                    Forgot Password?
                  </Box>
                </Box>
              )}

              <ReCAPTCHA
                size="normal"
                sitekey={RECAPTCHA_SITE_KEY}
                onChange={handleCaptchaSubmission}
                ref={recaptchaRef}
              />

              <ButtonBase
                type="submit"
                className={`${
                  isLoading || !isverified
                    ? "bg-bgGray cursor-not-allow"
                    : "bg-btnBlue"
                } h-[50px] rounded-[100px] mt-[20px] mb-6 text-white`}
                disabled={isLoading || !isverified}
              >
                {isLoading ? (
                  <CircularProgress style={{ color: "white" }} />
                ) : (
                  <>
                    <Typography className="font-bold mr-[12px]">
                      Continue
                    </Typography>
                    <IconArrowRight />
                  </>
                )}
              </ButtonBase>
            </Box>
          </form>
          {false && (
            <Box>
              <Box className="text-center border-b border-[#EAEDF4] relative mt-[35px]">
                <Typography className="bg-white font-bold text-grayText2 absolute px-[10px] left-[calc(50%-20px)] -top-[12px]">
                  Or
                </Typography>
              </Box>
              <Box className="flex mt-[25px] justify-between">
                <ButtonBase className="flex w-[205px] align-center gap-2 border border-solid border-[#EAEDF4] rounded-[100px] py-[10px] ">
                  <IconGoogle />
                  <Typography className="text-blackText font-semibold text-loginSubTitle">
                    Continue with Google
                  </Typography>
                </ButtonBase>

                <ButtonBase className="flex w-[205px] align-center gap-2 border border-solid border-[#EAEDF4] rounded-[100px] py-[10px] ">
                  <IconFacebook />
                  <Typography className="text-blackText font-semibold text-loginSubTitle">
                    Continue with Facebook
                  </Typography>
                </ButtonBase>
              </Box>
              <Box className="text-center border-b border-[#EAEDF4] relative mt-[35px]">
                <Typography className="bg-white font-bold text-grayText2 absolute px-[10px] left-[calc(50%-80px)] -top-[12px]">
                  Or use your wallet
                </Typography>
              </Box>
              <Box className="flex mt-[25px] justify-between">
                <ButtonBase className="flex w-[205px] align-center gap-2 border border-solid border-[#EAEDF4] rounded-[100px] py-[10px] ">
                  <IconMetaMask />
                  <Typography className="text-blackText font-semibold text-loginSubTitle">
                    Metamask
                  </Typography>
                </ButtonBase>

                <ButtonBase className="flex w-[205px] align-center gap-2 border border-solid border-[#EAEDF4] rounded-[100px] py-[10px] ">
                  <IconWalletConnect />
                  <Typography className="text-blackText font-semibold text-loginSubTitle">
                    Wallet Connect
                  </Typography>
                </ButtonBase>
              </Box>
            </Box>
          )}
          {!role && loginRole === "learner" && (
            <Box>
              <Stack className="flex-row items-center gap-2">
                <Box className="bg-btnNature h-[1px] flex-1" />
                <Typography className="font-bold text-grayText2 px-[10px]">
                  Or use your wallet
                </Typography>
                <Box className="bg-btnNature h-[1px] flex-1" />
              </Stack>
              <Box className="flex my-6 justify-between">
                <ButtonBase
                  disabled={isLoading}
                  onClick={handleLoginPhantom}
                  className="flex w-full align-center gap-2 border border-solid border-[#EAEDF4] rounded-[100px] py-[10px] "
                >
                  <img src={PhantomIcon} width={22} alt="phantom-icon" />
                  <Typography className="text-blackText font-semibold text-loginSubTitle">
                    Phantom Wallet
                  </Typography>
                </ButtonBase>
              </Box>
            </Box>
          )}
        </Box>
      </Box>
    </Stack>
  );
};

export { LoginContent };
