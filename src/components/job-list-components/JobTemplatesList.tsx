import { useEffect, useState } from 'react';
import { getJobs, updateJob } from '../../api/job';
import { Job } from '../../types/job';
import { SendHorizonal } from 'lucide-react';
import EditUserJobModal from '../../modals/EditUserJobModal';
import Searchbar from '../ui/Searchbar';
import Select from '../ui/Select';
import Label from '../ui/Label';
import { toast } from 'sonner';
import Button from '../ui/Button';

export default function JobTemplatesList({
  onPickJob,
}: {
  onPickJob?: (job: Job) => void;
}) {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState<
    'title-asc' | 'title-desc' | 'money-asc' | 'money-desc'
  >('title-asc');

  useEffect(() => {
    getJobs().then(setJobs);
  }, []);

  const handleSave = async (updates: Partial<Job>) => {
    if (!updates.id) return;
    try {
      if (onPickJob) {
        onPickJob({ ...selectedJob, ...updates, id: selectedJob?.id } as Job);
        setModalOpen(false);
        setSelectedJob(null);
      } else {
        await updateJob(updates.id, updates);
        toast.success('Job opdateret!');
        setJobs((jobs) =>
          jobs.map((j) => (j.id === updates.id ? { ...j, ...updates } : j)),
        );
        setModalOpen(false);
        setSelectedJob(null);
      }
    } catch (error) {
      toast.error('Der opstod en fejl under opdatering af jobbet.');
    }
  };

  // Filter and sort jobs
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
    <div>
      <h1 className="mb-6">Alle jobs</h1>
      <div className="w-full border-1 border-(--border) rounded-xl p-6 bg-white">
        <div className="flex items-center gap-x-4">
          <Searchbar
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full md:w-1/3"
          />
          <div className="flex items-center gap-4 ml-auto">
            <Label htmlFor="sortby" className="text-sm font-semibold">
              Sortér efter:
            </Label>
            <Select
              id="sortby"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
            >
              <option value="title-asc">Titel (A-Å)</option>
              <option value="title-desc">Titel (Å-A)</option>
              <option value="money-asc">Økonomi (lavest først)</option>
              <option value="money-desc">Økonomi (højest først)</option>
            </Select>
          </div>
        </div>
        <ul className="divide-y-1 divide-(--border) mt-4">
          {sortedJobs.map((job) => (
            <li key={job.id} className="flex items-center justify-between py-4">
              <div className="w-full grid grid-row-2 items-center">
                <div className="font-semibold truncate">{job.title}</div>
                <div className="text-gray-600 text-sm break-words whitespace-pre-line line-clamp-3 max-h-24">
                  {job.description}
                </div>
              </div>
              <Button
                variant='round'
                className="ml-4"
                onClick={() => {
                  setSelectedJob(job);
                  setModalOpen(true);
                }}
              >
                <SendHorizonal size={20} />
              </Button>
            </li>
          ))}
        </ul>
        {selectedJob && (
          <EditUserJobModal
            job={selectedJob}
            isOpen={modalOpen}
            onClose={() => {
              setModalOpen(false);
              setSelectedJob(null);
            }}
            onSave={handleSave}
          />
        )}
      </div>
    </div>
  );
}
