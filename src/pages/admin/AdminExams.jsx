import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { Modal } from "../../components/Admin/Modal";
import { ExamForm } from "../../components/Admin/ExamForm";
import { TrExam } from "../../components/Admin/TrExam";
import { useToast } from "../../context/ToastContext";

import {
  getExams,
  getCourses,
  createExam,
  updateExam,
  deleteExam,
  getExamQuestions,
  getExamResults,
} from "../../api/adminApi";

const AdminExams = () => {
  const [exams, setExams] = useState([]);
  const [courses, setCourses] = useState([]);

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const { showToast } = useToast();

  const [modal, setModal] = useState(null);
  const navigate = useNavigate();

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [examData, courseData] = await Promise.all([
        getExams(),
        getCourses(),
      ]);

      const examsWithCounts = await Promise.all(
        (Array.isArray(examData) ? examData : []).map(async (exam) => {
          const [questions, results] = await Promise.all([
            getExamQuestions(exam.id).catch(() => []),
            getExamResults(exam.id).catch(() => null),
          ]);

          return {
            ...exam,
            questionCount: Array.isArray(questions) ? questions.length : 0,
            attemptsCount: results?.attemptsCount ?? 0,
          };
        }),
      );

      setExams(examsWithCounts);
      setCourses(Array.isArray(courseData) ? courseData : []);
    } catch (error) {
      showToast(error.message, "error");
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    // Loading data synchronizes the page with the backend response.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadData();
  }, [loadData]);

  const handleOpenCreate = () => {
    setModal("create");
  };

  const handleOpenEdit = (exam) => {
    setModal(exam);
  };

  const handleCloseModal = () => {
    setModal(null);
  };

  const handleCreateExam = async (exam) => {
    setSubmitting(true);

    try {
      const newExam = await createExam(exam);

      setExams((currentExams) => [...currentExams, newExam]);

      setModal(null);
      showToast("Exam created successfully.", "success");
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdateExam = async (exam) => {
    setSubmitting(true);

    try {
      const updatedExam = await updateExam(modal.id, exam);

      setExams((currentExams) =>
        currentExams.map((currentExam) =>
          currentExam.id === updatedExam.id ? updatedExam : currentExam,
        ),
      );

      setModal(null);
      showToast("Exam updated successfully.", "success");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteExam = async (exam) => {
    const confirmed = window.confirm(`Delete exam "${exam.title}"?`);

    if (!confirmed) {
      return;
    }

    try {
      await deleteExam(exam.id);

      setExams((currentExams) =>
        currentExams.filter((currentExam) => currentExam.id !== exam.id),
      );
      showToast("Exam deleted successfully.", "success");
    } catch (error) {
      showToast(error.message, "error");
    }
  };

  const handleQuestions = (exam) => {
    navigate(`/admin/exams/${exam.id}/questions`);
  };

  const handleResults = (exam) => {
    navigate(`/admin/exams/${exam.id}/results`);
  };

  return (
    <section>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-serif text-2xl font-semibold text-ink">Exams</h1>

          <p className="mt-1 font-mono text-sm text-taupe">
            {exams.length} exam(s) in total
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenCreate}
          disabled={courses.length === 0}
          className="flex items-center gap-2 rounded-lg bg-ink px-5 py-3 text-sm font-medium text-cream transition-colors hover:bg-ink/80 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <span className="text-lg">+</span>
          Create an exam
        </button>
      </div>

      {courses.length === 0 && !loading && (
        <p className="mt-5 rounded-lg bg-cream px-4 py-3 font-mono text-sm text-taupe">
           Create a course first — every exam must belong to a course.
        </p>
      )}

      <div className="mt-8 overflow-hidden rounded-2xl border-2 border-ink/20 bg-paper">
        <div className="overflow-x-auto">
          {loading ? (
            <div className="px-6 py-10 text-center font-mono text-sm text-taupe">
              Loading exams...
            </div>
          ) : exams.length === 0 ? (
            <div className="px-6 py-10 text-center font-mono text-sm text-taupe">
              No exams have been created yet.
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-rule bg-cream/50">
                  <th className="px-5 py-3 text-left font-mono text-xs uppercase tracking-wider text-taupe">
                    Exam
                  </th>

                  <th className="px-5 py-3 text-left font-mono text-xs uppercase tracking-wider text-taupe">
                    Course
                  </th>

                  <th className="px-5 py-3 text-left font-mono text-xs uppercase tracking-wider text-taupe">
                    Availability
                  </th>

                  <th className="px-5 py-3 text-center font-mono text-xs uppercase tracking-wider text-taupe">
                    Questions
                  </th>

                  <th className="px-5 py-3 text-center font-mono text-xs uppercase tracking-wider text-taupe">
                    Attempts
                  </th>

                  <th className="px-5 py-3 text-left font-mono text-xs uppercase tracking-wider text-taupe">
                    Status
                  </th>

                  <th className="px-5 py-3 text-right font-mono text-xs uppercase tracking-wider text-taupe">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {exams.map((exam) => {
                  const course = courses.find(
                    (currentCourse) =>
                      String(currentCourse.id) === String(exam.courseId),
                  );

                  return (
                    <TrExam
                      key={exam.id}
                      exam={exam}
                      course={course}
                      onEdit={handleOpenEdit}
                      onDelete={handleDeleteExam}
                      onQuestions={handleQuestions}
                      onResults={handleResults}
                    />
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {modal === "create" && (
        <Modal title="Create an exam" onClose={handleCloseModal}>
          <ExamForm
            exam={null}
            courses={courses}
            onSave={handleCreateExam}
            onCancel={handleCloseModal}
            submitting={submitting}
          />
        </Modal>
      )}

      {/* EDIT MODAL */}

      {modal && modal !== "create" && (
        <Modal title={`Edit ${modal.title}`} onClose={handleCloseModal}>
          <ExamForm
            exam={modal}
            courses={courses}
            onSave={handleUpdateExam}
            onCancel={handleCloseModal}
            submitting={submitting}
          />
        </Modal>
      )}
    </section>
  );
};

export default AdminExams;
