import React from "react";
interface IProps {
    isOpen: boolean;
    onClose: () => void;
    connectMetaMask?: () => void;
    connectWithWalletConnect?: () => void;
}
declare const ModalWallet: ({ isOpen, onClose, connectMetaMask, connectWithWalletConnect }: IProps) => React.JSX.Element;
export { ModalWallet };
