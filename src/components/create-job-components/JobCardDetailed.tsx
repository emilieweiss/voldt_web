import { useState } from 'react';
import EditJobForm from '../../modals/EditJobForm';
import Modal from '../../modals/Modal';
import { Job } from '../../types/job';
import { Clock, Truck, BookUser, DollarSign, Pencil } from 'lucide-react';

interface JobCardDetailedProps {
  job: Job;
  updateSingleJob: (id: string) => void;
  onDelete: () => void;
}

function JobCardDetailed({
  job,
  updateSingleJob,
  onDelete,
}: JobCardDetailedProps) {
  const [isEditOpen, setIsEditOpen] = useState(false);

  return (
    <div
      className="
        border border-gray-400 rounded-xl p-6 bg-gray-100
        grid gap-0 items-center
        grid-cols-1
        lg:grid-cols-14
        overflow-x-auto
      "
    >
      {/* title and description */}
      <div className="lg:col-span-5 lg:pr-6 text-center lg:text-left">
        <p className="text-xl font-semibold lg:mb-2 truncate">{job.title}</p>
        <p className="text-base text-gray-600 break-words whitespace-pre-line line-clamp-3 max-h-24 mb-2 lg:mb-0">
          {job.description}
        </p>
      </div>

      {/* duration, time, address */}
      <div className="lg:col-span-4 pr-6 border-t py-3 lg:py-0 lg:border-t-0 lg:border-l border-gray-300 h-full justify-center lg:justify-start items-center flex">
        <div className="text-sm grid grid-cols-[40px_1fr] pl-6 gap-2">
          {/* Icons column */}
          <div className="flex flex-col items-center gap-y-2">
            <Clock className="w-5 h-5 flex-shrink-0" />
            <Truck className="w-5 h-5 flex-shrink-0" />
            <BookUser className="w-5 h-5 flex-shrink-0" />
          </div>
          {/* Text column */}
          <div className="flex flex-col items-start gap-y-2 w-full">
            <span className="font-semibold">{job.duration}</span>
            <span className="font-semibold">{job.delivery?.slice(0, 5)}</span>
            <span className="font-semibold">{job.address}</span>
          </div>
        </div>
      </div>

      {/* Economy Section */}
      <div className="lg:col-span-4 px-6 border-t py-3 lg:py-0 lg:border-t-0 lg:border-l border-gray-300 h-full flex flex-col justify-center">
        <div className="grid grid-cols-4 grid-rows-3 w-full text-center">
          {/* Row 1: Dollar sign and "Økonomi" spanning all columns */}
          <div className="col-span-4 flex items-center justify-center lg:justify-start mb-2 row-span-1">
            <DollarSign className="w-5 h-5 mr-2" />
            <span className="font-semibold">Økonomi</span>
          </div>
          {/* Row 2: Labels */}
          <p className="row-start-2 font-semibold text-base">Fejlet</p>
          <p className="row-start-2 font-semibold text-base">Skidt</p>
          <p className="row-start-2 font-semibold text-base">Fint</p>
          <p className="row-start-2 font-semibold text-base">Godt</p>
          {/* Row 3: Values */}
          <div className="row-start-3 flex justify-center items-center">
            0
          </div>
          <div className="border-l border-gray-300 row-start-3 flex justify-center items-center">
            {Math.round(job.money * 0.33).toLocaleString('da-DK')}
          </div>
          <div className="border-l border-gray-300 row-start-3 flex justify-center items-center">
            {Math.round(job.money * 0.667).toLocaleString('da-DK')}
          </div>
          <div className="border-l border-gray-300 row-start-3 flex justify-center items-center">
            {job.money.toLocaleString('da-DK')}
          </div>
        </div>
      </div>

      {/* Right Section */}
      <div className="lg:col-span-1 flex items-center justify-center border-t pt-3 lg:py-0 lg:border-t-0 lg:border-l border-gray-300 h-full">
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
            onDelete={onDelete}
          />
        </Modal>
      </div>
    </div>
  );
}

export default JobCardDetailed;
