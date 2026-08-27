import { useState } from "react";

export const CourseForm = ({ course, onSave, onCancel }) => {
  const [title, setTitle] = useState(course?.title || "");
  const [description, setDescription] = useState(course?.description || "");
  const [error, setError] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!title.trim() || !description.trim()) {
      setError("Please fill in all fields.");
      return;
    }

    setError("");

    const course = {
      title: title.trim(),
      description: description.trim(),
      status: "ACTIVE",
    };

    onSave(course);
  };

  return (
    <form onSubmit={handleSubmit}>

      {error && (
        <p className="mb-5 rounded-lg bg-red-100 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      )}

      <div className="mb-6 flex flex-col gap-2">
        <label
          htmlFor="course-title"
          className="text-xs font-medium tracking-widest text-[#403D08]"
        >
          COURSE TITLE
        </label>

        <input
          id="course-title"
          name="title"
          type="text"
          placeholder="ex. Algorithmique"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          className="rounded-lg border border-[#403D08]/50 bg-[#F0F0D0] px-4 py-3 text-[#403D08] outline-none focus:border-[#403D08]"
        />
      </div>

      <div className="mb-7 flex flex-col gap-2">
        <label
          htmlFor="course-description"
          className="text-xs font-medium tracking-widest text-[#403D08]"
        >
          DESCRIPTION
        </label>

        <textarea
          id="course-description"
          name="description"
          placeholder="Description du cours..."
          value={description}
          onChange={(event) =>
            setDescription(event.target.value)
          }
          className="min-h-24 resize-y rounded-lg border border-[#403D08]/50 bg-[#F0F0D0] px-4 py-3 text-[#403D08] outline-none focus:border-[#403D08]"
        />
      </div>

      <div className="flex justify-end gap-3 border-t border-[#403D08]/15 pt-5">

        <button
          type="button"
          onClick={onCancel}
          className="rounded-lg border border-[#403D08]/30 px-5 py-3 text-[#403D08] hover:bg-[#403D08]/10"
        >
          Annuler
        </button>

        <button
          type="submit"
          className="rounded-lg bg-[#403D08] px-5 py-3 font-medium text-white hover:bg-[#514D0A]"
        >
          Créer le cours
        </button>

      </div>
      
    </form>
  );
};