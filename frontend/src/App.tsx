import { Outlet, Link } from 'react-router-dom';
import { useTheme } from './context/ThemeContext';
import { useAuth } from './context/AuthContext';

export default function App() {
  const { theme, toggleTheme } = useTheme();
  const { isLoggedIn, user } = useAuth();

  return (
    <>
      <header className="absolute top-0 right-0 p-4 flex items-center gap-4">
        {isLoggedIn && (
          <nav className="flex gap-4">
            {user?.role === 'admin' ? (
              <Link to="/dashboard" className="font-semibold text-gray-600 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400">Admin</Link>
            ) : (
              <Link to="/profile" className="font-semibold text-gray-600 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400">Meu Perfil</Link>
            )}
          </nav>
        )}

        { }
        <button
          onClick={toggleTheme}
          className="p-2 rounded-full bg-gray-200 dark:bg-slate-700 text-gray-800 dark:text-yellow-400"
        >
          {theme === 'light' ? '🌙' : '☀️'}
        </button>
      </header>

      <main>
        <Outlet />
      </main>
    </>
  );
}