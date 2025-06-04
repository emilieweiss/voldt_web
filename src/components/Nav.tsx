import { Link, useLocation, useNavigate } from 'react-router';
import Button from './ui/Button';
import { useAuth } from '../context/Auth';
import { Menu } from 'lucide-react';
import { useState } from 'react';

function Navbar() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { isLoggedIn, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  const linkClass = (path: string) => {
    if (path === '/') {
      return `font-semibold ${pathname === '/' ? 'text-[color:var(--color-wolt-blue)]' : 'text-black'}`;
    }
    return `font-semibold ${pathname.startsWith(path) ? 'text-[color:var(--color-wolt-blue)]' : 'text-black'}`;
  };

  return (
    <nav className="flex items-center justify-between px-6 py-4 border-b border-gray-100 lg:px-30 relative">
      <div className="text-4xl font-bold text-(--color-wolt-blue)">voldt</div>
      {/* Burger menu button - only visible on lg and smaller */}
      <button
        className="lg:hidden flex items-center justify-center"
        onClick={() => setMenuOpen((open) => !open)}
        aria-label="Åben menu"
        type="button"
      >
        <Menu className="w-8 h-8 text-(--color-wolt-blue)" />
      </button>
      {/* Desktop menu - only visible on lg and up */}
      {isLoggedIn ? (
        <>
          <div className="hidden lg:flex items-center space-x-8 text-sm">
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
            <Button className="w-25" onClick={logout}>
              Log ud
            </Button>
          </div>
        </>
      ) : (
        <div className="hidden lg:flex items-center space-x-4 ml-auto">
          <Link to="/login" className="text-sm font-semibold">
            Login
          </Link>
          <Button className="" onClick={() => navigate('/signup')}>
            Opret profil
          </Button>
        </div>
      )}
      {/* Mobile menu - only visible on lg and smaller, when open */}
      {menuOpen && (
        <div className="lg:hidden absolute top-full left-0 w-full bg-white flex flex-col items-center space-y-4 py-4 border-b-1 border-(--border) z-50">
          {isLoggedIn ? (
            <>
              <Link to="/" className={linkClass('/')} onClick={() => setMenuOpen(false)}>
                Hjem
              </Link>
              <Link to="/create-job" className={linkClass('/create-job')} onClick={() => setMenuOpen(false)}>
                Opret job
              </Link>
              <Link to="/job-list" className={linkClass('/job-list')} onClick={() => setMenuOpen(false)}>
                Jobliste
              </Link>
              <Link to={`/edit-job/`} className={linkClass('/edit-job/')} onClick={() => setMenuOpen(false)}>
                Rediger jobliste
              </Link>
              <Link to={`/approve`} className={linkClass('/approve')} onClick={() => setMenuOpen(false)}>
                Godkend job
              </Link>
              <Button className="w-25" onClick={() => { setMenuOpen(false); logout(); }}>
                Log ud
              </Button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-sm font-semibold" onClick={() => setMenuOpen(false)}>
                Login
              </Link>
              <Button className="" onClick={() => { setMenuOpen(false); navigate('/signup'); }}>
                Opret profil
              </Button>
            </>
          )}
        </div>
      )}
    </nav>
  );
}

export default Navbar;