import { Redis } from "@upstash/redis";

const redis = Redis.fromEnv();

export type JobStatus = "pending" | "processing" | "done" | "error";

export type Job = {
  id: string;
  status: JobStatus;
  progress: number;
  result?: any;
  error?: string;
  createdAt: number;
  updatedAt: number;
};

const JOB_TTL = 60 * 60; // 1 heure

export async function createJob(initial: Partial<Job> = {}): Promise<Job> {
  const id = `job_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
  const now = Date.now();
  const job: Job = {
    id,
    status: "pending",
    progress: 0,
    createdAt: now,
    updatedAt: now,
    ...initial,
  };
  await redis.set(`barry:job:${id}`, JSON.stringify(job), { ex: JOB_TTL });
  return job;
}

export async function getJob(id: string): Promise<Job | null> {
  const data = await redis.get(`barry:job:${id}`);
  if (!data) return null;
  if (typeof data === "string") return JSON.parse(data);
  return data as Job;
}

export async function updateJob(
  id: string,
  updates: Partial<Job>
): Promise<Job | null> {
  const job = await getJob(id);
  if (!job) return null;
  const updated = { ...job, ...updates, updatedAt: Date.now() };
  await redis.set(`barry:job:${id}`, JSON.stringify(updated), { ex: JOB_TTL });
  return updated;
}