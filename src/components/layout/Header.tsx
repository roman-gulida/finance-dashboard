import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import toast from 'react-hot-toast';
import { useTheme } from '../../contexts/ThemeContext';
import { MoonStar, Sun } from 'lucide-react';

function Header() {
  const navigate = useNavigate();

  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const handleLogout = () => {
    logout();
    toast.success(`Signed out successfully`);
    navigate('/sign_in');
  };

  return (
    <header>
      <span className="header-brand">
        <Link to="/">
          <h1>Finance Dashboard</h1>
        </Link>
      </span>

      <nav>
        <NavLink to="/" end>
          Dashboard
        </NavLink>
        <NavLink to="/transactions">Transactions</NavLink>
        <NavLink to="/budget">Budget</NavLink>
      </nav>

      <div className="header-settings">
        <button
          onClick={() => {
            toggleTheme();
          }}
        >
          {theme === 'dark' ? <MoonStar size={16} /> : <Sun size={16} />}
        </button>
        <p>{user?.username}</p>
        <button onClick={handleLogout}>Sign out</button>
      </div>
    </header>
  );
}

export default Header;
