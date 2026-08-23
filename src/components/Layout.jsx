import { Outlet } from 'react-router-dom';
import Sidebar from './ui/SideBar';
import { useAuth } from '../context/AuthContext';

 const Layout = () => {
    const {user} = useAuth();
    const roleKey = user?.role?.toUpperCase();
    
  return (
    <div className="flex h-screen overflow-hidden bg-cream w-screen">
      <Sidebar  />

      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-paper border-b-2 border-ink px-6 py-3 flex items-center justify-between shrink-0">
          <h1 className="font-serif text-xl font-semibold text-ink">
            { roleKey === 'STUDENT' ? "Available Exams" : "Admin Dashboard"}
          </h1>
          <span className="font-mono text-xs text-taupe uppercase tracking-widest hidden sm:block">
            2026 Session
          </span>
        </header>

        <main className="flex-1 overflow-y-auto bg-cream p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
export default Layout;