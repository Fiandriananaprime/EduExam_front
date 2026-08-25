const EnabledStudentsAction = () => {
  return (
    <div class="flex items-center justify-end gap-2">
      <button class="text-xs px-3 py-1.5 border border-ink/30 rounded text-ink hover:bg-ink hover:text-cream transition-colors font-mono">
        Modifier
      </button>
      <button class="text-xs px-3 py-1.5 border border-taupe/50 rounded text-taupe hover:border-danger hover:text-danger transition-colors font-mono">
        Désactiver
      </button>
    </div>
  );
};
const DisaBledStudentsAction = () => {
  return (
    <div class="flex items-center justify-end gap-2">
      <button class="text-xs px-3 py-1.5 border border-ink/30 rounded text-ink hover:bg-ink hover:text-cream transition-colors font-mono">
        Modifier
      </button>
      <button class="text-xs px-3 py-1.5 border border-taupe/50 rounded text-taupe hover:border-danger hover:text-danger transition-colors font-mono">
        Désactiver
      </button>
    </div>
  );
};
const TrStudent = ({ name, email, status, result }) => {
  return;
  <tr px-5 py-3>
    <td>{name}</td>
    <td>{email}</td>
    <td>{status}</td>
    <td>{result}</td>
    <td>
        {status = "Enabled" ? <EnabledStudentsAction /> : <DisaBledStudentsAction/>}
    </td>
  </tr>;
};
