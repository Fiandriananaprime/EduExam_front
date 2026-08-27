import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getExamResults } from "../../api/adminApi";
import { useToast } from "../../context/ToastContext";

const AdminExamResults = () => {
    const { id } = useParams();
    const [data, setData] = useState({ results: [], attemptsCount: 0, average: 0 });
    const { showToast } = useToast();

    useEffect(() => {
        getExamResults(id)
            .then((response) => setData(response || { results: [], attemptsCount: 0, average: 0 }))
            .catch((err) => showToast(err.message, "error"));
    }, [id, showToast]);

    return (
        <section className="space-y-6">
            <div>
                <h1 className="font-serif text-2xl font-semibold text-ink">Exam Results</h1>
                <p className="mt-1 font-mono text-sm text-taupe">
                    {data.attemptsCount} attempt(s) · Average: {Number(data.average || 0).toFixed(2)}
                </p>
            </div>
            <div className="overflow-hidden rounded-xl border-2 border-ink/20 bg-paper">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="border-b border-rule bg-cream/50">
                            <th className="px-5 py-3 text-left font-mono text-xs uppercase text-taupe">Student</th>
                            <th className="px-5 py-3 text-left font-mono text-xs uppercase text-taupe">Score</th>
                            <th className="px-5 py-3 text-left font-mono text-xs uppercase text-taupe">Submitted</th>
                        </tr>
                    </thead>
                    <tbody>
                        {(Array.isArray(data.results) ? data.results : []).map((result) => (
                            <tr key={result.studentId} className="border-b border-ink/10 last:border-0">
                                <td className="px-5 py-3 text-ink">{result.firstName} {result.lastName}</td>
                                <td className="px-5 py-3 font-mono text-taupe">
                                    {result.attempted ? result.score : "Not attempted"}
                                </td>
                                <td className="px-5 py-3 font-mono text-taupe">
                                    {result.submittedAt ? new Date(result.submittedAt).toLocaleString("en-GB") : "—"}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </section>
    );
};

export default AdminExamResults;