import { Pencil } from 'lucide-react';
import { Job } from '../../types/job';
import JobCardMini from './JobCardMini';
import { useLocation } from 'react-router';
import Button from '../ui/Button';

interface UserJobListProps {
  profileName: string;
  jobs: Job[];
  onEdit: () => void;
  widthClass?: string;
}

function UserJobList({ profileName, jobs, onEdit, widthClass = "w-80" }: UserJobListProps) {
  const location = useLocation();
  const isEditJobPage = location.pathname.includes('edit-job');

  return (
    <div className={`border border-(--border) rounded-xl p-4 bg-white relative ${widthClass}`}>
      {/* Header */}
      <div className="mb-4 relative flex items-center justify-between">
        <h2 className="w-full truncate">{profileName}</h2>
        {!isEditJobPage && (
          <Button
            onClick={onEdit}
            className="flex-shrink-0"
            variant='round'
            aria-label="Rediger bruger"
          >
            <Pencil size={20} />
          </Button>
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
