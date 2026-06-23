import { useState, useEffect, useRef } from 'react';
import Editor from '@monaco-editor/react';
import {
  Chart as ChartJS,
  CategoryScale, LinearScale, PointElement,
  LineElement, Title, Tooltip, Legend, Filler,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale, LinearScale, PointElement,
  LineElement, Title, Tooltip, Legend, Filler,
);

// ─── Big-O notation → numeric rank (for chart ordering) ───────────────────
const BIG_O_RANK = {
  'o(1)': 0, 'o(log n)': 1, 'o(n)': 2,
  'o(n log n)': 3, 'o(n²)': 4, 'o(n^2)': 4,
  'o(2^n)': 5, 'o(n!)': 6,
};

// Map a Gemini notation string → a canonical key
function canonicalKey(notation) {
  if (!notation) return null;
  const n = notation.toLowerCase().replace(/\s+/g, '');
  if (n.includes('n!'))                         return 'o(n!)';
  if (n.includes('2^n') || n.includes('^n'))    return 'o(2^n)';
  if (n.includes('n^2') || n.includes('n²') || n.includes('n2')) return 'o(n²)';
  if (n.includes('nlogn') || n.includes('nlog')) return 'o(n log n)';
  if (n.includes('logn') || n.includes('log'))   return 'o(log n)';
  if (n.includes('(n)'))                         return 'o(n)';
  if (n.includes('(1)'))                         return 'o(1)';
  return null;
}

// Generate Y values for each Big-O class given X input sizes
function bigOValue(key, x) {
  switch (key) {
    case 'o(1)':       return 1;
    case 'o(log n)':   return Math.log2(x + 1);
    case 'o(n)':       return x;
    case 'o(n log n)': return x * Math.log2(x + 1);
    case 'o(n²)':      return x * x;
    case 'o(2^n)':     return Math.min(Math.pow(2, x), 1000);
    case 'o(n!)':      return Math.min([1,1,2,6,24,120,720,5040,40320,362880][x] || 1000, 1000);
    default:           return x;
  }
}

const ALL_CURVES = [
  { key: 'o(1)',       label: 'O(1)',       color: '#00ffa3' },
  { key: 'o(log n)',   label: 'O(log n)',   color: '#22d3ee' },
  { key: 'o(n)',       label: 'O(n)',       color: '#facc15' },
  { key: 'o(n log n)', label: 'O(n log n)', color: '#fb923c' },
  { key: 'o(n²)',      label: 'O(n²)',      color: '#f87171' },
  { key: 'o(2^n)',     label: 'O(2ⁿ)',      color: '#e879f9' },
  { key: 'o(n!)',      label: 'O(n!)',      color: '#ff4d4d' },
];

const X_LABELS = ['1','2','3','4','5','6','7','8','9','10'];
const X_VALUES = [1,2,3,4,5,6,7,8,9,10];

const CHART_BASE_OPTIONS = {
  responsive: true,
  maintainAspectRatio: false,
  animation: { duration: 600, easing: 'easeInOutQuart' },
  plugins: {
    legend: {
      position: 'bottom',
      labels: {
        color: '#94a3b8',
        font: { family: "'JetBrains Mono', monospace", size: 11 },
        padding: 16,
        boxWidth: 12,
        boxHeight: 2,
      },
    },
    tooltip: {
      backgroundColor: '#0f172a',
      borderColor: '#334155',
      borderWidth: 1,
      titleColor: '#e2e8f0',
      bodyColor: '#94a3b8',
      titleFont: { family: "'JetBrains Mono', monospace", size: 11 },
      bodyFont:  { family: "'JetBrains Mono', monospace", size: 11 },
      padding: 10,
    },
  },
  scales: {
    x: {
      ticks: { color: '#475569', font: { family: "'JetBrains Mono', monospace", size: 10 } },
      grid:  { color: 'rgba(51,65,85,0.4)' },
      title: { display: true, text: 'Input size (n)', color: '#475569', font: { size: 10 } },
    },
    y: {
      ticks: { color: '#475569', font: { family: "'JetBrains Mono', monospace", size: 10 } },
      grid:  { color: 'rgba(51,65,85,0.4)' },
      title: { display: true, text: 'Operations', color: '#475569', font: { size: 10 } },
      max: 120,
    },
  },
};

// ─── Chart 1: All Big-O curves, user's worst-case highlighted ─────────────
function BigOOverviewChart({ worstTime }) {
  const highlightKey = canonicalKey(worstTime);

  const datasets = ALL_CURVES.map(({ key, label, color }) => {
    const isHighlight = key === highlightKey;
    return {
      label: isHighlight ? `${label} ← your code` : label,
      data: X_VALUES.map(x => bigOValue(key, x)),
      borderColor: color,
      backgroundColor: isHighlight ? color + '22' : 'transparent',
      borderWidth: isHighlight ? 3 : 1.5,
      borderDash: isHighlight ? [] : [4, 3],
      pointRadius: isHighlight ? 4 : 2,
      pointBackgroundColor: color,
      fill: isHighlight,
      tension: 0.3,
      order: isHighlight ? 0 : 1,
    };
  });

  return (
    <ResultCard title="Big-O Growth Curves — Your Worst Case Highlighted" icon="📈">
      <div className="h-64 sm:h-72">
        <Line
          data={{ labels: X_LABELS, datasets }}
          options={{
            ...CHART_BASE_OPTIONS,
            plugins: {
              ...CHART_BASE_OPTIONS.plugins,
              title: { display: false },
            },
          }}
        />
      </div>
      {highlightKey && (
        <p className="mt-3 text-xs text-slate-500 text-center">
          Your worst-case <span className="text-emerald-400 font-bold">{worstTime}</span> is shown as a solid filled curve
        </p>
      )}
    </ResultCard>
  );
}

// ─── Chart 2: Best / Average / Worst time on one chart ────────────────────
function TimeComparisonChart({ bestTime, averageTime, worstTime }) {
  const cases = [
    { label: 'Best Case',    notation: bestTime,    color: '#00ffa3' },
    { label: 'Average Case', notation: averageTime, color: '#facc15' },
    { label: 'Worst Case',   notation: worstTime,   color: '#f87171' },
  ];

  const datasets = cases
    .filter(c => canonicalKey(c.notation))
    .map(({ label, notation, color }) => {
      const key = canonicalKey(notation);
      return {
        label: `${label} — ${notation}`,
        data: X_VALUES.map(x => bigOValue(key, x)),
        borderColor: color,
        backgroundColor: color + '18',
        borderWidth: 2.5,
        pointRadius: 3,
        pointBackgroundColor: color,
        fill: true,
        tension: 0.35,
      };
    });

  return (
    <ResultCard title="Best / Average / Worst Time Comparison" icon="⏱">
      <div className="h-64 sm:h-72">
        <Line
          data={{ labels: X_LABELS, datasets }}
          options={CHART_BASE_OPTIONS}
        />
      </div>
    </ResultCard>
  );
}

// ─── Chart 3: Space complexity growth curve ───────────────────────────────
function SpaceComplexityChart({ spaceComplexity }) {
  const key = canonicalKey(spaceComplexity);

  const datasets = key ? [{
    label: `Space — ${spaceComplexity}`,
    data: X_VALUES.map(x => bigOValue(key, x)),
    borderColor: '#818cf8',
    backgroundColor: '#818cf822',
    borderWidth: 2.5,
    pointRadius: 4,
    pointBackgroundColor: '#818cf8',
    fill: true,
    tension: 0.35,
  }] : [];

  return (
    <ResultCard title="Space Complexity Growth" icon="🧠">
      <div className="h-64 sm:h-72">
        {datasets.length > 0 ? (
          <Line
            data={{ labels: X_LABELS, datasets }}
            options={{
              ...CHART_BASE_OPTIONS,
              scales: {
                ...CHART_BASE_OPTIONS.scales,
                y: {
                  ...CHART_BASE_OPTIONS.scales.y,
                  title: { display: true, text: 'Memory usage', color: '#475569', font: { size: 10 } },
                },
              },
            }}
          />
        ) : (
          <div className="h-full flex items-center justify-center text-slate-500 text-sm">
            Could not map <span className="text-slate-300 mx-1 font-mono">{spaceComplexity}</span> to a known Big-O class
          </div>
        )}
      </div>
      {key && (
        <p className="mt-3 text-xs text-slate-500 text-center">
          Space complexity: <span className="text-indigo-400 font-bold">{spaceComplexity}</span>
        </p>
      )}
    </ResultCard>
  );
}

// ─── Complexity badge colour ───────────────────────────────────────────────
function complexityColor(notation) {
  if (!notation) return 'text-slate-400 border-slate-600';
  const n = notation.toLowerCase();
  if (n.includes('1)'))                                              return 'text-emerald-400 border-emerald-500/40 bg-emerald-400/5';
  if (n.includes('log'))                                             return 'text-cyan-400   border-cyan-500/40   bg-cyan-400/5';
  if (n.includes('n)') && !n.includes('n²') && !n.includes('n^2')) return 'text-yellow-400  border-yellow-500/40  bg-yellow-400/5';
  if (n.includes('n log') || n.includes('nlogn'))                   return 'text-orange-400 border-orange-500/40 bg-orange-400/5';
  if (n.includes('n²') || n.includes('n^2') || n.includes('n2'))   return 'text-rose-400   border-rose-500/40   bg-rose-400/5';
  if (n.includes('2^n') || n.includes('n!'))                        return 'text-red-500    border-red-600/40    bg-red-500/5';
  return 'text-slate-300 border-slate-600 bg-slate-800/40';
}

// ─── Complexity pill badge ─────────────────────────────────────────────────
function ComplexityBadge({ label, value }) {
  const colors = complexityColor(value);
  return (
    <div className={`flex flex-col items-center justify-center rounded-xl border px-4 py-3 min-w-[110px] ${colors}`}>
      <span className="text-[10px] uppercase tracking-widest text-slate-500 mb-1">{label}</span>
      <span className={`text-base font-bold font-mono ${colors.split(' ')[0]}`}>{value || '—'}</span>
    </div>
  );
}

// ─── Section card ──────────────────────────────────────────────────────────
function ResultCard({ title, icon, children }) {
  return (
    <div className="rounded-xl border border-slate-700/60 bg-slate-900/70 overflow-hidden">
      <div className="flex items-center gap-2 px-5 py-3 border-b border-slate-700/50 bg-slate-800/40">
        <span className="text-emerald-400 text-base">{icon}</span>
        <h3 className="text-xs font-semibold tracking-widest uppercase text-slate-300">{title}</h3>
      </div>
      <div className="px-5 py-4">{children}</div>
    </div>
  );
}

// ─── Skeleton loader ───────────────────────────────────────────────────────
function Skeleton() {
  return (
    <div className="space-y-4 animate-pulse mt-8">
      <div className="h-72 rounded-xl bg-slate-800/60" />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="h-72 rounded-xl bg-slate-800/60" />
        <div className="h-72 rounded-xl bg-slate-800/60" />
      </div>
      <div className="flex gap-3">
        {[1,2,3,4].map(i => <div key={i} className="h-16 flex-1 rounded-xl bg-slate-800/60" />)}
      </div>
      <div className="h-28 rounded-xl bg-slate-800/60" />
      <div className="h-36 rounded-xl bg-slate-800/60" />
    </div>
  );
}

// ─── Full results panel ────────────────────────────────────────────────────
function ResultsPanel({ result }) {
  const {
    bestTime, averageTime, worstTime,
    spaceComplexity, calculationExplanation,
    optimizationSuggestions, staticMetrics,
  } = result;

  return (
    <div
      className="mt-8 space-y-5"
      style={{ fontFamily: "'JetBrains Mono', 'Fira Code', monospace" }}
    >
      {/* Accent line */}
      <div className="h-px w-full bg-gradient-to-r from-transparent via-emerald-400/50 to-transparent" />

      {/* Header row */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-sm font-bold tracking-widest uppercase text-slate-300">
          Analysis Results
        </h2>
        {staticMetrics && (
          <div className="flex flex-wrap gap-4 text-xs text-slate-500">
            <span>LOC: <span className="text-slate-300">{staticMetrics.linesOfCode}</span></span>
            <span>Cyclomatic: <span className="text-slate-300">{staticMetrics.cyclomaticComplexity}</span></span>
            <span>Functions: <span className="text-slate-300">{staticMetrics.totalFunctions}</span></span>
          </div>
        )}
      </div>

      {/* ── CHARTS (above everything else) ─────────────────────────────── */}

      {/* Chart 1 — Full Big-O overview with highlight */}
      <BigOOverviewChart worstTime={worstTime} />

      {/* Chart 2 & 3 — side by side on wider screens */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <TimeComparisonChart
          bestTime={bestTime}
          averageTime={averageTime}
          worstTime={worstTime}
        />
        <SpaceComplexityChart spaceComplexity={spaceComplexity} />
      </div>

      {/* ── TEXT RESULTS (below charts) ────────────────────────────────── */}

      {/* Complexity badges */}
      <div className="flex flex-wrap gap-3">
        <ComplexityBadge label="Best Time"    value={bestTime} />
        <ComplexityBadge label="Average Time" value={averageTime} />
        <ComplexityBadge label="Worst Time"   value={worstTime} />
        <ComplexityBadge label="Space"        value={spaceComplexity} />
      </div>

      {/* Calculation explanation */}
      {calculationExplanation && (
        <ResultCard title="How It Was Calculated" icon="📐">
          <p className="text-sm text-slate-400 leading-relaxed whitespace-pre-wrap">
            {calculationExplanation}
          </p>
        </ResultCard>
      )}

      {/* Optimization suggestions */}
      {optimizationSuggestions && optimizationSuggestions.length > 0 && (
        <ResultCard title="Optimization Suggestions" icon="⚡">
          <ul className="space-y-2">
            {optimizationSuggestions.map((s, i) => (
              <li key={i} className="flex items-start gap-3 text-sm text-slate-400">
                <span className="mt-0.5 flex-shrink-0 w-5 h-5 rounded-full bg-emerald-400/10 border border-emerald-400/30 flex items-center justify-center text-emerald-400 text-[10px] font-bold">
                  {i + 1}
                </span>
                <span className="leading-relaxed">{s}</span>
              </li>
            ))}
          </ul>
        </ResultCard>
      )}
    </div>
  );
}

// ─── Main component ────────────────────────────────────────────────────────
function CodeEditor() {
  const [code, setCode]     = useState('\n// Write your code here\n');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError]   = useState('');

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    setError('');
    setResult(null);
    setLoading(true);

    try {
      const token = localStorage.getItem('token');

      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/analyze`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ code, language: 'js' }),
      });

      const data = await response.json();

      if (!data.success) {
        setError(data.message || 'Analysis failed. Please try again.');
        return;
      }

      setResult(data.data);

      setTimeout(() => {
        document.getElementById('analysis-results')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);

    } catch (err) {
      setError('Network error — could not reach the server.');
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="w-full max-w-5xl mx-auto px-4 sm:px-6 py-10 mt-40 mb-50">
      <h2
        className="text-3xl md:text-5xl font-extrabold tracking-tight text-[#d9dce2] text-center mb-8"
        style={{ fontFamily: "'JetBrains Mono', 'Fira Code', monospace" }}
      >
        Code Complexity Analyzer
      </h2>

      <form onSubmit={onSubmitHandler}>
        <div className="rounded-xl overflow-hidden border border-slate-700/60 shadow-2xl">
          <Editor
            width="100%"
            height="480px"
            defaultLanguage="javascript"
            value={code}
            onChange={(val) => setCode(val)}
            theme="vs-dark"
            options={{
              minimap: { enabled: false },
              fontSize: 14,
              wordWrap: 'on',
              automaticLayout: true,
              scrollBeyondLastLine: false,
              padding: { top: 12, bottom: 12 },
            }}
          />
        </div>

        {error && (
          <div className="mt-4 flex items-center gap-2 bg-red-500/10 border border-red-500/30 rounded-lg px-4 py-2.5">
            <svg className="w-4 h-4 text-red-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-red-400 text-xs" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
              {error}
            </span>
          </div>
        )}

        <div className="flex justify-center mt-5">
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center gap-2 bg-[#393E46] hover:bg-[#4a515b] disabled:opacity-50 disabled:cursor-not-allowed text-[#EEEEEE] hover:text-[#00ADB5] font-bold rounded-xl px-8 py-2.5 transition-all duration-200 active:scale-[0.97] text-sm"
            style={{ fontFamily: "'JetBrains Mono', monospace" }}
          >
            {loading ? (
              <>
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                </svg>
                Analyzing…
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                Analyze
              </>
            )}
          </button>
        </div>
      </form>

      <div id="analysis-results">
        {loading && <Skeleton />}
        {!loading && result && <ResultsPanel result={result} />}
      </div>
    </section>
  );
}

export default CodeEditor;