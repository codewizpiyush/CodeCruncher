import { useState } from "react";
import axios from "axios";

const EyeIcon = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
  </svg>
);

const EyeOffIcon = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
  </svg>
);

const ComplexityIcon = () => (
  <svg width="32" height="32" viewBox="0 0 36 36" fill="none">
    <rect x="2" y="24" width="6" height="10" rx="1" fill="#00ffa3" />
    <rect x="10" y="16" width="6" height="18" rx="1" fill="#00ffa3" opacity="0.7" />
    <rect x="18" y="8" width="6" height="26" rx="1" fill="#00ffa3" opacity="0.5" />
    <rect x="26" y="2" width="6" height="32" rx="1" fill="#00ffa3" opacity="0.3" />
    <path d="M5 24 L13 16 L21 8 L29 2" stroke="#00ffa3" strokeWidth="1.5" strokeDasharray="3 2" />
  </svg>
);

const inputClass =
  "w-full bg-slate-800/60 border border-slate-700 rounded-lg px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400/40 transition-all duration-200";

const InputField = ({ label, id, type = "text", value, onChange, placeholder, required, children }) => (
  <div className="flex flex-col gap-1.5">
    <label htmlFor={id} className="text-xs font-semibold tracking-widest uppercase text-slate-400">
      {label} {required && <span className="text-emerald-400">*</span>}
    </label>
    {children || (
      <input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className={inputClass}
      />
    )}
  </div>
);

const PasswordField = ({ label, id, value, onChange, placeholder, show, onToggle, required }) => (
  <InputField label={label} id={id} required={required}>
    <div className="relative">
      <input
        id={id}
        type={show ? "text" : "password"}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className={`${inputClass} pr-10`}
      />
      <button
        type="button"
        onClick={onToggle}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-emerald-400 transition-colors"
      >
        {show ? <EyeOffIcon /> : <EyeIcon />}
      </button>
    </div>
  </InputField>
);

export default function SignUp() {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    dob: "",
    phoneNumber: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handle = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (form.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    const { confirmPassword, ...payload } = form;
    payload.phoneNumber = Number(payload.phoneNumber);

    try {
      setLoading(true);
      const { data } = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/users/register`, payload);
      if (!data.success) {
        setError(data.message || "Registration failed. Please try again.");
        return;
      }
      setSubmitted(true);
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div
        className="min-h-[50vh] bg-slate-950 flex items-center justify-center p-4 rounded-2xl mb-150 mt-50"
        style={{ fontFamily: "'JetBrains Mono', 'Fira Code', 'Courier New', monospace" }}
      >
        <div className="text-center space-y-4 px-6 max-w-sm w-full">
          <div className="w-16 h-16 rounded-full bg-emerald-400/10 border border-emerald-400/40 flex items-center justify-center mx-auto animate-pulse">
            <svg className="w-8 h-8 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">Account Created!</h2>
          <p className="text-slate-400 text-sm">
            Your account is pending approval. You'll be notified once an admin activates it.
          </p>
          <button
            onClick={() => setSubmitted(false)}
            className="mt-4 px-6 py-2 rounded-lg bg-emerald-400/10 border border-emerald-400/30 text-emerald-400 text-sm hover:bg-emerald-400/20 transition-all"
          >
            ← Back to Sign Up
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen bg-slate-950 flex items-center justify-center p-4 sm:p-6 relative overflow-hidden mt-30 rounded-2xl mb-5 -top-10"
      style={{ fontFamily: "'JetBrains Mono', 'Fira Code', 'Courier New', monospace" }}
    >
      {/* Background grid */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "linear-gradient(#00ffa3 1px, transparent 1px), linear-gradient(90deg, #00ffa3 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />
      {/* Glow blobs */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative w-full max-w-xl">
        {/* Header */}
        <div className="text-center mb-6 sm:mb-8">
          <div className="flex items-center justify-center gap-2.5 mb-2">
            <ComplexityIcon />
            <span className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Code<span className="text-emerald-400">Cruncher</span>
            </span>
          </div>
          <p className="text-slate-500 text-xs tracking-widest uppercase">
            Analyze · Optimize · Master Complexity
          </p>
        </div>

        {/* Card */}
        <div className="bg-slate-900/80 backdrop-blur border border-slate-700/60 rounded-2xl shadow-2xl overflow-hidden">
          {/* Top accent */}
          <div className="h-0.5 w-full bg-gradient-to-r from-transparent via-emerald-400/60 to-transparent" />

          <div className="p-5 sm:p-8">
            <div className="mb-5 sm:mb-6">
              <h1 className="text-lg sm:text-xl font-bold text-white tracking-tight">Create Account</h1>
              <p className="text-slate-500 text-xs mt-1">
                <span className="text-emerald-400">role: user</span>
                &nbsp;·&nbsp; awaiting admin activation
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">

              {/* Row 1 — First / Last name */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <InputField
                  label="First Name" id="firstName"
                  value={form.firstName} onChange={handle("firstName")}
                  placeholder="John" required
                />
                <InputField
                  label="Last Name" id="lastName"
                  value={form.lastName} onChange={handle("lastName")}
                  placeholder="Doe" required
                />
              </div>

              {/* Row 2 — Email (full width) */}
              <InputField
                label="Email Address" id="email" type="email"
                value={form.email} onChange={handle("email")}
                placeholder="you@example.com" required
              />

              {/* Row 3 — Passwords */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <PasswordField
                  label="Password" id="password"
                  value={form.password} onChange={handle("password")}
                  placeholder="Min. 6 characters"
                  show={showPassword} onToggle={() => setShowPassword(!showPassword)}
                  required
                />
                <PasswordField
                  label="Confirm Password" id="confirmPassword"
                  value={form.confirmPassword} onChange={handle("confirmPassword")}
                  placeholder="Re-enter password"
                  show={showConfirm} onToggle={() => setShowConfirm(!showConfirm)}
                  required
                />
              </div>

              {/* Row 4 — DOB / Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <InputField
                  label="Date of Birth" id="dob" type="date"
                  value={form.dob} onChange={handle("dob")}
                  required
                />
                <InputField
                  label="Phone Number" id="phoneNumber" type="tel"
                  value={form.phoneNumber} onChange={handle("phoneNumber")}
                  placeholder="+91 9876543210" required
                />
              </div>

              {/* Error */}
              {error && (
                <div className="flex items-start gap-2 bg-red-500/10 border border-red-500/30 rounded-lg px-4 py-2.5">
                  <svg className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-red-400 text-xs">{error}</span>
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full mt-1 bg-emerald-400 hover:bg-emerald-300 disabled:opacity-60 disabled:cursor-not-allowed text-slate-950 font-bold text-sm tracking-widest uppercase py-3 rounded-lg transition-all duration-200 hover:shadow-lg hover:shadow-emerald-400/20 active:scale-[0.98] flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                    </svg>
                    Registering...
                  </>
                ) : (
                  "Create Account →"
                )}
              </button>

              <p className="text-center text-xs text-slate-600 leading-relaxed">
                New accounts require admin activation before access is granted.
                <br />
                Already have an account?{" "}
                <a href="/login" className="text-emerald-400 hover:text-emerald-300 transition-colors">
                  Sign in
                </a>
              </p>
            </form>
          </div>

          {/* Bottom bar */}
          <div className="h-0.5 w-full bg-gradient-to-r from-transparent via-slate-700/60 to-transparent" />
          <div className="px-5 sm:px-8 py-3 bg-slate-900/40 flex items-center justify-between">
            <span className="text-xs text-slate-600">O(n) · O(n log n) · O(1)</span>
            <span className="text-xs text-slate-600">CodeCruncher © 2026</span>
          </div>
        </div>
      </div>
    </div>
  );
}
