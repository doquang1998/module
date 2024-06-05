import axios from "axios";
import { axiosClient } from "./axiosClient";

export enum ImageType {
  COURSE = "course",
  UNIT = "unit",
  PROFILE = "profile",
  MEDIA = "media",
  CATEGORY = "category",
}

export const UploadApi = {
  updateImageFile: (id: number, imageType: ImageType, formData: FormData) => {
    return axiosClient.post(
      `/files/upload/image/${id}/${imageType}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
  },

  getSignedUrl: (mediaType: string) => {
    return axiosClient.get(`/files/gcs/SignedUrl/${mediaType}/png`);
  },

  uploadFile: (
    locationUrl: string,
    data: any,
    headers = {
      "Content-Type": "application/octet-stream",
    }
  ) => {
    return axios({
      method: "PUT",
      url: locationUrl,
      data,
      headers,
      validateStatus: (status) => status >= 200 && status < 400,
    });
  },

  getLocation: (signedUrl: string) => {
    return axios({
      method: "POST",
      url: signedUrl,
      data: {},
      headers: {
        "Content-Type": "application/octet-stream",
        "x-goog-resumable": "start",
      },
    });
  },

  fireEventFinishedUpload: (id: number, fileDestination: string) => {
    return axiosClient.post(`/files/upload/image/${id}/profile`, {
      fileDestination,
    });
  },
};
