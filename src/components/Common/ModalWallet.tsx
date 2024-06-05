import { Box, Modal } from "@mui/material";
import React from "react";
import Metamask from "../Common/assert/images/Metamask.png";
import Wallet from "../Common/assert/images/Wallet.png";
import { IconClose } from "./assert/icons/IconClose";
import useWindowSize from "../../hooks/useWindowSize";

interface IProps {
  isOpen: boolean;
  onClose: () => void;
  connectMetaMask?: () => void;
  connectWithWalletConnect?: () => void;
}

const ModalWallet = ({ isOpen, onClose, connectMetaMask, connectWithWalletConnect }: IProps) => {
  const { isSmallMobile } = useWindowSize()

  const handleClose = () => {
    onClose();
  };

  const handleConnectMetaMask = () => {
    onClose();
    connectMetaMask && connectMetaMask()
  }

  const handleConnectWallet = () => {
    onClose();
    connectWithWalletConnect && connectWithWalletConnect()
  }

  return (
    <div>
      <Modal open={isOpen}>
        <Box
          sx={{
            width: "calc(100vw - 32px)",
            maxWidth: "620px",
          }}
          className="bg-white p-[20px] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-[20px]"
        >
          <Box className="flex justify-between items-center">
            <Box className="flex-1 text-blackText font-bold text-pageTitle text-center">
              Connect Wallet
            </Box>
            <Box onClick={handleClose} className="cursor-pointer">
              <IconClose />
            </Box>
          </Box>
          <Box
            className="text-center text-blackText mt-[24px]"
          >
            <Box className={`flex ${isSmallMobile ? "flex-col" : "flex-row"} gap-[16px] px-[10px] py-[10px]`}>
              <Box className="flex flex-col gap-[16px] bg-bgCourse border border-[#EAEDF4] rounded-[16px] py-[24px] px-[20px] flex-1 items-center cursor-pointer" onClick={handleConnectMetaMask}>
                <img src={Metamask} alt="" width={64} height={60} />
                <Box className="text-blackText text-subHeaderTitle font-bold">
                  Metamask
                </Box>
              </Box>
              <Box className="flex flex-col gap-[16px] bg-bgCourse border border-[#EAEDF4] rounded-[16px] py-[24px] px-[20px] flex-1 items-center cursor-pointer" onClick={handleConnectWallet}>
                <img src={Wallet} alt="" width={64} height={60} />
                <Box className="text-blackText text-subHeaderTitle font-bold">
                  WalletConnect
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>
      </Modal>
    </div>
  );
};
export { ModalWallet };
