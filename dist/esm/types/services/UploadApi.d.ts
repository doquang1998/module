export declare enum ImageType {
    COURSE = "course",
    UNIT = "unit",
    PROFILE = "profile",
    MEDIA = "media",
    CATEGORY = "category"
}
export declare const UploadApi: {
    updateImageFile: (id: number, imageType: ImageType, formData: FormData) => Promise<import("axios").AxiosResponse<any, any>>;
    getSignedUrl: (mediaType: string) => Promise<import("axios").AxiosResponse<any, any>>;
    uploadFile: (locationUrl: string, data: any, headers?: {
        "Content-Type": string;
    }) => Promise<import("axios").AxiosResponse<any, any>>;
    getLocation: (signedUrl: string) => Promise<import("axios").AxiosResponse<any, any>>;
    fireEventFinishedUpload: (id: number, fileDestination: string) => Promise<import("axios").AxiosResponse<any, any>>;
};
