import {
  ref,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,

} from "firebase/storage";
import { storage } from "./app";

export const storageService = {
  uploadFile: (
    path,
    file,
    customMetadata
  ) => {
    const fileRef = ref(storage, path);
    return uploadBytesResumable(fileRef, file, customMetadata ? { customMetadata } : undefined);
  },
  getURL: async (path) => {
    const fileRef = ref(storage, path);
    return getDownloadURL(fileRef);
  },
  deleteFile: async (path) => {
    const fileRef = ref(storage, path);
    return deleteObject(fileRef);
  }
};
