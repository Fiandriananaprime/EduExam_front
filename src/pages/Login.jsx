import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { loginRequest } from "../api/authApi";

const Login = () =>  {
    const navigate = useNavigate();
    const { login } = useAuth();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
        const data = await loginRequest(email, password);

        localStorage.setItem("token", data.token);
        login(data.user);

        if (data.user.role === "student") {
        navigate("/student");
        } else if (data.user.role === "admin") {
        navigate("/admin");
        }
    } catch (error) {
        setError(error.message);
    } finally {
        setLoading(false);
    }
    };
  return (
    <div
      className="min-h-screen flex flex-col bg-cream"
      style={{ position: "relative", overflow: "hidden" }}
    >
      {/* Decorative circles */}
      <div className="pointer-events-none absolute top-[-180px] right-[-140px] w-[420px] h-[420px] rounded-full border-2 border-dashed border-sage opacity-15" />
      <div className="pointer-events-none absolute bottom-[-110px] left-[-80px] w-[240px] h-[240px] rounded-full bg-gold opacity-20" />

      {/* Header */}
      <header className="border-b-2 border-ink px-[6vw] py-[18px] flex items-center justify-between">
        <span className="font-serif text-2xl font-bold text-ink tracking-tight">
          Exam<span className="text-sage">Hub</span>
        </span>
        <span className="font-mono text-xs text-sage tracking-widest uppercase">
          Exam Platform
        </span>
      </header>

      {/* Main */}
      <main className="flex-1 flex items-center justify-center px-[6vw] py-14">
        <div
          className="w-full max-w-[460px] bg-paper border-2 border-ink rounded-xl shadow-2xl relative"
          style={{ padding: "40px 40px 32px" }}
        >
          {/* Inner border */}
          <div className="absolute inset-2 border border-rule rounded-lg pointer-events-none" />

          <div className="relative">
            {/* Header row */}
            <div className="flex justify-between items-center font-mono text-[0.7rem] tracking-widest uppercase text-ink border-b border-dashed border-taupe pb-3.5 mb-6">
              <span>Sign-in sheet</span>
              <span>2026 Session</span>
            </div>

            <h1 className="font-serif text-[1.9rem] font-semibold text-ink mb-1.5">
              Sign in
            </h1>
            <p className="text-sm text-ink/70 mb-6">
              Enter your credentials to access your ExamHub workspace.
            </p>

            {/* Role tabs */}
            <div className="grid grid-cols-2 border-[1.5px] border-ink rounded-lg overflow-hidden mb-6">
              <button
                type="button"
                className="text-center py-2.5 font-mono text-[0.72rem] tracking-widest uppercase bg-sage text-cream"
              >
                Student
              </button>
              <button
                type="button"
                className="text-center py-2.5 font-mono text-[0.72rem] tracking-widest uppercase text-ink border-l-[1.5px] border-ink hover:bg-cream/50"
              >
                Administrator
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="mb-4.5">
                <label className="block font-mono text-[0.68rem] tracking-widest uppercase text-sage mb-1.5">
                  Identifier
                </label>
                <input
                  type="email"
                  placeholder="prenom.nom@etablissement.mg"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full border-[1.5px] border-ink rounded-md bg-cream px-3 py-2.5 text-sm text-ink placeholder-taupe focus:outline-none focus:ring-2 focus:ring-sage transition-colors"
                />
              </div>

              <div className="mb-4">
                <label className="block font-mono text-[0.68rem] tracking-widest uppercase text-sage mb-1.5">
                  Password
                </label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full border-[1.5px] border-ink rounded-md bg-cream px-3 py-2.5 text-sm text-ink placeholder-taupe focus:outline-none focus:ring-2 focus:ring-sage transition-colors"
                />
              </div>

              <div className="flex items-center justify-between text-sm mb-6">
                <label className="flex items-center gap-2 text-ink/70 cursor-pointer select-none">
                  <input type="checkbox" className="accent-sage" />
                  Remember me
                </label>
                <button
                  type="button"
                  className="text-sage font-medium hover:underline text-sm"
                >
                  Forgot password?
                </button>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-ink text-cream rounded-md py-3 font-semibold text-sm hover:bg-ink/80 transition-colors flex items-center justify-center gap-2"
              >
                {loading ? "Logging in..." : "Log in"}
              </button>
            </form>

            <div className="mt-6 pt-4 border-t border-dashed border-taupe text-center text-sm text-ink/60">
              Don't have an account yet?{" "}
              <button type="button" className="text-sage font-semibold hover:underline">
                Contact your school
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default Login;