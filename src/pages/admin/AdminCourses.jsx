import { useEffect, useState } from "react";
import { Modal } from "../../components/Admin/Modal";
import { CourseForm } from "../../components/Admin/courseForm";
import {
  getCourses,
  getExams,
  createCourse,
  updateCourse,
  deleteCourse,
} from "../../api/adminApi";
import { CreateButton } from "../../components/Admin/CreateButton";
import { CourseCard } from "../../components/Admin/CourseCard";
import { useToast } from "../../context/ToastContext";
const AdminCourses = () => {
  const [courses, setCourses] = useState([]);
  const [modal, setModal] = useState(null);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const { showToast } = useToast();

  useEffect(() => {
    const loadCourses = async () => {
      try {
        const [coursesData, examsData] = await Promise.all([
          getCourses(),
          getExams(),
        ]);
        const exams = Array.isArray(examsData) ? examsData : [];
        const courses = Array.isArray(coursesData) ? coursesData : [];

        setCourses(courses.map((course) => ({
          ...course,
          examCount: exams.filter(
            (exam) => String(exam.courseId) === String(course.id),
          ).length,
        })));
      } catch {
        showToast("Unable to load courses.", "error");
      }
    };

    loadCourses();
  }, [showToast]);

  const handleCreateCourse = async (course) => {
    try {
      const newCourse = await createCourse(course);

      setCourses((currentCourses) => [...currentCourses, newCourse]);

      setModal(null);
      showToast("Course created successfully.", "success");
    } catch {
      showToast("Unable to create the course.", "error");
    }
  };
  const handleOpenCreateModal = () => {
    setSelectedCourse(null);
    setModal("create-course");
  };

  const handleEditCourse = (course) => {
    setSelectedCourse(course);
    setModal("edit-course");
  };

  const handleUpdateCourse = async (updatedCourse) => {
    try {
      const updated = await updateCourse(selectedCourse.id, updatedCourse);
      setCourses((currentCourses) => currentCourses.map((course) => (
        course.id === updated.id
          ? { ...updated, examCount: course.examCount ?? 0 }
          : course
      )));
      handleCloseModal();
      showToast("Course updated successfully.", "success");
    } catch {
      showToast("Unable to update the course.", "error");
    }
  };

  const handleDeleteCourse = async (course) => {
    const courseName = course.name || course.title || course.code || "this course";

    if (!window.confirm(`Are you sure you want to delete "${courseName}"?`)) {
      return;
    }

    try {
      await deleteCourse(course.id);
      setCourses((currentCourses) => currentCourses.filter(
        (currentCourse) => currentCourse.id !== course.id,
      ));
      showToast("Course deleted successfully.", "success");
    } catch {
      showToast("Unable to delete the course.", "error");
    }
  };

  const handleCloseModal = () => {
    setSelectedCourse(null);
    setModal(null);
  };

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
            <h1 class="font-serif text-2xl font-semibold text-ink">Courses</h1>
          <p class="text-sm text-taupe mt-1 font-mono">{courses.length} created courses</p>
        </div>
        <CreateButton onClick={handleOpenCreateModal} purpose={"Create courses"} />
      </div>
      <div className="grid gap-3">
          {courses.map((course) => (
          <CourseCard
            key={course.id}
            course={course}
            onEdit={handleEditCourse}
            onDelete={handleDeleteCourse}
          />
        ))}
      </div>
      {modal === "create-course" && (
        <Modal title="Create course" onClose={handleCloseModal}>
          <CourseForm
            onSave={handleCreateCourse}
            onCancel={handleCloseModal}
          />
        </Modal>
      )}
      {modal === "edit-course" && selectedCourse && (
        <Modal title="Edit course" onClose={handleCloseModal}>
          <CourseForm
            course={selectedCourse}
            onSave={handleUpdateCourse}
            onCancel={handleCloseModal}
          />
        </Modal>
      )}
    </div>
  );
};

export default AdminCourses;
