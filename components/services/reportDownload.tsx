import kfiAxios from "../utils/axios";

/**
 * Cancel a file download by jobId
 */
export const cancelFileDownload = async (jobId: string): Promise<void> => {
  try {
    await kfiAxios.post("/report-download/cancel", { jobId });
  } catch (error) {
    console.error('Failed to cancel file download:', error);
    throw error;
  }
};
