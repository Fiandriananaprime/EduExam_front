import { Outlet } from 'react-router-dom';
import { FileText, Award } from 'lucide-react';
import Sidebar from '../../components/ui/SideBar';

const navItems = [
  {
    path: '/student',
    label: 'Available Exams',
    icon: FileText,
  },
  {
    path: '/student/results',
    label: 'My Results',
    icon: Award,
  },
];

export default function StudentLayout({ pageTitle = 'Available Exams' }) {
  return (
    <div className="flex h-screen overflow-hidden bg-cream w-screen">
      <Sidebar navItems={navItems} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-paper border-b-2 border-ink px-6 py-3 flex items-center justify-between shrink-0">
          <h1 className="font-serif text-xl font-semibold text-ink">
            {pageTitle}
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