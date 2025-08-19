import { useEffect, useState, useCallback } from 'react';
import { getUserProfiles, supabase } from '../api/user';
import SolvedJobCard from '../components/approve-user-job-components/SolvedUserJobCard';
import ApproveUserJobModal from '../modals/ApproveUserJobModal';
import { approveJob, getSolvedJobs, markJobAsUnsolved } from '../api/user_job';
import { toast } from 'sonner';
import { User } from '../types/user';
import { UserJob } from '../types/user_job';
import BarLoader from 'react-spinners/BarLoader';

const ApproveJob = () => {
  const [solvedJobs, setSolvedJobs] = useState<UserJob[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState<UserJob>();

  const initialLoad = useCallback(async () => {
    setLoading(true);
    try {
      const [jobs, users] = await Promise.all([
        getSolvedJobs(),
        getUserProfiles(),
      ]);
      setSolvedJobs(jobs || []);
      setUsers(users || []);
    } catch (err) {
      setSolvedJobs([]);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const updateData = useCallback(async () => {
    try {
      const [jobs, users] = await Promise.all([
        getSolvedJobs(),
        getUserProfiles(),
      ]);
      setSolvedJobs(jobs || []);
      setUsers(users || []);
    } catch (err) {
      console.error('Error updating data:', err);
    }
  }, []);

  useEffect(() => {
    initialLoad();

    const channel = supabase
      .channel('user_jobs_changes_approve')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'user_jobs' },
        (payload) => {
          console.log('Realtime event (user_jobs):', payload);
          updateData();
        },
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'profiles' },
        (payload) => {
          console.log('Realtime event (profiles):', payload);
          updateData();
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [initialLoad, updateData]);

  const handleOpenApproveModal = (job: UserJob) => {
    setSelectedJob(job);
    setModalOpen(true);
  };

  const handleCloseApproveModal = () => {
    setModalOpen(false);
    setSelectedJob(undefined);
  };

  const userMap = Object.fromEntries(users.map((u: User) => [u.id, u.name]));

  return (
    <div className="flex flex-col">
      <h1 className="mb-4">Godkend færdige jobs</h1>
      {loading ? (
        <div className="flex justify-center">
          <BarLoader />
        </div>
      ) : solvedJobs.length === 0 ? (
        <div>Ingen jobs fundet.</div>
      ) : (
        <ul className="space-y-4">
          {[...solvedJobs]
            .sort((a, b) => a.delivery.localeCompare(b.delivery))
            .map((job) => (
              <SolvedJobCard
                key={job.id}
                job={job}
                userName={userMap[job.user_id]}
                onApproveClick={() => handleOpenApproveModal(job)}
              />
            ))}
        </ul>
      )}
      <ApproveUserJobModal
        isOpen={modalOpen}
        onClose={handleCloseApproveModal}
        onApprove={async (rating) => {
          if (selectedJob?.id) {
            if (rating === 'fejlet') {
              await markJobAsUnsolved(selectedJob.id);
            } else {
              let amount = selectedJob.money;
              if (rating === 'fint')
                amount = Math.round(selectedJob.money * 0.667);
              if (rating === 'skidt')
                amount = Math.round(selectedJob.money * 0.33);
              await approveJob(selectedJob.id, amount);
              toast.success(
                `Job godkendt med rating: "${rating}". Udbetaling: ${amount} kr.`,
              );
            }
            await updateData();
          }
          handleCloseApproveModal();
        }}
        imageSolvedUrl={selectedJob?.image_solved_url}
        money={selectedJob?.money ?? 0}
      />
    </div>
  );
};

export default ApproveJob;