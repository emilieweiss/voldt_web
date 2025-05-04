import React, { useState } from "react";
import CreateJobModal from "../modals/CreateJobModal";
import JobCardDetailed from "../components/JobCardDetailed";

const CreateJob = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const opgaver = [
    {
      title: "Opgavetitle",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
      timeEstimate: "35 min",
      deliveryTime: "11.45",
      address: "JegErEnAdresseTrustMe 43",
      economy: 150,
    },
    {
      title: "Opgavetitle",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
      timeEstimate: "35 min",
      deliveryTime: "11.45",
      address: "JegErEnAdresseTrustMe 43",
      economy: 150,
    },
    // Add more opgaver as needed
  ];

  return (
    <div className="relative p-8">
      <h2 className="text-6xl font-bold mb-[88px] ml-[140px] mt-[80px]">Liste over oprettede opgaver</h2>
      <button
        onClick={() => setIsModalOpen(true)}
        className="absolute top-[180px] right-[170px] bg-[var(--color-wolt-blue)] text-white rounded-lg w-[54px] h-[54px] flex items-center justify-center"
      >
        <span className="text-5xl font-semibold">+</span>
      </button>
      <div className="mb-6 mx-[140px] flex flex-col gap-y-[24px]">
        {opgaver.map((opgave, index) => (
          <JobCardDetailed key={index} {...opgave} />
        ))}
      </div>
      <CreateJobModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
};

export default CreateJob;