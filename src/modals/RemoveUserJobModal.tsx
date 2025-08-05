import Modal from './Modal';
import Button from '../components/ui/Button';
import { Job } from '../types/job';

interface DeleteUserJobModalProps {
    isOpen: boolean;
    onClose: () => void;
    onDelete: (job: Job) => void;
    job: Job;
}

export default function DeleteUserJobModal({
    isOpen,
    onClose,
    onDelete,
    job,
}: DeleteUserJobModalProps) {

    const handleDelete = () => {
        onDelete(job);
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <div className="flex flex-col gap-6">
                <h2 className="text-xl font-semibold">Er du sikker på at du vil slette dette job?</h2>

                <div className="bg-gray-100 p-4 rounded-xl">
                    <p className="text-xl font-semibold mb-2 truncate text-gray-900">
                        {job.title}
                    </p>
                    {job.description && (
                        <p className="text-base text-gray-600 break-words whitespace-pre-line line-clamp-3 max-h-24">
                            {job.description}
                        </p>
                    )}
                </div>

                <div className="flex gap-4 justify-end">
                    <Button
                        variant="secondary"
                        onClick={onClose}
                        className="px-6"
                    >
                        Annuller
                    </Button>
                    <Button
                        variant="destructive"
                        onClick={handleDelete}
                        className="px-6"
                    >
                        Slet job
                    </Button>
                </div>
            </div>
        </Modal>
    );
}