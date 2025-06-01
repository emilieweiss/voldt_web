import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { getUserProfiles } from '../api/user';
import Select from '../components/ui/Select';
import { BarLoader } from 'react-spinners';

const EditJobListDefault = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [selectedUserId, setSelectedUserId] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

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
        <div>
          <Select
            className="border rounded px-3 py-2"
            value={selectedUserId}
            onChange={(e) => {
              setSelectedUserId(e.target.value);
              if (e.target.value) {
                navigate(`/edit-job/${e.target.value}`);
              }
            }}
          >
            <option value="">Vælg bruger</option>
            {users.map((user) => (
              <option key={user.id} value={user.id}>
                {user.name}
              </option>
            ))}
          </Select>
        </div>
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
