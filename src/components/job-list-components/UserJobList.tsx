import { Pencil } from 'lucide-react';
import { Job } from '../../types/job';
import JobCardMini from './JobCardMini';
import { useLocation } from 'react-router';

interface UserJobListProps {
  profileName: string;
  jobs: Job[];
  onEdit: () => void;
}

function UserJobList({ profileName, jobs, onEdit }: UserJobListProps) {
  const location = useLocation();
  const isEditJobPage = location.pathname.includes('edit-job');

  return (
    <div className="border border-(--border) rounded-xl p-4  bg-white min-w-85 w-85 relative">
      {/* Header */}
      <div className="mb-4 relative flex items-center justify-between">
        <h2 className="">{profileName}</h2>
        {!isEditJobPage && (
          <button
            onClick={onEdit}
            className="bg-(--color-wolt-blue) text-white rounded-full w-9 h-9 flex items-center justify-center cursor-pointer hover:bg-(--color-wolt-medium-blue) transition-colors"
            aria-label="Rediger bruger"
            type="button"
          >
            <Pencil size={20} />
          </button>
        )}
      </div>

      {/* Job List */}
      <div className="flex flex-col space-y-3">
        {jobs.length === 0 ? (
          <div className="text-gray-400 text-center py-8">Ingen jobs</div>
        ) : (
          [...jobs]
            .sort((a, b) => a.delivery.localeCompare(b.delivery))
            .map((job, index) => <JobCardMini key={index} job={job} />)
        )}
      </div>
    </div>
  );
}

export default UserJobList;
