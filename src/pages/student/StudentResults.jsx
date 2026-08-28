import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMyResults } from '../../api/studentApi';
import { useToast } from '../../context/ToastContext';

const StudentResults = () => {
  const [attempts, setAttempts] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const { showToast } = useToast();
  useEffect(() => {
    const fetchResults = async () => {
      try {
        setLoading(true);
        const results = await getMyResults();
        setAttempts(results || []);
      } catch (err) {
        showToast(err.message || 'Failed to load results', 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [showToast]);

  if (loading) {
    return (
      <div className="p-6 lg:p-8 max-w-4xl mx-auto text-center font-mono text-taupe">
        Loading results...
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8 max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="font-serif text-2xl font-semibold text-ink">My Results</h1>
        <p className="text-sm text-taupe mt-1 font-mono">
          {attempts.length} exam(s) taken
        </p>
      </div>

      {attempts.length === 0 ? (
        <div className="bg-paper border-2 border-dashed border-ink/20 rounded-xl px-8 py-16 text-center">
          <div className="font-serif text-4xl text-taupe mb-2">∅</div>
          <div className="font-medium text-ink">You have not taken any exams yet.</div>
          <div className="text-sm text-taupe mt-1">
            Your results will appear here after submitting your exams.
          </div>
          <button
            onClick={() => navigate('/student')}
            className="mt-4 px-4 py-2 bg-ink text-cream rounded-lg text-sm font-medium hover:bg-ink/80 transition-colors"
          >
            View available exams
          </button>
        </div>
      ) : (
        <div className="bg-paper border-2 border-ink/20 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-rule bg-cream/50">
                  {['Exam', 'Course', 'Date', 'Score', '%', 'Result', ''].map((h) => (
                    <th
                      key={h}
                      className="text-left px-5 py-3 font-mono text-xs uppercase tracking-wider text-taupe"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {attempts.map((a, i) => {
                  const score = Number(a.score) || 0;
                  const maxScore = Number(a.totalPoints);
                  const hasMaxScore = Number.isFinite(maxScore) && maxScore > 0;
                  const percentage = hasMaxScore ? Math.round((score / maxScore) * 100) : 0;
                  const passed = percentage >= 50;

                  return (
                    <tr key={`${a.examId}-${a.submittedAt}`} className={i > 0 ? 'border-t border-rule' : ''}>
                      <td className="px-5 py-3">
                        <div className="font-medium text-ink max-w-[200px] truncate">
                          {a.examTitle || a.title || `Exam #${a.examId}`}
                        </div>
                      </td>
                      <td className="px-5 py-3 font-mono text-xs text-taupe">
                        {a.courseCode || '—'}
                      </td>
                      <td className="px-5 py-3 font-mono text-xs text-taupe">
                        {new Date(a.submittedAt).toLocaleDateString('en-US', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </td>
                      <td className="px-5 py-3 font-mono text-sm font-bold text-ink">
                        {score}/{hasMaxScore ? maxScore : '—'}
                      </td>
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-1.5 bg-ink/10 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full ${
                                passed ? 'bg-sage' : 'bg-danger/60'
                              }`}
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                          <span className="font-mono text-xs text-ink">{percentage}%</span>
                        </div>
                      </td>
                      <td className="px-5 py-3">
                        <span
                          className={`font-mono text-xs px-2 py-1 rounded ${
                            passed
                              ? 'bg-sage/15 text-sage'
                              : 'bg-danger/10 text-danger'
                          }`}
                        >
                          {passed ? 'Passed' : 'Failed'}
                        </span>
                      </td>
                      <td className="px-5 py-3">
                        <button
                          onClick={() =>
                            navigate(`/student/exams/${a.examId}/result`)
                          }
                          className="text-xs font-mono text-sage hover:underline"
                        >
                          View feedback →
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
export default StudentResults