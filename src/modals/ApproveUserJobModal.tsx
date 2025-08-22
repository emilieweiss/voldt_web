import { useEffect, useState } from 'react';
import Modal from './Modal';
import Button from '../components/ui/Button';
import { BarLoader } from 'react-spinners';
import { X } from 'lucide-react';

export default function ApproveUserJobModal({
  isOpen,
  onClose,
  onApprove,
  imageSolvedUrl,
  money,
}: {
  isOpen: boolean;
  onClose: () => void;
  onApprove: (rating: 'godt' | 'fint' | 'skidt' | 'fejlet') => void;
  imageSolvedUrl?: string | null;
  money: number;
}) {
  const [rating, setRating] = useState<
    'godt' | 'fint' | 'skidt' | 'fejlet' | null
  >('godt');
  const [imageLoading, setImageLoading] = useState(true);
  const [isImageZoomed, setIsImageZoomed] = useState(false);

  const payouts = {
    godt: money,
    fint: Math.round(money * 0.667),
    skidt: Math.round(money * 0.33),
    fejlet: 0,
  };

  const handleImageLoad = () => {
    setImageLoading(false);
  };

  const handleImageError = () => {
    setImageLoading(false);
  };

  useEffect(() => {
    if (isOpen && imageSolvedUrl) {
      setImageLoading(true);
    }
  }, [isOpen, imageSolvedUrl]);

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose}>
        <div className="flex flex-col gap-6">
          <h2 className="text-xl font-bold">Godkend løsning</h2>

          {/* Image section with loading state */}
          <div className="relative">
            {imageSolvedUrl ? (
              <>
                {imageLoading && (
                  <div className="flex justify-center py-8">
                    <BarLoader />
                  </div>
                )}
                <img
                  src={imageSolvedUrl}
                  alt="Løsning"
                  className={`rounded-lg max-h-[56vh] object-contain mx-auto cursor-pointer hover:opacity-90 transition-opacity ${
                    imageLoading ? 'hidden' : 'block'
                  }`}
                  onLoad={handleImageLoad}
                  onError={handleImageError}
                  onClick={() => setIsImageZoomed(true)}
                  title="Klik for at zoome"
                />
              </>
            ) : (
              <p className="text-red-500 text-center">
                Fejl i hentning af billede
              </p>
            )}
          </div>

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

      {/* Zoom overlay */}
      {isImageZoomed && (
        <div
          className="fixed inset-0 bg-black/80 bg-opacity-90 z-50 flex items-center justify-center p-4"
          onClick={() => setIsImageZoomed(false)}
        >
          <div className="relative">
            <button
              onClick={() => setIsImageZoomed(false)}
              className="absolute top-2 right-2 text-white text-2xl font-bold hover:text-gray-300"
            >
              <X />
            </button>
            <img
              src={imageSolvedUrl ?? undefined}
              alt="Løsning (zoomed)"
              className="max-w-[100vw] max-h-[100vh] object-contain"
            />
          </div>
        </div>
      )}
    </>
  );
}
