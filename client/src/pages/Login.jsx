import React from 'react'
import {assets} from '../assets/assets'
import { SignIn } from '@clerk/clerk-react'


const Login = () => {
  return (
    <div className='min-h-screen flex flex-col md:flex-row'>
       {/* Background Image */}
       <img src={assets.bgImage} alt="" className='absolute w-full h-full object-cover top-0 left-0 -z-1'/>
        
        
        <div className='flex-1 flex flex-col items-start justify-between p-6 md:p-10 lg:pl-40'>
            <img src={assets.logo} alt="Sharezone Logo" className='object-contain h-12' />
            <div>
                
                <h1 className='text-3xl md:text-6xl md:pb-2 font-bold bg-gradient-to-r from-indigo-950 to-indigo-800 bg-clip-text text-transparent'>More than just friends truly connect</h1>
                <p className='text-xl md:text-3xl text-indigo-900 max-w-72 md:max-w-md'>connect with global community on sharezone.</p>
            </div>
            <span className='md:h-10'></span>
        </div>
        <div className=' flex-1 flex items-center justify-center p-6 sm:p-10 '>
            <SignIn/>
        </div>
    </div>
  )
}

export default Login