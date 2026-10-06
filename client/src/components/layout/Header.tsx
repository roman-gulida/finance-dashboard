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
    <header className="flex flex-col lg:flex-row justify-between items-center w-full gap-3 px-4 sm:px-6 lg:px-8 py-4 lg:py-5 mb-2 mt-1">
      <div className="w-full lg:w-auto text-center lg:text-left">
        <Link to="/" className="outline-none">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-highlight">
            Finance Dashboard
          </h1>
        </Link>
      </div>

      <nav className="w-full lg:w-auto">
        <ul className="flex justify-center items-center gap-1 sm:gap-2 py-2 sm:py-3 px-3 sm:px-6 rounded-3xl bg-primary-100 dark:bg-primary-900 transition-colors duration-200 ease-out">
          <li>
            <NavLink
              to="/"
              end
              className={({ isActive }) =>
                `nav-item text-sm sm:text-base ${isActive ? 'nav-item-active' : ''}`
              }
            >
              Dashboard
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/transactions"
              className={({ isActive }) =>
                `nav-item text-sm sm:text-base ${isActive ? 'nav-item-active' : ''}`
              }
            >
              Transactions
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/budget"
              className={({ isActive }) =>
                `nav-item text-sm sm:text-base ${isActive ? 'nav-item-active' : ''}`
              }
            >
              Budget
            </NavLink>
          </li>
        </ul>
      </nav>

      <div className="flex justify-center items-center gap-2 sm:gap-3">
        <button
          onClick={toggleTheme}
          className="h-10 w-10 sm:h-12 sm:w-12 p-2 sm:p-3 flex justify-center items-center rounded-full sm:rounded-4xl header-btn"
        >
          {theme === 'dark' ? <MoonStar size={20} /> : <Sun size={20} />}
        </button>
        <p className="hidden sm:block text-base lg:text-lg">@{user?.username}</p>
        <button
          onClick={handleLogout}
          className="h-10 sm:h-12 px-4 sm:px-6 lg:w-28 py-2 sm:py-3 flex justify-center items-center rounded-3xl header-btn hover:scale-98 text-sm sm:text-base"
        >
          <span className="hidden sm:inline">Sign out</span>
          <span className="sm:hidden">Out</span>
        </button>
      </div>
    </header>
  );
}

export default Header;
