declare function useWindowSize(): {
    isSmallPC: boolean;
    isMobile: number | false;
    isSmallMobile: number | false;
};
export default useWindowSize;
