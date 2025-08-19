import { useEffect, useState, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router';
import { deleteUserProfile, getUserProfiles, supabase } from '../api/user';
import { getUserJobs } from '../api/user_job';
import UserJobList from '../components/job-list-components/UserJobList';
import { BarLoader } from 'react-spinners';
import { User } from '../types/user';
import { UserJob } from '../types/user_job';
import Select from '../components/ui/Select';
import Button from '../components/ui/Button';
import { Pencil } from 'lucide-react';
import Searchbar from '../components/ui/Searchbar';
import DeleteUserModal from '../modals/DeleteUserModal';
import Modal from '../modals/Modal';
import { toast } from 'sonner';

type SortBy = 'name-asc' | 'name-desc' | 'money-asc' | 'money-desc';

const JobList = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [userJobs, setUserJobs] = useState<{ [userId: string]: UserJob[] }>({});
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState<SortBy>('name-asc');
  const { id } = useParams<{ id: string }>();

  const initialLoad = useCallback(async () => {
    setLoading(true);
    try {
      const fetchedUsers = await getUserProfiles();
      setUsers(fetchedUsers || []);
      const jobsByUser: { [userId: string]: UserJob[] } = {};
      for (const user of fetchedUsers || []) {
        try {
          jobsByUser[user.id] = await getUserJobs(user.id);
        } catch {
          jobsByUser[user.id] = [];
        }
      }
      setUserJobs(jobsByUser);
    } finally {
      setLoading(false);
    }
  }, []);

  const updateData = useCallback(async () => {
    try {
      const fetchedUsers = await getUserProfiles();
      setUsers(fetchedUsers || []);
      const jobsByUser: { [userId: string]: UserJob[] } = {};
      for (const user of fetchedUsers || []) {
        try {
          jobsByUser[user.id] = await getUserJobs(user.id);
        } catch {
          jobsByUser[user.id] = [];
        }
      }
      setUserJobs(jobsByUser);
    } catch (err) {
      console.error('Error updating data:', err);
    }
  }, []);

  useEffect(() => {
    initialLoad();

    const channel = supabase
      .channel('job_list_changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'user_jobs' },
        (payload) => {
          console.log('Realtime event (user_jobs):', payload);
          updateData();
        },
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'profiles' },
        (payload) => {
          console.log('Realtime event (profiles):', payload);
          updateData();
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [initialLoad, updateData]);

  const handleEdit = (userId: string) => {
    navigate(`/edit-job/${userId}`);
  };

  const handleDeleteUser = async (userId: string) => {
    try {
      await deleteUserProfile(userId);
      setUsers((prev) => prev.filter((u) => u.id !== userId));
      setUserJobs((prev) => {
        const newJobs = { ...prev };
        delete newJobs[userId];
        return newJobs;
      });
      toast.success('Bruger slettet');
    } catch (error) {
      toast.error('Kunne ikke slette bruger');
      console.error('Error deleting user:', error);
    } finally {
      setIsOpen(false);
    }
  };

  const filteredUsers = id ? users.filter((user) => user.id === id) : users;

  const sortedUsers = [...filteredUsers].sort((a, b) => {
    if (sortBy === 'name-asc') return a.name.localeCompare(b.name);
    if (sortBy === 'name-desc') return b.name.localeCompare(a.name);
    return 0;
  });

  return (
    <div className="">
      <h1 className="mb-4">Jobliste</h1>
      <div className="flex items-center gap-x-4 mb-4">
        <Searchbar
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full md:w-1/3"
        />

        <div className="flex items-center gap-4 ml-auto">
          <label htmlFor="sortby" className="text-sm font-semibold sm:whitespace-nowrap">
            Sortér efter:
          </label>
          <Select
            options={[
              { value: 'name-asc', label: 'Navn (A-Å)' },
              { value: 'name-desc', label: 'Navn (Å-A)' },
            ]}
            value={sortBy}
            onChange={(value) => setSortBy(value as SortBy)}
            className="w-[80px] sm:w-[185px]"
          />
          <Button
            onClick={() => setIsOpen(true)}
            className="w-10 h-10 lg:w-14 lg:h-14 rounded-xl flex items-center justify-center p-0 flex-shrink-0"
            aria-label="Opret ny opgave"
          >
            <Pencil size={30} />
          </Button>
        </div>
      </div>

      <div className="flex gap-4 flex-wrap justify-center md:justify-start">
        {loading ? (
          <div className="flex justify-center w-full">
            <BarLoader />
          </div>
        ) : users.length === 0 ? (
          <div className="text-gray-400 text-center py-8 w-full">
            Ingen brugere fundet
          </div>
        ) : (
          [...sortedUsers].map((user: User) => (
            <UserJobList
              key={user.id}
              profileName={user.name}
              jobs={userJobs[user.id] || []}
              onEdit={() => handleEdit(user.id)}
            />
          ))
        )}
      </div>

      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <DeleteUserModal
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          users={users}
          onDelete={handleDeleteUser}
        />
      </Modal>
    </div>
  );
};

export default JobList;