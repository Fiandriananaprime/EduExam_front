import { LogOut, Menu } from 'lucide-react';
import { useState } from 'react';

export default function Sidebar({
  navItems = [],
  currentUser,
  currentView,
  onNavigate,
  onLogout,
  role
}) {
  const [isOpen,setIsOpen] = useState(false);
  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-10 p-2 bg-paper border border-ink rounded-md text-ink"
      >
        <Menu className="w-5 h-5" />
      </button>
      <aside
        className={`
          fixed inset-y-0 left-0 z-30 w-60 h-screen flex flex-col bg-ink
          transform transition-transform duration-200 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:relative lg:translate-x-0
        `}
      >
        <div className="px-5 py-5 border-b border-white/10">
          <div className="font-serif text-xl font-bold text-cream tracking-tight">
            Exam<span className="text-gold">Hub</span>
          </div>
          <div className="font-mono text-xs text-taupe mt-0.5 tracking-widest uppercase">
            {role}
          </div>
        </div>

        <nav className="flex-1 py-4 px-3 space-y-0.5 overflow-y-auto">
          {navItems.map((item) => {
            const active = currentView === item.id;
            const IconComponent = item.icon;

            return (
              <button
                key={item.id}
                onClick={() => {
                  onNavigate(item.id);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors text-left ${
                  active
                    ? 'bg-sage text-cream'
                    : 'text-cream/60 hover:bg-white/5 hover:text-cream'
                }`}
              >
                {IconComponent && (
                  <IconComponent
                    className={`w-4 h-4 shrink-0 ${
                      active ? 'text-cream' : 'text-cream/50'
                    }`}
                  />
                )}
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
        <div className="px-3 pb-4 border-t border-white/10 pt-3 space-y-1">
          {currentUser && (
            <div className="px-3 py-2">
              <div className="text-cream text-sm font-semibold truncate">
                {currentUser.firstName} {currentUser.lastName}
              </div>
              <div className="font-mono text-xs text-taupe mt-0.5 truncate">
                {currentUser.email}
              </div>
            </div>
          )}
          
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-cream/50 hover:text-cream hover:bg-white/5 transition-colors"
          >
            <LogOut className="w-4 h-4 shrink-0" />
            <span>Log out</span>
          </button>
        </div>
      </aside>

      {isOpen && (
        <div
          className="fixed inset-0 z-20 bg-ink/40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}