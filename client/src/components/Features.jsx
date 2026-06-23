import Navbar from "./Navbar"
import Working from "./Working"


const Features = () => {
    
  return (
    <div className="mt-15 mb-30">
        <Navbar />
        <section className="container pt-8 pb-3 md:pt-12 md:pb-7 text-white">
            <div className="text-center mb-8 ">
            <h2 className="text-3xl font-bold mb-3">Powerful Features</h2>
            <p className="">Everything you need for perfect code quality</p>
            </div>
            <div className="grid gap-6 md:grid-cols-3 ">
            <div className="rounded-xl border p-6 text-black bg-amber-200 hover:bg-amber-300">
                <h3 className="mt-4 text-xl font-semibold">AI Code Review</h3>
                <p className="mt-2 text-sm">
                GPT-4 powered analysis detects security flaws, suggests refactorings, and explains complexity issues in plain English.
                </p>
            </div>
            <div className="rounded-xl border p-6 text-black bg-amber-200 hover:bg-amber-300">
                <h3 className="mt-4 text-xl font-semibold">Monaco Editor</h3>
                <p className="mt-2 text-sm">
                Same editor as VS Code with syntax highlighting, auto-complete, and intelligent error markers for 10+ languages.
                </p>
            </div>
            <div className="rounded-xl border p-6 text-black bg-amber-200 hover:bg-amber-300">
                <h3 className="mt-4 text-xl font-semibold">AST-Based Parsing</h3>
                <p className="mt-2 text-sm">
                100% accurate syntax validation using Babel parser for JavaScript/TypeScript with line-precise error reporting.
                </p>
            </div>
            <div className="rounded-xl border p-6 text-black bg-amber-200 hover:bg-amber-300">
                <h3 className="mt-4 text-xl font-semibold">Smart Suggestions</h3>
                <p className="mt-2 text-sm">
                Get actionable refactoring advice, security warnings, and best practice recommendations tailored to your code.
                </p>
            </div>
            <div className="rounded-xl border p-6 text-black bg-amber-200 hover:bg-amber-300">
                <h3 className="mt-4 text-xl font-semibold">Complexity Metrics</h3>
                <p className="mt-2 text-sm">
                Track cyclomatic complexity, maintainability score, and code quality with real-time scoring from 0-100.
                </p>
            </div>
            <div className="rounded-xl border p-6 text-black bg-amber-200 hover:bg-amber-300">
                <h3 className="mt-4 text-xl font-semibold">Instant Analysis</h3>
                <p className="mt-2 text-sm">
                Real-time feedback with 500ms debounce. See issues, metrics, and AI insights appear as you type.
                </p>
            </div>
            </div>
        </section>
        <Working />
    </div>
  )
}

export default Features
