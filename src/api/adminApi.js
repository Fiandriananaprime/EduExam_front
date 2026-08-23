const API_URL = import.meta.env.VITE_API_URL;

async function apiRequest(endpoint, options = {}) {
  const token = localStorage.getItem("token");

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token && {
        Authorization: `Bearer ${token}`,
      }),
      ...options.headers,
    },
  });

  const data = await response.json().catch(() => null);

  if (response.status === 401) {
    localStorage.removeItem("token");
    localStorage.removeItem("role");

    throw new Error(data?.message || "Your session has expired");
  }

  if (response.status === 403) {
    throw new Error(
      data?.message || "You do not have permission to access this resource"
    );
  }

  if (!response.ok) {
    throw new Error(data?.message || "An error occurred");
  }

  return data;
}

export const getStudents = () => {
  return apiRequest("/students");
};

export const createStudent = (student) => {
  return apiRequest("/students", {
    method: "POST",
    body: JSON.stringify(student),
  });
};

export const updateStudent = (id, student) => {
  return apiRequest(`/students/${id}`, {
    method: "PUT",
    body: JSON.stringify(student),
  });
};

export const deleteStudent = (id) => {
  return apiRequest(`/students/${id}`, {
    method: "DELETE",
  });
};

export const getCourses = () => {
  return apiRequest("/courses");
};

export const createCourse = (course) => {
  return apiRequest("/courses", {
    method: "POST",
    body: JSON.stringify(course),
  });
};

export const updateCourse = (id, course) => {
  return apiRequest(`/courses/${id}`, {
    method: "PUT",
    body: JSON.stringify(course),
  });
};

export const deleteCourse = (id) => {
  return apiRequest(`/courses/${id}`, {
    method: "DELETE",
  });
};

export const getExams = () => {
  return apiRequest("/exams");
};

export const createExam = (exam) => {
  return apiRequest("/exams", {
    method: "POST",
    body: JSON.stringify(exam),
  });
};

export const getExam = (id) => {
  return apiRequest(`/exams/${id}`);
};

export const updateExam = (id, exam) => {
  return apiRequest(`/exams/${id}`, {
    method: "PUT",
    body: JSON.stringify(exam),
  });
};

export const deleteExam = (id) => {
  return apiRequest(`/exams/${id}`, {
    method: "DELETE",
  });
};

export const getExamQuestions = (examId) => {
  return apiRequest(`/exams/${examId}/questions`);
};

export const createExamQuestion = (examId, question) => {
  return apiRequest(`/exams/${examId}/questions`, {
    method: "POST",
    body: JSON.stringify(question),
  });
};

export const updateQuestion = (id, question) => {
  return apiRequest(`/questions/${id}`, {
    method: "PUT",
    body: JSON.stringify(question),
  });
};

export const deleteQuestion = (id) => {
  return apiRequest(`/questions/${id}`, {
    method: "DELETE",
  });
};

export const getExamResults = (examId) => {
  return apiRequest(`/exams/${examId}/results`);
};