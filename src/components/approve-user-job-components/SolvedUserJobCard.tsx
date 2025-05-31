import { Clock, Truck, BookUser, DollarSign, Check } from 'lucide-react';

interface SolvedJobCardProps {
  job: any;
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
        md:grid-cols-15
        overflow-x-auto
      "
    >
      {/* Left Section */}
      <div className="md:col-span-5 pr-6">
        <p className="mb-2 flex items-center gap-6 font-semibold">
          <span className="break-words text-gray-500">
            Bruger: {userName || job.user_id}
          </span>
        </p>
        <p className="text-xl font-semibold mb-2 truncate">{job.title}</p>
        <p className="text-base text-gray-600 break-words whitespace-pre-line line-clamp-3 max-h-24">
          {job.description}
        </p>
      </div>

      {/* Middle Section */}
      <div className="md:col-span-4 pr-6 border-t py-3 md:py-0 md:border-t-0 md:border-l border-gray-300 h-full flex flex-col justify-center">
        <div className="text-sm md:pl-6">
          <p className="mb-2 flex items-center gap-6 font-semibold">
            <Clock className="w-5 h-5 flex-shrink-0" />
            {job.duration}
          </p>
          <p className="mb-2 flex items-center gap-6 font-semibold">
            <Truck className="w-5 h-5 flex-shrink-0" />
            {job.delivery?.slice(0, 5)}
          </p>
          <p className="mb-2 flex items-center gap-6 font-semibold">
            <BookUser className="w-5 h-5 flex-shrink-0" />
            <span className="break-words">{job.adress}</span>
          </p>
        </div>
      </div>

      {/* Economy Section */}
      <div className="md:col-span-4 px-6 border-t py-3 md:py-0 md:border-t-0 md:border-l border-gray-300 h-full flex flex-col justify-center">
        <div className="grid grid-cols-4 grid-rows-3 w-full text-center">
          {/* Row 1: Dollar sign and "Økonomi" spanning all columns */}
          <div className="col-span-4 flex items-center justify-start mb-2 row-span-1">
            <DollarSign className="w-5 h-5 mr-2" />
            <span className="font-semibold">Økonomi</span>
          </div>
          {/* Row 2: Labels */}
          <p className="row-start-2 font-semibold text-base">Godt</p>
          <p className="row-start-2 font-semibold text-base">Fint</p>
          <p className="row-start-2 font-semibold text-base">Skidt</p>
          <p className="row-start-2 font-semibold text-base">Fejlet</p>
          {/* Row 3: Values */}
          <div className="row-start-3 flex justify-center items-center">
            {job.money}
          </div>
          <div className="border-l border-gray-300 row-start-3 flex justify-center items-center">
            {Math.round(job.money * 0.66)}
          </div>
          <div className="border-l border-gray-300 row-start-3 flex justify-center items-center">
            {Math.round(job.money * 0.33)}
          </div>
          <div className="border-l border-gray-300 row-start-3 flex justify-center items-center">
            0
          </div>
        </div>
      </div>
      <div className="md:col-span-2 gap-2 flex items-center justify-center border-t py-3 md:py-0 md:border-t-0 md:border-l border-gray-300 h-full">
        <button
          className="bg-(--color-wolt-blue) rounded-full p-2 text-white hover:bg-(--color-wolt-medium-blue) cursor-pointer"
          onClick={onApproveClick}
        >
          <Check />
        </button>
      </div>
    </div>
  );
}

export default SolvedJobCard;
