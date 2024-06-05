interface IProfile {
    email: string;
    fullName: string;
    phoneNumber?: string;
    dateOfBirth: string | null;
    walletAddress?: string | null;
    paypalId: string | null;
}
export declare const AuthService: {
    loginEmail: (username: string, password: string, token: string, role?: string) => Promise<import("axios").AxiosResponse<any, any>>;
    SignUp: (email: string, password: string, role: string, fullName: string, phoneNumber: string, dateOfBirth: string | null, token: string) => Promise<import("axios").AxiosResponse<any, any>>;
    ForgotPassword: (email: string, token: string) => Promise<import("axios").AxiosResponse<any, any>>;
    UserProfile: () => Promise<import("axios").AxiosResponse<any, any>>;
    ChangePassword: (password: string, oldPassword: string, site?: string) => Promise<import("axios").AxiosResponse<any, any>>;
    ResetPassword: (password: string, hash: string) => Promise<import("axios").AxiosResponse<any, any>>;
    EditProfile: (params: IProfile, site?: string) => Promise<import("axios").AxiosResponse<any, any>>;
    EditCreatorInfo: (title: string | null, biography: string | null) => Promise<import("axios").AxiosResponse<any, any>>;
    confirmEmail: (hash: string) => Promise<import("axios").AxiosResponse<any, any>>;
    checkHashForgot: (hash: string) => Promise<import("axios").AxiosResponse<any, any>>;
    RefreshToken: (refreshToken: string) => Promise<import("axios").AxiosResponse<any, any>>;
    VerifyCaptcha: (token: string | null) => Promise<import("axios").AxiosResponse<any, any>>;
    walletLogin: (data: any) => Promise<import("axios").AxiosResponse<any, any>>;
    setDefaultWallet: (data: any) => Promise<import("axios").AxiosResponse<any, any>>;
};
export {};
