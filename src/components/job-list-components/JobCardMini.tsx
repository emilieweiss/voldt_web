import { Clock, DollarSign, Truck } from 'lucide-react';
import { Job } from '../../types/job';

interface JobCardMiniProps {
  job: Job;
}

function JobCardMini({ job }: JobCardMiniProps) {
  return (
    <div className="rounded-xl p-6 bg-gray-100 flex flex-col w-full">
      {/* Title and Description */}
      <div>
        <p className="text-xl font-semibold mb-2 truncate text-gray-900">
          {job.title}
        </p>
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
  );
}

export default JobCardMini;
