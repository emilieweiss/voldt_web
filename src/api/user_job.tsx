import { supabase } from './user';
import { UserJob } from '../types/user_job';

// Assign (copy) a job to a user
export async function assignJobToUser(
  job: Omit<UserJob, 'id' | 'solved'>,
  userId: string,
) {
  const userJob: Omit<UserJob, 'id'> = {
    ...job,
    user_id: userId,
    solved: false,
  };
  const { data, error } = await supabase
    .from('user_jobs')
    .insert([userJob])
    .single();
  if (error) throw error;
  return data as UserJob;
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

// Remove a job from a user
export async function removeUserJob(userJobId: string) {
  const { error } = await supabase
    .from('user_jobs')
    .delete()
    .eq('id', userJobId);
  if (error) throw error;
}
