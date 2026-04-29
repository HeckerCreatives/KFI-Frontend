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


export const fileDownload = async (jobId: string): Promise<Blob> => {
  try {
    const response = await kfiAxios.get(`/report-download/${ jobId }`, {
      responseType: 'blob',
    });
    return response.data;
  } catch (error) {
    console.error('Failed to download file:', error);
    throw error;
  }
};

