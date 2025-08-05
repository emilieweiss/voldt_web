import { useState } from 'react';
import Modal from './Modal';
import Button from '../components/ui/Button';
import { BarLoader } from 'react-spinners';

export default function ApproveUserJobModal({
  isOpen,
  onClose,
  onApprove,
  imageSolvedUrl,
  money,
  loading,
}: {
  isOpen: boolean;
  onClose: () => void;
  onApprove: (rating: 'godt' | 'fint' | 'skidt' | 'fejlet') => void;
  imageSolvedUrl?: string | null;
  money: number;
  loading: boolean;
}) {
  const [rating, setRating] = useState<
    'godt' | 'fint' | 'skidt' | 'fejlet' | null
  >('godt');
  const payouts = {
    godt: money,
    fint: Math.round(money * 0.667),
    skidt: Math.round(money * 0.33),
    fejlet: 0,
  };
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="flex flex-col gap-6">
        <h2 className="text-xl font-bold">Godkend løsning</h2>
        {loading ? (
          <div className="flex justify-center">
            <BarLoader />
          </div>
        ) : imageSolvedUrl ? (
          <img
            src={imageSolvedUrl}
            alt="Løsning"
            className="rounded-lg max-h-64 object-contain mx-auto"
          />
        ) : (
          <p className="text-red-500 text-center">Fejl i hentning af billede</p>
        )}

        <div className="flex flex-col items-center">
          <div className="font-semibold mb-4">Vurdér løsning:</div>
          <div className="flex gap-4">
            {(['fejlet', 'skidt', 'fint', 'godt'] as const).map((type) => (
              <div key={type} className="flex flex-col items-center">
                <Button
                  type="button"
                  variant={rating === type ? 'default' : 'secondary'}
                  onClick={() => setRating(type)}
                >
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </Button>
                <span className="text-xs text-gray-500 mt-1">
                  {type === 'fejlet' ? '0 kr.' : `${payouts[type]} kr.`}
                </span>
              </div>
            ))}
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
