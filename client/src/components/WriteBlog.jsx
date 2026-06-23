import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function WriteBlog() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ title: "", content: "", tags: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");

  // Redirect guests away
  useEffect(() => {
    if (!localStorage.getItem("token")) navigate("/login");
  }, [navigate]);

  const handle = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.title.trim()) { setError("Title is required."); return; }
    if (!form.content.trim()) { setError("Content is required."); return; }

    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/blogs`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: form.title.trim(),
          content: form.content.trim(),
          tags: form.tags, // controller handles comma-split
        }),
      });
      const data = await res.json();
      if (!data.success) { setError(data.message); return; }
      navigate(`/blog/${data.data._id}`);
    } catch {
      setError("Network error — could not publish blog.");
    } finally {
      setLoading(false);
    }
  };

  const charCount = form.content.length;

  return (
    <div
      className="min-h-screen w-full"
      style={{ fontFamily: "'JetBrains Mono','Fira Code',monospace" }}
    >
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">

        {/* Back */}
        <button
          onClick={() => navigate("/blog")}
          className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-emerald-400 transition-colors mb-8"
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Blogs
        </button>

        {/* Card */}
        <div className="bg-slate-900/70 border border-slate-700/60 rounded-2xl overflow-hidden shadow-2xl">
          {/* Top accent */}
          <div className="h-0.5 w-full bg-gradient-to-r from-transparent via-emerald-400/60 to-transparent" />

          <div className="p-6 sm:p-8">
            <div className="mb-6">
              <h1 className="text-xl font-bold text-white tracking-tight">Write a Blog</h1>
              <p className="text-slate-500 text-xs mt-1">Share your knowledge with the community</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">

              {/* Title */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-widest text-slate-400">
                  Title <span className="text-emerald-400">*</span>
                </label>
                <input
                  type="text"
                  value={form.title}
                  onChange={handle("title")}
                  placeholder="e.g. Understanding Merge Sort Complexity"
                  maxLength={120}
                  required
                  className="w-full bg-slate-800/60 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-emerald-400/60 focus:ring-1 focus:ring-emerald-400/20 transition-all"
                />
                <p className="text-[10px] text-slate-600 text-right">{form.title.length}/120</p>
              </div>

              {/* Tags */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-widest text-slate-400">
                  Tags / Categories
                </label>
                <input
                  type="text"
                  value={form.tags}
                  onChange={handle("tags")}
                  placeholder="e.g. algorithms, sorting, big-o  (comma separated)"
                  className="w-full bg-slate-800/60 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-emerald-400/60 focus:ring-1 focus:ring-emerald-400/20 transition-all"
                />
                {/* Live tag preview */}
                {form.tags.trim() && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {form.tags.split(",").map((t) => t.trim()).filter(Boolean).map((tag) => {
                      const palette = [
                        "bg-emerald-400/10 text-emerald-400 border-emerald-500/30",
                        "bg-cyan-400/10 text-cyan-400 border-cyan-500/30",
                        "bg-yellow-400/10 text-yellow-400 border-yellow-500/30",
                        "bg-orange-400/10 text-orange-400 border-orange-500/30",
                        "bg-rose-400/10 text-rose-400 border-rose-500/30",
                        "bg-indigo-400/10 text-indigo-400 border-indigo-500/30",
                      ];
                      let hash = 0;
                      for (let i = 0; i < tag.length; i++) hash = tag.charCodeAt(i) + ((hash << 5) - hash);
                      const cls = palette[Math.abs(hash) % palette.length];
                      return (
                        <span key={tag} className={`text-[9px] uppercase tracking-widest px-2.5 py-0.5 rounded-full border font-semibold ${cls}`}>
                          {tag}
                        </span>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-widest text-slate-400">
                  Content <span className="text-emerald-400">*</span>
                </label>
                <textarea
                  value={form.content}
                  onChange={handle("content")}
                  placeholder="Write your blog content here…"
                  rows={16}
                  required
                  className="w-full bg-slate-800/60 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-emerald-400/60 focus:ring-1 focus:ring-emerald-400/20 transition-all resize-y leading-relaxed"
                />
                <p className="text-[10px] text-slate-600 text-right">{charCount} characters</p>
              </div>

              {/* Error */}
              {error && (
                <div className="flex items-start gap-2 bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-2.5">
                  <svg className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-red-400 text-xs">{error}</span>
                </div>
              )}

              {/* Actions */}
              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={() => navigate("/blog")}
                  className="text-xs text-slate-500 hover:text-slate-300 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex items-center gap-2 bg-emerald-400 hover:bg-emerald-300 disabled:opacity-50 disabled:cursor-not-allowed text-slate-950 font-bold text-xs tracking-widest uppercase px-6 py-2.5 rounded-xl transition-all active:scale-[0.97]"
                >
                  {loading ? (
                    <>
                      <svg className="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                      </svg>
                      Publishing…
                    </>
                  ) : "Publish Blog →"}
                </button>
              </div>
            </form>
          </div>

          <div className="h-0.5 w-full bg-gradient-to-r from-transparent via-slate-700/60 to-transparent" />
          <div className="px-6 sm:px-8 py-3 bg-slate-900/40 text-[10px] text-slate-600">
            Your blog will be visible to all users immediately after publishing.
          </div>
        </div>
      </div>
    </div>
  );
}
