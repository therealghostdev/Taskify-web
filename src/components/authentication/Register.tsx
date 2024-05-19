import './auth.scss';
import AppleIcon from '@mui/icons-material/Apple'
interface LoginProps{
  loginSwap: ()=>void
}

export default function Register({loginSwap}:LoginProps) {
  return (
    <div className='flex '>
    <div className='logo xsm:hidden lg:flex'>
    <div>Taskify</div>
    </div>
    <div className="formContainer h-screen flex justify-center items-center" >
      <form className=' rounded-lg dark:bg-slate-900 bg-slate-300 px-3  sm:w-80 xsm:w-11/12 h-auto flex flex-col  justify-center'>
      <h1 id='loginHead' className='text-2xl pb-8 font-semibold dark:text-white text-black'>Register</h1>
      <div className='flex flex-col items-center '>
        <label className=' w-full pb-3'>
          <div className='font-medium dark:text-white text-black'>Username</div>
          <input className='text-xs w-full h-7  py-2 dark:bg-black bg-slate-200 rounded border border-slate-400' type="text" placeholder='Enter your Username' />
        </label>
        <label className='w-full pb-3'>
          <div className='font-medium'>Password</div>
          <input className='border text-xs h-7 border-slate-400 rounded w-full dark:bg-black bg-slate-200' type="password" placeholder='Enter your Password' />
        </label>
        <label className='w-full pb-3'>
          <div className='font-medium'>Confirm Password</div>
          <input className='text-xs border h-7 border-slate-400 rounded w-full dark:bg-black bg-slate-200' type="password" placeholder='Enter your Password' />
        </label>
        <div className='pt-7 pb-3 w-full flex justify-center'>
          <button className='login text-sm w-full py-2 rounded-lg' type='submit'>
            Register
          </button>
        </div>
        <div className='flex items-center py-5 '>
          <hr className='w-1/2'/><span>or</span><hr className='w-1/2' />
        </div>
        <div className='googleLogin pb-3 w-full flex justify-center'>
          <button className='w-full justify-center items-center py-2 flex border' type='button'>
            <span className='pr-2'>
              <svg 
                    xmlns="http://www.w3.org/2000/svg"  
                    viewBox="0 0 48 48" 
                    width="1rem" 
                    height="auto">
                      <path 
                      fill="#fbc02d" 
                      d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12	s5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24s8.955,20,20,20	s20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"/>
                      <path 
                      fill="#e53935" 
                      d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039	l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"/>
                      <path 
                      fill="#4caf50" 
                      d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36	c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"/>
                      <path 
                      fill="#1565c0" 
                      d="M43.611,20.083L43.595,20L42,20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571	c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"/>
              </svg>
            </span>
            <span className='text-xs'>Register with Google</span>
          </button>
        </div>
        <div className='appleLogin w-full flex justify-center'>
          <button className='w-full  justify-center items-center py-2 flex border' type="button">
            <span className='pr-2 flex  '>
              <AppleIcon className='appleicon'/>
            </span>
            <span className='text-xs' >Register with apple</span>
          </button>
        </div>
        <div className='py-1  '>
         <span className='footNote text-slate-400'> Already have an account?</span> <button onClick={loginSwap} className='text-xs hover:underline'>Login</button>
        </div>
        </div>
      </form>
    </div>
  </div>
  )
}
