// Queue Domain Port
export interface QueueJob {
  id: string;
  name: string;
  data: Record<string, any>;
  priority?: number;
  delay?: number; // milliseconds
  attempts?: number;
  backoff?: {
    type: 'fixed' | 'exponential';
    delay: number;
  };
  removeOnComplete?: boolean | number;
  removeOnFail?: boolean | number;
}

export interface QueueJobResult {
  success: boolean;
  jobId: string;
  result?: any;
  error?: string;
}

export interface QueueOptions {
  name: string;
  concurrency?: number;
  limiter?: {
    max: number;
    duration: number;
  };
  defaultJobOptions?: Partial<QueueJob>;
}

export interface QueueStats {
  waiting: number;
  active: number;
  completed: number;
  failed: number;
  delayed: number;
}

// Queue Port Interface
export interface QueuePort {
  // Publish job
  publish(job: QueueJob): Promise<QueueJobResult>;
  
  // Publish multiple jobs
  publishBulk(jobs: QueueJob[]): Promise<QueueJobResult[]>;
  
  // Consume jobs
  consume(
    queueName: string, 
    processor: (job: QueueJob) => Promise<any>
  ): Promise<void>;
  
  // Get job status
  getJobStatus(jobId: string): Promise<QueueJob | null>;
  
  // Retry failed job
  retryJob(jobId: string): Promise<QueueJobResult>;
  
  // Remove job
  removeJob(jobId: string): Promise<QueueJobResult>;
  
  // Get queue stats
  getQueueStats(queueName: string): Promise<QueueStats>;
  
  // Pause queue
  pauseQueue(queueName: string): Promise<void>;
  
  // Resume queue
  resumeQueue(queueName: string): Promise<void>;
  
  // Clean queue
  cleanQueue(queueName: string, grace: number): Promise<void>;
}



