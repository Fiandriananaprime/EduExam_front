export const CreateButton = ({onClick, purpose}) => {
  return (
    <button
      className="flex items-center gap-2 px-4 py-2.5 bg-ink text-cream rounded-lg text-sm font-medium hover:bg-ink/80 transition-colors"
      onClick={onClick}
    >
      {purpose}
    </button>
  );
};
