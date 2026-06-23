import React from 'react'
import { Link } from 'react-router-dom';
import Features from './Features';
import Working from './Working';
import ReachOut from './ReachOut';

const UserHome = () => {
  return (
    <div className='mb-8'>
      <div className='flex flex-col justify-center items-center mt-25 my-auto mx-auto max-w-3xl'>
        <p className='inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 border-transparent bg-[#393E46] hover:bg-[#666c76] mb-2 text-white'>AI • Multi-language • Graphs • Monaco Editor</p>
        <h2 className='font-interx text-4xl md:text-6xl font-extrabold tracking-tight text-[#d9dce2]'>Code Complexity Analyzer</h2>
        <p className='mt-4 text-lg text-[#696c70]'>Analyze your code in real-time, across 10+ languages. Get error detection, complexity scoring, and instant AI-grade suggestions to improve quality and maintainability.</p>
      </div>
      <div className='mt-8 flex items-center justify-center gap-3'>       
        <Link to={"/code"} className='inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium transition-colors text-white hover:text-[#d9dce2] bg-amber-400 hover:bg-amber-500 rounded-md px-4 py-3'>Start Analyzing</Link>
        <Link to={"/features"} className='inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm text-[#d9dce2] font-medium transition-colors border-[#696c70] border hover:bg- hover:text- h-11 rounded-md px-8'>Features</Link>
      </div>
      <Features />
      <ReachOut />
    </div>

  )
}

export default UserHome;
