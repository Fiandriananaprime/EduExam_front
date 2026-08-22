const API_URL = import.meta.env.VITE_API_URL;

export async function getMyExams() {
  const response = await fetch(`${API_URL}/my/exams`);

  if (!response.ok) {
    throw new Error("Failed to fetch exams");
  }

  return response.json();
}

export async function getMyExam(id) {
  const response = await fetch(`${API_URL}/my/exams/${id}`);

  if (!response.ok) {
    throw new Error("Failed to fetch exam");
  }

  return response.json();
}

export async function submitExam(id, answers) {
  const response = await fetch(`${API_URL}/my/exams/${id}/submit`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(answers),
  });

  if (!response.ok) {
    throw new Error("Failed to submit exam");
  }

  return response.json();
}

export async function getMyResults() {
  const response = await fetch(`${API_URL}/my/results`);

  if (!response.ok) {
    throw new Error("Failed to fetch results");
  }

  return response.json();
}