import { useParams } from 'react-router';
import { useEffect, useState, useCallback } from 'react';
import { getUserProfiles, supabase } from '../api/user';
import { getUserJobs, assignJobToUser } from '../api/user_job';
import JobTemplatesList from '../components/job-list-components/JobTemplatesList';
import { Job } from '../types/job';
import { BarLoader } from 'react-spinners';
import { toast } from 'sonner';
import { User } from '../types/user';
import { UserJob } from '../types/user_job';
import UserJobListEdit from '../components/job-list-components/UserJobListEdit';

const EditJobList = () => {
  const { id } = useParams<{ id: string }>();
  const [user, setUser] = useState<User>();
  const [jobs, setJobs] = useState<UserJob[]>([]);
  const [loading, setLoading] = useState(true);

  const initialLoad = useCallback(async () => {
    setLoading(true);
    try {
      const users = await getUserProfiles();
      const foundUser = users.find((u: User) => u.id === id);
      setUser(foundUser);
      if (foundUser) {
        const userJobs = await getUserJobs(foundUser.id);
        setJobs(userJobs || []);
      }
    } finally {
      setLoading(false);
    }
  }, [id]);

  const updateData = useCallback(async () => {
    try {
      const users = await getUserProfiles();
      const foundUser = users.find((u: User) => u.id === id);
      setUser(foundUser);
      if (foundUser) {
        const userJobs = await getUserJobs(foundUser.id);
        setJobs(userJobs || []);
      }
    } catch (err) {
      console.error('Error updating data:', err);
    }
  }, [id]);

  useEffect(() => {
    if (!id) return;

    initialLoad();

    const channel = supabase
      .channel('edit_job_list_changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'user_jobs' },
        () => updateData(),
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'profiles' },
        () => updateData(),
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [id, initialLoad, updateData]);

  const handleJobRemoved = (jobId: string) => {
    setJobs((prevJobs) => prevJobs.filter((job) => job.id !== jobId));
  };

  const handleAssignJob = async (jobToAssign: Job) => {
    try {
      if (!jobToAssign.id || !user?.id) {
        toast.error('Job eller bruger mangler id!');
        return;
      }
      const userJob = {
        job_id: jobToAssign.id,
        job_image_url: jobToAssign.image_url,
        user_id: user.id,
        title: jobToAssign.title,
        description: jobToAssign.description,
        address: jobToAssign.address,
        duration: jobToAssign.duration,
        delivery: jobToAssign.delivery,
        image_solved_url: null,
        money: jobToAssign.money,
        solved: false,
        approved: false,
      };

      await assignJobToUser(userJob);
      toast.success(`Job tilføjet til bruger: ${user.name}`);

      // Ensure immediate update of the job list
      await updateData();
    } catch (err: unknown) {
      toast.error('Kunne ikke tilføje job til bruger');
      if (err instanceof Error) {
        console.error('Error assigning job:', err);
      }
    }
  };

  return (
    <div className="flex flex-col md:flex-row gap-8">
      <div className="w-full md:w-150 md:min-w-sm">
        <h1 className="mb-6">Rediger jobliste</h1>
        {loading || !user ? (
          <div className="flex flex-col items-center justify-center min-h-[400px]">
            <BarLoader color="#009DF4" />
            <p className="mt-4 text-gray-600">Indlæser jobliste...</p>
          </div>
        ) : (
          <div>
            <UserJobListEdit
              profileName={user.name}
              jobs={jobs}
              onEdit={() => {}}
              widthClass="w-full"
              onJobRemoved={handleJobRemoved}
            />
          </div>
        )}
      </div>
      <div className="w-full">
        <JobTemplatesList onPickJob={handleAssignJob} />
      </div>
    </div>
  );
};

export default EditJobList;
