import { useForm } from 'react-hook-form';
import { Job } from '../types/job';
import { updateJob } from '../api/job';
import Input from '../components/ui/Input';
import Textarea from '../components/ui/Textarea';
import Button from '../components/ui/Button';

interface EditJobFormProps {
  job: Job;
  onClose: () => void;
  updateSingleJob: (id: string) => void;
}

function EditJobForm({ job, onClose, updateSingleJob }: EditJobFormProps) {
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

  const onSubmit = async (data: any) => {
    try {
      await updateJob(job.id!, { ...data, money: Number(data.money) });
      updateSingleJob(job.id!);
      onClose();
    } catch (err: any) {
      console.error('Fejl ved opdatering af job:', err);
    }
  };

  return (
    <div className="w-full">
      <h2>Rediger opgave</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <label className="block mb-2">Titel</label>
        <Input
          className="w-full mb-4"
          {...register('title', { required: true })}
        />
        {errors.title && <span className="text-red-500">Påkrævet</span>}

        <label className="block mb-2">Beskrivelse</label>
        <Textarea
          className="w-full mb-4"
          {...register('description', { required: true })}
        />
        {errors.description && <span className="text-red-500">Påkrævet</span>}

        <label className="block mb-2">Adresse</label>
        <Input
          className="w-full mb-4"
          {...register('adress', { required: true })}
        />
        {errors.adress && <span className="text-red-500">Påkrævet</span>}

        <label className="block mb-2">Varighed (min)</label>
        <Input
          className="w-full mb-4"
          {...register('duration', { required: true })}
        />
        {errors.duration && <span className="text-red-500">Påkrævet</span>}

        <label className="block mb-2">Afleveringstidspunkt</label>
        <Input
          type="time"
          className="w-full mb-4"
          {...register('delivery', { required: true })}
        />
        {errors.delivery && <span className="text-red-500">Påkrævet</span>}

        <label className="block mb-2">Økonomi (kr)</label>
        <Input
          type="number"
          className="w-full mb-4"
          {...register('money', { required: true })}
        />
        {errors.money && <span className="text-red-500">Påkrævet</span>}

        <div className="flex justify-end gap-2">
          <Button
            variant="secondary"
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
          >
            Annuller
          </Button>
          <Button variant="default" type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Gemmer...' : 'Gem'}
          </Button>
        </div>
      </form>
    </div>
  );
}

export default EditJobForm;
