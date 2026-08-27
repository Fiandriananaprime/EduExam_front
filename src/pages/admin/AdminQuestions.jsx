import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getExamQuestions } from "../../api/adminApi";

const AdminQuestions = () => {
    const { id } = useParams();
    const [questions, setQuestions] = useState([]);
    const [error, setError] = useState("");

    useEffect(() => {
        getExamQuestions(id)
            .then((data) => setQuestions(Array.isArray(data) ? data : []))
            .catch((err) => setError(err.message));
    }, [id]);

    return (
        <section className="space-y-6">
            <div>
                <h1 className="font-serif text-2xl font-semibold text-ink">Questions</h1>
                <p className="mt-1 font-mono text-sm text-taupe">
                    {questions.length} question(s)
                </p>
            </div>
            {error && <p className="rounded-lg bg-red-100 px-4 py-3 text-sm text-red-700">{error}</p>}
            <div className="space-y-3">
                {questions.map((question, index) => (
                    <article key={question.id} className="rounded-xl border-2 border-ink/20 bg-paper p-5">
                        <div className="font-mono text-xs text-taupe">Question {index + 1} · {question.points} pt</div>
                        <h2 className="mt-2 font-serif text-lg font-semibold text-ink">{question.statement}</h2>
                        <ul className="mt-3 space-y-1 text-sm text-taupe">
                            {(question.choices || []).map((choice) => (
                                <li key={choice.id}>{choice.text}</li>
                            ))}
                        </ul>
                    </article>
                ))}
            </div>
        </section>
    );
};

export default AdminQuestions;