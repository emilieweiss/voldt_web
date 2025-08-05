import { Clock, DollarSign, Truck } from 'lucide-react';
import { Job } from '../../types/job';
import { X } from 'lucide-react'
import Button from '../ui/Button';
import { toast } from 'sonner';
import { removeUserJob } from '../../api/user_job';
import { useState } from 'react';
import DeleteUserJobModal from '../../modals/RemoveUserJobModal';

interface JobCardMiniProps {
  job: Job;
  edit?: boolean;
  onJobRemoved?: (jobId: string) => void;
}

function JobCardMini({ job, edit, onJobRemoved }: JobCardMiniProps) {
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleRemoveJob = async (jobToRemove: Job) => {
    try {
      if (!jobToRemove.id) {
        toast.error('Job mangler id!');
        return;
      }
      await removeUserJob(jobToRemove.id);
      toast.success(`Job fjernet: ${jobToRemove.title}`);
      // Call the callback to update the parent's state
      if (onJobRemoved) {
        onJobRemoved(jobToRemove.id);
      }
    } catch (err: unknown) {
      toast.error('Kunne ikke fjerne job');
      if (err instanceof Error) {
        alert('Kunne ikke fjerne job: ' + err.message);
        console.error(err);
      } else {
        alert('Kunne ikke fjerne job: Ukendt fejl');
        console.error(err);
      }
    }
  }

  const handleDeleteClick = () => {
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async (job: Job) => {
    await handleRemoveJob(job);
  };

  return (
    <>
      <div className="rounded-xl p-6 bg-gray-100 flex flex-col w-full">
        {/* Title and Description */}
        <div>
          <div className='relative flex items-center justify-between'>
            <p className="text-xl font-semibold mb-2 truncate text-gray-900">
              {job.title}
            </p>
            {!edit ? null : (
              <Button
                className="flex-shrink-0"
                variant="destructiveRound"
                aria-label="Slet job"
                onClick={handleDeleteClick}
              >
                <X size={20} />
              </Button>
            )}
          </div>
          <p className="text-base text-gray-600 break-words whitespace-pre-line line-clamp-3 max-h-24">
            {job.description}
          </p>
        </div>

        {/* Icons and Details */}
        <div className="flex items-center justify-between text-base text-gray-700 mt-4">
          <div className="flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-gray-700" />
            <span className="font-semibold">{job.money} kr.</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-gray-700" />
            <span className="font-semibold">{job.duration} min</span>
          </div>
          <div className="flex items-center gap-2">
            <Truck className="w-5 h-5 text-gray-700" />
            <span className="font-semibold">{job.delivery?.slice(0, 5)}</span>
          </div>
        </div>
      </div>
      <DeleteUserJobModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onDelete={handleConfirmDelete}
        job={job}
      />
    </>
  );
}

export default JobCardMini;
