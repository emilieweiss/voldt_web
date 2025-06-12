import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { deleteUserProfile, getUserProfiles } from '../api/user';
import { getUserJobs } from '../api/user_job';
import UserJobList from '../components/job-list-components/UserJobList';
import { BarLoader } from 'react-spinners';
import { User } from '../types/user';
import { UserJob } from '../types/user_job';
import Label from '../components/ui/Label';
import Select from '../components/ui/Select';
import Button from '../components/ui/Button';
import { Pencil, X } from 'lucide-react';
import Searchbar from '../components/ui/Searchbar';
import DeleteUserModal from '../modals/DeleteUserModal';
import Modal from '../modals/Modal';
import { toast } from 'sonner';

type SortBy = 'name-asc' | 'name-desc' | 'money-asc' | 'money-desc';

const JobList = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [userJobs, setUserJobs] = useState<{ [userId: string]: UserJob[] }>({});
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState<SortBy>('name-asc');
  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    async function fetchUsersAndJobs() {
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
      }
    }
    fetchUsersAndJobs();
  }, []);

  const handleEdit = (userId: string) => {
    navigate(`/edit-job/${userId}`);
  };

  const handleDeleteUser = async (userId: string) => {
    try {
      await deleteUserProfile(userId); // Call API to delete user in DB
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
            <option value="name-asc">Navn (A-Å)</option>
            <option value="name-desc">Navn (Å-A)</option>
          </Select>
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
        {users.length === 0 ? (
          <BarLoader />
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
