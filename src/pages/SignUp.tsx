import { useState } from 'react';
import { useNavigate } from 'react-router';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import * as userApi from '../api/user';
import Label from '../components/ui/Label';
import { toast } from 'sonner';

const SignUp = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email || !password) {
      setError('Email og kodeord skal udfyldes');
      return;
    }

    try {
      await userApi.signup(email, password, name);
      navigate('/login');
      toast.success('Profil oprettet! Du kan nu logge ind.');
    } catch {
      setError('Oprettelse fejlede');
      toast.error('Kunne ikke oprette profil. Prøv igen senere.');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center max-w-sm">
      <h2 className="mb-4">Opret en ny profil</h2>
      <h3 className="text-center mb-4 md:w-[340px]">
        Velkommen til! Indtast dine oplysninger for at oprette en ny bruger.
      </h3>
      <form onSubmit={handleSubmit} className="space-y-4 md:w-sm w-full">
        <div>
          <Label className="block mb-1">Navn</Label>
          <Input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full"
          />
        </div>
        <div>
          <Label className="block mb-1">Email</Label>
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full"
          />
        </div>
        <div>
          <Label className="block mb-1">Kodeord</Label>
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full"
          />
        </div>
        {error && <div className="text-red-500 text-sm">{error}</div>}
        <Button type="submit" className="w-full mt-2 text-xl">
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
