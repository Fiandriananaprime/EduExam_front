const API_URL = import.meta.env.VITE_API_URL;

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

const redirectToLogin = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("role");
  localStorage.removeItem("user");

  if (typeof window !== "undefined" && window.location.pathname !== "/login") {
    window.location.replace("/login");
  }
};

const throwApiError = async (response, fallbackMessage) => {
  const data = await response.json().catch(() => null);

  if (response.status === 401) {
    redirectToLogin();
  }

  throw new Error(data?.message || fallbackMessage);
};

const normalizeResult = (result) => {
  if (!result) return result;

  const corrections = result.corrections || result.correction;
  const examTitle = result.examTitle || result.exam_title || result.title;
  const totalPoints = result.totalPoints ?? result.total_points ?? result.maxScore;

  return {
    ...result,
    examTitle,
    totalPoints,
    maxScore: totalPoints,
    corrections: Array.isArray(corrections)
      ? corrections.map((correction) => ({
          ...correction,
          questionId: correction.questionId ?? correction.question_id,
          selectedChoiceId:
            correction.selectedChoiceId ??
            correction.studentChoiceId ??
            correction.student_choice_id,
          correctChoiceId:
            correction.correctChoiceId ?? correction.correct_choice_id,
          selectedChoiceText:
            correction.selectedChoiceText ?? correction.studentChoiceText,
          correctChoiceText: correction.correctChoiceText,
          pointsEarned:
            correction.pointsEarned ??
            (correction.isCorrect ? correction.points : 0),
        }))
      : corrections,
  };
};

export const getMyExams = async () => {
  const response = await fetch(`${API_URL}/my/exams`, {
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    await throwApiError(response, "Failed to fetch exams");
  }

  return response.json();
};

export const getMyExam = async (id) => {
  const response = await fetch(`${API_URL}/my/exams/${id}`, {
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    await throwApiError(response, "Failed to fetch exam");
  }

  const result = await response.json();
  return normalizeResult(result);
};

export const submitExam = async (id, answers) => {
  const response = await fetch(`${API_URL}/my/exams/${id}/submit`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(answers),
  });

  if (!response.ok) {
    await throwApiError(response, "Failed to submit exam");
  }

  const result = await response.json();
  const normalizedResult = normalizeResult(result);

  try {
    sessionStorage.setItem(`result-${id}`, JSON.stringify(normalizedResult));
  } catch {
    return normalizedResult;
  }

  return normalizedResult;
};

export const getMyResults = async () => {
  const response = await fetch(`${API_URL}/my/results`, {
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    await throwApiError(response, "Failed to fetch results");
  }

  const results = await response.json();
  return Array.isArray(results) ? results.map(normalizeResult) : results;
};

export const getResultById = async (examId) => {
  const results = await getMyResults();
  const result = results.find((r) => String(r.examId) === String(examId));

  if (!result) {
    throw new Error("Result not found");
  }

  return result;
};
