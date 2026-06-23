import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// ─── Helpers ───────────────────────────────────────────────────────────────

function formatDate(iso) {
  const d = new Date(iso);
  return d.toLocaleDateString("en-IN", {
    day: "2-digit", month: "short", year: "numeric",
    hour: "2-digit", minute: "2-digit", hour12: true,
  });
}

function complexityColor(notation) {
  if (!notation) return { text: "text-slate-400", border: "border-slate-600", bg: "bg-slate-800/40" };
  const n = notation.toLowerCase();
  if (n.includes("1)"))                                               return { text: "text-emerald-400", border: "border-emerald-500/40", bg: "bg-emerald-400/5" };
  if (n.includes("log"))                                              return { text: "text-cyan-400",    border: "border-cyan-500/40",    bg: "bg-cyan-400/5"    };
  if (n.includes("n)") && !n.includes("n²") && !n.includes("n^2"))  return { text: "text-yellow-400",  border: "border-yellow-500/40",  bg: "bg-yellow-400/5"  };
  if (n.includes("n log") || n.includes("nlogn"))                    return { text: "text-orange-400",  border: "border-orange-500/40",  bg: "bg-orange-400/5"  };
  if (n.includes("n²") || n.includes("n^2") || n.includes("n2"))    return { text: "text-rose-400",    border: "border-rose-500/40",    bg: "bg-rose-400/5"    };
  if (n.includes("2^n") || n.includes("n!"))                         return { text: "text-red-500",     border: "border-red-600/40",     bg: "bg-red-500/5"     };
  return { text: "text-slate-300", border: "border-slate-600", bg: "bg-slate-800/40" };
}

// ─── Complexity pill ───────────────────────────────────────────────────────
function ComplexityPill({ label, value }) {
  const c = complexityColor(value);
  return (
    <div className={`flex flex-col items-center justify-center rounded-lg border px-3 py-2 min-w-[90px] ${c.border} ${c.bg}`}>
      <span className="text-[9px] uppercase tracking-widest text-slate-500 mb-0.5">{label}</span>
      <span className={`text-sm font-bold font-mono ${c.text}`}>{value || "—"}</span>
    </div>
  );
}

// ─── Skeleton cards ────────────────────────────────────────────────────────
function SkeletonCard() {
  return (
    <div className="rounded-2xl border border-slate-700/50 bg-slate-900/60 p-5 space-y-4 animate-pulse">
      <div className="flex justify-between">
        <div className="h-4 w-32 rounded bg-slate-700/60" />
        <div className="h-4 w-24 rounded bg-slate-700/60" />
      </div>
      <div className="flex gap-2">
        {[1,2,3,4].map(i => <div key={i} className="h-12 flex-1 rounded-lg bg-slate-700/60" />)}
      </div>
      <div className="h-24 rounded-lg bg-slate-700/60" />
      <div className="h-16 rounded-lg bg-slate-700/60" />
    </div>
  );
}

// ─── Empty state ───────────────────────────────────────────────────────────
function EmptyState() {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center space-y-4">
      <div className="w-16 h-16 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center">
        <svg className="w-7 h-7 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
      </div>
      <p className="text-slate-400 font-semibold text-sm tracking-wide">No analyses yet</p>
      <p className="text-slate-600 text-xs max-w-xs">
        Head to the code editor, paste your code, and hit Analyze — your history will show up here.
      </p>
      <button
        onClick={() => navigate("/code")}
        className="mt-2 px-5 py-2 rounded-lg bg-emerald-400/10 border border-emerald-400/30 text-emerald-400 text-xs hover:bg-emerald-400/20 transition-all"
      >
        Start Analyzing →
      </button>
    </div>
  );
}

// ─── Single history card ───────────────────────────────────────────────────
function HistoryCard({ item, onDelete }) {
  const [expanded, setExpanded] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const handleDelete = async () => {
    setDeleting(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`/api/history/${item._id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) onDelete(item._id);
    } catch (e) {
      console.error("Delete failed:", e);
    } finally {
      setDeleting(false);
      setConfirmDelete(false);
    }
  };

  const worstColor = complexityColor(item.worstTime);

  return (
    <div
      className="rounded-2xl border border-slate-700/50 bg-slate-900/70 overflow-hidden transition-all duration-200 hover:border-slate-600/70 hover:shadow-lg hover:shadow-black/30"
      style={{ fontFamily: "'JetBrains Mono', 'Fira Code', monospace" }}
    >
      {/* Card header */}
      <div className="flex items-center justify-between px-5 py-4 bg-slate-800/40 border-b border-slate-700/40">
        <div className="flex items-center gap-3">
          {/* Worst-case indicator dot */}
          <span className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${worstColor.text.replace("text-", "bg-")}`} />
          <div>
            <p className="text-xs text-slate-300 font-semibold">
              Worst: <span className={worstColor.text}>{item.worstTime || "—"}</span>
            </p>
            <p className="text-[10px] text-slate-600 mt-0.5">{formatDate(item.createdAt)}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Language badge */}
          <span className="text-[10px] uppercase tracking-widest px-2 py-0.5 rounded-md bg-slate-700/60 text-slate-400 border border-slate-600/40">
            {item.language || "js"}
          </span>

          {/* Expand / collapse */}
          <button
            onClick={() => setExpanded(!expanded)}
            className="w-7 h-7 rounded-lg bg-slate-700/50 hover:bg-slate-600/60 flex items-center justify-center text-slate-400 hover:text-white transition-all"
          >
            <svg
              className={`w-3.5 h-3.5 transition-transform duration-200 ${expanded ? "rotate-180" : ""}`}
              fill="none" viewBox="0 0 24 24" stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {/* Delete */}
          {!confirmDelete ? (
            <button
              onClick={() => setConfirmDelete(true)}
              className="w-7 h-7 rounded-lg bg-slate-700/50 hover:bg-red-500/20 flex items-center justify-center text-slate-500 hover:text-red-400 transition-all"
              title="Delete"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          ) : (
            <div className="flex items-center gap-1">
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="text-[10px] px-2 py-1 rounded bg-red-500/20 border border-red-500/40 text-red-400 hover:bg-red-500/30 transition-all disabled:opacity-50"
              >
                {deleting ? "..." : "Yes"}
              </button>
              <button
                onClick={() => setConfirmDelete(false)}
                className="text-[10px] px-2 py-1 rounded bg-slate-700/50 border border-slate-600/40 text-slate-400 hover:bg-slate-600/60 transition-all"
              >
                No
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Always-visible: complexity pills */}
      <div className="px-5 py-4">
        <div className="flex flex-wrap gap-2">
          <ComplexityPill label="Best Time"    value={item.bestTime} />
          <ComplexityPill label="Average Time" value={item.averageTime} />
          <ComplexityPill label="Worst Time"   value={item.worstTime} />
          <ComplexityPill label="Space"        value={item.spaceComplexity} />
        </div>
      </div>

      {/* Expandable: full details */}
      {expanded && (
        <div className="px-5 pb-5 space-y-4 border-t border-slate-700/30 pt-4">

          {/* Code snippet */}
          {item.code && (
            <div>
              <p className="text-[10px] uppercase tracking-widest text-slate-500 mb-2">Code</p>
              <pre className="bg-slate-950/80 border border-slate-700/50 rounded-xl p-4 text-xs text-slate-300 overflow-x-auto max-h-64 leading-relaxed scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
                <code>{item.code}</code>
              </pre>
            </div>
          )}

          {/* Explanation */}
          {item.calculationExplanation && (
            <div>
              <p className="text-[10px] uppercase tracking-widest text-slate-500 mb-2">How It Was Calculated</p>
              <div className="bg-slate-800/40 border border-slate-700/40 rounded-xl px-4 py-3">
                <p className="text-xs text-slate-400 leading-relaxed whitespace-pre-wrap">
                  {item.calculationExplanation}
                </p>
              </div>
            </div>
          )}

          {/* Optimization suggestions */}
          {item.optimizationSuggestions && item.optimizationSuggestions.length > 0 && (
            <div>
              <p className="text-[10px] uppercase tracking-widest text-slate-500 mb-2">Optimization Suggestions</p>
              <ul className="space-y-2">
                {item.optimizationSuggestions.map((s, i) => (
                  <li key={i} className="flex items-start gap-3 text-xs text-slate-400">
                    <span className="mt-0.5 flex-shrink-0 w-4 h-4 rounded-full bg-emerald-400/10 border border-emerald-400/30 flex items-center justify-center text-emerald-400 text-[9px] font-bold">
                      {i + 1}
                    </span>
                    <span className="leading-relaxed">{s}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Main History page ─────────────────────────────────────────────────────
export default function History() {
  const [items, setItems]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState("");
  const [search, setSearch]   = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    (async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/history`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (!data.success) {
          setError(data.message || "Failed to load history.");
          return;
        }
        setItems(data.data);
      } catch (e) {
        setError("Network error — could not reach the server.");
      } finally {
        setLoading(false);
      }
    })();
  }, [navigate]);

  const handleDelete = (id) => {
    setItems((prev) => prev.filter((item) => item._id !== id));
  };

  // Filter by worst-case notation or code snippet
  const filtered = items.filter((item) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      item.worstTime?.toLowerCase().includes(q)  ||
      item.bestTime?.toLowerCase().includes(q)   ||
      item.spaceComplexity?.toLowerCase().includes(q) ||
      item.code?.toLowerCase().includes(q)
    );
  });

  return (
    <div
      className="min-h-screen w-full"
      style={{ fontFamily: "'JetBrains Mono', 'Fira Code', monospace" }}
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 mt-20">

        {/* Page header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-1">
            <svg className="w-5 h-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">Analysis History</h1>
          </div>
          <p className="text-slate-500 text-xs ml-8">
            {loading ? "Loading…" : `${items.length} ${items.length === 1 ? "analysis" : "analyses"} saved`}
          </p>
        </div>

        {/* Search bar */}
        {!loading && items.length > 0 && (
          <div className="relative mb-6">
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500"
              fill="none" viewBox="0 0 24 24" stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Filter by complexity (e.g. O(n²)) or code keyword…"
              className="w-full bg-slate-900/80 border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-emerald-400/60 focus:ring-1 focus:ring-emerald-400/20 transition-all"
            />
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

        {/* Content */}
        {loading ? (
          <div className="space-y-4">
            {[1,2,3].map(i => <SkeletonCard key={i} />)}
          </div>
        ) : items.length === 0 ? (
          <EmptyState />
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 text-slate-500 text-sm">
            No results matching <span className="text-slate-300">"{search}"</span>
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map((item) => (
              <HistoryCard key={item._id} item={item} onDelete={handleDelete} />
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
