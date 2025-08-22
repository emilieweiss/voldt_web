import { supabase } from './user';
import { UserJob } from '../types/user_job';

// Assign (copy) a job to a user
export async function assignJobToUser(userJob: Omit<UserJob, 'id'>) {
  const { data, error } = await supabase
    .from('user_jobs')
    .insert([userJob])
    .single();
  if (error) throw error;
  return data;
}

// Get jobs assigned to a user, but not solved or approved
export async function getUserJobs(userId: string) {
  const { data, error } = await supabase
    .from('user_jobs')
    .select('*')
    .eq('user_id', userId)
    .eq('solved', false)
    .eq('approved', false);
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
    .eq('solved', true)
    .eq('approved', false);
  if (error) throw error;
  return data as UserJob[];
}

// Get approved jobs
export async function getApprovedJobs() {
  const { data, error } = await supabase
    .from('user_jobs')
    .select('*')
    .eq('solved', true)
    .eq('approved', true);
  if (error) throw error;
  return data as UserJob[];
}

export async function approveJob(userJobId: string, amount: number) {
  // 1. Approve the job and get the updated row
  const { data: userJob, error: jobError } = await supabase
    .from('user_jobs')
    .update({ approved: true })
    .eq('id', userJobId)
    .select()
    .single();
  if (jobError) throw jobError;
  if (!userJob) throw new Error('Job not found or could not be approved');

  // 2. Find the user_id from the approved job
  const userId = (userJob as UserJob).user_id;

  // 3. Fetch the user's current profile
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('money')
    .eq('id', userId)
    .single();
  if (profileError) throw profileError;
  if (!profile) throw new Error('Profile not found for user: ' + userId);

  // 4. Update the user's money
  const newMoney = (profile.money ?? 0) + amount;
  const { data: updatedProfile, error: updateError } = await supabase
    .from('profiles')
    .update({ money: newMoney })
    .eq('id', userId)
    .select();

  if (updateError) throw updateError;
  if (!updatedProfile || updatedProfile.length === 0) {
    throw new Error('No profile updated for user: ' + userId);
  }

  return { userJob, updatedProfile };
}
