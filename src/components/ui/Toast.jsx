import { CheckCircle2, XCircle, AlertTriangle, Info, X } from 'lucide-react';

function ToastIcon({ type }) {
  switch (type) {
    case 'success':
      return <CheckCircle2 className="w-4 h-4" />;
    case 'error':
      return <XCircle className="w-4 h-4" />;
    case 'warning':
      return <AlertTriangle className="w-4 h-4" />;
    default:
      return <Info className="w-4 h-4" />;
  }
}

const toastStyles = {
  success: 'bg-paper border-sage text-ink',
  error: 'bg-paper border-danger text-danger',
  warning: 'bg-paper border-gold text-ink',
  info: 'bg-paper border-taupe text-ink',
};

const iconStyles = {
  success: 'text-sage',
  error: 'text-danger',
  warning: 'text-ink',
  info: 'text-taupe',
};

export function ToastContainer({ toasts, onRemove }) {
  if (!toasts.length) return null;

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 w-80">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`flex items-start gap-3 px-4 py-3 rounded-lg border-2 shadow-lg ${
            toastStyles[toast.type] || toastStyles.info
          }`}
        >
          <span
            className={`mt-0.5 shrink-0 ${
              iconStyles[toast.type] || iconStyles.info
            }`}
          >
            <ToastIcon type={toast.type} />
          </span>

          <span className="text-sm flex-1 font-sans leading-snug">
            {toast.message}
          </span>

          <button
            onClick={() => onRemove(toast.id)}
            className="shrink-0 opacity-50 hover:opacity-100 mt-0.5"
            aria-label="Fermer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      ))}
    </div>
  );
}