import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { getUserProfiles } from '../api/user';
import { User } from '../types/user';
import CustomSearchableSelect from '../components/ui/CustomSearchableSelect';

const EditJobListDefault = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const userOptions = users.map((u) => ({
    label: u.name,
    value: u.id,
  }));

  useEffect(() => {
    async function fetchUsers() {
      setLoading(true);
      const users = await getUserProfiles();
      setUsers(users || []);
      setLoading(false);
    }
    fetchUsers();
  }, []);

  return (
    <div className="">
      <h1 className="mb-6">Vælg bruger for at redigere jobliste</h1>
      {loading ? (
        <p></p>
      ) : (
        <CustomSearchableSelect
          options={userOptions}
          placeholder="Vælg bruger"
          onChange={(userId) => {
            if (userId) navigate(`/edit-job/${userId}`);
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
