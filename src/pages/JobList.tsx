import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { getUserProfiles } from '../api/user';
import { getUserJobs } from '../api/user_job';
import UserJobList from '../components/job-list-components/UserJobList';
import { BarLoader } from 'react-spinners';

const JobList = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [userJobs, setUserJobs] = useState<{ [userId: string]: any[] }>({});
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    async function fetchUsersAndJobs() {
      try {
        const fetchedUsers = await getUserProfiles();
        setUsers(fetchedUsers || []);
        const jobsByUser: { [userId: string]: any[] } = {};
        for (const user of fetchedUsers || []) {
          try {
            jobsByUser[user.id] = await getUserJobs(user.id);
          } catch {
            jobsByUser[user.id] = [];
          }
        }
        setUserJobs(jobsByUser);
      } finally {
      }
    }
    fetchUsersAndJobs();
  }, []);

  const handleEdit = (userId: string) => {
    navigate(`/edit-job/${userId}`);
  };

  const filteredUsers = id ? users.filter((user) => user.id === id) : users;

  return (
    <div className="">
      <h1 className="pb-6">Jobliste</h1>
      <div className="flex gap-4 flex-wrap justify-between">
        {users.length === 0 ? (
          <BarLoader />
        ) : (
          [...filteredUsers]
            .sort((a, b) => a.name.localeCompare(b.name))
            .map((user: any) => (
              <UserJobList
                key={user.id}
                profileName={user.name}
                jobs={userJobs[user.id] || []}
                onEdit={() => handleEdit(user.id)}
              />
            ))
        )}
      </div>
    </div>
  );
};

export default JobList;
