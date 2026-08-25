export function StudentForm({ onSave, onCancel }) {
  function handleSubmit(event) {
    event.preventDefault();

    // We'll handle the student data here later

    onSave();
  }

  return (
    <form onSubmit={handleSubmit}>

      <div className="grid grid-cols-2 gap-5">

        <div className="flex flex-col gap-2">
          <label
            htmlFor="firstName"
            className="text-xs font-medium tracking-widest text-[#403D08]"
          >
            FIRST NAME
          </label>

          <input
            id="firstName"
            name="firstName"
            type="text"
            placeholder="Amina"
            className="rounded-lg border border-[#403D08]/30 bg-[#F0F0D0] px-4 py-3 outline-none focus:border-[#403D08]"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label
            htmlFor="lastName"
            className="text-xs font-medium tracking-widest text-[#403D08]"
          >
            LAST NAME
          </label>

          <input
            id="lastName"
            name="lastName"
            type="text"
            placeholder="Rakotomalala"
            className="rounded-lg border border-[#403D08]/30 bg-[#F0F0D0] px-4 py-3 outline-none focus:border-[#403D08]"
          />
        </div>

      </div>

      <div className="mt-5 flex flex-col gap-2">
        <label
          htmlFor="email"
          className="text-xs font-medium tracking-widest text-[#403D08]"
        >
          EMAIL ADDRESS
        </label>

        <input
          id="email"
          name="email"
          type="email"
          placeholder="firstname.lastname@etud.mg"
          className="rounded-lg border border-[#403D08]/30 bg-[#F0F0D0] px-4 py-3 outline-none focus:border-[#403D08]"
        />
      </div>

      <div className="mt-5 flex flex-col gap-2">
        <label
          htmlFor="password"
          className="text-xs font-medium tracking-widest text-[#403D08]"
        >
          TEMPORARY PASSWORD
        </label>

        <input
          id="password"
          name="password"
          type="password"
          placeholder="••••••••"
          className="rounded-lg border border-[#403D08]/30 bg-[#F0F0D0] px-4 py-3 outline-none focus:border-[#403D08]"
        />
      </div>

      <div className="mt-7 flex justify-end gap-3 border-t border-[#403D08]/15 pt-5">

        <button
          type="button"
          onClick={onCancel}
          className="rounded-lg border border-[#403D08]/30 px-5 py-3 text-[#403D08] hover:bg-[#403D08]/10"
        >
          Cancel
        </button>

        <button
          type="submit"
          className="rounded-lg bg-[#403D08] px-5 py-3 font-medium text-white hover:bg-[#514D0A]"
        >
          Add student
        </button>

      </div>

    </form>
  );
}