const useGetToken = () => {
    if (typeof document !== 'undefined' && typeof window !== undefined) {
        const name = `token-${window.location.host}`
        const cDecoded = decodeURIComponent(document.cookie);
        const cArr = cDecoded.split('; ');

        let res: string | undefined;
        cArr.forEach(val => {
            if (val.indexOf(name) === 0) res = val.substring(name.length);
        })
        
        if (res) {
            const value = JSON.parse(res.split('=')[1]);
            if (value !== null) {
                return [value.token, value.refreshToken, value.tokenExpires, value.user]
            }
        }
        return [null, null, null, null]
    }
    return [null, null, null, null]
};

export default useGetToken;