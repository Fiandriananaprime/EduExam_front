import { Modal } from "../../components/Admin/Modal";
import { StudentForm } from "../../components/Admin/StudentForm";
import { useEffect, useState } from "react";
import {
  createStudent,
  getStudents,
  updateStudent,
  deleteStudent,
} from "../../api/adminApi";
import { TrStudent } from "../../components/Admin/TrStudents";
import { UpdateStudent } from "../../components/Admin/updateStudent";
import { useToast } from "../../context/ToastContext";


const AdminStudent = () => {
  const [modal, setModal] = useState(null);
  const [students, SetStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [submitting, setSubmitting] = useState(false);
  const { showToast } = useToast();
  const handleAdd = async (formValues) => {
    const data = await createStudent(formValues);
    setModal(null);
    if (data) {
      SetStudents((currentStudents) => [...currentStudents, data]);
    }
    showToast("Student created successfully.", "success");
  };
  useEffect(() => {
    const loadStudents = async () => {
      try {
        const data = await getStudents();
        SetStudents(Array.isArray(data) ? data : []);
      } catch (error) {
        console.log(error);
      }
    };
    loadStudents();
  }, []);

  const filteredStudents = students
    .filter((student) => student && typeof student === "object")
    .filter((student) => {
      const search = searchTerm.trim().toLowerCase();
      const status = student.isActive ? "ACTIVE" : "DISACTIVATED";
      const matchesStatus = statusFilter === "ALL" || status === statusFilter;

      return matchesStatus && (
        !search ||
        student.firstName?.toLowerCase().includes(search) ||
        student.lastName?.toLowerCase().includes(search) ||
        student.email?.toLowerCase().includes(search)
      );
    })
    .sort((firstStudent, secondStudent) => {
      if (statusFilter === "ALL" && firstStudent.isActive !== secondStudent.isActive) {
        return firstStudent.isActive ? -1 : 1;
      }

      return new Date(secondStudent.createdAt || 0) - new Date(firstStudent.createdAt || 0);
    });
  const handleSave = async (id, payload) => {
    setSubmitting(true);
    try {
      await updateStudent(id, payload);
      setModal(null);
      const data = await getStudents();
      SetStudents(Array.isArray(data) ? data : []);
      showToast("Student updated successfully.", "success");
    } finally {
      setSubmitting(false);
    }
  };
  const handleDeactivate = async (student) => {
    const confirmed = window.confirm(
      `Deactivate student "${student.firstName} ${student.lastName}"?`,
    );

    if (!confirmed) return;

    await deleteStudent(student.id);
    const data = await getStudents();
    SetStudents(Array.isArray(data) ? data : []);
    showToast("Student deactivated successfully.", "success");
  };
  return (
    <>
      <section>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <p className="font-serif text-2xl font-semibold text-ink">
              Students
            </p>
            <p className="text-sm text-taupe mt-1 font-mono">
              {students.length} Created accounts
            </p>
          </div>
          <button
            className="flex items-center gap-2 px-4 py-2.5 bg-ink text-cream rounded-lg text-sm font-medium hover:bg-ink/80 transition-colors"
            onClick={() => setModal("add-student")}
          >
            Add new student
          </button>
        </div>
        <div className="search_bar_container flex flex-col sm:flex-row gap-3 mt-4 mb-4">
          <div class="relative flex-1">
            <svg
              class="absolute left-3 top-1/2 -translate-y-1/2 text-taupe"
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
            >
              <circle
                cx="7"
                cy="7"
                r="4.5"
                stroke="currentColor"
                stroke-width="1.5"
              ></circle>
              <path
                d="M10.5 10.5l3 3"
                stroke="currentColor"
                stroke-width="1.5"
                stroke-linecap="round"
              ></path>
            </svg>
            <input
              placeholder="Search for a Student…"
              class="w-full pl-9 pr-4 py-2.5 bg-paper border-[1.5px] border-ink/30 rounded-lg text-sm text-ink placeholder-taupe focus:outline-none focus:ring-2 focus:ring-sage focus:border-transparent"
              type="search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div class="flex gap-2">
            <button
              class={`px-3 py-2 rounded-lg text-xs font-mono uppercase tracking-wider transition-colors ${statusFilter === "ALL" ? "bg-ink text-cream" : "bg-paper border border-ink/30 text-taupe hover:border-ink hover:text-ink"}`}
              onClick={() => setStatusFilter("ALL")}
            >
              All
            </button>
            <button
              class={`px-3 py-2 rounded-lg text-xs font-mono uppercase tracking-wider transition-colors ${statusFilter === "ACTIVE" ? "bg-ink text-cream" : "bg-paper border border-ink/30 text-taupe hover:border-ink hover:text-ink"}`}
              onClick={() => setStatusFilter("ACTIVE")}
            >
              Actives
            </button>
            <button
              class={`px-3 py-2 rounded-lg text-xs font-mono uppercase tracking-wider transition-colors ${statusFilter === "DISACTIVATED" ? "bg-ink text-cream" : "bg-paper border border-ink/30 text-taupe hover:border-ink hover:text-ink"}`}
              onClick={() => setStatusFilter("DISACTIVATED")}
            >
              Disactivated
            </button>
          </div>
        </div>
      </section>
      <div class="bg-paper border-2 border-ink/20 rounded-xl overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full text-sm">
            <thead>
              <tr class="border-b border-rule bg-cream/50">
                <th class="text-left px-5 py-3 font-mono text-xs uppercase tracking-wider text-taupe">
                  ID
                </th>
                <th class="text-left px-5 py-3 font-mono text-xs uppercase tracking-wider text-taupe">
                  Nom
                </th>
                <th class="text-left px-5 py-3 font-mono text-xs uppercase tracking-wider text-taupe">
                  Email
                </th>
                <th class="text-left px-5 py-3 font-mono text-xs uppercase tracking-wider text-taupe">
                  Statut
                </th>
                <th class="text-right px-5 py-3 font-mono text-xs uppercase tracking-wider text-taupe">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="list_students_display">
              {filteredStudents.map((student) => {
                return (
                  <TrStudent
                    name={`${student.firstName || ""} ${student.lastName || ""}`.trim() || "Student"}
                    status={student.isActive ? "ACTIVE" : "DISACTIVATED"}
                    email={student.email}
                    id={student.id}
                    onEdit={() => setModal(student)}
                    onDeactivate={() => handleDeactivate(student)}
                  />
                );
              })}
            </tbody>
          </table>
          {modal === "add-student" && (
            <Modal title="Add a student" onClose={() => setModal(null)}>
              <StudentForm onSave={handleAdd} onCancel={() => setModal(null)} />
            </Modal>
          )}
          {modal && modal !== "add-student" && modal !== "create" && (
                  <Modal title="Edit student" onClose={() => setModal(null)}>
                    <UpdateStudent
                      student={modal}
                      onSave={handleSave}
                      onCancel={() => setModal(null)}
                      submitting={submitting}
                    />
                  </Modal>
                )}
        </div>
      </div>
    </>
  );
};

export default AdminStudent;
