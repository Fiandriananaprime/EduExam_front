const SubmitModal = ({
  isOpen,
  onClose,
  onConfirm,
  submitting,
  answered,
  totalQuestions,
  unanswered,
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-40 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-ink/20 backdrop-blur-[1px]" />
      <div
        className="relative z-10 w-full max-w-md bg-paper border-2 border-ink rounded-xl shadow-2xl p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="absolute inset-2 border border-rule rounded-lg pointer-events-none" />
        <div className="relative">
          <h2 className="font-serif text-xl font-semibold text-ink mb-3">
            Submit exam?
          </h2>
          <p className="text-sm text-ink/80 leading-relaxed mb-4">
            You are about to submit your exam. This action is final and you will not be able to retake this exam.
          </p>

          <div className="bg-cream border border-ink/20 rounded-lg px-4 py-3 mb-5 space-y-1.5 font-mono text-xs">
            <div className="flex justify-between">
              <span className="text-taupe">Answered questions</span>
              <span className="text-sage font-semibold">
                {answered} / {totalQuestions}
              </span>
            </div>
            {unanswered > 0 && (
              <div className="flex justify-between">
                <span className="text-taupe">Unanswered (0 points)</span>
                <span className="text-danger font-semibold">{unanswered}</span>
              </div>
            )}
          </div>

          {unanswered > 0 && (
            <div className="mb-4 bg-gold/20 border border-gold rounded-lg px-4 py-3 text-xs text-ink font-mono">
              {unanswered} unanswered question{unanswered > 1 ? 's' : ''}. {unanswered > 1 ? 'They' : 'It'} will be worth 0 points.
            </div>
          )}

          <div className="flex gap-3 justify-end">
            <button
              onClick={onClose}
              disabled={submitting}
              className="px-4 py-2 border border-ink/30 rounded-lg text-sm text-ink hover:bg-ink/5 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              disabled={submitting}
              className="px-4 py-2 bg-ink text-cream rounded-lg text-sm font-medium hover:bg-ink/80 transition-colors disabled:opacity-50"
            >
              {submitting ? 'Submitting...' : 'Confirm Submission'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubmitModal;