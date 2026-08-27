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

  return response.json();
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

  return response.json();
};

export const getMyResults = async () => {
  const response = await fetch(`${API_URL}/my/results`, {
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    await throwApiError(response, "Failed to fetch results");
  }

  return response.json();
};

export const getResultById = async (examId) => {
  const results = await getMyResults();
  const result = results.find((r) => String(r.examId) === String(examId));

  if (!result) {
    throw new Error("Result not found");
  }

  return result;
};