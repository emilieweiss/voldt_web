import { Link, useLocation } from 'react-router'

function Navbar() {
  const { pathname } = useLocation()

  const linkClass = (path: string) =>
    `font-semibold ${
      pathname === path ? 'text-[color:var(--color-wolt-blue)]' : 'text-black'
    }`

  return (
    <nav className="flex items-center justify-between p-4 border-b">
      <div className="text-2xl font-bold text-[color:var(--color-wolt-blue)]">voldt</div>
      <div className="flex space-x-8">
        <Link to="/" className={linkClass('/')}>Hjem</Link>
        <Link to="/create-job" className={linkClass('/create-job')}>Opret job</Link>
        <Link to="/job-list" className={linkClass('/job-list')}>Jobliste</Link>
        <Link to="/edit-job/1" className={linkClass('/edit-job/1')}>Rediger jobliste</Link>
      </div>
      <Link
        to="/login"
        className="bg-[color:var(--color-wolt-blue)] hover:bg-[color:var(--color-wolt-medium-blue)] text-white font-semibold py-2 px-4 rounded-xl"
      >
        Log ud
      </Link>
    </nav>
  )
}

export default Navbar
