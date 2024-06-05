const useSetToken = (token: any, loginType?: string) => {
  document.cookie = `token-${window.location.host}=${JSON.stringify(token)}`;
  if (loginType) {
    document.cookie = `loginType-${window.location.host}=${loginType}`;
  }
};

export default useSetToken;
