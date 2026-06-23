import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

function formatDate(iso) {
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "2-digit", month: "long", year: "numeric",
    hour: "2-digit", minute: "2-digit", hour12: true,
  });
}

function tagColor(tag) {
  const palette = [
    "bg-emerald-400/10 text-emerald-400 border-emerald-500/30",
    "bg-cyan-400/10 text-cyan-400 border-cyan-500/30",
    "bg-yellow-400/10 text-yellow-400 border-yellow-500/30",
    "bg-orange-400/10 text-orange-400 border-orange-500/30",
    "bg-rose-400/10 text-rose-400 border-rose-500/30",
    "bg-indigo-400/10 text-indigo-400 border-indigo-500/30",
    "bg-purple-400/10 text-purple-400 border-purple-500/30",
  ];
  let hash = 0;
  for (let i = 0; i < tag.length; i++) hash = tag.charCodeAt(i) + ((hash << 5) - hash);
  return palette[Math.abs(hash) % palette.length];
}

function SkeletonDetail() {
  return (
    <div className="animate-pulse space-y-5 max-w-3xl mx-auto px-4 py-12">
      <div className="h-8 w-2/3 rounded-lg bg-slate-700/60" />
      <div className="h-3 w-1/3 rounded bg-slate-700/40" />
      <div className="flex gap-2">
        <div className="h-5 w-14 rounded-full bg-slate-700/40" />
        <div className="h-5 w-16 rounded-full bg-slate-700/40" />
      </div>
      <div className="space-y-2 pt-4">
        {[1,2,3,4,5,6].map(i => (
          <div key={i} className={`h-3 rounded bg-slate-700/40 ${i % 3 === 0 ? "w-2/3" : "w-full"}`} />
        ))}
      </div>
    </div>
  );
}

export default function BlogDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [blog, setBlog]       = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState("");
  const [deleting, setDeleting]   = useState(false);
  const [confirmDel, setConfirmDel] = useState(false);

  // Check if current user is the author
  const token = localStorage.getItem("token");

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/blogs/${id}`);
        const data = await res.json();
        if (!data.success) { setError(data.message); return; }
        setBlog(data.data);
      } catch {
        setError("Network error — could not load blog.");
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  const handleDelete = async () => {
    setDeleting(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/blogs/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) navigate("/blog");
      else setError(data.message);
    } catch {
      setError("Failed to delete blog.");
    } finally {
      setDeleting(false);
      setConfirmDel(false);
    }
  };

  if (loading) return <SkeletonDetail />;

  if (error) return (
    <div className="max-w-3xl mx-auto px-4 py-12 text-center" style={{ fontFamily: "'JetBrains Mono',monospace" }}>
      <p className="text-red-400 text-sm mb-4">{error}</p>
      <button onClick={() => navigate("/blog")} className="text-emerald-400 text-xs hover:underline">← Back to Blogs</button>
    </div>
  );

  return (
    <div
      className="min-h-screen w-full"
      style={{ fontFamily: "'JetBrains Mono','Fira Code',monospace" }}
    >
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">

        {/* Back button */}
        <button
          onClick={() => navigate("/blog")}
          className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-emerald-400 transition-colors mb-8"
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Blogs
        </button>

        {/* Article */}
        <article>
          {/* Tags */}
          {blog.tags && blog.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-4">
              {blog.tags.map((tag) => (
                <span key={tag} className={`text-[9px] uppercase tracking-widest px-2.5 py-0.5 rounded-full border font-semibold ${tagColor(tag)}`}>
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Title */}
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white leading-snug tracking-tight mb-4">
            {blog.title}
          </h1>

          {/* Meta row */}
          <div className="flex flex-wrap items-center justify-between gap-3 mb-8 pb-6 border-b border-slate-700/40">
            <div className="flex items-center gap-3 text-xs text-slate-500">
              <div className="w-7 h-7 rounded-full bg-emerald-400/10 border border-emerald-400/30 flex items-center justify-center text-emerald-400 font-bold text-xs">
                {blog.authorName?.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="text-slate-300 font-semibold">{blog.authorName}</p>
                <p className="text-slate-600">{formatDate(blog.createdAt)}</p>
              </div>
            </div>

            {/* Delete — only shown to the author */}
            {token && (
              <div className="flex items-center gap-2">
                {!confirmDel ? (
                  <button
                    onClick={() => setConfirmDel(true)}
                    className="inline-flex items-center gap-1.5 text-[10px] px-3 py-1.5 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20 transition-all"
                  >
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    Delete
                  </button>
                ) : (
                  <div className="flex items-center gap-2 text-[10px]">
                    <span className="text-slate-500">Delete this blog?</span>
                    <button
                      onClick={handleDelete}
                      disabled={deleting}
                      className="px-2.5 py-1 rounded bg-red-500/20 border border-red-500/40 text-red-400 hover:bg-red-500/30 transition-all disabled:opacity-50"
                    >
                      {deleting ? "..." : "Yes, delete"}
                    </button>
                    <button
                      onClick={() => setConfirmDel(false)}
                      className="px-2.5 py-1 rounded bg-slate-700/50 border border-slate-600/40 text-slate-400 hover:bg-slate-600/50 transition-all"
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Content */}
          <div className="text-sm text-slate-400 leading-8 whitespace-pre-wrap">
            {blog.content}
          </div>
        </article>
      </div>
    </div>
  );
}
