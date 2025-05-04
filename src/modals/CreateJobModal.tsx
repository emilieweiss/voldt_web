import React from "react";

interface CreateJobModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CreateJobModal: React.FC<CreateJobModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg w-3/4 max-w-4xl p-8 relative">
        <button
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
          onClick={onClose}
        >
          ✕
        </button>
        <h2 className="text-2xl font-bold mb-6">Opret ny opgave</h2>
        <form className="grid grid-cols-2 gap-6">
          <div>
            <label className="block mb-2">Title</label>
            <input
              type="text"
              placeholder="Test Test"
              className="w-full border rounded px-4 py-2"
            />
          </div>
          <div>
            <label className="block mb-2">Adresse</label>
            <input
              type="text"
              placeholder="Jegerenadresse 23"
              className="w-full border rounded px-4 py-2"
            />
          </div>
          <div>
            <label className="block mb-2">Beskrivelse</label>
            <textarea
              placeholder="Lorem Ipsum"
              className="w-full border rounded px-4 py-2"
            ></textarea>
          </div>
          <div>
            <label className="block mb-2">Tidsestimat</label>
            <input
              type="text"
              placeholder="35 min"
              className="w-full border rounded px-4 py-2"
            />
          </div>
          <div>
            <label className="block mb-2">Afleveringstidspunkt</label>
            <input
              type="text"
              placeholder="10.45"
              className="w-full border rounded px-4 py-2"
            />
          </div>
          <div>
            <label className="block mb-2">Økonomi</label>
            <input
              type="text"
              placeholder="150"
              className="w-full border rounded px-4 py-2"
            />
          </div>
          <div className="col-span-2 flex flex-col items-center">
            <button className="bg-blue-500 text-white rounded-full w-12 h-12 flex items-center justify-center mb-4">
              +
            </button>
            <span>Upload billede</span>
          </div>
          <div className="col-span-2">
            <ul>
              <li className="flex items-center">
                DetteErEtBilledeTrustMe.JPEG
                <span className="ml-auto text-green-500">✔</span>
              </li>
              <li className="flex items-center">
                DetteErEtBilledeTrustMe.JPEG
                <span className="ml-auto text-green-500">✔</span>
              </li>
              <li className="flex items-center">
                DetteErEtBilledeTrustMe.JPEG
                <span className="ml-auto text-green-500">✔</span>
              </li>
            </ul>
          </div>
          <div className="col-span-2 flex justify-end">
            <button className="bg-blue-500 text-white py-2 px-6 rounded">
              Opret opgave
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateJobModal;