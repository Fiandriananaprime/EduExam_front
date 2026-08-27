const EnabledStudentsAction = ({ onEdit }) => {
  return (
    <div class="flex items-center justify-end gap-2">
      <button
        class="text-xs px-3 py-1.5 border border-ink/30 rounded text-ink hover:bg-ink hover:text-cream transition-colors font-mono"
        onClick={onEdit}
      >
        Modifier
      </button>
      <button class="text-xs px-3 py-1.5 border border-taupe/50 rounded text-taupe hover:border-danger hover:text-danger transition-colors font-mono">
        Désactiver
      </button>
    </div>
  );
};
const DisaBledStudentsAction = ({ onEdit }) => {
  return (
    <div class="flex items-center justify-end gap-2 opacity-60">
      <button
        class="text-xs px-3 py-1.5 border border-ink/30 rounded text-ink hover:bg-ink hover:text-cream transition-colors font-mono"
        onClick={onEdit}
      >
        Modifier
      </button>
      <button class="text-xs px-3 py-1.5 border border-taupe/50 rounded text-taupe hover:border-danger hover:text-danger transition-colors font-mono">
        Désactiver
      </button>
    </div>
  );
};
export const TrStudent = ({ name, email, status, result, id, onEdit }) => {
  if (status === "DISACTIVATED") {
    return (
      <tr className="px-5 py-3 opacity-60" key={id}>
        <td className="px-5 py-3 flex items-center gap-2">
          <div class="w-8 h-8 rounded-full bg-gold/50 border border-ink/20 flex items-center justify-center font-serif font-bold text-xs text-ink shrink-0">
            {name[0]}
          </div>
          <span className="font-medium text-ink">{name}</span>
        </td>
        <td className="px-5 py-3 font-mono text-xs text-taupe">{email}</td>
        <td className="px-5 py-3">
          <span className="font-mono text-xs px-2 py-1 rounded bg-sage/15 text-sage">
            {status}
          </span>
        </td>
        <td className="px-5 py-3 font-mono text-xs text-ink">{result}</td>
        <td className="px-5 py-3">
            {status === "ACTIVE" ? (
            <EnabledStudentsAction onEdit={onEdit} />
          ) : (
            <DisaBledStudentsAction onEdit={onEdit} />
          )}
        </td>
      </tr>
    );
  }
  return (
    <tr className="px-5 py-3" key={id}>
      <td className="px-5 py-3 flex items-center gap-2">
        <div class="w-8 h-8 rounded-full bg-gold/50 border border-ink/20 flex items-center justify-center font-serif font-bold text-xs text-ink shrink-0">
          {name[0]}
        </div>
        <span className="font-medium text-ink">{name}</span>
      </td>
      <td className="px-5 py-3 font-mono text-xs text-taupe">{email}</td>
      <td className="px-5 py-3">
        <span className="font-mono text-xs px-2 py-1 rounded bg-sage/15 text-sage">
          {status}
        </span>
      </td>
      <td className="px-5 py-3 font-mono text-xs text-ink">{result}</td>
      <td className="px-5 py-3">
        {status === "ACTIVE" ? (
          <EnabledStudentsAction onEdit={onEdit} />
        ) : (
          <DisaBledStudentsAction onEdit={onEdit} />
        )}
      </td>
    </tr>
  );
};
