import {
  Box,
  ButtonBase,
  CircularProgress,
  FormControl,
  Stack,
  Typography,
} from "@mui/material";
import { Formik, FormikHelpers, useFormik } from "formik";
import React, { useEffect, useState } from "react";
import * as Yup from "yup";
import { AuthService } from "../../../services/AuthService";
import { InputPassWord } from "../../Common/InputPassWord";
import { MessageError } from "../../Common/MessageError";
import { IconArrowRight } from "../../Common/assert/icons/IconArrowRight";
import LogoAuth from "../../Common/assert/images/LogoAuth.png";
import { MESSAGE_ALERT, VALIDATION_MESSAGE } from "../../Common/constants/auth";
import { toast } from "react-toastify";
import useWindowSize from "../../../hooks/useWindowSize";
import "../../Common/assert/customCss/global.css";

interface IProps {
  redirectLogin: () => void;
}

const ResetPasswordContent = ({ redirectLogin }: IProps) => {
  const { isMobile } = useWindowSize();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  let hash =
    typeof window !== "undefined"
      ? window.location?.search?.split("hash=")[1]
      : "";
  const formik = useFormik({
    initialValues: {
      password: "",
      cfpassword: "",
    },
    validationSchema: Yup.object({
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
    onSubmit: async (values) => {
      handleSubmit(values);
    },
  });

  const handleSubmit = async (values: {
    password: string;
    cfpassword: string;
  }) => {
    setIsLoading(true);
    try {
      await AuthService.ResetPassword(values.password, hash);
      setIsLoading(false);
      formik.resetForm();
      redirectLogin && redirectLogin();
      console.log("aaa", redirectLogin.toString());
      if (typeof window !== "undefined") {
        window.history.replaceState(
          {},
          document.title,
          window.location.pathname
        );
      }
    } catch (err: any) {
      setIsLoading(false);
      toast.error(
        `${err?.response?.data?.message ?? MESSAGE_ALERT.SOMETHING_WENT_WRONG}`
      );
    }
  };

  useEffect(() => {
    if (hash) {
      handleCheckForgot();
    }
  }, [hash]);

  const handleCheckForgot = async () => {
    try {
      await AuthService.checkHashForgot(hash);
    } catch (err: any) {
      toast.error(
        `${err?.response?.data?.message ?? MESSAGE_ALERT.SOMETHING_WENT_WRONG}`
      );
    }
  };

  return (
    <Stack flex={1} className="custom-form">
      <Box
        className={`${
          isMobile
            ? " "
            : "relative right-[80px] rounded-tl-[60px] rounded-bl-[60px] min-w-[580px]"
        } bg-bgCourse h-full `}
      >
        <Box className={`${isMobile ? "px-[32px]" : "ml-[80px]"} my-[70px] `}>
          <Box className="flex justify-center">
            <img src={LogoAuth} alt="LogoAuth" />
          </Box>
          <Box className="text-blackText text-loginTitle text-center font-bold mt-[32px]">
            Reset Password
          </Box>
          <Typography onClick={redirectLogin} className="font-bold mr-[12px]">
            Reset password
          </Typography>
          <Formik
            initialValues={{
              password: "",
              cfpassword: "",
            }}
            onSubmit={async (values) => {
              handleSubmit(values);
            }}
          >
            <Box className=" flex flex-col mt-[16px]">
              <FormControl className="mb-[16px]">
                <InputPassWord
                  isAuth={true}
                  label="New Password"
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
                  label="Confirm Password"
                  field="cfpassword"
                  onChange={formik.handleChange}
                  value={formik.values.cfpassword}
                />
                {formik.errors.cfpassword && formik.touched.cfpassword && (
                  <MessageError message={formik.errors.cfpassword} />
                )}
              </FormControl>

              <Box className="text-loginSubTitle text-grayText">
                Include at least:{" "}
              </Box>
              <Box className="ml-[20px]">
                <ul
                  className={`list-disc marker:grayText text-grayText grid grid-cols-2 gap-x-20 
                 ${
                   isMobile
                     ? "text-smallTextAuth gap-x-4"
                     : "text-loginSubTitle gap-x-20"
                 }
                    `}
                >
                  <li>1 Uppercase character</li>
                  <li>1 Special character</li>
                  <li>1 Lowercase character</li>
                  <li>8 Characters minimum</li>
                  <li>1 Number</li>
                </ul>
              </Box>

              <ButtonBase
                type="submit"
                className={` ${
                  isLoading ? "bg-bgGray" : "bg-btnBlue"
                } h-[50px] rounded-[100px] mt-[24px] text-white`}
                disabled={isLoading}
              >
                {isLoading ? (
                  <CircularProgress style={{ color: "white" }} />
                ) : (
                  <>
                    <Typography className="font-bold mr-[12px]">
                      Reset password
                    </Typography>
                    <IconArrowRight />
                  </>
                )}
              </ButtonBase>
            </Box>
          </Formik>
        </Box>
      </Box>
    </Stack>
  );
};

export { ResetPasswordContent };
