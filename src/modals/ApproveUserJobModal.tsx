import { useState } from 'react';
import Button from '../components/ui/Button';
import Modal from './Modal';
import { BounceLoader } from 'react-spinners';

interface ApproveUserJobModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApprove: () => void;
  onReject: () => void;
  imageSolvedUrl?: string;
}

function ApproveUserJobModal({
  isOpen,
  onClose,
  onApprove,
  onReject,
  imageSolvedUrl,
}: ApproveUserJobModalProps) {
  const [imageLoading, setImageLoading] = useState(true);

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="flex flex-col items-center">
        <h2 className="text-lg font-semibold text-center">Godkend job</h2>
        <p className="mb-4">Er du sikker på, at du vil godkende dette job?</p>
        {imageSolvedUrl && (
          <div className="relative flex flex-col items-center min-h-32 min-w-32">
            {imageLoading ? (
              <div className="flex items-center justify-center w-full h-full min-h-32 min-w-32">
                <BounceLoader size={48} color="#4A90E2" />
              </div>
            ) : (
              <img
                src={imageSolvedUrl}
                alt="Billede af løst job"
                className="max-h-[60vh] object-contain"
                onLoad={() => setImageLoading(false)}
                onError={() => setImageLoading(false)}
              />
            )}
            {/* Preload image to trigger onLoad/onError */}
            <img
              src={imageSolvedUrl}
              alt=""
              style={{ display: 'none' }}
              onLoad={() => setImageLoading(false)}
              onError={() => setImageLoading(false)}
            />
          </div>
        )}
        <div className="flex gap-4 mt-4 w-1/2">
          <Button
            variant="destructive"
            onClick={onReject}
            className="w-full md:text-xl"
          >
            Afvis
          </Button>
          <Button className="w-full md:text-xl" onClick={onApprove}>
            Godkend
          </Button>
        </div>
      </div>
    </Modal>
  );
}

export default ApproveUserJobModal;
