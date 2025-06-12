import { useState } from 'react';
import Modal from './Modal';
import Select from '../components/ui/Select';
import Label from '../components/ui/Label';
import Button from '../components/ui/Button';

interface User {
  id: string;
  name: string;
}

interface DeleteUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  users: User[];
  onDelete: (userId: string) => void;
}

export default function DeleteUserModal({
  isOpen,
  onClose,
  users,
  onDelete,
}: DeleteUserModalProps) {
  const [selectedUserId, setSelectedUserId] = useState<string>('');

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="flex flex-col gap-6">
        <h2>Slet bruger</h2>
        <Label>
          Vælg bruger:
          <Select
            value={selectedUserId}
            onChange={(e) => setSelectedUserId(e.target.value)}
          >
            <option value="" disabled>
              Vælg en bruger
            </option>
            {users.map((user) => (
              <option key={user.id} value={user.id}>
                {user.name}
              </option>
            ))}
          </Select>
        </Label>
        <div className="flex gap-4 justify-end">
          <Button
            disabled={!selectedUserId}
            onClick={() => {
              if (selectedUserId) onDelete(selectedUserId);
            }}
            className="text-xl px-4"
          >
            Slet
          </Button>
        </div>
      </div>
    </Modal>
  );
}
