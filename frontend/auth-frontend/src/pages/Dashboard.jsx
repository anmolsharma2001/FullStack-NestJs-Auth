// pages/Dashboard.jsx

import { Link } from "react-router-dom";

export default function Dashboard() {
  return (
    <>
  <div className="text-center mt-10 ">
   <p className="text-2xl font-extrabold"> Welcome to Dashboard</p>

    <div className="flex gap-5 justify-center">
         <button className="mt-5 p-4 rounded-2xl bg-amber-400 text-white ">
        <Link to='/change-password'>Change Password</Link>
     </button>
        
      
    </div>

    <button className="mt-5 p-4 rounded-2xl bg-blue-400 text-white ">
        <Link to='/forgot-password'>Forgot Password</Link>
     </button>

    </div>
   
   </>
  )
}
