import { useState } from 'react';
import { useAuth } from '../context/Auth';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { useNavigate } from 'react-router';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      await login(email, password);
      navigate('/'); // Redirect to home after login
    } catch (err: any) {
      setError(err.message || 'Login fejlede');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center max-w-sm">
      <h2 className="mb-4">Log ind på din profil</h2>
      <h3 className="md:w-[320px] text-center mb-4">
        Velkommen tilbage! Indtast dine log ind oplysninger her.
      </h3>
      <form onSubmit={handleSubmit} className="space-y-4 md:w-sm w-full">
        <div>
          <label className="block mb-1">Email</label>
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full"
          />
        </div>
        <div>
          <label className="block mb-1">Kodeord</label>
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
          Login
        </Button>

        <div className="border-1 border-gray-100"></div>

        <div className="flex flex-row justify-center items-center text-sm">
          <p className="text-center mr-2">Har du ikke en profil?</p>
          <p
            onClick={() => navigate('/signup')}
            className="text-[color:var(--color-wolt-blue)] cursor-pointer font-semibold"
          >
            Opret profil
          </p>
        </div>
      </form>
    </div>
  );
};

export default Login;
