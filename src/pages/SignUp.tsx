import { useNavigate } from 'react-router';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Label from '../components/ui/Label';
import { toast } from 'sonner';
import * as userApi from '../api/user';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { signUpSchema, SignUpSchema } from '../validation/signUpSchema';

const SignUp = () => {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignUpSchema>({
    resolver: zodResolver(signUpSchema),
  });

  const onSubmit = async (data: SignUpSchema) => {
    try {
      await userApi.signup(data.email, data.password, data.name);
      navigate('/login');
      toast.success('Profil oprettet! Du kan nu logge ind.');
    } catch {
      toast.error('Kunne ikke oprette profil. Prøv igen senere.');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center max-w-sm">
      <h2 className="mb-4">Opret en ny profil</h2>
      <h3 className="text-center mb-4 md:w-[340px]">
        Velkommen til! Indtast dine oplysninger for at oprette en ny bruger.
      </h3>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-4 md:w-sm w-full"
      >
        <div>
          <Label className="block mb-1">Navn</Label>
          <Input
            type="text"
            {...register('name')}
            required
            className="w-full"
          />
          {errors.name && (
            <div className="text-red-500 text-sm">{errors.name.message}</div>
          )}
        </div>
        <div>
          <Label className="block mb-1">Email</Label>
          <Input
            type="email"
            {...register('email')}
            required
            className="w-full"
          />
          {errors.email && (
            <div className="text-red-500 text-sm">{errors.email.message}</div>
          )}
        </div>
        <div>
          <Label className="block mb-1">Kodeord</Label>
          <Input
            type="password"
            {...register('password')}
            required
            className="w-full"
          />
          {errors.password && (
            <div className="text-red-500 text-sm">
              {errors.password.message}
            </div>
          )}
        </div>
        <div>
          <Label className="block mb-1">Hemmelig kode</Label>
          <Input
            type="password"
            {...register('secret')}
            required
            className="w-full"
            placeholder="Indtast hemmelig kode"
          />
          {errors.secret && (
            <div className="text-red-500 text-sm">{errors.secret.message}</div>
          )}
        </div>
        <Button
          type="submit"
          className="w-full mt-2 text-xl"
          disabled={isSubmitting}
        >
          Opret profil
        </Button>

        <div className="border-1 border-gray-100"></div>

        <div className="flex flex-row justify-center items-center text-sm">
          <p className="text-center mr-2">Har du allerede en profil?</p>
          <p
            onClick={() => navigate('/login')}
            className="text-[color:var(--color-wolt-blue)] cursor-pointer font-semibold"
          >
            Log ind
          </p>
        </div>
      </form>
    </div>
  );
};

export default SignUp;
