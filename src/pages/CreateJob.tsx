import { useState, useEffect } from 'react';
import CreateJobModal from '../modals/CreateJobModal';
import JobCardDetailed from '../components/create-job-components/JobCardDetailed';
import { getJobs, getJob } from '../api/job';
import { Job } from '../types/job';
import Button from '../components/ui/Button';
import { Plus } from 'lucide-react';
import Modal from '../modals/Modal';
import Select from '../components/ui/Select';
import { toast } from 'sonner';
import Searchbar from '../components/ui/Searchbar';
import Label from '../components/ui/Label';
import BarLoader from 'react-spinners/BarLoader';

type SortBy = 'title-asc' | 'title-desc' | 'money-asc' | 'money-desc';

const CreateJob = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [sortBy, setSortBy] = useState<SortBy>('title-asc');
  const [search, setSearch] = useState('');

  const fetchJobs = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getJobs();
      setJobs(data);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message || 'Kunne ikke hente jobs');
      } else {
        setError('Kunne ikke hente jobs');
      }
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
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message || 'Kunne ikke opdatere job');
      } else {
        setError('Kunne ikke opdatere job');
      }
      toast.error('Job kunne ikke opdateres');
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const filteredJobs = jobs.filter(
    (job) =>
      job &&
      job.title &&
      job.title.toLowerCase().includes(search.toLowerCase()),
  );

  const sortedJobs = filteredJobs.sort((a, b) => {
    if (sortBy === 'title-asc') return a.title.localeCompare(b.title);
    if (sortBy === 'title-desc') return b.title.localeCompare(a.title);
    if (sortBy === 'money-asc') return Number(a.money) - Number(b.money);
    if (sortBy === 'money-desc') return Number(b.money) - Number(a.money);
    return 0;
  });

  return (
    <div className="flex flex-col">
      <h1 className="mb-4">Liste over oprettede opgaver</h1>
      <div className="flex flex-col gap-6">
        <div className="flex items-center gap-x-4">
          {/* Search bar on the left */}
          <Searchbar
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full md:w-1/3"
          />

          {/* Sort and + button on the right */}
          <div className="flex items-center gap-4 ml-auto">
            <Label htmlFor="sortby" className="text-sm font-semibold">
              Sortér efter:
            </Label>
            <Select
              id="sortby"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortBy)}
              className="min-w-30"
            >
              <option value="title-asc">Titel (A-Å)</option>
              <option value="title-desc">Titel (Å-A)</option>
              <option value="money-asc">Økonomi (lavest først)</option>
              <option value="money-desc">Økonomi (højest først)</option>
            </Select>
            <Button
              onClick={() => setIsOpen(true)}
              className="w-10 h-10 lg:w-14 lg:h-14 rounded-xl flex items-center justify-center p-0 flex-shrink-0"
              aria-label="Opret ny opgave"
            >
              <Plus strokeWidth={5} size={30} />
            </Button>
          </div>
        </div>
        {loading && <div className="flex justify-center">
          <BarLoader />
        </div>}
        {error && <div className="text-red-500">{error}</div>}
        {!loading &&
          !error &&
          sortedJobs.map((job) => (
            <JobCardDetailed
              key={job.id}
              job={job}
              updateSingleJob={updateSingleJob}
              onDelete={() =>
                setJobs((prev) => prev.filter((j) => j.id !== job.id))
              }
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
