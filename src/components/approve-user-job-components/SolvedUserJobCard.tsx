import { Clock, Truck, BookUser, DollarSign, Check } from 'lucide-react';
import { UserJob } from '../../types/user_job';
import Button from '../ui/Button';

interface SolvedJobCardProps {
  job: UserJob;
  userName?: string;
  onApproveClick?: () => void;
}

function SolvedJobCard({ job, userName, onApproveClick }: SolvedJobCardProps) {
  return (
    <div
      className="
        border border-gray-400 rounded-xl p-6 bg-gray-100
        grid gap-0 items-center
        grid-cols-1
        lg:grid-cols-15
        overflow-x-auto
      "
    >
      {/* title and description */}
      <div className="lg:col-span-5 pr-6 text-center lg:text-left">
        <p className="break-words text-gray-500 font-semibold mb-2 lg:mb-0">
          Bruger: {userName || job.user_id}
        </p>
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
          <div className="col-span-4 flex items-center justify-start mb-2 row-span-1">
            <DollarSign className="w-5 h-5 mr-2" />
            <span className="font-semibold">Økonomi</span>
          </div>
          {/* Row 2: Labels */}
          <p className="row-start-2 font-semibold text-base">Fejlet</p>
          <p className="row-start-2 font-semibold text-base">Skidt</p>
          <p className="row-start-2 font-semibold text-base">Fint</p>
          <p className="row-start-2 font-semibold text-base">Godt</p>
          {/* Row 3: Values */}
          <div className=" row-start-3 flex justify-center items-center">
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
      <div className="lg:col-span-2 gap-2 flex items-center justify-center border-t py-3 lg:py-0 lg:border-t-0 lg:border-l border-gray-300 h-full">
        <Button
          variant='round'
          onClick={onApproveClick}
        >
          <Check />
        </Button>
      </div>
    </div>
  );
}

export default SolvedJobCard;
