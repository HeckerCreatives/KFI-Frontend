import { useEffect, useRef, useState } from 'react';
import { Minus, X, Download, File, Trash } from 'lucide-react';
import { Job, useJobStore } from '../../store/fileQueStore';




export const FileQueue = () => {
  const { jobs, deleteJob} = useJobStore()
   const [minimized, setMinimized] = useState(false);
    const [showQueue, setShowQueue] = useState(true); 


    const handleDownload = (fileUrl: string, label: string, fileType: string, jobId?: string, filename?: string) => {
        if (!fileUrl) return;

        console.log(fileUrl)

        const extensions: Record<string, string> = {
            pdf: '.pdf',
            excel: '.xlsx',
        };

        const ext = extensions[fileType.toLowerCase()] ?? '';

        const a = document.createElement('a');
        a.href = fileUrl;
        a.download = filename || label;
        document.body.appendChild(a);
        a.click();
        a.remove();

        if(jobId){
            deleteJob(jobId)
        }
    };


  if (jobs.length === 0) return null;

 if (minimized) {
  const allDone = jobs.every(j => j.progress >= 100);

  return (
    <div
      onClick={() => setMinimized(false)}
      className="fixed bottom-6 right-6 z-[999] flex items-center justify-between px-4 py-3 rounded-xl bg-[#1a73e8] cursor-pointer w-[280px]"
    >
      <div className="flex items-center gap-2">
        {allDone ? (
          <Download size={15} className="text-white" />
        ) : (
          <svg
            className="animate-spin text-white"
            width={15}
            height={15}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2.5}
          >
            <path
              strokeLinecap="round"
              d="M12 2a10 10 0 0 1 10 10"
              stroke="white"
              strokeOpacity={0.4}
            />
            <path
              strokeLinecap="round"
              d="M12 2a10 10 0 0 1 10 10"
              stroke="white"
              strokeDasharray="15 45"
            />
          </svg>
        )}
        <span className="text-sm font-medium text-white">
          {allDone ? 'Downloads ready' : 'Processing...'}
        </span>
      </div>
      <span className="text-xs font-medium bg-white/25 text-white rounded-full px-2.5 py-0.5">
        {jobs.length} item{jobs.length !== 1 ? 's' : ''}
      </span>
    </div>
  );
}

  return (
    <div className="fixed bottom-6 right-6 z-[999] w-[320px] bg-white border border-zinc-200 rounded-xl overflow-hidden shadow-lg">
      {/* header */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-[#1a73e8]">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-white">File queue</span>
          <span className="text-xs bg-white/25 text-white rounded-full px-2 py-0.5 font-medium">
            {jobs.length}
          </span>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setMinimized(true)}
            className="w-7 h-7 rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-colors"
          >
            <Minus size={14} />
          </button>
          {/* <button
            onClick={() => setShowQueue(false)}
            className="w-7 h-7 rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-colors"
          >
            <X size={14} />
          </button> */}
        </div>
      </div>

      {/* list */}
      <div className="max-h-[260px] overflow-y-auto divide-y divide-zinc-100">
        {jobs.map(job => {
          const done = job.progress >= 100;
          return (
            <div key={job.jobId} className="flex items-center gap-3 px-4 py-3">
              {/* file icon */}
              <div className={`w-8 h-8 rounded-md flex items-center justify-center shrink-0 ${
                job.fileType === 'pdf' ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'
              }`}>

               
                <File size={15} />
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-gray-800 truncate">{job.label}</p>
                {job.status === 'error' ? (
                  <>
                  <p className=' text-xs text-red-500'>Failed to generate file.</p>
                  </>
                ): (
                  <p className="text-[11px] text-gray-400 mb-1.5">
                  {done ? 'Complete' : `${job.progress}%`}
                  </p>
                )}
                
                <div className="h-[3px] bg-zinc-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${done ? 'bg-green-500' : 'bg-[#1a73e8]'}`}
                    style={{ width: `${job.progress}%` }}
                  />
                </div>
              </div>

              <div className="shrink-0">
                {job.fileUrl ? (
                  <button
                    onClick={() => handleDownload(job.fileUrl!, job.label, job.fileType || '', job.jobId, job.filename)}
                    className="w-7 h-7 rounded-full flex items-center justify-center text-[#1a73e8] hover:bg-blue-50 transition-colors"
                  >
                    <Download size={15} />
                  </button>
                ) : (
                  <>
                  {job.status === 'error' ? (
                  <button className=' cursor-pointer text-red-600' onClick={() => deleteJob(job.jobId)}><Trash size={15}/></button>

                  ): (
                  <svg
                  className="animate-spin text-zinc-500"
                  width={15}
                  height={15}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2.5}
                >
                  <path
                    strokeLinecap="round"
                    d="M12 2a10 10 0 0 1 10 10"
                    stroke=" #71717a"
                    strokeOpacity={0.4}
                  />
                  <path
                    strokeLinecap="round"
                    d="M12 2a10 10 0 0 1 10 10"
                    stroke=" #71717a"
                    strokeDasharray="15 45"
                  />
                </svg>

                  )}
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};