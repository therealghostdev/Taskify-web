import { useState } from "react";
import Login from "./Login";
import Register from "./Register";

export default function Index() {
  const [isLogin, setIsLogin] = useState<boolean>(true);

  const loginSwap = () => {
    setIsLogin(!isLogin);
  };
  return (
    <div className="flex md:flex-row flex-col justify-center items-center w-full md:h-screen md:overflow-y-hidden">
      <div className="md:w-2/4 w-full">HELLo</div>
      {isLogin ? (
        <Login registerSwap={loginSwap} />
      ) : (
        <Register loginSwap={loginSwap} />
      )}
    </div>
  );
}
