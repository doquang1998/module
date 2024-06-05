import { Box, Modal } from "@mui/material";
import React from "react";
import Message from "../Common/assert/images/Message.png";
import { IconClose } from "./assert/icons/IconClose";

interface IProps {
  isOpen: boolean;
  email: string;
  isSignUp?: boolean;
  onClose: () => void;
}

const ModalAuth = ({ isOpen, email, isSignUp, onClose }: IProps) => {
  const handleClose = () => {
    onClose();
  };

  return (
    <div>
      <Modal open={isOpen}>
        <Box
          sx={{
            width: "calc(100vw - 32px)",
            maxWidth: "650px",
          }}
          className="bg-white p-[20px] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-[20px]"
        >
          <Box className="flex justify-end cursor-pointer">
            <Box onClick={handleClose}>
              <IconClose />
            </Box>
          </Box>
          <Box className="flex justify-center h-[100px]">
            <img src={Message} alt="Message" />
          </Box>
          <Box className="text-blackText font-bold text-pageTitle text-center mt-[25px]">
            Check your email {email}
          </Box>
          <Box
            className="text-center text-blackText mt-[16px]"
            id="alert-dialog-description"
          >
            {isSignUp ? (
              <Box>
                lf that email exists, you should receive a verification email shortly. 
              </Box>
            ) : (
              <Box>
                lf that email exists, you should receive a verification email
                for setting your password shortly.
              </Box>
            )}
            <Box className="my-[25px]">
              lf you can't find that email, please make sure you've entered the
              Correct email address, or check your spam folder.
            </Box>
          </Box>
        </Box>
      </Modal>
    </div>
  );
};
export { ModalAuth };
