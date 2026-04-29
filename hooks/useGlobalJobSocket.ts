import { useEffect, useRef } from 'react';
import { Socket, io } from 'socket.io-client';
import { useJobStore } from '../store/fileQueStore';

export const useGlobalJobSocket = () => {
  const socketRef = useRef<Socket | null>(null);
  const { updateJob, addJob, jobs } = useJobStore();

  console.log(jobs)

  useEffect(() => {
    // Initialize socket connection
    const socket = io(`${process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:5005'}`, 
      {
      reconnection: true,
      transports: ['websocket', 'polling'],
      withCredentials: true
    }
  );

    socketRef.current = socket;

    // Helper to detect file type from contentType or filename
    const detectFileType = (data: any): 'pdf' | 'excel' | 'zip' => {
      if (data.fileType) return data.fileType;
      
      const contentType = data.contentType?.toLowerCase() || '';
      if (contentType.includes('zip')) return 'zip';
      if (contentType.includes('excel') || contentType.includes('spreadsheet')) return 'excel';
      
      const filename = data.filename?.toLowerCase() || '';
      if (filename.endsWith('.zip')) return 'zip';
      if (filename.endsWith('.xlsx') || filename.endsWith('.xls')) return 'excel';
      
      return 'pdf';
    };

    // Global progress handler - listens for all job progress updates
   
    const handleProgress = (data: any) => {
      console.log('[GlobalJobSocket] Progress:', data);
      
      if (!data.jobId) return;

      const percent = data.percent ?? data.progress ?? 0;
      const fileType = detectFileType(data);

      // Check if job exists in store, if not create it
      const existingJob = useJobStore.getState().jobs.find((j) => j.jobId === data.jobId);

       if (!existingJob) {
         addJob({
           jobId: data.jobId,
           label: data.label || 'Report',
           type: data.type || 'report',
           progress: percent,
           status: 'processing',
           fileType,
           file: '',
           filename: data.filename || '',
         });
       } else {
         updateJob(data.jobId, {
           progress: percent,
           status: 'processing',
         });
       }
    };

    // Global ready handler - listens for all job completion
    const handleReady = (data: any) => {
      console.log('[GlobalJobSocket] Ready:', data);

      if (!data.jobId) return;

      let url: string = '';
      const fileType = detectFileType(data);

      // If backend sends base64 encoded file, create blob URL
      if (typeof data.file === 'string' && data.file.length > 0) {
        try {
          const binary = atob(data.file);
          const bytes = new Uint8Array(binary.length);
          for (let i = 0; i < binary.length; i++) {
            bytes[i] = binary.charCodeAt(i);
          }

          const mimeTypes: Record<string, string> = {
            pdf: 'application/pdf',
            excel: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            zip: 'application/zip',
          };
          const mimeType = mimeTypes[fileType] || data.contentType || 'application/octet-stream';

          const blob = new Blob([bytes], { type: mimeType });
          url = URL.createObjectURL(blob);
          console.log('[GlobalJobSocket] Created blob URL for', fileType, 'file');
        } catch (err) {
          console.error('[GlobalJobSocket] Error creating blob:', err);
        }
      }
      // If backend didn't send base64, construct HTTP URL for cached file
      else if (data.filename) {
        // Construct URL to fetch from backend cache endpoint
        const baseUrl = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5005').replace('/api', '');
        url = `${baseUrl}/reports/${data.jobId}?filename=${encodeURIComponent(data.filename)}`;
        console.log('[GlobalJobSocket] Using HTTP URL for cached file:', url);
      } else {
        console.warn('[GlobalJobSocket] No file data and no filename provided');
      }

      updateJob(data.jobId, {
        progress: 100,
        status: 'done',
        file: url,
        filename: data.filename || '',
        fileUrl: url,
        fileType,
      });
    };

    // Global error handler - listens for all job errors
    const handleError = (data: any) => {
      console.log('[GlobalJobSocket] Error:', data);

      if (!data.jobId) return;

      updateJob(data.jobId, {
        status: 'error',
        progress: 0,
      });
    };

    // Setup event listeners
    const setupListeners = () => {
      socket.off('report:progress', handleProgress);
      socket.off('report:ready', handleReady);
      socket.off('report:error', handleError);
      
      socket.on('report:progress',handleProgress);
      socket.on('report:ready', handleReady);
      socket.on('report:error', handleError);
    };

    // Rejoin all pending jobs on reconnection
    const rejoinPendingJobs = () => {
      const pendingJobs = jobs.filter(
        (job) => job.status === 'processing' && job.progress < 100
      );
      
      if (pendingJobs.length > 0) {
        console.log('[GlobalJobSocket] Rejoining', pendingJobs.length, 'pending job(s)');
        pendingJobs.forEach((job) => {
          socket.emit('join:report', job.jobId);
          console.log('[GlobalJobSocket] Rejoined job:', job.jobId);
        });
      }
    };

    socket.on('connect', () => {
      console.log('[GlobalJobSocket] Connected:', socket.id);
      setupListeners();
      rejoinPendingJobs();
    });

    socket.on('disconnect', () => {
      console.log('[GlobalJobSocket] Disconnected');
    });

    socket.on('connect_error', (error) => {
      console.error('[GlobalJobSocket] Connection error:', error);
    });

    return () => {
      socket.off('report:progress', handleProgress);
      socket.off('report:ready', handleReady);
      socket.off('report:error', handleError);
      socket.off('connect');
      socket.off('disconnect');
      socket.off('connect_error');
      socket.disconnect();
    };
  }, [updateJob, addJob, socketRef]);

  return socketRef.current;
};
