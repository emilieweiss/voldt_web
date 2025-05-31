import { useForm } from 'react-hook-form';
import Modal from './Modal';
import { createJob } from '../api/job';
import { toast } from 'sonner';
import Input from '../components/ui/Input';
import Textarea from '../components/ui/Textarea';
import Button from '../components/ui/Button';
import { Job } from '../types/job';
import { uploadJobImage } from '../api/images';
import { zodResolver } from '@hookform/resolvers/zod';
import { jobSchema } from '../validation/jobSchema';

interface CreateJobModalProps {
  isOpen: boolean;
  onClose: () => void;
  onJobCreated?: (job: Job) => void;
}

type FormData = {
  title: string;
  adress: string;
  description: string;
  duration: number;
  delivery: string;
  money: number;
  image?: FileList;
};

function CreateJobModal({
  isOpen,
  onClose,
  onJobCreated,
}: CreateJobModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(jobSchema),
    defaultValues: {
      title: '',
      adress: '',
      description: '',
      duration: 0,
      delivery: '',
      money: 0,
      image: undefined,
    },
  });

  const onSubmit = async (data: FormData) => {
    try {
      let imageUrl = null;
      const file = data.image?.[0];
      console.log('Selected file:', file);
      if (file) {
        imageUrl = await uploadJobImage(file, Date.now().toString());
        console.log('Image uploaded, URL:', imageUrl);
      }
      const job = await createJob({
        ...data,
        money: Number(data.money),
        image_url: imageUrl,
      });
      reset();
      onClose();
      if (onJobCreated) {
        onJobCreated(job);
      }
    } catch (err) {
      toast.error('Kunne ikke oprette job');
      console.error('Fejl ved oprettelse af job:', err);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <h2 className="text-2xl font-bold mb-6">Opret ny opgave</h2>
      <form
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
        onSubmit={handleSubmit(onSubmit)}
      >
        {/* Title - full width */}
        <div className="flex flex-col col-span-1 md:col-span-2">
          <label className="block mb-2">Title</label>
          <Input
            type="text"
            placeholder="Test Test"
            className="w-full border rounded px-4 py-2"
            {...register('title', { required: true })}
          />
          {errors.title && (
            <span className="text-red-500">
              {errors.title.message as string}
            </span>
          )}
        </div>
        {/* Beskrivelse - full width */}
        <div className="flex flex-col col-span-1 md:col-span-2">
          <label className="block mb-2">Beskrivelse</label>
          <Textarea
            placeholder="Lorem Ipsum"
            className="w-full border rounded px-4 py-2"
            {...register('description', { required: true })}
          ></Textarea>
          {errors.description && (
            <span className="text-red-500">
              {errors.description.message as string}
            </span>
          )}
        </div>
        {/* Adresse */}
        <div className="flex flex-col">
          <label className="block mb-2">Adresse</label>
          <Input
            type="text"
            placeholder="Jegerenadresse 23"
            className="w-full border rounded px-4 py-2"
            {...register('adress', { required: true })}
          />
          {errors.adress && (
            <span className="text-red-500">
              {errors.adress.message as string}
            </span>
          )}
        </div>
        {/* Tidsestimat */}
        <div className="flex flex-col">
          <label className="block mb-2">Varighed (min)</label>
          <Input
            type="number"
            placeholder="35"
            className="w-full border rounded px-4 py-2"
            {...register('duration', { valueAsNumber: true })}
          />
          {errors.duration && (
            <span className="text-red-500">
              {errors.duration.message as string}
            </span>
          )}
        </div>
        {/* Afleveringstidspunkt */}
        <div className="flex flex-col">
          <label className="block mb-2">Afleveringstidspunkt</label>
          <Input
            type="time"
            placeholder="10.45"
            className="w-full border rounded px-4 py-2"
            {...register('delivery', { required: true })}
          />
          {errors.delivery && (
            <span className="text-red-500">
              {errors.delivery.message as string}
            </span>
          )}
        </div>
        {/* Økonomi */}
        <div className="flex flex-col">
          <label className="block mb-2">Økonomi</label>
          <Input
            type="number"
            placeholder="150"
            className="w-full border rounded px-4 py-2"
            {...register('money', { valueAsNumber: true })}
          />
          {errors.money && (
            <span className="text-red-500">
              {errors.money.message as string}
            </span>
          )}
        </div>
        {/* Billede */}
        <div className="flex flex-col col-span-1 md:col-span-2">
          <label className="block mb-2">Billede</label>
          <input
            type="file"
            accept="image/*"
            className="w-full border rounded px-4 py-2"
            {...register('image')}
          />
        </div>
        {/* Submit button - full width */}
        <div className="col-span-1 md:col-span-2 flex gap-6 justify-center w-full">
          <Button
            variant="secondary"
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="w-full"
          >
            Annuller
          </Button>
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? 'Opretter...' : 'Opret opgave'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}

export default CreateJobModal;
