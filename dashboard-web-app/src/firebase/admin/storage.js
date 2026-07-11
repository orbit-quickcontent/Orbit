import {
  ref,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,

} from "firebase/storage";
import { storage } from "./app";

export const storageService = {
  /**
   * Upload a file with progress monitoring
   */
  uploadFile: (
    path,
    file,
    customMetadata
  ) => {
    const fileRef = ref(storage, path);
    return uploadBytesResumable(fileRef, file, { customMetadata });
  },

  /**
   * Fetch download URL of an object in storage
   */
  getURL: async (path) => {
    const fileRef = ref(storage, path);
    return getDownloadURL(fileRef);
  },

  /**
   * Delete an object from storage
   */
  deleteFile: async (path) => {
    const fileRef = ref(storage, path);
    return deleteObject(fileRef);
  }
};
