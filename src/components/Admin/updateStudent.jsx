import { useState } from "react";

export const UpdateStudent = ({ student, onSave, onCancel }) => {
  const [error, setError] = useState("");
  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);

    const modifiedStudent = {
      firstName: data.get("firstName")?.trim() || "",
      lastName: data.get("lastName")?.trim() || "",
      email: data.get("email")?.trim() || "",
    };
    if (
      !modifiedStudent.firstName ||
      !modifiedStudent.lastName ||
      !modifiedStudent.email
    ) {
      setError("Please fill in all fields.");
      return;
    }
    setError("");
    onSave(student?.id, modifiedStudent);
    
  };
  
  return (
    <form onSubmit={handleSubmit}>
      {error && (
        <p className="mb-5 rounded-lg bg-red-100 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      )}
      <div className="relative">
        <div className="flex items-center justify-between px-6 py-4 border-b border-rule">
          <h2 className="font-serif text-lg font-semibold text-ink">
            Edit student
          </h2>
          <button className="text-taupe hover:text-ink transition-colors">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path
                d="M4 4l10 10M14 4L4 14"
                stroke="currentColor"
                stroke-width="1.5"
                stroke-linecap="round"
              ></path>
            </svg>
          </button>
        </div>
        <div className="px-6 py-5">
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block font-mono text-[0.68rem] tracking-widest uppercase text-sage mb-1">
                  First name
                </label>
                <input
                  name="firstName"
                  defaultValue={student?.firstName || ""}
                  className="w-full border-[1.5px] border-ink rounded-md bg-cream px-3 py-2 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-sage"
                  placeholder="Amina"
                />
              </div>
              <div>
                <label className="block font-mono text-[0.68rem] tracking-widest uppercase text-sage mb-1">
                  Last name
                </label>
                <input
                  name="lastName"
                  defaultValue={student?.lastName || ""}
                  className="w-full border-[1.5px] border-ink rounded-md bg-cream px-3 py-2 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-sage"
                  placeholder="Rakotomalala"
                />
              </div>
            </div>
            <div>
              <label className="block font-mono text-[0.68rem] tracking-widest uppercase text-sage mb-1">
                Email address
              </label>
              <input
                name="email"
                defaultValue={student?.email || ""}
                className="w-full border-[1.5px] border-ink rounded-md bg-cream px-3 py-2 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-sage"
                placeholder="prenom.nom@etud.mg"
                type="email"
              />
            </div>
          </div>
          <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-rule">
            <button
              className="px-4 py-2 border border-ink/30 rounded-lg text-sm text-ink hover:bg-ink/5 transition-colors"
              onClick={onCancel}
            >
              Cancel
            </button>
            <button className="px-4 py-2 bg-ink text-cream rounded-lg text-sm font-medium hover:bg-ink/80 transition-colors">
              Save changes
            </button>
          </div>
        </div>
      </div>
    </form>
  );
};
