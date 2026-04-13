import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type Job = {
  jobId: string
  label: string
  type?: 'print' | 'export' | 'report'
  progress: number
  status: 'processing' | 'done' | 'error'
  fileUrl?: string
  file?: string
  filename?: string
  fileType?: 'pdf' | 'excel' | 'zip'
  createdAt?: number
}

type Store = {
  jobs: Job[]
  addJob: (job: Job) => void
  updateJob: (jobId: string, data: Partial<Job>) => void
  removeJob: (jobId: string) => void
  deleteJob: (jobId: string) => void
  clearJobs: () => void
}

export const useJobStore = create<Store>()(
  persist(
    (set) => ({
      jobs: [],

      addJob: (job) =>
        set((state) => ({
          jobs: [
            ...state.jobs,
            { ...job, createdAt: Date.now() },
          ],
        })),

      updateJob: (jobId, data) =>
        set((state) => ({
          jobs: state.jobs.map((j) =>
            j.jobId === jobId ? { ...j, ...data } : j
          ),
        })),

      removeJob: (jobId) =>
        set((state) => ({
          jobs: state.jobs.filter((j) => j.jobId !== jobId),
        })),

      // deleteJob — removes + revokes blob URL to free memory
      deleteJob: (jobId) =>
        set((state) => {
          const job = state.jobs.find((j) => j.jobId === jobId)
          if (job?.fileUrl?.startsWith('blob:')) {
            URL.revokeObjectURL(job.fileUrl)
          }
          return {
            jobs: state.jobs.filter((j) => j.jobId !== jobId),
          }
        }),

      clearJobs: () => set({ jobs: [] }),
    }),
    {
      name: 'job-queue', // localStorage key
     
    }
  )
)