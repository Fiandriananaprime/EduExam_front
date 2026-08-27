import { Pencil, Trash2 } from "lucide-react";

export const CourseCard = ({
  course,
  onEdit,
  onDelete,
}) => {
  return (
    <article className="flex w-full items-center justify-between rounded-xl border-2 border-ink/20 bg-paper px-6 py-5 shadow-sm transition-shadow hover:shadow-md">

      <div className="min-w-0 flex-1">

        <div className="flex items-center gap-2">

          <h2 className="font-serif text-xl font-semibold text-ink">
            {course.name || course.title || "Untitled course"}
          </h2>

          {course.code && (
            <span className="rounded-md bg-cream px-2.5 py-1 font-mono text-xs text-taupe">
              {course.code}
            </span>
          )}

          <span className="rounded-md bg-cream px-2.5 py-1 font-mono text-xs text-ink">
            {course.examCount ?? 0} exams
          </span>

        </div>

        <p className="mt-2 text-base text-taupe">
          {course.description}
        </p>

      </div>

      <div className="ml-6 flex shrink-0 gap-2">

        <button
          type="button"
          onClick={() => onEdit(course)}
          aria-label="Modify course"
          title="Modify course"
          className="rounded-md border border-ink/30 p-2 text-ink hover:bg-ink/10"
        >
          <Pencil className="h-4 w-4" aria-hidden="true" />
        </button>

        <button
          type="button"
          onClick={() => onDelete(course)}
          aria-label="Delete course"
          title="Delete course"
          className="rounded-md border border-danger/20 p-2 text-taupe hover:border-danger hover:text-danger"
        >
          <Trash2 className="h-4 w-4" aria-hidden="true" />
        </button>

      </div>

    </article>
  );
};