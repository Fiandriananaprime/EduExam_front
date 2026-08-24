const AdminStudent = () => {
  return (
    <>
      <section>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <p className="font-serif text-2xl font-semibold text-ink">
              Students
            </p>
            <p className="text-sm text-taupe mt-1 font-mono">
              X Comptes enregistrés
            </p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2.5 bg-ink text-cream rounded-lg text-sm font-medium hover:bg-ink/80 transition-colors">
            Add new student
          </button>
        </div>
        <div className="search_bar_container flex flex-col sm:flex-row gap-3 mt-4 mb-4">
          <div class="relative flex-1">
            <svg
              class="absolute left-3 top-1/2 -translate-y-1/2 text-taupe"
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
            >
              <circle
                cx="7"
                cy="7"
                r="4.5"
                stroke="currentColor"
                stroke-width="1.5"
              ></circle>
              <path
                d="M10.5 10.5l3 3"
                stroke="currentColor"
                stroke-width="1.5"
                stroke-linecap="round"
              ></path>
            </svg>
            <input
              placeholder="Rechercher un étudiant…"
              class="w-full pl-9 pr-4 py-2.5 bg-paper border-[1.5px] border-ink/30 rounded-lg text-sm text-ink placeholder-taupe focus:outline-none focus:ring-2 focus:ring-sage focus:border-transparent"
              type="search"
              value=""
            />
          </div>
          <div class="flex gap-2">
            <button class="px-3 py-2 rounded-lg text-xs font-mono uppercase tracking-wider transition-colors bg-paper border border-ink/30 text-taupe hover:border-ink hover:text-ink">
              All
            </button>
            <button class="px-3 py-2 rounded-lg text-xs font-mono uppercase tracking-wider transition-colors bg-ink text-cream">
              Actives
            </button>
            <button class="px-3 py-2 rounded-lg text-xs font-mono uppercase tracking-wider transition-colors bg-paper border border-ink/30 text-taupe hover:border-ink hover:text-ink">
              Disactivated
            </button>
          </div>
        </div>
      </section>
    </>
  );
};

export default AdminStudent;
