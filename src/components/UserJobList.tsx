import React from "react";
import JobCardMini from "./JobCardMini";

interface UserJobListProps {
  title: string;
  jobs: {
    title: string;
    description: string;
    economy: number;
    timeEstimate: string;
    deliveryTime: string;
  }[];
  onEdit: () => void;
}

const UserJobList: React.FC<UserJobListProps> = ({ title, jobs, onEdit }) => {
    return (
      <div className="border rounded-lg p-[12px] shadow-sm bg-white w-[346px] relative">
        {/* Header */}
        <div className="mb-4 relative">
          <h2 className="text-xl font-bold">{title}</h2>
          <button
            onClick={onEdit}
            className="absolute top-0 right-0 bg-[var(--color-wolt-blue)] text-white rounded-full w-[37px] h-[37px] flex items-center justify-center"
          >
            <span className="material-icons text-lg">edit</span>
          </button>
        </div>
  
        {/* Job List */}
        <div className="flex flex-col space-y-[12px]">
          {jobs.map((job, index) => (
            <JobCardMini key={index} {...job} />
          ))}
        </div>
      </div>
    );
  };
  
  export default UserJobList;