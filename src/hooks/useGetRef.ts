const useGetRef = () => {
    if (typeof document !== 'undefined' && typeof window !== undefined) {
        const name = `ref-${window.location.host}`
        const cDecoded = decodeURIComponent(document.cookie);
        const cArr = cDecoded.split('; ');

        let res: string | undefined;
        cArr.forEach(val => {
            if (val.indexOf(name) === 0) res = val.substring(name.length);
        })
        
        if (res) {
            const value = res.split('=')[1];
            return value
        }
        return null
    }
    return null
};

export default useGetRef;