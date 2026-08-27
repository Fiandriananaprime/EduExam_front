import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  getStudents,
  getCourses,
  getExams,
  getExamQuestions,
  getExamResults,
} from '../../api/adminApi';
import { useToast } from '../../context/ToastContext';

export default function AdminDashboard() {
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [exams, setExams] = useState([]);
  const [attempts, setAttempts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();
  const navigate = useNavigate()

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const [studentsData, coursesData, examsData] = await Promise.all([
          getStudents(),
          getCourses(),
          getExams(),
        ]);

        const fetchedStudents = studentsData || [];
        const fetchedCourses = coursesData || [];
        const fetchedExams = examsData || [];

        setStudents(fetchedStudents);
        setCourses(fetchedCourses);
        setExams(fetchedExams);

        const resultsPromises = fetchedExams.map(async (exam) => {
          try {
            const res = await getExamResults(exam.id);
            if (!res || !Array.isArray(res.results)) return [];
            return res.results
              .filter((s) => s.submittedAt !== null && s.submittedAt !== undefined)
              .map((s) => ({
                id: `${exam.id}-${s.studentId}`,
                studentId: s.studentId,
                studentName: s.firstName ? `${s.firstName} ${s.name}` : s.name,
                examId: exam.id,
                examTitle: exam.title,
                score: s.score,
                submittedAt: s.submittedAt,
              }));
          } catch {
            return [];
          }
        });

        const resultsPerExam = await Promise.all(resultsPromises);
        const allAttempts = resultsPerExam.flat();

        const detailedAttemptsPromises = allAttempts.map(async (attempt) => {
          try {
            const questions = await getExamQuestions(attempt.examId);
            const totalPoints = Array.isArray(questions)
              ? questions.reduce((acc, question) => acc + (question.points || 0), 0)
              : 0;
            return { ...attempt, totalPoints };
          } catch {
            return { ...attempt, totalPoints: 0 };
          }
        });

        const fullAttempts = await Promise.all(detailedAttemptsPromises);

        fullAttempts.sort(
          (a, b) => new Date(b.submittedAt) - new Date(a.submittedAt)
        );
        setAttempts(fullAttempts);
      } catch (err) {
        showToast(err.message || "Unable to load dashboard data", "error");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [showToast]);

  const now = new Date();

  const getExamStatus = (exam) => {
    const start = new Date(exam.startDate);
    const end = new Date(exam.endDate);

    if (now < start) {
      return { label: 'Scheduled', cls: 'bg-gold/40 text-ink' };
    } else if (now >= start && now <= end) {
      return { label: 'Available', cls: 'bg-sage/20 text-sage' };
    } else {
      return { label: 'Finished', cls: 'bg-ink/10 text-taupe' };
    }
  };

  const getCourseName = (courseId) => {
    const course = courses.find((c) => c.id === courseId);
    return course ? course.name : '—';
  };

  const totalStudents = students.length;
  const totalCourses = courses.length;
  const totalExams = exams.length;
  const availableExams = exams.filter((e) => {
    const start = new Date(e.startDate);
    const end = new Date(e.endDate);
    return now >= start && now <= end;
  }).length;

  const recentExams = [...exams]
    .sort((a, b) => new Date(b.startDate) - new Date(a.startDate))
    .slice(0, 4);
  const recentStudents = [...students]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 4);

  if (loading) {
    return (
      <div className="p-6 lg:p-8 max-w-7xl mx-auto text-center font-mono text-sm text-taupe">
        Loading dashboard data...
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto space-y-8">
      {/* Summary cards */}
      <section>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'Students', value: totalStudents, sub: 'enrolled', nav: 'admin-students' },
            { label: 'Courses', value: totalCourses, sub: 'active', nav: 'admin-courses' },
            { label: 'Exams', value: totalExams, sub: 'in total', nav: 'admin-exams' },
            { label: 'Available', value: availableExams, sub: 'right now', nav: 'admin-exams', highlight: true },
          ].map((card) => (
            <button
              key={card.label}
              onClick={() => navigate(`/admin/${card.nav.replace('admin-', '')}`)}
              className={`text-left bg-paper border-2 rounded-xl px-5 py-5 hover:shadow-md transition-shadow group ${
                card.highlight ? 'border-sage' : 'border-ink/20'
              }`}
            >
              <div className={`font-serif text-4xl font-bold mb-1 ${card.highlight ? 'text-sage' : 'text-ink'}`}>
                {card.value}
              </div>
              <div className="font-semibold text-sm text-ink">{card.label}</div>
              <div className="font-mono text-xs text-taupe mt-0.5 uppercase tracking-wider">{card.sub}</div>
            </button>
          ))}
        </div>
      </section>

      {/* Quick actions */}
      <section>
        <h2 className="font-serif text-lg font-semibold text-ink mb-3 flex items-center gap-2">
          <span className="w-5 h-px bg-ink inline-block" />
          Quick actions
        </h2>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => navigate('/admin/students')}
            className="flex items-center gap-2 px-4 py-2.5 bg-ink text-cream rounded-lg text-sm font-medium hover:bg-ink/80 transition-colors"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            Add a student
          </button>
          <button
            onClick={() => navigate('/admin/courses')}
            className="flex items-center gap-2 px-4 py-2.5 border-2 border-ink text-ink rounded-lg text-sm font-medium hover:bg-ink/5 transition-colors"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            Create a course
          </button>
          <button
            onClick={() => navigate('/admin/exams')}
            className="flex items-center gap-2 px-4 py-2.5 border-2 border-ink text-ink rounded-lg text-sm font-medium hover:bg-ink/5 transition-colors"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            Create an exam
          </button>
        </div>
      </section>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent exams */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-serif text-lg font-semibold text-ink">Recent exams</h2>
            <button onClick={() => navigate('/admin/exams')} className="text-sm text-sage hover:underline font-medium">
              View all →
            </button>
          </div>
          <div className="bg-paper border-2 border-ink/20 rounded-xl overflow-hidden">
            {recentExams.length === 0 ? (
              <div className="px-5 py-4 text-sm text-taupe font-mono">No exams found.</div>
            ) : (
              recentExams.map((exam, i) => {
                const status = getExamStatus(exam);
                return (
                  <div key={exam.id} className={`px-5 py-4 flex items-start justify-between gap-3 ${i > 0 ? 'border-t border-rule' : ''}`}>
                    <div className="min-w-0">
                      <div className="font-medium text-sm text-ink truncate">{exam.title}</div>
                      <div className="font-mono text-xs text-taupe mt-0.5">
                        <span>{getCourseName(exam.courseId)}</span>
                      </div>
                    </div>
                    <span className={`font-mono text-xs px-2 py-1 rounded-md shrink-0 ${status.cls}`}>
                      {status.label}
                    </span>
                  </div>
                );
              })
            )}
          </div>
        </section>

        {/* Recent students */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-serif text-lg font-semibold text-ink">Recent students</h2>
            <button onClick={() => navigate('/admin/students')} className="text-sm text-sage hover:underline font-medium">
              View all →
            </button>
          </div>
          <div className="bg-paper border-2 border-ink/20 rounded-xl overflow-hidden">
            {recentStudents.length === 0 ? (
              <div className="px-5 py-4 text-sm text-taupe font-mono">No students found.</div>
            ) : (
              recentStudents.map((s, i) => {
                const fullName = s.firstName ? `${s.firstName} ${s.name}` : s.name;
                const firstInitial = s.firstName ? s.firstName[0] : (s.name ? s.name[0] : '');
                const secondInitial = s.name ? (s.firstName ? s.name[0] : s.name[1] || '') : '';
                const isActive = s.isActive !== false;

                return (
                  <div key={s.id} className={`px-5 py-4 flex items-center justify-between gap-3 ${i > 0 ? 'border-t border-rule' : ''}`}>
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-8 h-8 rounded-full bg-gold/50 border border-ink/20 flex items-center justify-center font-serif font-bold text-sm text-ink shrink-0 uppercase">
                        {firstInitial}{secondInitial}
                      </div>
                      <div className="min-w-0">
                        <div className="font-medium text-sm text-ink">{fullName}</div>
                        <div className="font-mono text-xs text-taupe truncate">{s.email}</div>
                      </div>
                    </div>
                    <span className={`font-mono text-xs px-2 py-1 rounded-md shrink-0 ${
                      isActive ? 'bg-sage/15 text-sage' : 'bg-ink/10 text-taupe'
                    }`}>
                      {isActive ? 'Active' : 'Deactivated'}
                    </span>
                  </div>
                );
              })
            )}
          </div>
        </section>
      </div>

      {/* Recent results */}
      <section>
        <h2 className="font-serif text-lg font-semibold text-ink mb-3">Recent results</h2>
        <div className="bg-paper border-2 border-ink/20 rounded-xl overflow-x-auto">
          {attempts.length === 0 ? (
            <div className="px-5 py-4 text-sm text-taupe font-mono">No recent results.</div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-rule">
                  <th className="text-left px-5 py-3 font-mono text-xs uppercase tracking-wider text-taupe">Student</th>
                  <th className="text-left px-5 py-3 font-mono text-xs uppercase tracking-wider text-taupe">Exam</th>
                  <th className="text-left px-5 py-3 font-mono text-xs uppercase tracking-wider text-taupe">Score</th>
                  <th className="text-left px-5 py-3 font-mono text-xs uppercase tracking-wider text-taupe">Date</th>
                </tr>
              </thead>
              <tbody>
                {attempts.slice(0, 4).map((a, i) => {
                  const hasMax = a.totalPoints > 0;
                  const pct = hasMax ? Math.round((a.score / a.totalPoints) * 100) : 0;
                  return (
                    <tr key={a.id} className={i > 0 ? 'border-t border-rule' : ''}>
                      <td className="px-5 py-3 font-medium text-ink">{a.studentName}</td>
                      <td className="px-5 py-3 text-ink/70 truncate max-w-[200px]">{a.examTitle}</td>
                      <td className="px-5 py-3">
                        <span className={`font-mono text-xs px-2 py-1 rounded ${pct >= 50 ? 'bg-sage/15 text-sage' : 'bg-danger/10 text-danger'}`}>
                          {hasMax ? `${a.score}/${a.totalPoints} — ${pct}%` : `${a.score} pts`}
                        </span>
                      </td>
                      <td className="px-5 py-3 font-mono text-xs text-taupe">
                        {new Date(a.submittedAt).toLocaleDateString('fr-FR')}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </section>
    </div>
  );
}