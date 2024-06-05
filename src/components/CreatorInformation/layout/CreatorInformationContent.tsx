import {
  Box,
  ButtonBase,
  CircularProgress,
  FormControl,
  OutlinedInput,
  Stack,
  TextField,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { AxiosResponse } from "axios";
import { useFormik } from "formik";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { AuthService } from "../../../services/AuthService";
import "../../Common/assert/customCss/global.css";
import { MESSAGE_ALERT } from "../../Common/constants/auth";
import { IProps } from "../CreatorInformation";

interface IProfile {
  id: number;
  title: string | null;
  biography: string | null;
}

const StyledTextArea = styled(TextField)`
  textarea {
    resize: none;
  }
`;

const CreatorInformationContent = ({ title, biography, handleUpdateProfile }: IProps) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isChange, setIsChange] = useState<boolean>(false);
  const [dataInfor, setDataInfor] = useState({
    title: title,
    biography: biography,
  });

  const formik = useFormik({
    initialValues: {
      title: dataInfor.title,
      biography: dataInfor.biography,
    },
    onSubmit: async (values) => {
      setIsLoading(true);
      try {
        const response: AxiosResponse = await AuthService.EditCreatorInfo(
          values.title ? values.title.trim() : values.title,
          values.biography ? values.biography.trim() : values.biography
        );
        setIsLoading(false);
        toast.success(MESSAGE_ALERT.UPDATE_SUCCESS);
        setDataInfor({
          title: response?.data?.title,
          biography: response?.data?.biography,
        });
        formik.setFieldValue("title", response?.data?.title);
        formik.setFieldValue("biography", response?.data?.biography);
        handleUpdateProfile && handleUpdateProfile(response.data)
        setIsChange(false)
      } catch (err: any) {
        toast.error(`${err?.response?.data?.message ?? MESSAGE_ALERT.SOMETHING_WENT_WRONG}`);
        setIsLoading(false);
      }
    },
  });

  useEffect(() => {
    formik.setFieldValue("title", title);
    formik.setFieldValue("biography", biography);
  }, [title, biography])

  const handleChangeInput = (e: { target: { id: string; value: any } }) => {
    if (!isChange) {
      setIsChange(true);
    }
    formik.setFieldValue(e.target.id, e.target.value);
  };

  const handleResetForm = () => {
    formik.resetForm()
    formik.setFieldValue("title", dataInfor.title || "");
    formik.setFieldValue("biography", dataInfor.biography || null);
  };

  return (
    <Stack flex={1}>
      <Box className="flex my-[30px] mx-[40px] justify-around">
        <Box flex={2}>
          <Box className="font-bold text-headerTitle text-blackText">
            Creator Information
          </Box>
          <Box className="text-grayText mt-[10px]">
            Your information will be made public
          </Box>
          <Box className="text-grayText text-loginSubTitle mt-[30px]">Role</Box>
          <Box className="bg-btnBluelight text-white text-loginSubTitle font-bold rounded-[100px] px-[12px] py-[5px] w-[131px] mt-[10px]">
           Content Creator
          </Box>
          <form onSubmit={formik.handleSubmit}>
            <Box className=" flex flex-col mt-[20px]">
              <FormControl className="mb-[20px]">
                <Box className="text-loginSubTitle text-grayText mb-[5px]">
                  Title
                </Box>
                <OutlinedInput
                  id="title"
                  inputProps={{
                    maxLength: 256,
                  }}
                  onChange={handleChangeInput}
                  value={formik.values.title ||
                    formik.initialValues.title}
                  className="border border-[#EAEDF4] bg-white rounded-[12px] max-w-[560px]"
                  placeholder="Enter title"
                />
              </FormControl>

              <FormControl className="mb-[20px]">
                <Box className="text-loginSubTitle text-grayText mb-[5px]">
                  Biography
                </Box>
                <StyledTextArea
                  id="biography"
                  placeholder="Enter your details"
                  value={formik.values.biography ||
                    formik.initialValues.biography}
                  onChange={handleChangeInput}
                  minRows={3}
                  maxRows={6}
                  multiline
                  InputProps={{
                    className: "border border-[#EAEDF4] bg-white rounded-[12px] max-w-[560px]",
                  }}
                  inputProps={{
                    maxLength: 300,
                  }}
                  variant="outlined"
                />
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
    </Stack>
  );
};

export { CreatorInformationContent };

