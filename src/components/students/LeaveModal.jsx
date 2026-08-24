const LeaveModal = ({ isOpen, onClose, onConfirm, submitting }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-ink/20 backdrop-blur-[1px]" />
      <div className="relative z-10 w-full max-w-md bg-paper border-2 border-ink rounded-xl shadow-2xl p-6">
        <h2 className="font-serif text-xl font-semibold text-ink mb-3">
          Leave exam?
        </h2>
        <p className="text-sm text-ink/80 leading-relaxed mb-6">
          It will be submitted with your current answers.
        </p>
        <div className="flex gap-3 justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-ink/30 rounded-lg text-sm text-ink hover:bg-ink/5"
          >
            Continue Exam
          </button>
          <button
            onClick={onConfirm}
            disabled={submitting}
            className="px-4 py-2 bg-ink text-cream rounded-lg text-sm font-medium hover:bg-ink/80 transition-colors disabled:opacity-50"
          >
            {submitting ? 'Submitting...' : "Leave exam"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default LeaveModal;