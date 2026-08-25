import { useEffect } from "react";

export const Modal = ({ title, children, onClose })=>  {
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    }

    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl overflow-hidden rounded-2xl bg-[#F7F7E8] shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
      
        <div className="flex items-center justify-between border-b border-[#403D08]/15 px-7 py-5">
          <h2 className="font-serif text-2xl font-semibold text-[#403D08]">
            {title}
          </h2>

          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-full text-2xl text-[#403D08]/70 hover:bg-[#403D08]/10"
          >
            
          </button>
        </div>
        <div className="px-7 py-6">
          {children}
        </div>
      </div>
    </div>
  );
}