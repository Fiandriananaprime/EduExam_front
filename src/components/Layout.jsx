import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './ui/SideBar';
import { useAuth } from '../context/AuthContext';

const Layout = () => {
  const { user } = useAuth();
  const location = useLocation();

  const roleKey = user?.role?.toUpperCase();

  const getTitle = () => {
    const pathname = location.pathname;

    if (roleKey === 'STUDENT') {
      if (pathname === '/student') {
        return 'Available Exams';
      }

      if (pathname.startsWith('/student/exams/') && pathname.endsWith('/result')) {
        return 'My Result';
      }

      if (pathname === '/student/results') {
        return 'Results History';
      }

      return 'Student';
    }

    if (pathname === '/admin') {
      return 'Dashboard';
    }

    if (pathname === '/admin/students') {
      return 'Students Management';
    }

    if (pathname === '/admin/courses') {
      return 'Courses Management';
    }

    if (pathname === '/admin/exams') {
      return 'Exams Management';
    }

    if (
      pathname.startsWith('/admin/exams/') &&
      pathname.endsWith('/questions')
    ) {
      return 'Questions Editor';
    }

    if (
      pathname.startsWith('/admin/exams/') &&
      pathname.endsWith('/results')
    ) {
      return 'Exam Results';
    }

    return 'Admin Dashboard';
  };

  return (
    <div className="flex h-screen overflow-hidden bg-cream w-screen">
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-paper border-b-2 border-ink px-6 py-3 flex items-center justify-between shrink-0">
          <h1 className="font-serif text-xl font-semibold text-ink">
            {getTitle()}
          </h1>

          <span className="font-mono text-xs text-taupe uppercase tracking-widest hidden sm:block">
            2026 Session
          </span>
        </header>

        <main className="flex-1 flex flex-col min-h-0 bg-cream">
          <div className="flex-1 overflow-y-auto p-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;