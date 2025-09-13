import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { getUserProfiles } from '../api/user';
import { User } from '../types/user';
import CustomSearchableSelect from '../components/ui/CustomSearchableSelect';
import BarLoader from 'react-spinners/BarLoader';

const EditJobListDefault = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const userOptions = users
    .sort((a, b) => a.name.localeCompare(b.name))
    .map((u) => ({
      label: u.name,
      value: u.id,
    }));

  useEffect(() => {
    async function fetchUsers() {
      setLoading(true);
      try {
        const users = await getUserProfiles();
        setUsers(users || []);
      } catch (error) {
        console.error('Error fetching users:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchUsers();
  }, []);

  return (
    <div className="">
      <h1 className="mb-6">Vælg bruger for at redigere jobliste</h1>
      {loading ? (
        <div className="flex flex-col items-center justify-center min-h-[400px]">
          <BarLoader color="#009DF4" />
          <p className="mt-4 text-gray-600">Indlæser brugere...</p>
        </div>
      ) : (
        <CustomSearchableSelect
          options={userOptions}
          placeholder="Vælg bruger"
          onChange={(userId) => {
            if (userId) {
              navigate(`/edit-job/${userId}`);
            }
          }}
        />
      )}
      {users.length === 0 && !loading && (
        <div className="mt-4 text-gray-500">
          Ingen brugere fundet. Opret en bruger for at redigere joblisten.
        </div>
      )}
    </div>
  );
};

export default EditJobListDefault;
