import { useState, useEffect } from 'react';
import CreateJobModal from '../modals/CreateJobModal';
import JobCardDetailed from '../components/JobCardDetailed';
import { getJobs, getJob } from '../api/job';
import { Job } from '../types/job';
import Button from '../components/ui/Button';
import { Plus } from 'lucide-react';
import Modal from '../modals/Modal';
import Select from '../components/ui/Select';
import { toast } from 'sonner';

const CreateJob = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [sortBy, setSortBy] = useState<SortBy>('title-asc');

  const fetchJobs = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getJobs();
      setJobs(data);
    } catch (err: any) {
      setError(err.message || 'Kunne ikke hente jobs');
    } finally {
      setLoading(false);
    }
  };

  const handleJobCreated = (job: Job) => {
    if (!job) return;
    setJobs((prevJobs) => [job, ...prevJobs.filter(Boolean)]);
    toast.success('Job oprettet');
  };

  const updateSingleJob = async (id: string) => {
    try {
      const updatedJob = await getJob(id);
      setJobs((prevJobs) =>
        prevJobs.map((job) => (job.id === updatedJob.id ? updatedJob : job)),
      );
      toast.success('Job opdateret');
    } catch (err: any) {
      setError(err.message || 'Kunne ikke opdatere job');
      toast.error('Job opdateret');
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  type SortBy = 'title-asc' | 'title-desc' | 'money-asc' | 'money-desc';

  const sortedJobs = jobs
    .filter((job) => job && job.title)
    .sort((a, b) => {
      if (sortBy === 'title-asc') return a.title.localeCompare(b.title);
      if (sortBy === 'title-desc') return b.title.localeCompare(a.title);
      if (sortBy === 'money-asc') return Number(a.money) - Number(b.money);
      if (sortBy === 'money-desc') return Number(b.money) - Number(a.money);
      return 0;
    });

  return (
    <div className="relative">
      <h1 className="">Liste over oprettede opgaver</h1>
      <div className="flex items-center gap-4 mb-4">
        <label htmlFor="sortby" className="text-sm font-semibold">
          Sortér efter:
        </label>
        <Select
          id="sortby"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as SortBy)}
          className="border rounded px-2 py-1"
        >
          <option value="title-asc">Titel (A-Å)</option>
          <option value="title-desc">Titel (Å-A)</option>
          <option value="money-asc">Økonomi (lavest først)</option>
          <option value="money-desc">Økonomi (højest først)</option>
        </Select>
      </div>
      <div className="mb-6 flex flex-col gap-y-[24px] relative">
        {loading && <div>Indlæser jobs...</div>}
        {error && <div className="text-red-500">{error}</div>}
        <div className="flex justify-end">
          <Button
            onClick={() => setIsOpen(true)}
            className="w-14 h-14 rounded-xl flex items-center justify-center p-0"
            aria-label="Opret ny opgave"
          >
            <Plus strokeWidth={5} size={64} />
          </Button>
        </div>
        {!loading &&
          !error &&
          sortedJobs.map((job) => (
            <JobCardDetailed
              key={job.id}
              job={job}
              updateSingleJob={updateSingleJob}
            />
          ))}
      </div>
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <CreateJobModal
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          onJobCreated={handleJobCreated}
        />
      </Modal>
    </div>
  );
};

export default CreateJob;
