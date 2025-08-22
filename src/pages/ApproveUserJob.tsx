import { useEffect, useState, useCallback } from 'react';
import { getUserProfiles } from '../api/user';
import { useRealtime } from '../context/RealtimeContext';
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

  const { subscribeTo } = useRealtime();

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

    const unsubscribe = subscribeTo(['user_jobs', 'profiles'], updateData);

    return unsubscribe;
  }, [initialLoad, updateData, subscribeTo]);

  const handleOpenApproveModal = (job: UserJob) => {
    setSelectedJob(job);
    setModalOpen(true);
  };

  const handleCloseApproveModal = () => {
    setModalOpen(false);
    // Don't clear selectedJob immediately to avoid console spam
    setTimeout(() => setSelectedJob(undefined), 100);
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
              toast.success('Job markeret som fejlet og sendt tilbage.');
            } else {
              let amount = selectedJob.money;
              if (rating === 'fint') {
                amount = Math.round(selectedJob.money * 0.667);
              } else if (rating === 'skidt') {
                amount = Math.round(selectedJob.money * 0.33);
              }

              try {
                await approveJob(selectedJob.id, amount);

                toast.success(
                  `Job godkendt med rating: "${rating}". Udbetaling: ${amount} kr. (Original: ${selectedJob.money} kr.)`,
                );
              } catch (error) {
                toast.error('Fejl ved godkendelse af job');
              }
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
