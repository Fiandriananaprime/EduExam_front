import { useState } from "react";
import { Modal } from "../../components/Admin/Modal";

const QuestionForm = ({ question, saving, onSave, onClose }) => {
    const [editingQuestion, setEditingQuestion] = useState(() => ({
        ...question,
        points: question.points ?? 0,
        choices: (question.choices || []).map((choice) => ({
            text: choice.text || "",
            isCorrect: Boolean(choice.isCorrect),
        })),
    }));

    const handleSubmit = (event) => {
        event.preventDefault();
        onSave({
            ...editingQuestion,
            statement: editingQuestion.statement.trim(),
            points: Number(editingQuestion.points),
            choices: editingQuestion.choices.map((choice) => ({
                text: choice.text.trim(),
                isCorrect: choice.isCorrect,
            })),
        });
    };

    return (
        <Modal
            title="Modify question"
            onClose={() => !saving && onClose()}
        >
            <form 
                onSubmit={handleSubmit} 
                className="flex max-h-[80vh] w-full max-w-2xl flex-col space-y-5 px-1"
            >
                <div>
                    <label className="mb-2 block font-mono text-xs uppercase tracking-widest text-taupe">
                        Statement
                    </label>
                    <textarea
                        value={editingQuestion.statement}
                        onChange={(event) => setEditingQuestion((q) => ({
                            ...q,
                            statement: event.target.value,
                        }))}
                        required
                        rows={3}
                        className="w-full rounded-lg border border-ink/30 bg-cream px-4 py-3 text-ink outline-none focus:border-ink"
                    />
                </div>
                <div>
                    <label className="mb-2 block font-mono text-xs uppercase tracking-widest text-taupe">
                        Points
                    </label>
                    <input
                        type="number"
                        min="1"
                        value={editingQuestion.points}
                        onChange={(event) => setEditingQuestion((q) => ({
                            ...q,
                            points: event.target.value,
                        }))}
                        required
                        className="w-full rounded-lg border border-ink/30 bg-cream px-4 py-3 text-ink outline-none focus:border-ink"
                    />
                </div>
                <div>
                    <p className="mb-2 font-mono text-xs uppercase tracking-widest text-taupe">Choix</p>
                    <div className="max-h-60 space-y-3 overflow-y-auto pr-2">
                        {editingQuestion.choices.map((choice, choiceIndex) => (
                            <div key={choiceIndex} className="flex flex-col-reverse gap-2 sm:flex-row sm:items-center sm:gap-3">
                                <input
                                    type="text"
                                    value={choice.text}
                                    onChange={(event) => setEditingQuestion((q) => ({
                                        ...q,
                                        choices: q.choices.map((currentChoice, currentIndex) =>
                                            currentIndex === choiceIndex
                                                ? { ...currentChoice, text: event.target.value }
                                                : currentChoice,
                                        ),
                                    }))}
                                    required
                                    className="min-w-0 flex-1 rounded-lg border border-ink/30 bg-cream px-4 py-3 text-ink outline-none focus:border-ink"
                                />
                                <label className="flex shrink-0 items-center gap-2 text-sm text-taupe">
                                    <input
                                        type="radio"
                                        name="correctChoice"
                                        checked={choice.isCorrect}
                                        onChange={() => setEditingQuestion((q) => ({
                                            ...q,
                                            choices: q.choices.map((currentChoice, currentIndex) => ({
                                                ...currentChoice,
                                                isCorrect: currentIndex === choiceIndex,
                                            })),
                                        }))}
                                    />
                                    Correct
                                </label>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="flex justify-end gap-3 border-t border-ink/15 pt-5">
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={saving}
                        className="rounded-lg border border-ink/30 px-5 py-3 text-ink hover:bg-ink/10 disabled:opacity-50"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={saving}
                        className="rounded-lg bg-ink px-5 py-3 font-medium text-white hover:bg-ink/80 disabled:opacity-50"
                    >
                        {saving ? "Saving..." : "Save"}
                    </button>
                </div>
            </form>
        </Modal>
    );
};

export default QuestionForm;