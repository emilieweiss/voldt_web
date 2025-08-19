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

  const userOptions = users.map(user => ({
    value: user.id,
    label: user.name,
  }));

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="flex flex-col gap-6 h-[50vh] min-h-96">
        <h2 className="text-xl font-bold">Slet bruger</h2>

        <div className="flex-1 flex flex-col justify-start">
          <Label>Vælg bruger:</Label>
          <Select
            options={userOptions}
            value={selectedUserId}
            onChange={setSelectedUserId}
            placeholder="Vælg en bruger..."
          />
        </div>

        <div className="flex gap-4 justify-end">
          <Button
            type="button"
            variant="secondary"
            onClick={onClose}
          >
            Annuller
          </Button>
          <Button
            type="button"
            variant="destructive"
            disabled={!selectedUserId}
            onClick={() => {
              if (selectedUserId) {
                onDelete(selectedUserId);
                setSelectedUserId(''); // Reset selection
                onClose(); // Close modal
              }
            }}
          >
            Slet bruger
          </Button>
        </div>
      </div>
    </Modal>
  );
}
