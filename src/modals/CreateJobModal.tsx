import { useForm } from 'react-hook-form';
import Modal from './Modal';
import { createJob, updateJob } from '../api/job';
import { toast } from 'sonner';
import Input from '../components/ui/Input';
import Textarea from '../components/ui/Textarea';
import Button from '../components/ui/Button';
import { Job } from '../types/job';
import { uploadJobImage } from '../api/images';
import { zodResolver } from '@hookform/resolvers/zod';
import { jobSchema } from '../validation/jobSchema';
import { useState } from 'react';
import { Plus, Check } from 'lucide-react';
import Label from '../components/ui/Label';

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
  });

  const [file, setFile] = useState<File | null>(null);

  const onSubmit = async (data: FormData) => {
    try {
      // 1. Create the job without image_url
      const job = await createJob({
        ...data,
        money: Number(data.money),
        image_url: null,
      });

      // 2. Upload the image if selected
      let imageUrl = null;
      if (file && job.id) {
        imageUrl = await uploadJobImage(file, job.id);
        await updateJob(job.id, { image_url: imageUrl });
      }

      reset();
      setFile(null); // clear file input
      onClose();
      if (onJobCreated) {
        const updatedJob = imageUrl ? { ...job, image_url: imageUrl } : job;
        onJobCreated(updatedJob);
      }
    } catch (err) {
      toast.error('Kunne ikke oprette job');
      console.error('Fejl ved oprettelse af job:', err);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <h1 className="text-2xl font-bold">Opret ny opgave</h1>
      <div className="border border-gray-100 my-2"></div>
      <form
        className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-0 h-[50vh] md:mt-4 overflow-y-auto"
        onSubmit={handleSubmit(onSubmit)}
      >
        {/* Left column */}
        <div className="flex flex-col gap-6 col-span-1 md:pr-6">
          {/* Titel */}
          <div>
            <Label className="block mb-2">Title</Label>
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
          {/* Beskrivelse */}
          <div>
            <Label className="block mb-2">Beskrivelse</Label>
            <Textarea
              placeholder="Lorem Ipsum"
              className="w-full border rounded px-4 py-2"
              {...register('description', { required: true })}
            />
            {errors.description && (
              <span className="text-red-500">
                {errors.description.message as string}
              </span>
            )}
          </div>
          {/* Billede */}
          <div className="flex flex-col items-center">
            <input
              id="file-upload"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
            />
            <Label
              htmlFor="file-upload"
              className="cursor-pointer flex flex-col items-center"
            >
              <span className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-(--color-wolt-blue) hover:bg-(--color-wolt-medium-blue) transition-colors">
                <Plus size={38} strokeWidth={6} className="text-white" />
              </span>
              <span className="mt-2 text-sm font-medium">Upload billede</span>
            </Label>
            {file && (
              <div className="flex items-center mt-2 w-full">
                <span className="text-sm text-gray-700 truncate">
                  {file.name}
                </span>
                <span className="ml-auto flex items-center">
                  <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-green-500">
                    <Check size={16} className="text-white" />
                  </span>
                </span>
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-6 col-span-1 md:border-l md:pl-6 border-gray-100">
          {/* Adresse */}
          <div>
            <Label className="block mb-2">Adresse</Label>
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
          {/* Varighed */}
          <div>
            <Label className="block mb-2">Varighed</Label>
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
          <div>
            <Label className="block mb-2">Afleveringstidspunkt</Label>
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
          <div>
            <Label className="block mb-2">Økonomi</Label>
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
        </div>

        {/* Submit button - full width */}
        <div className="col-span-1 md:col-span-2 flex gap-6 justify-end w-full">
          <Button
            type="submit"
            className="w-full md:w-1/4 text-lg"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Opretter...' : 'Opret opgave'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}

export default CreateJobModal;
