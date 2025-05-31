import { supabase } from './user';
import { UserJob } from '../types/user_job';

// Assign (copy) a job to a user
export async function assignJobToUser(
  job: any, // job object with all fields you want to copy
  userId: string,
) {
  const userJob = {
    ...job, // copies all job fields (title, description, etc.)
    user_id: userId,
    solved: false,
  };
  delete userJob.id; // remove the original job id if present
  const { data, error } = await supabase
    .from('user_jobs')
    .insert([userJob])
    .single();
  if (error) throw error;
  return data;
}

// Get all jobs assigned to a user
export async function getUserJobs(userId: string) {
  const { data, error } = await supabase
    .from('user_jobs')
    .select('*')
    .eq('user_id', userId);
  if (error) throw error;
  return data as UserJob[];
}

// Mark a user job as solved
export async function markJobAsSolved(userJobId: string) {
  const { data, error } = await supabase
    .from('user_jobs')
    .update({ solved: true })
    .eq('id', userJobId)
    .single();
  if (error) throw error;
  return data as UserJob;
}

export async function markJobAsUnsolved(userJobId: string) {
  const { data, error } = await supabase
    .from('user_jobs')
    .update({ solved: false })
    .eq('id', userJobId)
    .single();
  if (error) throw error;
  return data as UserJob;
}

// Remove a job from a user
export async function removeUserJob(userJobId: string) {
  const { error } = await supabase
    .from('user_jobs')
    .delete()
    .eq('id', userJobId);
  if (error) throw error;
}

// Get solved jobs
export async function getSolvedJobs() {
  const { data, error } = await supabase
    .from('user_jobs')
    .select('*')
    .eq('solved', true);
  if (error) throw error;
  return data as UserJob[];
}

export async function approveJob(userJobId: string, amount: number) {
  // 1. Approve the job
  const { data: userJob, error: jobError } = await supabase
    .from('user_jobs')
    .update({ solved: true })
    .eq('id', userJobId)
    .single();
  if (jobError) throw jobError;

  // 2. Find the user_id from the approved job
  const userId = (userJob as UserJob).user_id;

  // 3. Fetch the user's current profile
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('money')
    .eq('id', userId)
    .single();
  if (profileError) throw profileError;

  // 4. Update the user's money
  const newMoney = (profile.money ?? 0) + amount;
  const { error: updateError } = await supabase
    .from('profiles')
    .update({ money: newMoney })
    .eq('id', userId);
  if (updateError) throw updateError;

  return userJob;
}
