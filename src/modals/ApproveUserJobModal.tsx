import { useState } from 'react';
import Modal from './Modal';
import Button from '../components/ui/Button';

export default function ApproveUserJobModal({
  isOpen,
  onClose,
  onApprove,
  imageSolvedUrl,
}: {
  isOpen: boolean;
  onClose: () => void;
  onApprove: (rating: 'godt' | 'fint' | 'skidt' | 'fejlet') => void;
  imageSolvedUrl?: string | null;
}) {
  const [rating, setRating] = useState<
    'godt' | 'fint' | 'skidt' | 'fejlet' | null
  >('godt');

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="flex flex-col gap-6">
        <h2 className="text-xl font-bold">Godkend løsning</h2>
        {imageSolvedUrl ? (
          <img
            src={imageSolvedUrl}
            alt="Løsning"
            className="rounded-lg max-h-64 object-contain mx-auto"
          />
        ) : (
          <p className="text-red-500 text-center">Fejl i hentning af billede</p>
        )}

        <div className="flex flex-col items-center">
          <div className="font-semibold mb-2">Vurdér løsning:</div>
          <div className="flex gap-4 mb-4">
            <Button
              type="button"
              variant={rating === 'godt' ? 'default' : 'secondary'}
              onClick={() => setRating('godt')}
            >
              Godt
            </Button>
            <Button
              type="button"
              variant={rating === 'fint' ? 'default' : 'secondary'}
              onClick={() => setRating('fint')}
            >
              Fint
            </Button>
            <Button
              type="button"
              variant={rating === 'skidt' ? 'default' : 'secondary'}
              onClick={() => setRating('skidt')}
            >
              Skidt
            </Button>
            <Button
              type="button"
              variant={rating === 'fejlet' ? 'default' : 'secondary'}
              onClick={() => setRating('fejlet')}
            >
              Fejlet
            </Button>
          </div>
        </div>

        <div className="flex gap-4 justify-end">
          <Button
            type="button"
            variant="default"
            disabled={!rating}
            onClick={() => {
              if (rating) onApprove(rating);
            }}
          >
            Bekræft godkendelse
          </Button>
        </div>
      </div>
    </Modal>
  );
}
