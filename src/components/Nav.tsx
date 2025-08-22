import { Link, useLocation, useNavigate } from 'react-router';
import Button from './ui/Button';
import { useAuth } from '../context/Auth';
import { Menu } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

type NavItem = {
  path: string;
  label: string;
  requiresAuth: boolean;
};

const navItems: NavItem[] = [
  { path: '/', label: 'Hjem', requiresAuth: true },
  { path: '/create-job', label: 'Opret job', requiresAuth: true },
  { path: '/job-list', label: 'Jobliste', requiresAuth: true },
  { path: '/edit-job/', label: 'Rediger jobliste', requiresAuth: true },
  { path: '/approve', label: 'Godkend job', requiresAuth: true },
  { path: '/statistics', label: 'Statistik', requiresAuth: true },
  { path: '/punishment', label: 'Straf', requiresAuth: true },
  { path: '/login', label: 'Login', requiresAuth: false },
];

function Navbar() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { isLoggedIn, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };

    if (menuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [menuOpen]);

  const linkClass = (path: string) => {
    if (path === '/') {
      return `font-semibold ${pathname === '/' ? 'text-[color:var(--color-wolt-blue)]' : 'text-black'}`;
    }
    return `font-semibold ${pathname.startsWith(path) ? 'text-[color:var(--color-wolt-blue)]' : 'text-black'}`;
  };

  const filteredNavItems = navItems.filter((item) =>
    isLoggedIn ? item.requiresAuth : !item.requiresAuth,
  );

  const renderNavItems = (isMobile = false) => (
    <>
      {filteredNavItems.map((item) => (
        <Link
          key={item.path}
          to={item.path}
          className={linkClass(item.path)}
          onClick={isMobile ? () => setMenuOpen(false) : undefined}
        >
          {item.label}
        </Link>
      ))}

      {isLoggedIn ? (
        <Button
          className="w-25"
          onClick={() => {
            if (isMobile) setMenuOpen(false);
            logout();
          }}
        >
          Log ud
        </Button>
      ) : (
        <Button
          onClick={() => {
            if (isMobile) setMenuOpen(false);
            navigate('/signup');
          }}
        >
          Opret profil
        </Button>
      )}
    </>
  );

  return (
    <nav
      className="flex items-center justify-between px-6 py-4 border-b border-gray-100 lg:px-30 relative"
      ref={menuRef}
    >
      <Link to="/" className="text-4xl font-bold text-(--color-wolt-blue) ">
        voldt
      </Link>

      {/* Burger menu button - only visible on lg and smaller */}
      <button
        className="lg:hidden flex items-center justify-center"
        onClick={() => setMenuOpen((open) => !open)}
        aria-label="Åben menu"
        type="button"
      >
        <Menu className="w-8 h-8 text-(--color-wolt-blue) cursor-pointer" />
      </button>

      {/* Desktop menu - only visible on lg and up */}
      <div className="hidden lg:flex items-center space-x-8 text-sm">
        {renderNavItems()}
      </div>

      {/* Mobile menu - only visible on lg and smaller, when open */}
      {menuOpen && (
        <div className="lg:hidden absolute top-full left-0 w-full bg-white flex flex-col items-center space-y-4 py-4 border-b-1 border-(--border) z-50">
          {renderNavItems(true)}
        </div>
      )}
    </nav>
  );
}

export default Navbar;
