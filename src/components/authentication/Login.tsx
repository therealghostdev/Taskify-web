import { useState, FormEvent, ChangeEvent } from "react";
import AppleIcon from "@mui/icons-material/Apple";
import { useThemeContext } from "../../utils/app_context/general";
import { RegisterProps, LoginErrorsState } from "../../utils/types/todo";
import { toast } from "react-toastify";

export default function Login({ registerSwap }: RegisterProps) {
  const [formState, setFormState] = useState({
    userName: "",
    password: "",
  });
  const { userName, password } = formState;
  const { darkMode } = useThemeContext();

  const customId = "1";
  const notify = (message: string) =>
    toast(message, { theme: darkMode ? "dark" : "light", toastId: customId });

  const [errors, setErrors] = useState<LoginErrorsState>({
    username: "",
    password: "",
    disabledBtn: true,
  });

  // Update the errors state whenever the formState changes
  const typingHandler = (name: string, value: string) => {
    const newErrors = { ...errors };

    if (name === "userName") {
      newErrors.username = value.length < 1 ? "Username cannot be empty" : "";
    }
    if (name === "password") {
      newErrors.password =
        value.length < 6 ? "Password should have more than 6 characters" : "";
    }

    // Update the state based on errors
    newErrors.disabledBtn =
      newErrors.username !== "" || newErrors.password !== "";

    setErrors(newErrors);
  };

  const clearForm = () => {
    setFormState({
      userName: "",
      password: "",
    });

    setTimeout(() => {
      setErrors({
        username: "",
        password: "",
        disabledBtn: true,
      });
    }, 0);
  };

  const login = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!errors.disabledBtn) {
      console.log("Login successful");
      clearForm();
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormState((prev) => ({
      ...prev,
      [name]: value,
    }));
    typingHandler(name, value);
  };

  return (
    <div className="md:w-2/4 w-full lg:h-full flex justify-center items-center lg:block overflow-y-auto m-auto">
      <div className="w-full flex justify-center items-center m-auto">
        <form
          onSubmit={login}
          className={`py-2 my-5 rounded-lg px-3 md:w-3/4 w-full ${
            darkMode ? "text-[#ffffff]" : "text-[#000000]"
          }`}
        >
          <h1 id="loginHead" className="text-2xl pb-8 font-semibold">
            Login
          </h1>
          <div className="flex flex-col items-center">
            <div className="flex flex-col gap-2 w-full">
              <label className="w-full my-2 text-lg" htmlFor="username">
                Username
              </label>
              <input
                id="username"
                name="userName"
                value={userName}
                onChange={handleChange}
                className={`px-4 py-3 rounded-md w-full transition-all duration-700 border-2 border-[#535353] ${
                  darkMode
                    ? "bg-[#363636] text-[#AFAFAF] focus:outline-none"
                    : "bg-[#bdbdbd] text-[#000000] focus:outline-none"
                } ${errors.username ? "border-red-500" : ""}`}
                type="text"
                placeholder="Enter your Username"
              />
              {errors.username && (
                <div className="text-red-500 text-sm my-2">
                  {errors.username}
                </div>
              )}

              <label className="w-full my-2" htmlFor="password">
                Password
              </label>
              <input
                id="password"
                name="password"
                value={password}
                onChange={handleChange}
                className={`px-4 py-3 rounded-md w-full transition-all duration-700 border-2 border-[#535353] ${
                  darkMode
                    ? "bg-[#363636] text-[#AFAFAF] focus:outline-none"
                    : "bg-[#bdbdbd] text-[#000000] focus:outline-none"
                } ${errors.password ? "border-red-500" : ""}`}
                type="password"
                placeholder="Enter your Password"
              />
              {errors.password && (
                <div className="text-red-500 text-sm my-2">
                  {errors.password}
                </div>
              )}
            </div>
            <div className="pt-7 pb-3 w-full flex justify-center">
              <button
                disabled={errors.disabledBtn}
                className={`login text-lg w-full py-3 rounded-md bg-[#8687e7] ${
                  errors.disabledBtn ? "opacity-40 cursor-not-allowed" : ""
                }`}
                type="submit"
              >
                Login
              </button>
            </div>
            <div className="flex items-center justify-center py-5">
              <div className="w-1/2 border-b border-b-[#535353]"></div>
              <span className="text-lg mx-2">or</span>
              <div className="w-1/2 border-b border-b-[#535353]"></div>
            </div>
            <div className="googleLogin pb-3 w-full flex justify-center">
              <button
                className="w-full justify-center items-center py-2 flex border border-[#8875FF] rounded-md"
                type="button"
              >
                <span className="pr-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 48 48"
                    width="1rem"
                    height="auto"
                  >
                    <path
                      fill="#fbc02d"
                      d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12	s5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24s8.955,20,20,20	s20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
                    />
                    <path
                      fill="#e53935"
                      d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039	l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
                    />
                    <path
                      fill="#4caf50"
                      d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36	c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"
                    />
                    <path
                      fill="#1565c0"
                      d="M43.611,20.083L43.595,20L42,20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571	c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"
                    />
                  </svg>
                </span>
                <span
                  className="text-lg"
                  onClick={() => notify("Coming soon!")}
                >
                  Login with Google
                </span>
              </button>
            </div>
            <div className="appleLogin w-full flex justify-center">
              <button
                onClick={() => notify("coming soon!")}
                className="w-full justify-center items-center py-2 flex border border-[#8875FF] rounded-md"
                type="button"
              >
                <span className="pr-2 flex  ">
                  <AppleIcon className="appleicon" />
                </span>
                <span className="text-lg">Login with Apple</span>
              </button>
            </div>
            <div className="py-1 text-[#979797] my-2">
              <span className="text-lg mr-2">Don't have an account?</span>
              <button onClick={registerSwap} className="text-lg text-white link">
                Register
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
