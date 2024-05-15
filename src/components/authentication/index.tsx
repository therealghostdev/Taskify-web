import { useState } from 'react'
import Login from './Login'
import Register from './Register'


export default function Index() {
  const [isLogin, setIsLogin] = useState(true)
   const [isRegister, setIsRegister] = useState(false)

  const registerSwap = ()=>{
    setIsLogin(!isLogin)
  }
  const loginSwap = ()=>{
    setIsRegister(!isRegister)
  }
  return (
    <div>
      {isLogin ? (
        <Login registerSwap={registerSwap} />): <Register loginSwap={loginSwap} />
      }
    </div>
  )
}
