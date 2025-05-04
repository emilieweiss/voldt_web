import UserJobList from "../components/UserJobList";

const JobList = () => {
  const jobs = [
    {
      title: "Opgavetitle",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
      economy: 150,
      timeEstimate: "35 min",
      deliveryTime: "11.45",
    },
    {
      title: "Opgavetitle",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
      economy: 200,
      timeEstimate: "45 min",
      deliveryTime: "12.30",
    },
  ];

  const handleEdit = () => {
    // Handle edit action here
    console.log("Edit job");
  };

  return (
    <div className="p-8">
      <h2 className="text-6xl font-bold mb-[88px] ml-[140px] mt-[80px]">Jobliste</h2>
      <UserJobList title="Bruger 1" jobs={jobs} onEdit={handleEdit} />
    </div>
  );
};

export default JobList;