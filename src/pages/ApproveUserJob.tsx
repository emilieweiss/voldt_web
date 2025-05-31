import { useEffect, useState } from 'react';
import { getUserProfiles } from '../api/user';
import SolvedJobCard from '../components/approve-user-job-components/SolvedUserJobCard';
import ApproveUserJobModal from '../modals/ApproveUserJobModal';
import { approveJob, markJobAsUnsolved, getSolvedJobs } from '../api/user_job';

const ApproveJob = () => {
  const [solvedJobs, setSolvedJobs] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState<any>(null);

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
  const handleOpenApproveModal = (job: any) => {
    setSelectedJob(job);
    setModalOpen(true);
  };

  // Handler to close modal
  const handleCloseApproveModal = () => {
    setModalOpen(false);
    setSelectedJob(null);
  };

  // Create a lookup map for user id to name
  const userMap = Object.fromEntries(users.map((u: any) => [u.id, u.name]));

  return (
    <div className="p-0">
      <h1 className="text-2xl font-bold mb-6">Godkendte jobs</h1>
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
        onApprove={async () => {
          if (selectedJob?.id) {
            await approveJob(selectedJob.id, selectedJob.money);
            await refreshJobs();
          }
          handleCloseApproveModal();
        }}
        onReject={async () => {
          if (selectedJob?.id) {
            await markJobAsUnsolved(selectedJob.id);
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
