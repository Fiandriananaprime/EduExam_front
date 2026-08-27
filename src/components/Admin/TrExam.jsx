const getExamStatus = (startsAt, endsAt) => {
  const now = new Date();
  const start = new Date(startsAt);
  const end = new Date(endsAt);

  if (now < start) {
    return "Upcoming";
  }

  if (now >= start && now <= end) {
    return "Available";
  }

  return "Finished";
};

const formatDate = (date) => {
  return new Date(date).toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const TrExam = ({
  exam,
  course,
  onEdit,
  onDelete,
  onQuestions,
  onResults,
}) => {
  const status = getExamStatus(
    exam.startsAt,
    exam.endsAt
  );

  const questionsCount =
    exam.questionsCount ??
    exam.questions?.length ??
    0;

  const attempts =
    exam.attempts ??
    exam.attemptCount ??
    0;

  return (
    <tr className="border-b border-ink/10 last:border-b-0">

      <td className="px-5 py-4 font-medium text-ink">
        {exam.title}
      </td>

      <td className="px-5 py-4 font-mono text-sm text-taupe">
        {course?.name ?? exam.courseId}
      </td>

      <td className="px-5 py-4 font-mono text-sm text-taupe">
        <div>
          {formatDate(exam.startsAt)}
        </div>

        <div className="mt-1">
          → {formatDate(exam.endsAt)}
        </div>
      </td>

      <td className="px-5 py-4 text-center text-ink">
        {questionsCount}
      </td>

      <td className="px-5 py-4 text-center text-ink">
        {attempts}
      </td>

      <td className="px-5 py-4">
        <span
          className={
            status === "Available"
              ? "rounded-md bg-sage/20 px-2.5 py-1 font-mono text-xs text-taupe"
              : status === "Finished"
                ? "rounded-md bg-ink/10 px-2.5 py-1 font-mono text-xs text-taupe"
                : "rounded-md bg-cream px-2.5 py-1 font-mono text-xs text-ink"
          }
        >
          {status}
        </span>
      </td>

      <td className="px-5 py-4">
        <div className="flex items-center justify-end gap-2">

          <button
            type="button"
            onClick={() => onEdit(exam)}
            className="rounded-md border border-ink/30 px-3 py-1.5 font-mono text-xs text-ink transition-colors hover:bg-ink hover:text-cream"
          >
            Edit
          </button>

          <button
            type="button"
            onClick={() => onQuestions(exam)}
            className="rounded-md border border-ink/30 px-3 py-1.5 font-mono text-xs text-ink transition-colors hover:bg-ink hover:text-cream"
          >
            Questions
          </button>

          <button
            type="button"
            onClick={() => onResults(exam)}
            className="rounded-md border border-ink/30 px-3 py-1.5 font-mono text-xs text-ink transition-colors hover:bg-ink hover:text-cream"
          >
            Results
          </button>

          <button
            type="button"
            onClick={() => onDelete(exam)}
            className="rounded-md border border-danger/30 px-3 py-1.5 font-mono text-xs text-danger transition-colors hover:bg-danger hover:text-white"
          >
            Delete
          </button>

        </div>
      </td>

    </tr>
  );
};