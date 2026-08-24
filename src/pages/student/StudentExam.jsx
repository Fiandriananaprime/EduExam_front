import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Check } from 'lucide-react';
import { getMyExam, submitExam } from '../../api/studentApi';
import { useToast } from '../../context/ToastContext';
import LeaveModal from '../../components/students/LeaveModal';
import SubmitModal from '../../components/students/SubmitModal';

const StudentExamPage = () => {
  const { id: examId } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [exam, setExam] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [answers, setAnswers] = useState({});
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [showLeaveDialog, setShowLeaveDialog] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const examUrl = window.location.href;
    window.history.pushState(null, '', examUrl);

    const handlePopState = () => {
      if (!isLeaving) {
        window.history.pushState(null, '', examUrl);
        setShowLeaveDialog(true);
      }
    };

    const handleBeforeUnload = (event) => {
      event.preventDefault();
      event.returnValue = '';
    };

    window.addEventListener('popstate', handlePopState);
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [isLeaving]);

  useEffect(() => {
    const fetchExamData = async () => {
      try {
        setLoading(true);
        const data = await getMyExam(examId);
        setExam(data);
        sessionStorage.setItem(`exam-${examId}`, JSON.stringify(data));
      } catch (err) {
        setError(err.message || "Failed to load exam.");
        showToast(err.message || 'Failed to load exam.', 'error');
      } finally {
        setLoading(false);
      }
    };

    if (examId) {
      fetchExamData();
    }
  }, [examId, showToast]);

  if (loading) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center font-mono text-ink">
        Loading exam...
      </div>
    );
  }

  const examQuestions = exam?.questions || [];

  if (error || !exam || examQuestions.length === 0) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <div className="text-center">
          <div className="font-serif text-4xl text-taupe mb-2">∅</div>
          <div className="font-medium text-ink">{error || "Exam not found or has no questions."}</div>
          <button
            onClick={() => navigate('/student')}
            className="mt-4 text-sage text-sm hover:underline"
          >
            Back to dashboard
          </button>
        </div>
      </div>
    );
  }

  const answered = Object.keys(answers).length;
  const unanswered = examQuestions.length - answered;

  const handleSelect = (questionId, choiceId) => {
    setAnswers(prev => ({ ...prev, [questionId]: choiceId }));
  };

  const scrollToQuestion = (questionId) => {
    const el = document.getElementById(`question-${questionId}`);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleSubmit = async () => {
    try {
      setSubmitting(true);

      const formattedAnswers = Object.entries(answers).map(([questionId, choiceId]) => ({
        questionId,
        choiceId: String(choiceId)
      }));

      const result = await submitExam(examId, { answers: formattedAnswers });
      showToast('Exam submitted successfully.', 'success');
      
      navigate(`/student/exams/${examId}/result`, {
        state: { result, exam },
      });
      return true;
    } catch (err) {
      showToast(err.message || 'Failed to submit exam.', 'error');
      return false;
    } finally {
      setSubmitting(false);
    }
  };

  const handleLeaveExam = async () => {
    setIsLeaving(true);
    setShowLeaveDialog(false);
    const submitted = await handleSubmit();

    if (!submitted) {
      setIsLeaving(false);
      setShowLeaveDialog(true);
    }
  };

  return (
    <div className="h-screen bg-cream flex flex-col">
      <header className="bg-paper border-b-2 border-ink px-6 py-3 flex items-center justify-between gap-4 sticky top-0 z-30">
        <div className="flex items-center gap-4 min-w-0">
          <span className="font-serif text-lg font-bold text-ink hidden sm:block">
            Exam<span className="text-sage">Hub</span>
          </span>
          <div className="h-5 w-px bg-ink/20 hidden sm:block" />
          <div className="min-w-0">
            <div className="font-medium text-sm text-ink truncate">{exam.title}</div>
            <div className="font-mono text-xs text-taupe">{exam.courseName || exam.course?.name}</div>
          </div>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <span className="font-mono text-xs text-taupe">
            {answered}/{examQuestions.length} answered
          </span>
          <button
            onClick={() => setShowSubmitModal(true)}
            className="px-4 py-2 bg-ink text-cream rounded-lg text-sm font-medium hover:bg-ink/80 transition-colors"
          >
            Submit
          </button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        <aside className="hidden md:flex flex-col w-48 bg-paper border-r border-rule p-4 gap-1 overflow-y-auto sticky top-0 h-[calc(100vh-57px)]">
          <div className="font-mono text-xs text-taupe uppercase tracking-wider mb-2">
            Navigation
          </div>
          {examQuestions.map((question, i) => {
            const isDone = !!answers[question.id];
            return (
              <button
                key={question.id}
                onClick={() => scrollToQuestion(question.id)}
                className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-mono text-left transition-colors ${
                  isDone
                    ? 'bg-sage/15 text-sage'
                    : 'text-taupe hover:bg-ink/5 hover:text-ink'
                }`}
              >
                <span
                  className={`w-5 h-5 rounded flex items-center justify-center text-xs shrink-0 border ${
                    isDone ? 'border-sage/50 bg-sage/10' : 'border-taupe/30'
                  }`}
                >
                  {i + 1}
                </span>
                <span className="truncate">Q{i + 1}</span>
                {isDone && <Check className="w-3 h-3 shrink-0 ml-auto" />}
              </button>
            );
          })}
        </aside>

        <main className="flex-1 min-h-0 overflow-y-scroll">
          <div className="px-6 py-8 max-w-3xl mx-auto w-full space-y-12">
            <div className="w-full bg-paper p-4 rounded-xl border border-ink/10">
              <div className="flex justify-between text-xs font-mono text-taupe mb-2">
                <span>Overall Completion</span>
                <span>{Math.round((answered / examQuestions.length) * 100)}%</span>
              </div>
              <div className="w-full h-2 bg-ink/10 rounded-full">
                <div
                  className="h-full bg-sage rounded-full transition-all duration-300"
                  style={{ width: `${(answered / examQuestions.length) * 100}%` }}
                />
              </div>
            </div>

            {examQuestions.map((q, index) => (
              <section
                key={q.id}
                id={`question-${q.id}`}
                className="scroll-mt-20 p-6 bg-paper rounded-2xl border border-ink/10 shadow-sm"
              >
                <div className="flex items-center gap-2 mb-4">
                  <span className="font-mono text-xs bg-ink text-cream px-2.5 py-1 rounded-md">
                    Question {index + 1} / {examQuestions.length}
                  </span>
                  <span className="font-mono text-xs text-taupe">
                    {q.points} point{q.points > 1 ? 's' : ''}
                  </span>
                </div>

                <h2 className="font-serif text-xl font-semibold text-ink leading-relaxed mb-6">
                  {q.statement}
                </h2>

                <div className="space-y-3">
                  {q.choices.map(choice => {
                    const selected = answers[q.id] === choice.id;
                    return (
                      <button
                        key={choice.id}
                        onClick={() => handleSelect(q.id, choice.id)}
                        className={`w-full flex items-center gap-4 px-5 py-4 rounded-xl border-2 text-left transition-all ${
                          selected
                            ? 'border-ink bg-ink text-cream'
                            : 'border-ink/20 bg-paper hover:border-ink/50 hover:bg-cream text-ink'
                        }`}
                      >
                        <div
                          className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                            selected ? 'border-cream bg-cream' : 'border-ink/40'
                          }`}
                        >
                          {selected && <div className="w-2.5 h-2.5 rounded-full bg-ink" />}
                        </div>
                        <span className="text-sm font-medium">{choice.text}</span>
                      </button>
                    );
                  })}
                </div>
              </section>
            ))}

            <div className="pt-8 border-t border-rule flex justify-center pb-12">
              <button
                onClick={() => setShowSubmitModal(true)}
                className="px-8 py-3 bg-sage text-cream rounded-xl text-base font-medium hover:bg-sage/90 transition-colors shadow-lg"
              >
                Submit Exam
              </button>
            </div>
          </div>
        </main>
      </div>

      <LeaveModal
        isOpen={showLeaveDialog}
        onClose={() => setShowLeaveDialog(false)}
        onConfirm={handleLeaveExam}
        submitting={submitting}
      />

      <SubmitModal
        isOpen={showSubmitModal}
        onClose={() => setShowSubmitModal(false)}
        onConfirm={handleSubmit}
        submitting={submitting}
        answered={answered}
        totalQuestions={examQuestions.length}
        unanswered={unanswered}
      />
    </div>
  );
};

export default StudentExamPage;