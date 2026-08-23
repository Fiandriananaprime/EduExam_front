const API_URL = import.meta.env.VITE_API_URL;

function getAuthHeaders() {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

export async function getMyExams() {
  const response = await fetch(`${API_URL}/my/exams`, {
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error("Failed to fetch exams");
  }

  return response.json();
}

export async function getMyExam(id) {
  const response = await fetch(`${API_URL}/my/exams/${id}`, {
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error("Failed to fetch exam");
  }

  return response.json();
}

export async function submitExam(id, answers) {
  const response = await fetch(`${API_URL}/my/exams/${id}/submit`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(answers),
  });

  if (!response.ok) {
    throw new Error("Failed to submit exam");
  }

  return response.json();
}

export async function getMyResults() {
  const response = await fetch(`${API_URL}/my/results`, {
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error("Failed to fetch results");
  }

  return response.json();
}

export async function getResultById(examId) {
  const results = await getMyResults();
  const result = results.find((r) => String(r.examId) === String(examId));

  if (!result) {
    throw new Error("Result not found");
  }

  return result;
}