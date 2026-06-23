import { useState } from 'react'
import './App.css'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from './components/Navbar'
import CodeEditor from './components/CodeEditor'
import Home from './components/Home';
import FAQ from './components/FAQ';
import Features from './components/Features';
import Working from './components/Working';
import UserHome from './components/UserHome';
import ReachOut from './components/ReachOut';
import Login from './components/Login';
import SignUp from './components/SignUp';
import History from './components/History';
import Blog from './components/Blog';
import BlogDetail from './components/BlogDetail';
import WriteBlog from './components/WriteBlog';

function App() {

  return (
    <div className='bg-black h-full bg-[radial-gradient(circle_at_50%_0%,rgba(3,141,255,0.6)_0%,transparent_40%),radial-gradient(circle_at_0%_100%,rgba(3,141,255,0.6)_0%,transparent_40%),radial-gradient(circle_at_100%_100%,rgba(3,141,255,0.6)_0%,transparent_40%)] pt-2 min-h-full flex flex-col items-center'>
      <Navbar />
        <Routes>
          <Route path='/' element={<UserHome />}/>
          <Route path='/login' element={<Login />}/>
          <Route path='/signup' element={<SignUp />}/>
          <Route path='/faqs' element={<FAQ />}/>
          <Route path='/blog' element={<Blog />}/>
          <Route path='/features' element={<Features />}/>
          <Route path='/working' element={<Working />}/>
          <Route path='/code' element={<CodeEditor />}/>
          <Route path='/history' element={<History />}/>
          <Route path='/blog' element={<Blog />} />
          <Route path='/blog/write' element={<WriteBlog />} />
          <Route path='/blog/:id' element={<BlogDetail />} />
        </Routes>
    
    </div>
  )
}

export default App
