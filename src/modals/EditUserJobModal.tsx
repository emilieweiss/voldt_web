import { useEffect, useState } from 'react';
import Button from '../components/ui/Button';
import Modal from './Modal';
import { Job } from '../types/job';
import Input from '../components/ui/Input';
import Label from '../components/ui/Label';

export default function EditUserJobModal({
  job,
  isOpen,
  onClose,
  onSave,
}: {
  job: Job | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updated: Partial<Job>) => void;
}) {
  const [adress, setAdress] = useState('');
  const [duration, setDuration] = useState(0);
  const [delivery, setDelivery] = useState('');
  const [money, setMoney] = useState(0);

  useEffect(() => {
    if (job) {
      setAdress(job.adress);
      setDuration(job.duration);
      setDelivery(job.delivery);
      setMoney(job.money);
    }
  }, [job]);

  if (!job) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <h1>Rediger opgave før tildeling</h1>
      <div className="border border-gray-100 my-2"></div>
      <form
        className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-0 h-[50vh] md:mt-4 overflow-y-auto"
        onSubmit={(e) => {
          e.preventDefault();
          onSave({
            id: job.id,
            adress,
            duration,
            delivery,
            money,
          });
        }}
      >
        {/* Venstre kolonne */}
        <div className="flex flex-col gap-6 col-span-1 md:pr-6">
          {/* Titel (fast tekst) */}
          <div>
            <Label>Titel</Label>
            <p className="w-full break-words whitespace-pre-line line-clamp-3 max-h-24">
              {job.title}
            </p>
          </div>
          {/* Beskrivelse (fast tekst) */}
          <div>
            <Label>Beskrivelse</Label>
            <p className="w-full break-words whitespace-pre-line line-clamp-10">
              {job.description}
            </p>
          </div>
        </div>
        {/* Højre kolonne */}
        <div className="flex flex-col gap-6 col-span-1 md:border-l md:pl-6 border-gray-100">
          {/* Adresse (redigerbar) */}
          <div>
            <Label>Adresse</Label>
            <Input
              type="text"
              className="w-full border rounded px-4 py-2"
              value={adress}
              onChange={(e) => setAdress(e.target.value)}
            />
          </div>
          {/* Varighed (redigerbar) */}
          <div>
            <Label>Varighed</Label>
            <Input
              type="number"
              className="w-full border rounded px-4 py-2"
              value={duration}
              onChange={(e) => setDuration(Number(e.target.value))}
            />
          </div>
          {/* Leveringstidspunkt (redigerbar) */}
          <div>
            <Label>Afleveringstidspunkt</Label>
            <Input
              type="time"
              className="w-full border rounded px-4 py-2"
              value={delivery}
              onChange={(e) => setDelivery(e.target.value)}
            />
          </div>
          {/* Økonomi (redigerbar) */}
          <div>
            <Label>Økonomi</Label>
            <Input
              type="number"
              className="w-full border rounded px-4 py-2"
              value={money}
              onChange={(e) => setMoney(Number(e.target.value))}
            />
          </div>
        </div>
        {/* Knapper */}
        <div className="col-span-1 md:col-span-2 flex gap-6 justify-end items-end w-full">
          <Button
            className="md:w-1/5 h-12"
            type="button"
            variant="secondary"
            onClick={onClose}
          >
            Luk
          </Button>
          <Button type="submit" className="w-full md:w-1/4 text-lg h-12">
            Gem og tildel til bruger
          </Button>
        </div>
      </form>
    </Modal>
  );
}
