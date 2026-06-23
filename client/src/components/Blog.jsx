import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// ─── Helpers ───────────────────────────────────────────────────────────────
function formatDate(iso) {
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "2-digit", month: "short", year: "numeric",
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

// ─── Skeleton card ─────────────────────────────────────────────────────────
function SkeletonCard() {
  return (
    <div className="rounded-2xl border border-slate-700/50 bg-slate-900/60 p-5 space-y-3 animate-pulse">
      <div className="h-5 w-3/4 rounded bg-slate-700/60" />
      <div className="h-3 w-1/3 rounded bg-slate-700/40" />
      <div className="flex gap-2 pt-1">
        <div className="h-5 w-14 rounded-full bg-slate-700/40" />
        <div className="h-5 w-16 rounded-full bg-slate-700/40" />
      </div>
    </div>
  );
}

// ─── Blog card ─────────────────────────────────────────────────────────────
function BlogCard({ blog }) {
  const navigate = useNavigate();
  return (
    <div
      onClick={() => navigate(`/blog/${blog._id}`)}
      className="group cursor-pointer rounded-2xl border border-slate-700/50 bg-slate-900/70 p-5 space-y-3
                 hover:border-emerald-400/30 hover:bg-slate-800/70 hover:shadow-lg hover:shadow-emerald-400/5
                 transition-all duration-200"
      style={{ fontFamily: "'JetBrains Mono','Fira Code',monospace" }}
    >
      {/* Title */}
      <h2 className="text-sm font-bold text-slate-200 group-hover:text-emerald-400 transition-colors leading-snug line-clamp-2">
        {blog.title}
      </h2>

      {/* Meta */}
      <div className="flex items-center gap-3 text-[10px] text-slate-500">
        <span className="flex items-center gap-1">
          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          {blog.authorName}
        </span>
        <span>·</span>
        <span>{formatDate(blog.createdAt)}</span>
      </div>

      {/* Tags */}
      {blog.tags && blog.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 pt-1">
          {blog.tags.map((tag) => (
            <span
              key={tag}
              className={`text-[9px] uppercase tracking-widest px-2 py-0.5 rounded-full border font-semibold ${tagColor(tag)}`}
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Read more arrow */}
      <div className="flex justify-end">
        <span className="text-[10px] text-slate-600 group-hover:text-emerald-400 transition-colors">
          Read more →
        </span>
      </div>
    </div>
  );
}

// ─── Main Blog list page ───────────────────────────────────────────────────
export default function Blog() {
  const [blogs, setBlogs]       = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState("");
  const [search, setSearch]     = useState("");
  const [activeTag, setActiveTag] = useState("");
  const navigate = useNavigate();

  const isLoggedIn = !!localStorage.getItem("token");

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/blogs`);
        const data = await res.json();
        if (!data.success) { setError(data.message); return; }
        setBlogs(data.data);
      } catch {
        setError("Network error — could not load blogs.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // Collect all unique tags from all blogs
  const allTags = [...new Set(blogs.flatMap((b) => b.tags || []))];

  const filtered = blogs.filter((b) => {
    const matchSearch = !search.trim() ||
      b.title.toLowerCase().includes(search.toLowerCase()) ||
      b.authorName.toLowerCase().includes(search.toLowerCase());
    const matchTag = !activeTag || (b.tags || []).includes(activeTag);
    return matchSearch && matchTag;
  });

  return (
    <div
      className="min-h-screen w-full"
      style={{ fontFamily: "'JetBrains Mono','Fira Code',monospace" }}
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 mt-20">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              <span className="text-emerald-400">{"// "}</span>Blogs
            </h1>
            <p className="text-slate-500 text-xs mt-1">
              {loading ? "Loading…" : `${blogs.length} ${blogs.length === 1 ? "post" : "posts"} from the community`}
            </p>
          </div>

          {isLoggedIn && (
            <button
              onClick={() => navigate("/blog/write")}
              className="inline-flex items-center gap-2 bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-bold text-xs tracking-widest uppercase px-5 py-2.5 rounded-xl transition-all active:scale-[0.97]"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
              </svg>
              Write a Blog
            </button>
          )}
        </div>

        {/* Search */}
        <div className="relative mb-4">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by title or author…"
            className="w-full bg-slate-900/80 border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-emerald-400/60 focus:ring-1 focus:ring-emerald-400/20 transition-all"
          />
        </div>

        {/* Tag filter pills */}
        {allTags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            <button
              onClick={() => setActiveTag("")}
              className={`text-[9px] uppercase tracking-widest px-3 py-1 rounded-full border font-semibold transition-all
                ${!activeTag ? "bg-emerald-400/20 text-emerald-400 border-emerald-400/40" : "bg-slate-800/40 text-slate-500 border-slate-700/50 hover:border-slate-500"}`}
            >
              All
            </button>
            {allTags.map((tag) => (
              <button
                key={tag}
                onClick={() => setActiveTag(activeTag === tag ? "" : tag)}
                className={`text-[9px] uppercase tracking-widest px-3 py-1 rounded-full border font-semibold transition-all
                  ${activeTag === tag ? tagColor(tag) : "bg-slate-800/40 text-slate-500 border-slate-700/50 hover:border-slate-500"}`}
              >
                {tag}
              </button>
            ))}
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="mb-6 flex items-center gap-2 bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3">
            <svg className="w-4 h-4 text-red-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-red-400 text-xs">{error}</span>
          </div>
        )}

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1,2,3,4,5,6].map(i => <SkeletonCard key={i} />)}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 text-slate-500 text-sm space-y-2">
            <p>No blogs found{search ? ` for "${search}"` : ""}.</p>
            {isLoggedIn && (
              <button
                onClick={() => navigate("/blog/write")}
                className="mt-3 px-5 py-2 rounded-lg bg-emerald-400/10 border border-emerald-400/30 text-emerald-400 text-xs hover:bg-emerald-400/20 transition-all"
              >
                Be the first to write one →
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((blog) => <BlogCard key={blog._id} blog={blog} />)}
          </div>
        )}

        {/* Guest CTA */}
        {!isLoggedIn && !loading && (
          <div className="mt-10 text-center py-6 rounded-2xl border border-slate-700/40 bg-slate-900/40">
            <p className="text-slate-500 text-xs mb-3">Want to share your knowledge?</p>
            <button
              onClick={() => navigate("/login")}
              className="px-5 py-2 rounded-lg bg-emerald-400/10 border border-emerald-400/30 text-emerald-400 text-xs hover:bg-emerald-400/20 transition-all"
            >
              Log in to write a blog →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
