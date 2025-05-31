import { supabase } from './user';
import { Job } from '../types/job';

// Create a new job
export async function createJob(job: Omit<Job, 'id'>): Promise<Job> {
  const { data, error } = await supabase
    .from('job')
    .insert([job])
    .select()
    .single();
  if (error) throw error;
  return data as Job;
}

// Get all jobs
export async function getJobs() {
  const { data, error } = await supabase.from('job').select('*');
  if (error) throw error;
  return data as Job[];
}

// Get a single job by id
export async function getJob(id: string) {
  const { data, error } = await supabase
    .from('job')
    .select('*')
    .eq('id', id)
    .single();
  if (error) throw error;
  return data as Job;
}

// Update a job
export async function updateJob(id: string, updates: Partial<Omit<Job, 'id'>>) {
  const { data, error } = await supabase
    .from('job')
    .update(updates)
    .eq('id', id)
    .single();
  if (error) throw error;
  return data as Job;
}

// Delete a job
export async function deleteJob(id: string) {
  const { error } = await supabase.from('job').delete().eq('id', id);
  if (error) throw error;
}
