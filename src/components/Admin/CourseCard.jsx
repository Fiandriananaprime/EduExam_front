export const CourseCard = ({
  course,
  onEdit,
  onDelete,
}) => {
  return (
    <article className="flex w-full items-center justify-between rounded-2xl border-2 border-ink/20 bg-paper px-6 py-5">

      <div className="min-w-0 flex-1">

        <div className="flex items-center gap-2">

          <h2 className="font-serif text-xl font-semibold text-ink">
            {course.title}
          </h2>

          <span className="rounded-md bg-sage/20 px-2.5 py-1 font-mono text-xs text-taupe">
            {course.status}
          </span>

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
          className="rounded-md border border-ink/30 px-4 py-2 font-mono text-sm text-ink hover:bg-ink/10"
        >
          Modify
        </button>

        <button
          type="button"
          onClick={() => onDelete(course)}
          className="rounded-md border border-danger/20 px-4 py-2 font-mono text-sm text-taupe hover:border-danger hover:text-danger"
        >
          Delete
        </button>

      </div>

    </article>
  );
};