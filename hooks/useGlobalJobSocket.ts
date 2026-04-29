import { useEffect, useRef } from 'react';
import { Socket, io } from 'socket.io-client';
import { useJobStore } from '../store/fileQueStore';

export const useGlobalJobSocket = () => {
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    const socket = io(
      process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:5005',
      {
        reconnection: true,
        transports: ['websocket', 'polling'],
        withCredentials: true,
        autoConnect: true,
      }
    );

    socketRef.current = socket;

    // Join any job that is added after the socket is already connected
    const knownJobIds = new Set(useJobStore.getState().jobs.map((j) => j.jobId));
    const unsubscribeStore = useJobStore.subscribe((state) => {
      state.jobs.forEach((job) => {
        if (!knownJobIds.has(job.jobId)) {
          knownJobIds.add(job.jobId);
          if (socket.connected) {
            socket.emit('join:report', job.jobId);
          }
        }
      });
    });

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

    const handleProgress = (data: any) => {
      console.log('[GlobalJobSocket] Progress:', data);
      if (!data.jobId) return;

      const percent = data.percent ?? data.progress ?? 0;
      const fileType = detectFileType(data);
      const existingJob = useJobStore.getState().jobs.find((j) => j.jobId === data.jobId);

      if (!existingJob) {
        // ✅ re-read addJob from getState() so it's always fresh
        useJobStore.getState().addJob({
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
        useJobStore.getState().updateJob(data.jobId, { progress: percent, status: 'processing' });
      }
    };

    const handleReady = (data: any) => {
      console.log('[GlobalJobSocket] Ready:', data);
      if (!data.jobId) return;

      let url = '';
      const fileType = detectFileType(data);

      if (typeof data.file === 'string' && data.file.length > 0) {
        try {
          const binary = atob(data.file);
          const bytes = new Uint8Array(binary.length);
          for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);

          const mimeTypes: Record<string, string> = {
            pdf: 'application/pdf',
            excel: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            zip: 'application/zip',
          };

          const blob = new Blob([bytes], { type: mimeTypes[fileType] || 'application/octet-stream' });
          url = URL.createObjectURL(blob);
        } catch (err) {
          console.error('[GlobalJobSocket] Error creating blob:', err);
        }
      } else if (data.filename) {
        const baseUrl = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5005').replace('/api', '');
        url = `${baseUrl}/reports/${data.jobId}?filename=${encodeURIComponent(data.filename)}`;
      } else {
        console.warn('[GlobalJobSocket] No file data or filename in ready event');
      }

      useJobStore.getState().updateJob(data.jobId, {
        progress: 100,
        status: 'done',
        file: url,
        filename: data.filename || '',
        fileUrl: url,
        fileType,
      });
    };

    const handleError = (data: any) => {
      console.log('[GlobalJobSocket] Error:', data);
      if (!data.jobId) return;
      useJobStore.getState().updateJob(data.jobId, { status: 'error', progress: 0 });
    };

    // ✅ Register listeners ONCE — no setupListeners() on reconnect
    socket.on('report:progress', handleProgress);
    socket.on('report:ready', handleReady);
    socket.on('report:error', handleError);

    socket.on('connect', () => {
      console.log('[GlobalJobSocket] Connected:', socket.id);

      // ✅ Only rejoin pending jobs on reconnect — listeners are already registered
      const pendingJobs = useJobStore
        .getState()
        .jobs.filter((job) => job.status === 'processing' && job.progress < 100);

      pendingJobs.forEach((job) => {
        socket.emit('join:report', job.jobId);
        console.log('[GlobalJobSocket] Rejoined job:', job.jobId);
      });
    });

    socket.on('disconnect', () => console.log('[GlobalJobSocket] Disconnected'));
    socket.on('connect_error', (err) => console.error('[GlobalJobSocket] Connection error:', err));

    return () => {
      unsubscribeStore();
      socket.off('report:progress', handleProgress);
      socket.off('report:ready', handleReady);
      socket.off('report:error', handleError);
      socket.off('connect');
      socket.off('disconnect');
      socket.off('connect_error');
      socket.disconnect();
      socketRef.current = null;
    };
  }, []); // ✅ empty deps — socket is a singleton for the component's lifetime

  return socketRef.current;
};