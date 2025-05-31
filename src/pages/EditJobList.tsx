import { useParams } from 'react-router';
import { useEffect, useState } from 'react';
import { getUserProfiles } from '../api/user';
import { getUserJobs, assignJobToUser } from '../api/user_job';
import { getJobs } from '../api/job';
import UserJobList from '../components/job-list-components/UserJobList';
import Button from '../components/ui/Button';
import Select from '../components/ui/Select';

const EditJobList = () => {
  const { id } = useParams<{ id: string }>();
  const [user, setUser] = useState<any>(null);
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [allJobs, setAllJobs] = useState<any[]>([]);
  const [selectedJobId, setSelectedJobId] = useState<string>('');

  useEffect(() => {
    async function fetchUserAndJobs() {
      setLoading(true);
      try {
        const users = await getUserProfiles();
        const foundUser = users.find((u: any) => u.id === id);
        setUser(foundUser);
        if (foundUser) {
          const userJobs = await getUserJobs(foundUser.id);
          setJobs(userJobs || []);
        }
      } finally {
        setLoading(false);
      }
    }
    if (id) fetchUserAndJobs();
  }, [id]);

  useEffect(() => {
    async function fetchJobs() {
      const jobs = await getJobs();
      setAllJobs(jobs || []);
    }
    fetchJobs();
  }, []);

  const handleAssignJob = async () => {
    try {
      const jobToAssign = allJobs.find(
        (j) => String(j.id) === String(selectedJobId),
      );
      if (!jobToAssign) {
        alert('Vælg et job at tilføje');
        console.error('Job not found for id:', selectedJobId);
        setSelectedJobId('');
        return;
      }
      const { id, image_url, ...jobFields } = jobToAssign; // fjern id og image_url
      const userJob = {
        ...jobFields,
        job_id: jobToAssign.id,
        user_id: user.id,
        solved: false,
      };
      await assignJobToUser(userJob, user.id);
      const userJobs = await getUserJobs(user.id);
      setJobs(userJobs || []);
      setSelectedJobId('');
    } catch (err) {
      alert('Kunne ikke tilføje job: ' + (err as any).message);
      console.error(err);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (!user) return <div>Bruger ikke fundet</div>;

  return (
    <div className="">
      <h1>Rediger jobliste</h1>
      {/* Add job to user */}
      <div className="mb-6 flex gap-4 items-end">
        <Select
          className="border rounded px-3 py-2"
          value={selectedJobId}
          onChange={(e) => setSelectedJobId(e.target.value)}
        >
          <option value="">Vælg job</option>
          {allJobs.map((job) => (
            <option key={job.id} value={job.id}>
              {job.title}
            </option>
          ))}
        </Select>
        <Button type="button" onClick={handleAssignJob}>
          Tilføj job
        </Button>
      </div>
      <UserJobList profileName={user.name} jobs={jobs} onEdit={() => {}} />
    </div>
  );
};

export default EditJobList;
