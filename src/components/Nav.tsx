import { Link, useLocation, useNavigate } from 'react-router';
import Button from './ui/Button';
import { useAuth } from '../context/Auth';

function Navbar() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { isLoggedIn, logout } = useAuth();

  const linkClass = (path: string) => {
    if (path === '/') {
      return `font-semibold ${
        pathname === '/' ? 'text-[color:var(--color-wolt-blue)]' : 'text-black'
      }`;
    }
    return `font-semibold ${
      pathname.startsWith(path)
        ? 'text-[color:var(--color-wolt-blue)]'
        : 'text-black'
    }`;
  };

  return (
    <nav className="flex items-center justify-between px-6 py-4 border-b border-gray-100 lg:px-30">
      <div className="text-4xl font-bold text-(--color-wolt-blue)">voldt</div>
      {isLoggedIn ? (
        <>
          <div className="flex space-x-8 text-sm">
            <Link to="/" className={linkClass('/')}>
              Hjem
            </Link>
            <Link to="/create-job" className={linkClass('/create-job')}>
              Opret job
            </Link>
            <Link to="/job-list" className={linkClass('/job-list')}>
              Jobliste
            </Link>
            <Link to={`/edit-job/`} className={linkClass('/edit-job/')}>
              Rediger jobliste
            </Link>
            <Link to={`/approve`} className={linkClass('/approve')}>
              Godkend job
            </Link>
          </div>
          <Button className="w-25" onClick={logout}>
            Log ud
          </Button>
        </>
      ) : (
        <div className="flex items-center space-x-4 ml-auto">
          <Link to="/login" className="text-sm font-semibold">
            Login
          </Link>
          <Button className="" onClick={() => navigate('/signup')}>
            Opret profil
          </Button>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
