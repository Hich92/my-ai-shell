import { UploadStatus } from "./types";

export const simulateUpload = async (file: File): Promise<void> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, 2000);
  });
};
