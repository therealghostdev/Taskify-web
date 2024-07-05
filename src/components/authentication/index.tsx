import { useState } from "react";
import Login from "./Login";
import Register from "./Register";

export default function Index() {
  const [isLogin, setIsLogin] = useState<boolean>(true);
  const [isRegister, setIsRegister] = useState<boolean>(false);

  const registerSwap = () => {
    setIsLogin(!isLogin);
  };
  const loginSwap = () => {
    setIsRegister(!isRegister);
  };
  return (
    <div className="flex md:flex-row flex-col justify-center items-center w-full md:h-screen md:overflow-y-hidden">
      <div className="md:w-2/4 w-full">HELLo</div>
      {isLogin ? (
        <Login registerSwap={registerSwap} />
      ) : (
        <Register loginSwap={loginSwap} />
      )}
    </div>
  );
}
