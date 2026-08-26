import { useNavigate } from 'react-router-dom';

const fmtDate = (d) => {
  if (!d) return '—';
  return new Date(d).toLocaleString('en-US', { 
    day: '2-digit', 
    month: 'short', 
    hour: '2-digit', 
    minute: '2-digit' 
  });
};

const ExamCard = ({ exam, result, done }) => {
  const navigate = useNavigate();

  return (
    <div className={`bg-paper border-2 rounded-xl p-5 flex flex-col gap-3 ${done ? 'border-sage/40' : 'border-ink/20'}`}>
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <div className="font-serif font-semibold text-ink text-base leading-tight">
            {exam?.title || result?.examTitle || `Exam #${result?.examId}`}
          </div>
          {(exam?.description || result?.courseCode) && (
            <div className="text-xs text-taupe mt-1 truncate">
              {exam?.description || result.courseCode}
            </div>
          )}
        </div>

        {done ? (
          <span className="font-mono text-xs px-2 py-1 rounded bg-sage/15 text-sage shrink-0">
            {result?.score !== undefined ? `${result.score} / ${result.maxScore}` : 'Completed'}
          </span>
        ) : (
          <span className="font-mono text-xs px-2 py-1 rounded shrink-0 bg-sage/20 text-sage">
            Available
          </span>
        )}
      </div>

      <div className="flex items-center gap-4 text-xs text-taupe font-mono">
        <span className="flex items-center gap-1">
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M10 2H2a1 1 0 00-1 1v7a1 1 0 001 1h8a1 1 0 001-1V3a1 1 0 00-1-1z" stroke="currentColor" strokeWidth="1"/>
            <path d="M4 1v2M8 1v2M1 5h10" stroke="currentColor" strokeWidth="1" strokeLinecap="round"/>
          </svg>
          {done ? fmtDate(result?.submittedAt) : `${fmtDate(exam?.startDate)} → ${fmtDate(exam?.endDate)}`}
        </span>
      </div>

      <div className="pt-1">
        {done ? (
          <button
            onClick={() => navigate(`/student/exams/${result.examId}/result`)}
            className="w-full py-2.5 border-2 border-sage text-sage rounded-lg text-sm font-medium hover:bg-sage hover:text-cream transition-colors"
          >
            View Result →
          </button>
        ) : (
          <button
            onClick={() => navigate(`/student/exams/${exam.id}`)}
            data-testid="start-exam-button"
            className="w-full py-2.5 bg-ink text-cream rounded-lg text-sm font-medium hover:bg-ink/80 transition-colors"
          >
            Start Exam
          </button>
        )}
      </div>
    </div>
  );
};

export default ExamCard