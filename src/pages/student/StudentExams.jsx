import { useState, useEffect } from 'react';
import { GraduationCap  } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { getMyExams, getMyResults } from '../../api/studentApi';
import ExamCard from '../../components/students/ExamCard';

 const StudentExams = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  
  const [availableExams, setAvailableExams] = useState([]);
  const [recentCompletedResults, setRecentCompletedResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const [examsData, resultsData] = await Promise.all([
          getMyExams(),
          getMyResults().catch(() => [])
        ]);

        setAvailableExams(examsData || []);

        const sortedResults = (resultsData || [])
          .slice()
          .sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt))
          .slice(0, 2);

        setRecentCompletedResults(sortedResults);
      } catch (err) {
        setError(err.message || 'Failed to load dashboard data');
        showToast(err.message || 'Failed to load dashboard data', 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [showToast]);

  if (loading) {
    return (
      <div className="p-8 text-center font-mono text-sm text-taupe">
        Loading exams...
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center text-red-600 font-medium">
        Error: {error}
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8 max-w-5xl mx-auto space-y-8">

      {/* Welcome Header */}
      <div className="bg-paper border-2 border-ink/20 rounded-xl px-6 py-5 relative overflow-hidden">
        <div className="pointer-events-none absolute right-0 top-0 w-40 h-full opacity-5">
          <GraduationCap className="w-full h-full stroke-1" />
        </div>
        <div className="font-mono text-xs text-taupe uppercase tracking-widest mb-1">2026 Session</div>
        <h1 className="font-serif text-2xl font-semibold text-ink">
          Welcome, {user?.firstName} {user?.lastName}
        </h1>
        <p className="text-sm text-taupe mt-1">
          {availableExams.length > 0
            ? `${availableExams.length} exam${availableExams.length > 1 ? 's' : ''} available right now.`
            : "No exams available at the moment."}
        </p>
      </div>

      {/* Available Exams */}
      {availableExams.length > 0 && (
        <section>
          <h2 className="font-serif text-lg font-semibold text-ink mb-3 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-sage inline-block animate-pulse" />
            Available Exams
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {availableExams.map(e => <ExamCard key={e.id} exam={e} />)}
          </div>
        </section>
      )}

      {/* Max 2 Recent Completed Exams */}
      {recentCompletedResults.length > 0 && (
        <section>
          <h2 className="font-serif text-lg font-semibold text-ink mb-3 flex items-center gap-2">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <circle cx="8" cy="8" r="6.5" stroke="#7C9082" strokeWidth="1.5"/>
              <path d="M5 8l2 2 4-4" stroke="#7C9082" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Recent Results (Max 2)
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {recentCompletedResults.map(r => (
              <ExamCard key={r.examId} result={r} done />
            ))}
          </div>
        </section>
      )}

      {/* Empty State */}
      {availableExams.length === 0 && recentCompletedResults.length === 0 && (
        <div className="bg-paper border-2 border-dashed border-ink/20 rounded-xl px-8 py-16 text-center">
          <div className="font-serif text-4xl text-taupe mb-2">∅</div>
          <div className="font-medium text-ink">No exams or results available</div>
          <div className="text-sm text-taupe mt-1">Your exams will appear here once scheduled.</div>
        </div>
      )}
    </div>
  );
}
export default StudentExams;