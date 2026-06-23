import { useState } from 'react'
import { Link } from 'react-router-dom';
import { getUserInfo } from '../apicalls/users'
import { useEffect } from 'react';
import axios from "axios";



const Navbar = () => {
    const [login,setlogin] = useState(false);

    
    function loginhandler(){
        setlogin((login)?false:true);
    }
  return (
    <nav className='fixed w-full top-2 left-0 -[top-1] z-10'>
      <div className='flex bg-[#020202] rounded-2xl justify-around  gap-5 w-[1250px] h-18 mx-auto font-deca'>
        <div className='flex gap-1 justify-between items-center my-auto px-2 bg-[#020202] rounded-2xl h-13'>
          <Link to={"/"}><img src="../../images/code-solid-full.svg" alt="code cruncher logo" className='text-white bg-amber-400 w-10 h-7 rounded-2xl'/></Link>
          <Link to={'/'} className='text-[#c6bcbc] font-bold text-3xl'>CodeCruncher</Link>
        </div>
        <div className='flex justify-center items-center gap-15 text-xl text-[#c6bcbc] font-medium '>
          <Link to={'/faqs'} className='hover:text-amber-300' >FAQ</Link>
          <Link to={'/features'} className='hover:text-amber-300'>Features</Link>
          <Link to={'/blog'} className='hover:text-amber-300'>Blog</Link>
          {/* <Link to={'/working'} className='hover:text-amber-500'>Working</Link> */}
          <Link to={'/history'} className='hover:text-amber-300'>History</Link>
        </div>
        <div className='flex justify-center items-center text-xl'>
          <Link to={'/login'} className='bg-[#020202] text-[#c6bcbc] border font-medium rounded-2xl px-5 py-1 hover:text-amber-300' onClick={loginhandler}>{login?"Sign In":"Logout"}</Link>
        </div>
      </div>
    </nav>
    
  )
}

export default Navbar
