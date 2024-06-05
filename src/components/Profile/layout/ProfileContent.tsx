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
  Button,
  Typography,
  Tooltip,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { DatePicker, MobileDatePicker } from "@mui/x-date-pickers";
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
import { chunkFile, formatAddress } from "../../helpers/functions";
import { IProps } from "../Profile";
import useWindowSize from "../../../hooks/useWindowSize";
import "../../Common/assert/customCss/Profile.css";
import { CancelIcon, StarIcon } from "../../Common/icons";

interface IWallet {
  address: string;
  createdAt: string;
  id: number;
  isPrimaryWallet: boolean;
  updatedAt: string;
  userId: number;
}
interface IProfile {
  id: number;
  fullName: string | null;
  dateOfBirth: string | null;
  email: string | null;
  phoneNumber: string | null;
  walletAddress: string | null;
  avatarUrl: string | null;
  wallets: IWallet[];
  paypalId: string | null;
}

const SmallAvatar = styled(Avatar)(({ theme }) => ({
  width: 28,
  height: 28,
  border: `2px solid #EAEDF4`,
}));

const ProfileContent = ({
  redirectProfile,
  handleUpdateAvatar,
  handleConnectWallet,
  handleDisconnectWallet,
  activeAccount,
  handleSetDefaultAccount,
}: IProps) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [dataProfile, setDataProfile] = useState<IProfile | null>(null);
  const [avatarUpdate, setAvatarUpdate] = useState<string>("");
  const [errorMsgAvatar, setErrorMsgAvatar] = useState<boolean>(false);
  const [isChange, setIsChange] = useState<boolean>(false);
  const [wallets, setWallets] = useState<IWallet[]>([]);

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
      dateOfBirth: Yup.date()
        .nullable()
        .max(
          new Date(new Date().setDate(new Date().getDate() - 1)),
          VALIDATION_MESSAGE.INVALID_DATE
        ),
      // email: Yup.string()
      //   .email(VALIDATION_MESSAGE.INVALID_EMAIL)
      //   .matches(
      //     /^[\w-\.+]+@([\w-]+\.)+[\w-]{2,4}$/,
      //     VALIDATION_MESSAGE.INVALID_EMAIL
      //   )
      //   .max(62, VALIDATION_MESSAGE.MAXIMUM_62)
      //   .required("This is a required field"),
    }),
    onSubmit: async (values) => {
      setIsLoading(true);
      try {
        await AuthService.EditProfile(
          {
            email: values.email,
            fullName: values.fullName.trim(),
            phoneNumber: `+${values.phoneNumber}`,
            walletAddress: values.walletAddress,
            dateOfBirth: values.dateOfBirth
              ? dayjs(values.dateOfBirth).format("YYYY-MM-DD")
              : null,
            paypalId: values.paypalId,
          },
          "user"
        );
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
          setDataProfile({ ...dataUpdate });
          setIsChange(false);
        }
        toast.success(MESSAGE_ALERT.UPDATE_PROFILE_SUCCESS);
      } catch (error: any) {
        if (error?.response?.data?.errors?.email) {
          formik.errors.email = VALIDATION_MESSAGE.EMAIL_ALREADY;
        }
        if (error?.response?.data?.errors?.phoneNumber) {
          formik.errors.phoneNumber = VALIDATION_MESSAGE.INVALID_PHONE_NUMBER;
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

  const getUserProfile = async (isUpdateWallets?: boolean) => {
    try {
      const response: AxiosResponse = await AuthService.UserProfile();
      if (!isUpdateWallets) {
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
      }
      setDataProfile(response.data);
      setWallets(response.data.wallets);
    } catch (error: any) {
      toast.error(
        `${
          error?.response?.data?.message ?? MESSAGE_ALERT.SOMETHING_WENT_WRONG
        }`
      );
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

  const handleChangeInput = (e: { target: { id: string; value: any } }) => {
    if (!isChange) {
      setIsChange(true);
    }
    formik.setFieldValue(e.target.id, e.target.value);
  };

  const { isMobile } = useWindowSize();

  const onClickConnectWallet = async () => {
    try {
      await handleConnectWallet();
      getUserProfile(true);
    } catch (error: any) {
      toast.error(
        `${
          error?.response?.data?.message ?? MESSAGE_ALERT.SOMETHING_WENT_WRONG
        }`
      );
    }
  };

  const onClickSetDefaultAccount = async () => {
    try {
      await handleSetDefaultAccount();
      getUserProfile(true);
    } catch (error: any) {
      toast.error(
        `${
          error?.response?.data?.message ?? MESSAGE_ALERT.SOMETHING_WENT_WRONG
        }`
      );
    }
  };

  const onClickDisconnectWallet = async () => {
    try {
      await handleDisconnectWallet();
      getUserProfile(true);
    } catch (error: any) {
      toast.error(
        `${
          error?.response?.data?.message ?? MESSAGE_ALERT.SOMETHING_WENT_WRONG
        }`
      );
    }
  };

  return (
    <Stack flex={1}>
      <Box
        className={`flex ${
          isMobile
            ? "flex-col px-[16px] pb-[24px] pt-[40px] gap-[34px]"
            : "my-[30px] mx-[40px] justify-around"
        }`}
      >
        <Box
          flex={1}
          className={`${
            isMobile ? "flex flex-col items-center" : "mt-[45px] ml-[40px]"
          }`}
        >
          <Box
            className={`${
              isMobile ? "w-[160px] h-[160px]" : "w-[210px] h-[210px]"
            } relative  border border-[#2869F6] border-opacity-30 rounded-full outline outline-offset-[15px] outline-[#2869F6]/[.1]`}
          >
            <Avatar
              alt="Avatar Profile"
              src={avatarUpdate ? avatarUpdate : dataProfile?.avatarUrl || ""}
              sx={{ width: isMobile ? 140 : 180, height: isMobile ? 140 : 180 }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 border-2 border-[#2869F6]"
            />
          </Box>
          <Box
            className={`${
              isMobile ? "text-subtitle mt-[22px]" : "text-pageTitle mt-[65px]"
            } font-bold  w-[225px] text-center text-blackText`}
          >
            {dataProfile?.fullName}
          </Box>
        </Box>
        <Box flex={2}>
          <Box
            className={`${isMobile ? "flex justify-between items-center" : ""}`}
          >
            <Box>
              <Box
                className={`${
                  isMobile ? "text-subHeaderTitle" : "text-headerTitle"
                } font-bold  text-blackText`}
              >
                Personal Profile
              </Box>
              <Box
                className={`${
                  isMobile ? "text-smallText" : "text-subHeaderTitle"
                } font-bold  text-blueText`}
              >
                Your information will be made public
              </Box>
            </Box>
            <Box
              className={`${
                isMobile ? "" : "mt-[15px] max-w-[80px]"
              } bg-btnGreen text-white font-bold rounded-[100px] px-[12px] py-[5px]`}
            >
              Learner
            </Box>
          </Box>
          <Box
            className={`${
              isMobile ? "mt-[24px] flex flex-col items-center" : "mt-[32px]"
            }`}
          >
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
                src={avatarUpdate ? avatarUpdate : dataProfile?.avatarUrl || ""}
                sx={{ width: 80, height: 80 }}
              />
            </Badge>
            {errorMsgAvatar && (
              <MessageError message={VALIDATION_MESSAGE.MAX_SIZE_FILE_IMAGE} />
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
                  value={
                    formik.values.fullName || formik.initialValues.fullName
                  }
                  className="border border-[#EAEDF4] bg-bgInputGray rounded-[12px]"
                  slotProps={{
                    input: {
                      className: "py-0 h-[50px]",
                    },
                  }}
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
                {isMobile ? (
                  <MobileDatePicker
                    value={formik.values.dateOfBirth}
                    maxDate={dayjs().subtract(1, "day")}
                    onChange={(value) => {
                      setIsChange(true);
                      formik.setFieldValue("dateOfBirth", value, true);
                    }}
                    format="DD/MM/YYYY"
                    slotProps={{
                      textField: {
                        id: "dateOfBirth",
                        placeholder: "DD/MM/YYYY",
                        sx: {
                          ".MuiOutlinedInput-root": {
                            borderRadius: "12px",
                            borderColor: "#EAEDF4",
                            backgroundColor: "#F8F8FA",
                            paddingRight: "10px",
                            height: "50px",
                            borderWidth: "1px",
                            paddingY: "0px",
                          },
                        },
                        className: "h-[50px]",
                        InputProps: {
                          className: "h-[50px] py-0",
                          endAdornment: <IconDate />,
                        },
                      },
                    }}
                  />
                ) : (
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
                            backgroundColor: "#F8F8FA",
                            borderWidth: "1px",
                          },
                        },
                        className: "h-[50px]",
                        inputProps: {
                          className: "h-[50px] py-0",
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
                )}
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
                  placeholder="Enter email address"
                  inputProps={{
                    maxLength: 62,
                  }}
                  disabled={true}
                  value={formik.values.email || formik.initialValues.email}
                  InputProps={{
                    className:
                      "h-[50px] border border-[#EAEDF4] bg-bgInputGray rounded-[12px]",
                    startAdornment: (
                      <Box className="mr-[10px]">
                        <IconEmail />
                      </Box>
                    ),
                  }}
                />
              </FormControl>
              <FormControl className="mb-[16px]">
                <Box className="leading-6 mb-[7px] ml-[5px] text-grayText text-sm">
                  Mobile Number
                </Box>
                <InputPhone
                  field="phoneNumber"
                  formik={formik}
                  value={
                    formik.values.phoneNumber ||
                    formik.initialValues.phoneNumber
                  }
                  isChangeForm={!isChange ? () => setIsChange(true) : undefined}
                />
                {formik.errors.phoneNumber && formik.touched.phoneNumber && (
                  <MessageError message={formik.errors.phoneNumber} />
                )}
              </FormControl>

              <FormControl className="mb-[16px]">
                <Box className="leading-6 mb-[7px] ml-[5px] text-grayText text-sm">
                  Wallet address
                </Box>
                <Stack className="gap-1">
                  {wallets.map((wallet, index) => (
                    <Stack
                      className="flex-row w-full items-center gap-3 md:gap-2"
                      key={wallet.id}
                    >
                      <TextField
                        id="walletAddress"
                        placeholder="Enter wallet address"
                        inputProps={{
                          maxLength: 62,
                        }}
                        disabled={true}
                        value={
                          isMobile
                            ? formatAddress(wallet.address)
                            : wallet.address
                        }
                        className="flex-1 max-w-[230px] sm:max-w-[560px]"
                        InputProps={{
                          className: `h-[50px] border ${
                            wallet.isPrimaryWallet
                              ? "border-[#2869F6]"
                              : "border-[#EAEDF4]"
                          } ${
                            wallet.isPrimaryWallet
                              ? "bg-white"
                              : "bg-bgInputGray"
                          } rounded-xl font-normal`,
                          sx: {
                            ".Mui-disabled": {
                              "-webkit-text-fill-color": "#464358 !important",
                            },
                          },
                          endAdornment: (
                            <Typography className="whitespace-nowrap font-sm text-blueText font-bold">
                              {wallet.isPrimaryWallet ? "Primary" : ""}
                            </Typography>
                          ),
                        }}
                      />
                      {activeAccount === wallet.address &&
                        !wallet.isPrimaryWallet && (
                          <>
                            <Tooltip title="Set as primary wallet">
                              <ButtonBase
                                className="rounded-full"
                                onClick={onClickSetDefaultAccount}
                              >
                                <StarIcon />
                              </ButtonBase>
                            </Tooltip>
                            <Tooltip title="Remove wallet address">
                              <ButtonBase
                                className="rounded-full"
                                onClick={onClickDisconnectWallet}
                              >
                                <CancelIcon />
                              </ButtonBase>
                            </Tooltip>
                          </>
                        )}
                    </Stack>
                  ))}
                </Stack>
                {wallets.length < 5 && (
                  <Button
                    onClick={onClickConnectWallet}
                    variant="outlined"
                    className={`text-blueText text-sm text-loginSubTitle font-bold w-max border-[#2869F6] border rounded-full h-[30px] py-[5px] px-[16px] min-w-[unset] mt-3 normal-case`}
                  >
                    Add wallet
                  </Button>
                )}
              </FormControl>

              <Box
                className={`${isMobile ? "flex justify-between" : ""}`}
                mt={"20px"}
              >
                <ButtonBase
                  className={`${
                    isMobile ? "mr-[16px] w-[150px]" : "w-[160px] mr-[30px]"
                  } h-[50px]  rounded-[100px] bg-bgBtnGray text-blackText`}
                  onClick={handleResetForm}
                  disabled={!isChange}
                >
                  <Box className="font-bold">Cancel</Box>
                </ButtonBase>
                <ButtonBase
                  type="submit"
                  className={`${
                    !isChange || isLoading ? "bg-bgGray" : "bg-btnBlue"
                  } 
                    ${isMobile ? "w-[150px]" : "w-[160px]"}
                    h-[50px]  rounded-[100px]  text-white`}
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

export { ProfileContent };
