import { Pencil, Trash2 } from "lucide-react";

const getExamStatus = (startDate, endDate) => {
  const now = new Date();
  const start = new Date(startDate);
  const end = new Date(endDate);

  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
    return "Unknown";
  }

  if (now < start) {
    return "Upcoming";
  }

  if (now >= start && now <= end) {
    return "Available";
  }

  return "Finished";
};

const formatDate = (date) => {
  const parsedDate = new Date(date);
  if (Number.isNaN(parsedDate.getTime())) return "—";

  const day = String(parsedDate.getDate()).padStart(2, "0");
  const month = String(parsedDate.getMonth() + 1).padStart(2, "0");
  const year = String(parsedDate.getFullYear()).slice(-2);
  const hours = String(parsedDate.getHours()).padStart(2, "0");
  const minutes = String(parsedDate.getMinutes()).padStart(2, "0");

  return `${day}/${month}/${year} ${hours}:${minutes}`;
};

export const TrExam = ({
  exam,
  course,
  onEdit,
  onDelete,
  onQuestions,
  onResults,
}) => {
  const status = getExamStatus(exam.startDate, exam.endDate);

  const questionsCount =
    exam.questionCount ??
    exam.questionsCount ??
    exam.questions?.length ??
    0;

  const attempts =
    exam.attemptsCount ??
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
          {formatDate(exam.startDate)}
        </div>

        <div className="mt-1">
          → {formatDate(exam.endDate)}
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
                : status === "Unknown"
                  ? "rounded-md bg-danger/10 px-2.5 py-1 font-mono text-xs text-danger"
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
            aria-label="Edit exam"
            title="Edit exam"
            className="rounded-md border border-ink/30 px-3 py-1.5 font-mono text-xs text-ink transition-colors hover:bg-ink hover:text-cream"
          >
            <Pencil className="h-4 w-4" aria-hidden="true" />
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
            aria-label="Delete exam"
            title="Delete exam"
            className="rounded-md border border-danger/30 px-3 py-1.5 font-mono text-xs text-danger transition-colors hover:bg-danger hover:text-white"
          >
            <Trash2 className="h-4 w-4" aria-hidden="true" />
          </button>

        </div>
      </td>

    </tr>
  );
};