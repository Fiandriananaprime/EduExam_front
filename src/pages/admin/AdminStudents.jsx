import { Modal } from "../../components/Admin/Modal";
import { StudentForm } from "../../components/Admin/StudentForm";
import { useEffect, useState } from "react";
import { createStudent, getStudents, updateStudent } from "../../api/adminApi";
import { TrStudent } from "../../components/Admin/TrStudents";
import { UpdateStudent } from "../../components/Admin/updateStudent";


const AdminStudent = () => {
  const [modal, setModal] = useState(null);
  const [students, SetStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const handleAdd = async (formValues) => {
    const data = await createStudent(formValues);
    setModal(null);
    SetStudents((currentStudents) => [...currentStudents, data]);
  };
  const handleUpdate = async (id, student) => {
    const values = await updateStudent(id,student);
  }

  useEffect(() => {
    const loadStudents = async () => {
      try {
        const data = await getStudents();
        SetStudents(data);
      } catch (error) {
        console.log(error);
      }
    };
    loadStudents();
  }, []);

  const filteredStudents = students.filter((student) => {
    const search = searchTerm.trim().toLowerCase();

    return (
      student.firstName?.toLowerCase().includes(search) ||
      student.lastName?.toLowerCase().includes(search) ||
      student.email?.toLowerCase().includes(search) ||
      student.status?.toLowerCase().includes(search.toLocaleLowerCase())
    );
  });
  const handleSave = async (id, payload) => {
    setSubmitting(true);
    try {
      await updateStudent(id, payload);
      setModal(null);
      await load();
    } finally {
      setSubmitting(false);
    }
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
              {students.length} Created accouts
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
              class="px-3 py-2 rounded-lg text-xs font-mono uppercase tracking-wider transition-colors bg-paper border border-ink/30 text-taupe hover:border-ink hover:text-ink"
              onClick={() => {
                setSearchTerm("");
              }}
            >
              All
            </button>
            <button
              class="px-3 py-2 rounded-lg text-xs font-mono uppercase tracking-wider transition-colors bg-ink text-cream"
              onClick={() => setSearchTerm("ACTIVE")}
            >
              Actives
            </button>
            <button
              class="px-3 py-2 rounded-lg text-xs font-mono uppercase tracking-wider transition-colors bg-paper border border-ink/30 text-taupe hover:border-ink hover:text-ink"
              onClick={() => {
                setSearchTerm("DISACTIVATED");
              }}
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
                  Nom
                </th>
                <th class="text-left px-5 py-3 font-mono text-xs uppercase tracking-wider text-taupe">
                  Email
                </th>
                <th class="text-left px-5 py-3 font-mono text-xs uppercase tracking-wider text-taupe">
                  Statut
                </th>
                <th class="text-left px-5 py-3 font-mono text-xs uppercase tracking-wider text-taupe">
                  Résultats
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
                    name={student.firstName + " " + student.lastName}
                    status={student.status || null}
                    email={student.email}
                    result={student.result || null}
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
          {modal && modal !== "create" && (
                  <Modal title="Edit student" onClose={() => setModal(null)}>
                    <UpdateStudent
                      student={modal}
                      onSave={handleSave}
                      onDeactivate={handleDeactivate}
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
