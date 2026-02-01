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
    <header className="flex justify-between items-center w-full min-h-15 pl-8 pr-13 py-5 ">
      <div>
        <Link to="/">
          <h1 className="text-4xl font-bold text-primary-500 dark:text-primary-300">
            Finance Dashboard
          </h1>
        </Link>
      </div>

      <nav>
        <ul className="flex justify-center items-center py-3 px-6 rounded-3xl bg-primary-100 dark:bg-primary-900 transition-colors duration-200 ease-out">
          <li>
            <NavLink
              to="/"
              end
              className={({ isActive }) => `nav-item ${isActive ? 'nav-item-active' : ''}`}
            >
              Dashboard
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/transactions"
              className={({ isActive }) => `nav-item ${isActive ? 'nav-item-active' : ''}`}
            >
              Transactions
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/budget"
              className={({ isActive }) => `nav-item ${isActive ? 'nav-item-active' : ''}`}
            >
              Budget
            </NavLink>
          </li>
        </ul>
      </nav>

      <div className="flex justify-center items-center gap-3">
        <button
          onClick={() => {
            toggleTheme();
          }}
          className="h-12 w-12 p-5 mr-5 flex justify-center items-center rounded-4xl header-btn"
        >
          <span>{theme === 'dark' ? <MoonStar size={22} /> : <Sun size={22} />}</span>
        </button>
        <p className="text-lg">@{user?.username}</p>
        <button
          onClick={handleLogout}
          className="h-12 w-28 py-5 flex justify-center items-center rounded-3xl header-btn"
        >
          <span>Sign out</span>
        </button>
      </div>
    </header>
  );
}

export default Header;
