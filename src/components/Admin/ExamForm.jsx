import { useEffect, useState } from "react";
import { useToast } from "../../context/ToastContext";

export const ExamForm = ({
  exam,
  courses,
  onSave,
  onCancel,
  submitting,
}) => {
  const [form, setForm] = useState({
    courseId: "",
    title: "",
    description: "",
    startsAt: "",
    endsAt: "",
  });

  const { showToast } = useToast();

  useEffect(() => {
    if (exam) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setForm({
        courseId: exam.courseId ?? "",
        title: exam.title ?? "",
        description: exam.description ?? "",
        startsAt: exam.startDate
          ? exam.startDate.slice(0, 16)
          : "",
        endsAt: exam.endDate
          ? exam.endDate.slice(0, 16)
          : "",
      });

      return;
    }

    setForm({
      courseId: courses[0]?.id ?? "",
      title: "",
      description: "",
      startsAt: "",
      endsAt: "",
    });
  }, [exam, courses]);

  const handleChange = (field) => (event) => {
    setForm((previous) => ({
      ...previous,
      [field]: event.target.value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (
      !form.courseId ||
      !form.title.trim() ||
      !form.startsAt ||
      !form.endsAt
    ) {
      showToast("Please fill in all required fields.", "error");
      return;
    }

    const start = new Date(form.startsAt);
    const end = new Date(form.endsAt);

    if (end <= start) {
      showToast(
        "The closing time must be after the opening time."
        , "error"
      );
      return;
    }

    try {
      await onSave({
        courseId: form.courseId,
        title: form.title.trim(),
        description: form.description.trim(),
        startDate: start.toISOString(),
        endDate: end.toISOString(),
      });
    } catch (error) {
      showToast(error.message, "error");
    }
  };

  return (
    <form onSubmit={handleSubmit}>


      <div className="flex flex-col gap-5">

        <div className="flex flex-col gap-2">

          <label className="font-mono text-xs uppercase tracking-widest text-taupe">
            Course
          </label>

          <select
            value={form.courseId}
            onChange={handleChange("courseId")}
            className="rounded-lg border border-ink/30 bg-[#F0F0D0] px-4 py-3 text-ink outline-none focus:border-ink"
          >
            <option value="">
              Select a course
            </option>

            {courses.map((course) => (
              <option
                key={course.id}
                value={course.id}
              >
                {course.name ?? course.title}
              </option>
            ))}
          </select>

        </div>

        <div className="flex flex-col gap-2">

          <label className="font-mono text-xs uppercase tracking-widest text-taupe">
            Title
          </label>

          <input
            type="text"
            value={form.title}
            onChange={handleChange("title")}
            placeholder="e.g. Final exam — Algorithms"
            className="rounded-lg border border-ink/30 bg-[#F0F0D0] px-4 py-3 text-ink outline-none focus:border-ink"
          />

        </div>

        <div className="flex flex-col gap-2">

          <label className="font-mono text-xs uppercase tracking-widest text-taupe">
            Description
          </label>

          <textarea
            value={form.description}
            onChange={handleChange("description")}
            placeholder="Description of the exam..."
            rows={3}
            className="resize-none rounded-lg border border-ink/30 bg-[#F0F0D0] px-4 py-3 text-ink outline-none focus:border-ink"
          />

        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">

          <div className="flex flex-col gap-2">

            <label className="font-mono text-xs uppercase tracking-widest text-taupe">
              Opens at
            </label>

            <input
              type="datetime-local"
              value={form.startsAt}
              onChange={handleChange("startsAt")}
              className="rounded-lg border border-ink/30 bg-[#F0F0D0] px-4 py-3 text-ink outline-none focus:border-ink"
            />

          </div>

          <div className="flex flex-col gap-2">

            <label className="font-mono text-xs uppercase tracking-widest text-taupe">
              Closes at
            </label>

            <input
              type="datetime-local"
              value={form.endsAt}
              onChange={handleChange("endsAt")}
              className="rounded-lg border border-ink/30 bg-[#F0F0D0] px-4 py-3 text-ink outline-none focus:border-ink"
            />

          </div>

        </div>

      </div>

      <div className="mt-7 flex justify-end gap-3 border-t border-ink/15 pt-5">

        <button
          type="button"
          onClick={onCancel}
          className="rounded-lg border border-ink/30 px-5 py-3 text-ink hover:bg-ink/10"
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={submitting}
          className="rounded-lg bg-ink px-5 py-3 font-medium text-white hover:bg-ink/80 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {submitting
            ? "Saving..."
            : exam
              ? "Save changes"
              : "Create exam"}
        </button>

      </div>

    </form>
  );
};