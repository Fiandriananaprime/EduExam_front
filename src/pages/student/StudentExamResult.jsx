import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { getResultById } from '../../api/studentApi';
import { useToast } from '../../context/ToastContext';

const StudentResultPage = () => {
  const { id: examId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { showToast } = useToast();
  const storedExam = (() => {
    try {
      return JSON.parse(sessionStorage.getItem(`exam-${examId}`));
    } catch {
      return null;
    }
  })();

  const [exam, setExam] = useState(location.state?.exam || storedExam);
  const [examResult, setExamResult] = useState(
    location.state?.examResult || location.state?.result || null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchResultData = async () => {
      try {
        setLoading(true);
        let currentResult = examResult;
        if (!currentResult) {
          currentResult = await getResultById(examId);
          setExamResult(currentResult);
        }

        if (!exam) {
          setExam({
            title: currentResult.examTitle,
            description: currentResult.courseCode,
            questions: [],
          });
        }

      } catch (err) {
        setError(err.message || "Failed to load result data");
        showToast(err.message || 'Failed to load result data', 'error');
      } finally {
        setLoading(false);
      }
    };

    if (examId) {
      fetchResultData();
    }
  }, [exam, examId, examResult, showToast]);

  if (loading) {
    return <div className="p-8 text-center text-taupe font-mono animate-pulse">Loading results...</div>;
  }

  if (error) {
    return <div className="p-8 text-center text-danger font-mono">Error: {error}</div>;
  }

  if (!exam || !examResult) {
    return (
      <div className="p-8 text-center">
        <div className="font-serif text-4xl text-taupe mb-2">∅</div>
        <div className="text-ink font-medium">Result not found.</div>
        <button onClick={() => navigate('/student')} className="mt-4 text-sage text-sm hover:underline">
          Back to dashboard
        </button>
      </div>
    );
  }

  const pct = Math.round((examResult.score / examResult.maxScore) * 100);
  const corrections = examResult.corrections || [];
  const correctCount = corrections.filter(c => c.isCorrect).length;
  const incorrectCount = corrections.filter(
    c => !c.isCorrect && c.selectedChoiceId != null
  ).length;
  const unansweredCount = corrections.filter(
    c => c.selectedChoiceId == null
  ).length;
  const examQuestions = exam.questions || [];

  return (
    <div className="p-6 lg:p-8 max-w-3xl mx-auto space-y-8">
      <div>
        <button onClick={() => navigate('/student')} className="flex items-center gap-1 text-sage text-sm mb-4 hover:underline font-mono">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M9 3L5 7l4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Back to exams
        </button>
        <h1 className="font-serif text-2xl font-semibold text-ink">{exam.title}</h1>
        {exam.description && <p className="text-taupe mt-1 text-sm">{exam.description}</p>}
      </div>

      <div className="bg-paper border-2 border-ink rounded-xl px-6 py-7 relative overflow-hidden text-center">
        <div className="pointer-events-none absolute inset-2 border border-rule rounded-lg" />
        <div className="relative">
          <div className="font-mono text-xs text-taupe uppercase tracking-widest mb-2">Your score</div>
          <div className="font-serif text-7xl font-bold text-ink mb-1">
            {examResult.score}<span className="text-3xl font-medium text-taupe">/{examResult.maxScore}</span>
          </div>
          <div className={`font-mono text-2xl font-bold mb-4 ${pct >= 50 ? 'text-sage' : 'text-danger'}`}>{pct}%</div>

          <div className="flex justify-center gap-8 text-sm font-mono">
            <div className="text-center">
              <div className="font-bold text-sage text-xl">{correctCount}</div>
              <div className="text-taupe text-xs uppercase tracking-wider">Correct</div>
            </div>
            <div className="text-center">
              <div className="font-bold text-danger text-xl">{incorrectCount}</div>
              <div className="text-taupe text-xs uppercase tracking-wider">Incorrect</div>
            </div>
            <div className="text-center">
              <div className="font-bold text-taupe text-xl">{unansweredCount}</div>
              <div className="text-taupe text-xs uppercase tracking-wider">Unanswered</div>
            </div>
          </div>
        </div>
      </div>

      <section>
        <h2 className="font-serif text-xl font-semibold text-ink mb-4 flex items-center gap-2">
          <span className="w-5 h-px bg-ink" />
          Detailed Correction
        </h2>
        <div className="space-y-4">
          {corrections.map(correction => {
            const question = examQuestions.find(
              item => String(item.id) === String(correction.questionId)
            );
            const statement = correction.statement || question?.statement || 'Question';
            const choices = question?.choices || correction.choices || [];
            const selectedId = correction.selectedChoiceId;
            const correctId = correction.correctChoiceId;

            const isCorrect = correction.isCorrect;
            const isUnanswered = selectedId == null;

            const cardCls = isCorrect
              ? 'border-sage/40 bg-sage/5'
              : isUnanswered
                ? 'border-gold/50 bg-gold/5'
                : 'border-danger/30 bg-danger/5';

            return (
              <div key={correction.questionId} className={`bg-paper border-2 rounded-xl p-5 ${cardCls}`}>
                <div className="flex items-start gap-3 mb-4">
                  <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                    isCorrect ? 'bg-sage text-cream' : isUnanswered ? 'bg-gold text-ink' : 'bg-danger/80 text-cream'
                  }`}>
                    {isCorrect ? '✓' : isUnanswered ? '—' : '✗'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <p className="font-serif font-semibold text-ink text-sm leading-relaxed">{statement}</p>
                      <span className={`font-mono text-xs px-2 py-1 rounded shrink-0 ${
                        isCorrect ? 'bg-sage/20 text-sage' : 'bg-ink/10 text-taupe'
                      }`}>
                        {correction.pointsEarned !== undefined ? `+${correction.pointsEarned}` : '0'} pt{question?.points > 1 ? 's' : ''}
                      </span>
                    </div>
                  </div>
                </div>

                {/*Response*/}
                <div className="space-y-2 ml-9">
                  {choices.map(choice => {
                    const isTheCorrectChoice = String(choice.id) === String(correctId);
                    const isTheSelectedChoice = String(choice.id) === String(selectedId);
                    
                    const choiceStyles = isTheCorrectChoice
                      ? "border-sage bg-sage/10 text-sage font-medium"
                      : isTheSelectedChoice && !isCorrect
                        ? "border-danger bg-danger/10 text-danger font-medium"
                        : "border-rule text-taupe/70 bg-paper/50";

                    return (
                      <div 
                        key={choice.id} 
                        className={`px-4 py-3 border-2 rounded-lg flex items-center justify-between text-sm ${choiceStyles}`}
                      >
                        <span>{choice.text}</span>
                        {isTheCorrectChoice && <span className="ml-auto font-bold text-sage">✓ Correct</span>}
                        {isTheSelectedChoice && !isCorrect && <span className="ml-auto font-bold text-danger">✗ Your choice</span>}
                      </div>
                    );
                  })}

                  {isUnanswered && (
                    <div className="mt-3 font-mono text-xs text-taupe px-4 py-2 border border-dashed border-taupe/30 rounded-lg">
                      Unanswered question — 0 points awarded
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <div className="flex gap-3">
        <button
          onClick={() => navigate('/student/results')}
          className="px-4 py-2.5 border-2 border-ink text-ink rounded-lg text-sm font-medium hover:bg-ink hover:text-cream transition-colors"
        >
          View all my results
        </button>
        <button
          onClick={() => navigate('/student')}
          className="px-4 py-2.5 bg-ink text-cream rounded-lg text-sm font-medium hover:bg-ink/80 transition-colors"
        >
          Back to exams
        </button>
      </div>
    </div>
  );
}

export default StudentResultPage;