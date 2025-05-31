import { useState } from 'react';
import EditJobForm from '../modals/EditJobForm';
import Modal from '../modals/Modal';
import { Job } from '../types/job';
import { Clock, Truck, BookUser, DollarSign, Pencil } from 'lucide-react';

interface JobCardDetailedProps {
  job: Job;
  updateSingleJob: (id: string) => void;
}

function JobCardDetailed({ job, updateSingleJob }: JobCardDetailedProps) {
  const [isEditOpen, setIsEditOpen] = useState(false);

  return (
    <div
      className="
        border border-gray-400 rounded-xl p-6 bg-gray-100
        grid gap-0 items-center
        grid-cols-1
        md:grid-cols-14
        overflow-x-auto
      "
    >
      {/* Left Section */}
      <div className="md:col-span-5 pr-6">
        <h2 className="text-xl mb-2">{job.title}</h2>
        <p className="text-base text-gray-600">{job.description}</p>
      </div>

      {/* Middle Section */}
      <div className="md:col-span-4 pr-6 border-t md:border-t-0 md:border-l border-gray-300 h-full">
        <div className="text-sm md:pl-6">
          <p className="mb-2 flex items-center gap-2 font-semibold">
            <Clock className="w-5 h-5 flex-shrink-0" />
            {job.duration}
          </p>
          <p className="mb-2 flex items-center gap-2 font-semibold">
            <Truck className="w-5 h-5 flex-shrink-0" />
            {job.delivery?.slice(0, 5)}
          </p>
          <p className="mb-2 flex items-center gap-2 font-semibold">
            <BookUser className="w-5 h-5 flex-shrink-0" />
            <span className="break-words">{job.adress}</span>
          </p>
        </div>
      </div>

      {/* Economy Section */}
      <div className="md:col-span-4 flex flex-col justify-center items-center pr-6 border-t md:border-t-0 md:border-l border-gray-300 h-full">
        <p className="mb-2 flex items-center gap-2 font-semibold">
          <DollarSign className="w-5 h-5" />
          Økonomi
        </p>
        <p className="text-lg font-bold">{job.money} kr</p>
      </div>

      {/* Right Section */}
      <div className="md:col-span-1 flex items-center justify-center border-t md:border-t-0 md:border-l border-gray-300 h-full">
        <button
          className="text-gray-500 hover:text-gray-800 cursor-pointer"
          onClick={() => setIsEditOpen(true)}
        >
          <Pencil />
        </button>
        <Modal isOpen={isEditOpen} onClose={() => setIsEditOpen(false)}>
          <EditJobForm
            job={job}
            onClose={() => setIsEditOpen(false)}
            updateSingleJob={updateSingleJob}
          />
        </Modal>
      </div>
    </div>
  );
}

export default JobCardDetailed;
