export class JobScheduler {
    private scheduledJobs: Map<string, NodeJS.Timeout> = new Map();
  
    schedule(jobId: string, job: () => void, delay: number): void {
      if (this.scheduledJobs.has(jobId)) {
        console.warn(`Job '${jobId}' already scheduled.`);
        return;
      }
  
      const timeout = setTimeout(() => {
        try {
          job();
        } catch (error) {
          console.error(`Error executing job '${jobId}':`, error);
        } finally {
          this.scheduledJobs.delete(jobId);
        }
      }, delay);
  
      this.scheduledJobs.set(jobId, timeout);
      console.log(`Job '${jobId}' scheduled for ${delay} ms.`);
    }
  
    cancel(jobId: string): void {
      const timeout = this.scheduledJobs.get(jobId);
      if (timeout) {
        clearTimeout(timeout);
        this.scheduledJobs.delete(jobId);
        console.log(`Job '${jobId}' cancelled.`);
      } else {
        console.warn(`Job '${jobId}' not found.`);
      }
    }
  }
  