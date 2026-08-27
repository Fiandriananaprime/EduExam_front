import { useEffect, useState } from "react";
import { Modal } from "../../components/Admin/Modal";
import { CourseForm } from "../../components/Admin/courseForm";
import {
  getCourses,
  createCourse,
  updateCourse,
  deleteCourse,
} from "../../api/adminApi";
import { CreateButton } from "../../components/Admin/CreateButton";
import { CourseCard } from "../../components/Admin/CourseCard";
const AdminCourses = () => {
  const [courses, setCourses] = useState([]);
  const [modal, setModal] = useState(null);
  const [error, setError] = useState("");
  const [selectedCourse, setSelectedCourse] = useState(null);

  useEffect(() => {
    const loadCourses = async () => {
      try {
        const data = await getCourses();

        setCourses(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error(error);
        setError("Unable to load courses.");
      }
    };

    loadCourses();
  }, []);

  const handleCreateCourse = async (course) => {
    try {
      const newCourse = await createCourse(course);

      setCourses((currentCourses) => [...currentCourses, newCourse]);

      setModal(null);
    } catch (error) {
      console.error(error);
      setError("Unable to create the course.");
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
        course.id === updated.id ? updated : course
      )));
      handleCloseModal();
    } catch (error) {
      console.error(error);
      setError("Unable to update the course.");
    }
  };

  const handleDeleteCourse = async (course) => {
    if (!window.confirm(`Are you sure you want to delete "${course.title}"?`)) {
      return;
    }

    try {
      await deleteCourse(course.id);
      setCourses((currentCourses) => currentCourses.filter(
        (currentCourse) => currentCourse.id !== course.id,
      ));
    } catch (error) {
      console.error(error);
      setError("Unable to delete the course.");
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
      {error && (
        <p className="rounded-lg bg-red-100 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      )}
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
