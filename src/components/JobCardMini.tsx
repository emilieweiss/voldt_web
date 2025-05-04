import React from "react";

interface JobCardMiniProps {
  title: string;
  description: string;
  economy: number;
  timeEstimate: string;
  deliveryTime: string;
}

const JobCardMini: React.FC<JobCardMiniProps> = ({
  title,
  description,
  economy,
  timeEstimate,
  deliveryTime,
}) => {
  return (
    <div className="border rounded-lg p-4 shadow-sm bg-gray-50 flex flex-col w-[320px] h-[145px]">
      {/* Title and Description */}
      <div>
        <h3 className="text-lg font-bold">{title}</h3>
        <p className="text-gray-600 text-sm">{description}</p>
      </div>

      {/* Icons and Details */}
      <div className="flex items-center justify-between text-sm text-gray-600">
        <div className="flex items-center gap-1">
          <span className="material-icons text-gray-500">money</span>
          <p>{economy}</p>
        </div>
        <div className="flex items-center gap-1">
          <span className="material-icons text-gray-500">schedule</span>
          <p>{timeEstimate}</p>
        </div>
        <div className="flex items-center gap-1">
          <span className="material-icons text-gray-500">levering</span>
          <p>{deliveryTime}</p>
        </div>
      </div>
    </div>
  );
};

export default JobCardMini;