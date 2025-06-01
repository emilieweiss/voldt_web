import { useEffect, useState } from 'react';
import { getUserProfiles } from '../api/user';
import SolvedJobCard from '../components/approve-user-job-components/SolvedUserJobCard';
import ApproveUserJobModal from '../modals/ApproveUserJobModal';
import { approveJob, getSolvedJobs, markJobAsUnsolved } from '../api/user_job';
import { Job } from '../types/job';
import { toast } from 'sonner';
import { User } from '../types/user';
import { UserJob } from '../types/user_job';

const ApproveJob = () => {
  const [solvedJobs, setSolvedJobs] = useState<UserJob[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState<UserJob>();

  const refreshJobs = async () => {
    setLoading(true);
    try {
      const jobs = await getSolvedJobs();
      setSolvedJobs(jobs || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    async function fetchData() {
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
    }
    fetchData();
  }, []);

  // Handler to open modal
  const handleOpenApproveModal = (job: UserJob) => {
    setSelectedJob(job);
    setModalOpen(true);
  };

  // Handler to close modal
  const handleCloseApproveModal = () => {
    setModalOpen(false);
    setSelectedJob(undefined);
  };

  // Create a lookup map for user id to name
  const userMap = Object.fromEntries(users.map((u: User) => [u.id, u.name]));

  return (
    <div className="p-0">
      <h1 className="text-2xl font-bold mb-6">Godkend færdige jobs</h1>
      {loading ? (
        <div>Indlæser...</div>
      ) : solvedJobs.length === 0 ? (
        <div>Ingen jobs fundet.</div>
      ) : (
        <ul className="space-y-4">
          {solvedJobs.map((job) => (
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
            await refreshJobs();
          }
          handleCloseApproveModal();
        }}
        imageSolvedUrl={selectedJob?.image_solved_url}
      />
    </div>
  );
};

export default ApproveJob;
