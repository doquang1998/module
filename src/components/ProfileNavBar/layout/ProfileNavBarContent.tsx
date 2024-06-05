import {
  Avatar,
  Badge,
  Box,
  ButtonBase,
  CircularProgress,
  FormControl,
  OutlinedInput,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { DatePicker } from "@mui/x-date-pickers";
import { AxiosResponse } from "axios";
import dayjs, { Dayjs } from "dayjs";
import { useFormik } from "formik";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import * as Yup from "yup";
import { AuthService } from "../../../services/AuthService";
import { UploadApi } from "../../../services/UploadApi";
import { InputPhone } from "../../Common/InputPhone";
import { MessageError } from "../../Common/MessageError";
import { IconDate } from "../../Common/assert/icons/IconDate";
import { IconEmail } from "../../Common/assert/icons/IconEmail";
import Camera from "../../Common/assert/images/Camera.png";
import { MESSAGE_ALERT, VALIDATION_MESSAGE } from "../../Common/constants/auth";
import { chunkFile } from "../../helpers/functions";
import { IProps } from "../ProfileNavBar";

interface IProfile {
  id: number;
  fullName: string | null;
  dateOfBirth: string | null;
  phoneNumber: string | null;
  email: string | null;
  walletAddress: string | null;
  avatarUrl: string | null;
  paypalId: string | null;
}

const SmallAvatar = styled(Avatar)(({ theme }) => ({
  width: 28,
  height: 28,
  border: `2px solid #EAEDF4`,
}));

const ProfileNavBarContent = ({
  handleUpdateAvatar,
  handleUpdateProfile,
}: IProps) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isGetProfile, setIsGetProfile] = useState<boolean>(true);
  const [dataProfile, setDataProfile] = useState<IProfile | null>(null);
  const [avatarUpdate, setAvatarUpdate] = useState<string>("");
  const [errorMsgAvatar, setErrorMsgAvatar] = useState<boolean>(false);
  const [isChange, setIsChange] = useState<boolean>(false);

  const formik = useFormik<{
    fullName: string;
    dateOfBirth: Dayjs | null;
    email: string;
    phoneNumber: string;
    walletAddress: string;
    paypalId: string;
  }>({
    initialValues: {
      fullName: "",
      dateOfBirth: null,
      email: "",
      phoneNumber: "",
      walletAddress: "",
      paypalId: "",
    },
    validationSchema: Yup.object({
      fullName: Yup.string()
        .trim()
        .required("This is a required field")
        .matches(/^[A-Za-z0-9 ]+$/, VALIDATION_MESSAGE.ONLY_ALPHABETS)
        .max(100, VALIDATION_MESSAGE.MAXIMUM_100),
      walletAddress: Yup.string()
        .trim()
        .max(100, VALIDATION_MESSAGE.MAXIMUM_100),
      paypalId: Yup.string().trim().max(100, VALIDATION_MESSAGE.MAXIMUM_100),
      dateOfBirth: Yup.date()
        .nullable()
        .max(
          new Date(new Date().setDate(new Date().getDate() - 1)),
          VALIDATION_MESSAGE.INVALID_DATE
        ),
      // email: Yup.string()
      //   .required("This is a required field")
      //   .email(VALIDATION_MESSAGE.INVALID_EMAIL)
      //   .matches(/^[\w-\.+]+@([\w-]+\.)+[\w-]{2,4}$/, VALIDATION_MESSAGE.INVALID_EMAIL)
      //   .max(62, VALIDATION_MESSAGE.MAXIMUM_62),
    }),
    onSubmit: async (values) => {
      setIsLoading(true);
      try {
        const response = await AuthService.EditProfile({
          fullName: values.fullName.trim(),
          dateOfBirth: values.dateOfBirth
            ? dayjs(values.dateOfBirth).format("YYYY-MM-DD")
            : null,
          email: values.email,
          phoneNumber: `+${values.phoneNumber}`,
          walletAddress: values.walletAddress,
          paypalId: values.paypalId,
        });
        setIsLoading(false);
        if (dataProfile) {
          const dataUpdate = { ...dataProfile };
          dataUpdate.fullName = values.fullName.trim();
          dataUpdate.dateOfBirth = values.dateOfBirth
            ? dayjs(values.dateOfBirth).format("YYYY-MM-DD")
            : null;
          dataUpdate.email = values.email;
          dataUpdate.phoneNumber = values.phoneNumber;
          dataUpdate.walletAddress = values.walletAddress ?? "";
          dataUpdate.paypalId = values.paypalId ?? "";
          setDataProfile({ ...dataUpdate });
          setIsChange(false);
        }
        handleUpdateProfile && handleUpdateProfile(response.data ?? "");
        toast.success(MESSAGE_ALERT.UPDATE_PROFILE_SUCCESS);
      } catch (error: any) {
        if (error?.response?.data?.errors?.email) {
          formik?.setFieldError("email", VALIDATION_MESSAGE.EMAIL_ALREADY);
        }
        if (error?.response?.data?.errors?.phoneNumber) {
          formik?.setFieldError(
            "phoneNumber",
            VALIDATION_MESSAGE.INVALID_PHONE_NUMBER
          );
        }
        if (!error?.response?.data?.errors) {
          toast.error(
            `${
              error?.response?.data?.message ??
              MESSAGE_ALERT.SOMETHING_WENT_WRONG
            }`
          );
        }
        setIsLoading(false);
      }
    },
  });

  useEffect(() => {
    getUserProfile();
  }, []);

  const getUserProfile = async () => {
    try {
      setIsGetProfile(true);
      const response: AxiosResponse = await AuthService.UserProfile();
      formik.setValues({
        fullName: response?.data?.fullName,
        dateOfBirth: response?.data?.dateOfBirth
          ? dayjs(response?.data?.dateOfBirth)
          : null,
        email: response?.data?.email,
        phoneNumber: response?.data?.phoneNumber,
        walletAddress: response?.data?.walletAddress ?? "",
        paypalId: response?.data?.paypalId ?? "",
      });

      setDataProfile(response.data);
    } catch (error: any) {
      toast.error(
        `${
          error?.response?.data?.message ?? MESSAGE_ALERT.SOMETHING_WENT_WRONG
        }`
      );
    } finally {
      setIsGetProfile(false);
    }
  };

  const handleUploadAvatar = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    try {
      if (!dataProfile?.id || !event.target.files) return;
      setErrorMsgAvatar(false);
      if (event.target.files[0].size > 1024 * 1024 * 5) {
        setErrorMsgAvatar(true);
        event.target.value = "";
        return;
      }
      const response = await UploadApi.getSignedUrl("image");
      const { url, fileDestination } = response.data.data;
      const resLocation = await UploadApi.getLocation(url);
      const chunks = await chunkFile(event.target.files[0]);
      const headers = {
        "Content-Range": chunks[0].contentRange,
        "Content-Type": "application/octet-stream",
      };
      await UploadApi.uploadFile(
        resLocation?.headers?.location,
        chunks[0].data,
        headers
      );
      const responseUpload = await UploadApi.fireEventFinishedUpload(
        dataProfile.id,
        fileDestination
      );

      handleUpdateAvatar && handleUpdateAvatar(responseUpload.data ?? "");
      setAvatarUpdate(responseUpload.data);
    } catch (error: any) {
      toast.error(
        `${
          error?.response?.data?.message ?? MESSAGE_ALERT.SOMETHING_WENT_WRONG
        }`
      );
    }
  };

  const handleResetForm = () => {
    formik.setValues({
      fullName: dataProfile?.fullName || "",
      dateOfBirth: dataProfile?.dateOfBirth
        ? dayjs(dataProfile?.dateOfBirth)
        : null,
      email: dataProfile?.email || "",
      phoneNumber: dataProfile?.phoneNumber || "",
      walletAddress: dataProfile?.walletAddress ?? "",
      paypalId: dataProfile?.paypalId ?? "",
    });
  };
  const handleInput = (
    e: { target: { id: string; value: any } },
    isBlur: boolean
  ) => {
    if (!isChange) {
      setIsChange(true);
    }
    const value = isBlur ? e.target.value.trim() : e.target.value;
    formik.setFieldValue(e.target.id, value);
  };

  const handleChangeInput = (e: { target: { id: string; value: any } }) =>
    handleInput(e, false);

  const handleBlurInput = (e: { target: { id: string; value: any } }) =>
    handleInput(e, true);

  return (
    <Stack flex={1}>
      {isGetProfile ? (
        <Box className="flex items-center justify-center">
          <CircularProgress />
        </Box>
      ) : (
        <Box className="flex my-[30px] mx-[40px] justify-around bg-bgCourse">
          <Box flex={2}>
            <Box className="font-bold text-headerTitle text-blackText">
              Profile
            </Box>
            <Box className="text-subHeaderTitle text-grayText">
              General user information
            </Box>
            <Box className="mt-[32px]">
              <Box className="text-loginSubTitle text-grayText mb-[10px]">
                Change avatar
              </Box>
              <Badge
                overlap="circular"
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                badgeContent={<SmallAvatar alt="Camera" src={Camera} />}
                className="relative cursor-pointer rounded-full mb-[5px]"
              >
                <input
                  type="file"
                  accept="image/png, image/jpeg"
                  className="absolute inset-0 z-10 cursor-pointer opacity-0 rounded-t-full rounded-bl-full"
                  onChange={handleUploadAvatar}
                />
                <Avatar
                  alt="Avatar"
                  src={
                    avatarUpdate ? avatarUpdate : dataProfile?.avatarUrl || ""
                  }
                  sx={{ width: 80, height: 80 }}
                  style={{ objectFit: "contain" }}
                />
              </Badge>
              {errorMsgAvatar && (
                <MessageError
                  message={VALIDATION_MESSAGE.MAX_SIZE_FILE_IMAGE}
                />
              )}
            </Box>
            <form onSubmit={formik.handleSubmit}>
              <Box className=" flex flex-col mt-[20px]">
                <FormControl className="mb-[16px]">
                  <Box className="text-loginSubTitle text-grayText mb-[5px]">
                    Full name
                  </Box>
                  <OutlinedInput
                    id="fullName"
                    onChange={handleChangeInput}
                    onBlur={handleBlurInput}
                    value={
                      formik.values.fullName || formik.initialValues.fullName
                    }
                    className="border border-[#EAEDF4] bg-white rounded-[12px] max-w-[560px]"
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
                  <Box className="text-loginSubTitle text-grayText mb-[5px]">
                    Date of birth
                  </Box>
                  <DatePicker
                    value={
                      formik.values.dateOfBirth ||
                      formik.initialValues.dateOfBirth
                    }
                    format="DD/MM/YYYY"
                    slotProps={{
                      textField: {
                        id: "dateOfBirth",
                        placeholder: "DD/MM/YYYY",
                        sx: {
                          ".MuiOutlinedInput-root": {
                            borderRadius: "12px",
                            borderColor: "#EAEDF4",
                            backgroundColor: "#FFF",
                            maxWidth: 560,
                          },
                        },
                      },
                      popper: {
                        placement: "bottom-end",
                      },
                    }}
                    maxDate={dayjs().subtract(1, "day")}
                    onChange={(value) => {
                      setIsChange(true);
                      formik.setFieldValue("dateOfBirth", value, true);
                    }}
                    slots={{
                      openPickerIcon: IconDate,
                    }}
                  />
                  {formik.errors.dateOfBirth && formik.touched.dateOfBirth && (
                    <MessageError
                      message={
                        formik.values.dateOfBirth
                          ? VALIDATION_MESSAGE.INVALID_DATE
                          : formik.errors.dateOfBirth
                      }
                    />
                  )}
                </FormControl>

                <FormControl className="mb-[16px]">
                  <Box className="leading-6 mb-[7px] ml-[5px] text-grayText text-sm">
                    Email address
                  </Box>
                  <TextField
                    id="email"
                    inputProps={{
                      maxLength: 62,
                    }}
                    disabled={true}
                    placeholder="Enter email address"
                    value={formik.values.email || formik.initialValues.email}
                    InputProps={{
                      className:
                        "border border-[#EAEDF4] bg-white rounded-[12px] max-w-[560px]",
                      startAdornment: (
                        <Box className="mr-[10px]">
                          <IconEmail />
                        </Box>
                      ),
                    }}
                  />
                  {/* {formik.errors.email && formik.touched.email && (
                    <MessageError message={formik.errors.email} />
                  )} */}
                </FormControl>

                <FormControl className="mb-[16px] max-w-[560px]">
                  <Box className="leading-6 mb-[7px] ml-[5px] text-grayText text-sm">
                    Mobile Number
                  </Box>
                  <InputPhone
                    isAuth={true}
                    field="phoneNumber"
                    formik={formik}
                    isChangeForm={
                      !isChange ? () => setIsChange(true) : undefined
                    }
                    value={
                      formik.values.phoneNumber ||
                      formik.initialValues.phoneNumber
                    }
                  />
                  {formik.errors.phoneNumber && formik.touched.phoneNumber && (
                    <MessageError message={formik.errors.phoneNumber} />
                  )}
                </FormControl>

                <FormControl className="mb-[16px]">
                  <Box className="text-loginSubTitle text-grayText mb-[5px]">
                    Wallet address
                  </Box>
                  <OutlinedInput
                    id="walletAddress"
                    onChange={handleChangeInput}
                    onBlur={handleBlurInput}
                    value={
                      formik.values.walletAddress ||
                      formik.initialValues.walletAddress
                    }
                    className="border border-[#EAEDF4] max-w-[560px] bg-white rounded-[12px]"
                    slotProps={{
                      input: {
                        className: "py-0 h-[50px]",
                      },
                    }}
                    placeholder="Enter receiving wallet address"
                    inputProps={{
                      maxLength: 100,
                    }}
                  />
                </FormControl>
                <FormControl className="mb-[16px]">
                  <Box className="text-loginSubTitle text-grayText mb-[5px]">
                    Paypal Account (Not visible to other users)
                  </Box>
                  <OutlinedInput
                    id="paypalId"
                    onChange={handleChangeInput}
                    onBlur={handleBlurInput}
                    value={
                      formik.values.paypalId || formik.initialValues.paypalId
                    }
                    className="border border-[#EAEDF4] max-w-[560px] bg-white rounded-[12px]"
                    slotProps={{
                      input: {
                        className: "py-0 h-[50px]",
                      },
                    }}
                    placeholder="Enter PayPal ID"
                    inputProps={{
                      maxLength: 100,
                    }}
                  />
                  <Typography className="text-sm text-grayText italic mt-1.5">
                    *System cannot validate your wallet address/Paypal ID, so
                    please make sure your details are correct
                  </Typography>
                </FormControl>

                <Box mt={"20px"}>
                  <ButtonBase
                    className="h-[50px] w-[160px] rounded-[100px] bg-bgBtnGray text-blackText mr-[30px]"
                    onClick={handleResetForm}
                    disabled={!isChange}
                  >
                    <Box className="font-bold">Cancel</Box>
                  </ButtonBase>
                  <ButtonBase
                    type="submit"
                    className={`${
                      !isChange || isLoading ? "bg-bgGray" : "bg-btnBlue"
                    } h-[50px] w-[160px] rounded-[100px]  text-white`}
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
      )}
    </Stack>
  );
};

export { ProfileNavBarContent };
