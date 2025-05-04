import React from "react";

interface JobCardDetailedProps {
  title: string;
  description: string;
  timeEstimate: string;
  deliveryTime: string;
  address: string;
  economy: number;
}

const JobCardDetailed: React.FC<JobCardDetailedProps> = ({
  title,
  description,
  timeEstimate,
  deliveryTime,
  address,
  economy,
}) => {
  return (
    <div className="border rounded-lg p-6 shadow-sm bg-gray-50 flex">
      {/* Left Section */}
      <div className="flex-1 pr-6">
        <h3 className="text-xl font-bold mb-2">{title}</h3>
        <p className="text-gray-600 mb-4">{description}</p>
      </div>

      {/* Divider */}
      <div className="border-l border-gray-300 mx-6"></div>

      {/* Middle Section */}
      <div className="flex flex-col justify-center pr-6">
        <div className="text-sm text-gray-600 mb-2">
          <p className="mb-1">
            <span className="font-bold">Tidsestimat:</span> {timeEstimate}
          </p>
          <p className="mb-1">
            <span className="font-bold">Afleveringstidspunkt:</span> {deliveryTime}
          </p>
          <p>
            <span className="font-bold">Adresse:</span> {address}
          </p>
        </div>
      </div>

      {/* Divider */}
      <div className="border-l border-gray-300 mx-6"></div>

      {/* Economy Section */}
      <div className="flex flex-col justify-center items-center pr-6">
        <p className="text-gray-500 text-sm mb-1">Økonomi</p>
        <p className="text-lg font-bold">{economy} kr</p>
      </div>

      {/* Divider */}
      <div className="border-l border-gray-300 mx-6"></div>

      {/* Right Section */}
      <div className="flex items-center">
        <button className="text-gray-500 hover:text-gray-800">
          <span className="material-icons">edit</span>
        </button>
      </div>
    </div>
  );
};

export default JobCardDetailed;