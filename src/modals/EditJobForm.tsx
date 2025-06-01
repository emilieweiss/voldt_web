import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Job } from '../types/job';
import { updateJob, deleteJob } from '../api/job';
import Input from '../components/ui/Input';
import Textarea from '../components/ui/Textarea';
import Button from '../components/ui/Button';
import { uploadJobImage } from '../api/images';
import Label from '../components/ui/Label';
import { toast } from 'sonner';

interface EditJobFormProps {
  job: Job;
  onClose: () => void;
  onDelete: () => void;
  updateSingleJob: (id: string) => void;
}

function EditJobForm({
  job,
  onClose,
  updateSingleJob,
  onDelete,
}: EditJobFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      title: job.title,
      description: job.description,
      adress: job.adress,
      duration: job.duration,
      delivery: job.delivery,
      money: job.money,
    },
  });
  const [file, setFile] = useState<File | null>(null);

  const onSubmit = async (data: Job) => {
    try {
      let imageUrl = job.image_url;
      if (file && job.id) {
        imageUrl = await uploadJobImage(file, job.id);
      }
      await updateJob(job.id!, {
        ...data,
        money: Number(data.money),
        image_url: imageUrl,
      });
      updateSingleJob(job.id!);
      toast.success('Job opdateret');
      onClose();
    } catch (err) {
      if (err instanceof Error) {
        console.error('Fejl ved opdatering af job:', err);
        toast.error('Kunne ikke opdatere job: ' + err.message);
      } else {
        console.error('Fejl ved opdatering af job:', err);
        toast.error('Kunne ikke opdatere job');
      }
    }
  };

  const handleDelete = async () => {
    try {
      await deleteJob(job.id!);
      toast.success('Job slettet');
      onDelete(); // This should remove the job from the parent list
      onClose();
    } catch (err) {
      console.error('Fejl ved sletning af job:', err);
      toast.error('Kunne ikke slette job');
    }
  };

  return (
    <div className="w-full">
      <h2>Rediger opgave</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Label className="block mb-2">Titel</Label>
        <Input
          className="w-full mb-4"
          {...register('title', { required: true })}
        />
        {errors.title && <span className="text-red-500">Påkrævet</span>}

        <Label className="block mb-2">Beskrivelse</Label>
        <Textarea
          className="w-full mb-4"
          {...register('description', { required: true })}
        />
        {errors.description && <span className="text-red-500">Påkrævet</span>}

        <Label className="block mb-2">Adresse</Label>
        <Input
          className="w-full mb-4"
          {...register('adress', { required: true })}
        />
        {errors.adress && <span className="text-red-500">Påkrævet</span>}

        <Label className="block mb-2">Varighed (min)</Label>
        <Input
          className="w-full mb-4"
          {...register('duration', { required: true })}
        />
        {errors.duration && <span className="text-red-500">Påkrævet</span>}

        <Label className="block mb-2">Afleveringstidspunkt</Label>
        <Input
          type="time"
          className="w-full mb-4"
          {...register('delivery', { required: true })}
        />
        {errors.delivery && <span className="text-red-500">Påkrævet</span>}

        <Label className="block mb-2">Økonomi (kr)</Label>
        <Input
          type="number"
          className="w-full mb-4"
          {...register('money', { required: true })}
        />
        {errors.money && <span className="text-red-500">Påkrævet</span>}
        <Label className="block mb-2">Billede</Label>
        <Input
          type="file"
          accept="image/*"
          className="w-full mb-4"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
        />
        <div className="flex justify-between gap-2">
          <Button
            variant="destructive"
            type="button"
            onClick={async (e) => {
              e.preventDefault();
              await handleDelete();
            }}
          >
            Slet job
          </Button>
          <div className="w-1/2 flex flex-row gap-2">
            <Button
              variant="secondary"
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="w-full"
            >
              Annuller
            </Button>
            <Button
              variant="default"
              type="submit"
              disabled={isSubmitting}
              className="w-full"
            >
              {isSubmitting ? 'Gemmer...' : 'Gem'}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default EditJobForm;
