import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Pencil } from "lucide-react";
import { getExamQuestions, updateQuestion } from "../../api/adminApi";
import  EditQuestionModal  from "../../components/Admin/QuestionForm";
import { useToast } from "../../context/ToastContext";

const AdminQuestions = () => {
    const { id } = useParams();
    const [questions, setQuestions] = useState([]);
    const [editingQuestion, setEditingQuestion] = useState(null);
    const [saving, setSaving] = useState(false);
    const { showToast } = useToast();

    const handleSave = async (payload) => {
        setSaving(true);

        try {
            const updatedQuestion = await updateQuestion(payload.id, {
                statement: payload.statement,
                points: payload.points,
                choices: payload.choices,
            });

            setQuestions((currentQuestions) =>
                currentQuestions.map((question) =>
                    question.id === updatedQuestion.id ? updatedQuestion : question,
                ),
            );
            setEditingQuestion(null);
        } catch (err) {
            showToast(err.message || "Unable to update the question.", "error");
        } finally {
            setSaving(false);
        }
    };

    useEffect(() => {
        getExamQuestions(id)
            .then((data) => setQuestions(Array.isArray(data) ? data : []))
            .catch((err) => showToast(err.message, "error"));
    }, [id, showToast]);

    return (
        <section className="space-y-6">
            <div>
                <h1 className="font-serif text-2xl font-semibold text-ink">Questions</h1>
                <p className="mt-1 font-mono text-sm text-taupe">
                    {questions.length} question(s)
                </p>
            </div>
            <div className="space-y-3">
                {questions.map((question, index) => (
                    <article key={question.id} className="rounded-xl border-2 border-ink/20 bg-paper p-5">
                        <div className="flex items-start justify-between gap-4">
                            <div className="font-mono text-xs text-taupe">Question {index + 1} · {question.points} pt</div>
                            <button
                                type="button"
                                onClick={() => {
                                    setEditingQuestion(question);
                                }}
                                aria-label={`Edit question ${index + 1}`}
                                title="Edit question"
                                className="rounded-md border border-ink/30 p-2 text-ink transition-colors hover:bg-ink hover:text-cream"
                            >
                                <Pencil className="h-4 w-4" aria-hidden="true" />
                            </button>
                        </div>
                        <h2 className="mt-2 font-serif text-lg font-semibold text-ink">{question.statement}</h2>
                        <ul className="mt-3 space-y-1 text-sm text-taupe">
                            {(question.choices || []).map((choice) => (
                                <li key={choice.id}>{choice.text}</li>
                            ))}
                        </ul>
                    </article>
                ))}
            </div>
            {editingQuestion && (
                <EditQuestionModal
                    question={editingQuestion}
                    saving={saving}
                    onSave={handleSave}
                    onClose={() => setEditingQuestion(null)}
                />
            )}
        </section>
    );
};

export default AdminQuestions;