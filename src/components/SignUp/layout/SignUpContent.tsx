import {
  Box,
  ButtonBase,
  Checkbox,
  CircularProgress,
  FormControl,
  FormControlLabel,
  OutlinedInput,
  Radio,
  RadioGroup,
  Stack,
  TextField,
} from "@mui/material";
import dayjs from "dayjs";
import { useFormik } from "formik";
import React, { useEffect, useRef, useState } from "react";
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
import {
  MESSAGE_ALERT,
  MESSAGE_ERROR,
  VALIDATION_MESSAGE,
} from "../../Common/constants/auth";
import { InputPassWord } from "../../Common/InputPassWord";
import { MessageError } from "../../Common/MessageError";
import { ModalAuth } from "../../Common/ModalAuth";
import { checkExitEmailDomain } from "../../helpers/functions";
interface IProps {
  redirectLogin: () => void;
}

interface ISignUp {
  email: string;
  fullName: string;
  password: string;
  cfpassword: string;
  title: string;
  phoneNumber?: string;
  dateOfBirth: string | null;
}

const SignUpContent = ({ redirectLogin }: IProps) => {
  const { isMobile } = useWindowSize();
  const [selectRole, setSelectRole] = useState<string>("user");
  const [isApprove, setIsApprove] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isOpenModal, setIsOpenModal] = useState<boolean>(false);
  const [isverified, setIsverified] = useState<boolean>(false);
  const recaptchaRef = useRef<ReCAPTCHA>(null);
  const [token, setToken] = useState("");

  useEffect(() => {
    let ref =
      typeof window !== "undefined"
        ? window.location?.search?.split("ref=")[1]
        : "";
    if (ref) {
      document.cookie = `ref-${window.location.host}=${ref}`;
    }
  }, []);

  const formik = useFormik({
    initialValues: {
      email: "",
      fullName: "",
      password: "",
      cfpassword: "",
      title: "",
      phoneNumber: "",
      dateOfBirth: null,
    },
    validationSchema: Yup.object({
      fullName: Yup.string()
        .trim()
        .required("This is a required field")
        .matches(/^[A-Za-z\s]+$/, VALIDATION_MESSAGE.ONLY_ALPHABETS)
        .max(100, VALIDATION_MESSAGE.MAXIMUM_100),
      email: Yup.string()
        .email(VALIDATION_MESSAGE.INVALID_EMAIL)
        .matches(
          /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
          VALIDATION_MESSAGE.INVALID_EMAIL
        )
        .max(62, VALIDATION_MESSAGE.MAXIMUM_62)
        .required("This is a required field"),
      dateOfBirth: Yup.date()
        .nullable()
        .max(
          new Date(new Date().setDate(new Date().getDate() - 1)),
          VALIDATION_MESSAGE.INVALID_DATE
        ),
      password: Yup.string()
        .min(8, VALIDATION_MESSAGE.MIN_8)
        .max(62, VALIDATION_MESSAGE.MAXIMUM_62)
        .matches(
          /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*\d)(?=.*[" !#$%&'()*+,-./:;<=>?@[\]^_`{|}~])[A-Za-z\d" !#$%&'()*+,-./:;<=>?@[\]^_`{|}~]{8,}$/,
          VALIDATION_MESSAGE.INVALID_PASSWORD_FORMAT
        )
        .required("This is a required field"),
      cfpassword: Yup.string()
        .oneOf([Yup.ref("password")], VALIDATION_MESSAGE.CF_PASSWORD)
        .required("This is a required field"),
    }),
    onSubmit: (values) => {
      handleSignUp(values);
    },
  });

  const handleChangeRole = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectRole((event.target as HTMLInputElement).value);
  };

  const handleKeyDown = (e: { code: string; preventDefault: () => void }) => {
    if (e.code === "Space") e.preventDefault();
  };

  const handleSignUp = async (values: ISignUp) => {
    try {
      setIsLoading(true);
      const emailDomain = values.email.substring(values.email.indexOf("@") + 1);
      const exitEmailDomain = await checkExitEmailDomain(emailDomain);
  
      if (exitEmailDomain) {
        toast.error("Email invalid!");
        recaptchaRef.current?.reset();
        return;
      }
      await AuthService.SignUp(
        values.email,
        values.password,
        selectRole,
        values.fullName.trim(),
        `+${values.phoneNumber}`,
        values.dateOfBirth
          ? dayjs(values.dateOfBirth).format("YYYY-MM-DD")
          : null,
        token
      );
      setIsOpenModal(true);
    } catch (err: any) {
      if (
        err?.response?.data?.errors?.email ||
        err?.response?.data?.message === MESSAGE_ERROR.EMAIL_ALREADY
      ) {
        formik.errors.email = VALIDATION_MESSAGE.EMAIL_ALREADY;
      }
      if (err?.response?.data?.errors?.phoneNumber) {
        formik.errors.phoneNumber = VALIDATION_MESSAGE.INVALID_PHONE_NUMBER;
      }
      if (
        err?.response?.data?.message !== MESSAGE_ERROR.EMAIL_ALREADY &&
        !err?.response?.data?.errors?.phoneNumber
      ) {
        toast.error(
          `${
            err?.response?.data?.message ?? MESSAGE_ALERT.SOMETHING_WENT_WRONG
          }`
        );
      }
      recaptchaRef.current?.reset();
    } finally {
      setIsLoading(false);
    }
  };

  const handleRedirectLogin = () => {
    redirectLogin();
  };

  const handleOpenTerm = () => {
    if (typeof window !== undefined) {
      window.open(
        "https://cdn.uat.acad.live/docs/Terms%20and%20Conditions.pdf",
        "_blank"
      );
    }
  };

  const handleOpenPolicy = () => {
    if (typeof window !== undefined) {
      window.open(
        "https://cdn.uat.acad.live/docs/Privacy%20Statement.pdf",
        "_blank"
      );
    }
  };

  async function handleCaptchaSubmission(token: string | null) {
    setToken(token ? token : "");
    setIsverified(true);
  }

  return (
    <Stack flex={1} className="custom-form">
      <Box
        className={`${
          isMobile
            ? ""
            : "relative right-[80px] rounded-tl-[60px] rounded-bl-[60px] min-w-[580px]"
        } bg-bgCourse h-full`}
      >
        <Box
          className={`${
            isMobile ? "px-[32px] my-[24px]" : "ml-[80px] my-[70px]"
          }  `}
        >
          <Box className="flex justify-center">
            <img src={LogoAuth} alt="LogoAuth" />
          </Box>
          <Box
            className={`${
              isMobile ? "text-subtitle" : "text-loginTitle"
            } text-blackText text-center font-bold mt-[32px]`}
          >
            Sign up to AcademicLabs
          </Box>
          <Box className="flex flex-row text-loginSubTitle justify-center">
            Have an account?
            <Box
              className="text-blue ml-[10px] cursor-pointer"
              onClick={handleRedirectLogin}
            >
              Sign in
            </Box>
          </Box>
          <Box>
            <Box className="text-loginSubTitle text-grayText mt-[20px] mb-[10px]">
              Who will be using this
            </Box>
            <FormControl>
              <RadioGroup
                row
                value={selectRole}
                onChange={handleChangeRole}
                name="row-radio-buttons-group"
              >
                <FormControlLabel
                  value="user"
                  control={<Radio />}
                  label="Learner"
                  className={`${
                    selectRole === "user"
                      ? "text-blackText font-semibold"
                      : "text-grayText"
                  }`}
                  sx={{
                    ".MuiTypography-body1": {
                      fontFamily: "Mulish",
                    },
                    ".MuiTypography-root": {
                      fontSize: isMobile ? "14px" : "16px",
                    },
                  }}
                />
                <FormControlLabel
                  value="instructor"
                  control={<Radio />}
                  label="Content Creator"
                  className={`${
                    selectRole === "instructor"
                      ? "text-blackText font-semibold"
                      : "text-grayText"
                  }`}
                  sx={{
                    ".MuiTypography-body1": {
                      fontFamily: "Mulish",
                    },
                    ".MuiTypography-root": {
                      fontSize: isMobile ? "14px" : "16px",
                    },
                  }}
                />
              </RadioGroup>
            </FormControl>
          </Box>
          <form onSubmit={formik.handleSubmit}>
            <Box className=" flex flex-col mt-[16px]">
              <FormControl className="mb-[16px]">
                <Box className="text-loginSubTitle text-grayText mb-[5px]">
                  Full name
                </Box>
                <OutlinedInput
                  id="fullName"
                  onChange={formik.handleChange}
                  value={formik.values.fullName}
                  className={`border border-[#EAEDF4] bg-white rounded-xl h-[50px]`}
                  placeholder="Enter full name"
                  inputProps={{
                    maxLength: 100,
                  }}
                />
                {formik.errors.fullName && formik.touched.fullName && (
                  <MessageError message={formik.errors.fullName} />
                )}
              </FormControl>
              <FormControl className="mb-[16px]">
                <Box className="leading-6 mb-[7px] ml-[5px] text-grayText text-sm">
                  Email address
                </Box>
                <TextField
                  id="email"
                  onChange={formik.handleChange}
                  onKeyDown={handleKeyDown}
                  value={formik.values.email}
                  placeholder="Enter email address"
                  inputProps={{
                    maxLength: 62,
                  }}
                  InputProps={{
                    className:
                      "border border-[#EAEDF4] bg-white rounded-xl h-[50px]",
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

              <FormControl className="mb-[16px]">
                <InputPassWord
                  isAuth={true}
                  label="Confirm password"
                  field="cfpassword"
                  value={formik.values.cfpassword}
                  onChange={formik.handleChange}
                />
                {formik.errors.cfpassword && formik.touched.cfpassword && (
                  <MessageError message={formik.errors.cfpassword} />
                )}
              </FormControl>

              <Box
                className={`${
                  isMobile ? "text-smallText" : "text-loginSubTitle"
                } text-grayText`}
              >
                Include at least:{" "}
              </Box>
              <Box className="ml-[20px]">
                <ul
                  className={`list-disc marker:grayText text-grayText grid grid-cols-2  ${
                    isMobile
                      ? "text-smallTextAuth gap-x-4"
                      : "text-loginSubTitle gap-x-20"
                  }`}
                >
                  <li>1 Uppercase character</li>
                  <li>1 Special character</li>
                  <li>1 Lowercase character</li>
                  <li>8 Characters minimum</li>
                  <li>1 Number</li>
                </ul>
              </Box>

              <FormControl className="flex flex-row items-start mt-[16px]">
                <Checkbox
                  color="success"
                  className="pl-[0px] -ml-[2px] pt-[0px]"
                  onChange={() => setIsApprove(!isApprove)}
                />
                <Box className={"flex-1 text-blackText text-loginSubTitle"}>
                  <p>
                    I agree to the{" "}
                    <span
                      className="cursor-pointer mx-[5px] underline"
                      onClick={handleOpenTerm}
                    >
                      Term of Services{" "}
                    </span>{" "}
                    and{" "}
                    <span
                      className="cursor-pointer ml-[5px] underline"
                      onClick={handleOpenPolicy}
                    >
                      Privacy Policy
                    </span>{" "}
                  </p>
                </Box>
              </FormControl>

              <ReCAPTCHA
                size="normal"
                sitekey={RECAPTCHA_SITE_KEY}
                onChange={handleCaptchaSubmission}
                ref={recaptchaRef}
              />

              <ButtonBase
                type="submit"
                disabled={!isApprove || !isverified}
                className={`h-[50px] rounded-[100px] mt-[24px] text-white ${
                  isApprove && isverified ? "bg-btnBlue" : "bg-btnDisable"
                }`}
              >
                {isLoading ? (
                  <CircularProgress style={{ color: "white" }} />
                ) : (
                  <>
                    <Box className="font-bold mr-[12px]">Create account</Box>
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
        isSignUp={true}
      />
    </Stack>
  );
};

export { SignUpContent };
