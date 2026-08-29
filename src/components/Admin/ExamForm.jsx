import { useEffect, useState } from "react";
import { useToast } from "../../context/ToastContext";

const createEmptyChoice = () => ({
  text: "",
  isCorrect: false,
});

const createEmptyQuestion = (position) => ({
  statement: "",
  points: 1,
  position,
  choices: [createEmptyChoice(), createEmptyChoice()],
});

const validateQuestions = (questions) => {
  if (!Array.isArray(questions) || questions.length === 0) {
    return "Add at least one question to the exam.";
  }

  for (const [index, question] of questions.entries()) {
    if (!question.statement?.trim()) {
      return `Question ${index + 1} is missing a statement.`;
    }

    if (!Array.isArray(question.choices) || question.choices.length < 2 || question.choices.length > 6) {
      return `Question ${index + 1} must have between 2 and 6 choices.`;
    }

    const emptyChoice = question.choices.some((choice) => !choice.text?.trim());
    if (emptyChoice) {
      return `Each choice in question ${index + 1} requires text.`;
    }

    const correctCount = question.choices.filter((choice) => choice.isCorrect).length;
    if (correctCount !== 1) {
      return `Question ${index + 1} must have exactly one correct answer.`;
    }
  }

  return null;
};

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
    questions: [createEmptyQuestion(1)],
  });

  const { showToast } = useToast();

  useEffect(() => {
    if (exam) {
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
        questions: [],
      });

      return;
    }

    setForm({
      courseId: courses[0]?.id ?? "",
      title: "",
      description: "",
      startsAt: "",
      endsAt: "",
      questions: [createEmptyQuestion(1)],
    });
  }, [exam, courses]);

  const handleChange = (field) => (event) => {
    setForm((previous) => ({
      ...previous,
      [field]: event.target.value,
    }));
  };

  const handleQuestionChange = (questionIndex, field) => (event) => {
    const value = field === "points" ? Number(event.target.value || 0) : event.target.value;

    setForm((previous) => ({
      ...previous,
      questions: previous.questions.map((question, index) =>
        index === questionIndex ? { ...question, [field]: value } : question,
      ),
    }));
  };

  const handleChoiceChange = (questionIndex, choiceIndex, field) => (event) => {
    setForm((previous) => ({
      ...previous,
      questions: previous.questions.map((question, index) => {
        if (index !== questionIndex) {
          return question;
        }

        return {
          ...question,
          choices: question.choices.map((choice, currentIndex) =>
            currentIndex === choiceIndex
              ? { ...choice, [field]: field === "text" ? event.target.value : event.target.checked }
              : field === "isCorrect"
                ? { ...choice, isCorrect: false }
                : choice,
          ),
        };
      }),
    }));
  };

  const handleAddQuestion = () => {
    setForm((previous) => ({
      ...previous,
      questions: [
        ...previous.questions,
        createEmptyQuestion(previous.questions.length + 1),
      ],
    }));
  };

  const handleAddChoice = (questionIndex) => {
    setForm((previous) => ({
      ...previous,
      questions: previous.questions.map((question, index) =>
        index === questionIndex && question.choices.length < 6
          ? { ...question, choices: [...question.choices, createEmptyChoice()] }
          : question,
      ),
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
      showToast("The closing time must be after the opening time.", "error");
      return;
    }

    const normalizedQuestions = form.questions.map((question, index) => ({
      ...question,
      statement: question.statement.trim(),
      points: Number(question.points) || 1,
      position: index + 1,
      choices: question.choices.map((choice) => ({
        text: choice.text.trim(),
        isCorrect: Boolean(choice.isCorrect),
      })),
    }));

    const questionValidationError = validateQuestions(normalizedQuestions);
    if (questionValidationError) {
      showToast(questionValidationError, "error");
      return;
    }

    try {
      const payload = {
        courseId: form.courseId,
        title: form.title.trim(),
        description: form.description.trim(),
        startDate: start.toISOString(),
        endDate: end.toISOString(),
        ...(exam ? {} : { questions: normalizedQuestions }),
      };

      await onSave(payload);
    } catch (error) {
      showToast(error.message, "error");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-h-[80vh] overflow-y-auto pr-1">
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
            <option value="">Select a course</option>

            {courses.map((course) => (
              <option key={course.id} value={course.id}>
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

        {!exam && (
          <div className="rounded-xl border border-ink/20 bg-cream/40 p-4">
            <div className="mb-4 flex items-center justify-between gap-3">
              <h3 className="font-mono text-xs uppercase tracking-widest text-taupe">
                Questions
              </h3>

              <button
                type="button"
                onClick={handleAddQuestion}
                className="rounded-lg bg-ink px-3 py-2 text-xs font-medium text-cream hover:bg-ink/80"
              >
                + AddQuestion
              </button>
            </div>

            <div className="max-h-[38vh] overflow-y-auto pr-1">
              <div className="space-y-5">
                {form.questions.map((question, questionIndex) => (
                  <div key={questionIndex} className="rounded-lg border border-ink/20 bg-paper p-4">
                    <div className="mb-3 flex items-center justify-between gap-3">
                      <p className="font-mono text-[11px] uppercase tracking-widest text-taupe">
                        Question {questionIndex + 1}
                      </p>
                      <span className="text-xs text-taupe">{question.choices.length}/6 choices</span>
                    </div>

                    <div className="space-y-3">
                      <div className="flex flex-col gap-2">
                        <label className="font-mono text-[11px] uppercase tracking-widest text-taupe">
                          Statement
                        </label>

                        <textarea
                          value={question.statement}
                          onChange={handleQuestionChange(questionIndex, "statement")}
                          rows={3}
                          placeholder="Write the question..."
                          className="resize-none rounded-lg border border-ink/30 bg-[#F0F0D0] px-4 py-3 text-ink outline-none focus:border-ink"
                        />
                      </div>

                      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                        <div className="flex flex-col gap-2">
                          <label className="font-mono text-[11px] uppercase tracking-widest text-taupe">
                            Points
                          </label>

                          <input
                            type="number"
                            min="1"
                            value={question.points}
                            onChange={handleQuestionChange(questionIndex, "points")}
                            className="rounded-lg border border-ink/30 bg-[#F0F0D0] px-4 py-3 text-ink outline-none focus:border-ink"
                          />
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div className="flex items-center justify-between gap-3">
                          <p className="font-mono text-[11px] uppercase tracking-widest text-taupe">
                            Choices
                          </p>

                          <button
                            type="button"
                            onClick={() => handleAddChoice(questionIndex)}
                            disabled={question.choices.length >= 6}
                            className="rounded-lg border border-ink/30 px-3 py-2 text-xs text-ink hover:bg-ink/10 disabled:cursor-not-allowed disabled:opacity-40"
                          >
                            + AddChoice
                          </button>
                        </div>

                        {question.choices.map((choice, choiceIndex) => (
                          <div key={choiceIndex} className="flex flex-col gap-2 rounded-lg border border-ink/15 bg-[#F9F8E8] p-3">
                            <div className="flex items-center justify-between gap-3">
                              <span className="font-mono text-[10px] uppercase tracking-widest text-taupe">
                                Choice {choiceIndex + 1}
                              </span>

                              <label className="flex items-center gap-2 text-xs text-ink">
                                <input
                                  type="radio"
                                  name={`correct-${questionIndex}`}
                                  checked={Boolean(choice.isCorrect)}
                                  onChange={(event) =>
                                    handleChoiceChange(questionIndex, choiceIndex, "isCorrect")({
                                      target: { checked: event.target.checked },
                                    })
                                  }
                                />
                                Correct
                              </label>
                            </div>

                            <input
                              type="text"
                              value={choice.text}
                              onChange={handleChoiceChange(questionIndex, choiceIndex, "text")}
                              placeholder="Choice text"
                              className="rounded-lg border border-ink/30 bg-[#F0F0D0] px-4 py-3 text-ink outline-none focus:border-ink"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
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
          {submitting ? "Saving..." : exam ? "Save changes" : "Create exam"}
        </button>
      </div>
    </form>
  );
};