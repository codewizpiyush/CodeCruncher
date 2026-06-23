import React from 'react'
import Navbar from './Navbar'

const Working = () => {
  return (
    <div>
        <Navbar />
        <section className="container py-12 md:py-20 text-white">
            <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-bold">How it works</h2>
            <p className="mt-4">
                Paste or type your code in Monaco Editor, select the language, and watch live analysis appear instantly. 
                Our AST parser catches syntax errors with precision, while AI examines your code for security, 
                refactoring opportunities, and best practices. Get complexity metrics, issue reports, and intelligent 
                suggestions—all in real-time.
            </p>
            <div className="mt-8 grid gap-4 sm:grid-cols-3 text-left">
                <div className="p-4 rounded-lg border text-black bg-amber-200 hover:bg-amber-300">
                <div className="font-semibold mb-2">1. Write Code</div>
                <p className="text-sm">Use Monaco Editor with syntax highlighting</p>
                </div>
                <div className="p-4 rounded-lg border text-black bg-amber-200 hover:bg-amber-300">
                <div className="font-semibold mb-2">2. Auto-Analyze</div>
                <p className="text-sm">Get instant syntax validation & metrics</p>
                </div>
                <div className="p-4 rounded-lg border text-black bg-amber-200 hover:bg-amber-300">
                <div className="font-semibold mb-2">3. AI Insights</div>
                <p className="text-sm">Receive intelligent suggestions & fixes</p>
                </div>
            </div>
            </div>
        </section>
    </div>
  )
}

export default Working
