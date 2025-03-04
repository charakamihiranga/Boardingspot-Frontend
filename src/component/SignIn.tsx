import { useState, ChangeEvent, FormEvent } from "react";
import { motion } from "framer-motion";
import { IoClose } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import { googleAuth, loginUser } from "../reducers/UserSlice.ts";
import Swal from "sweetalert2";
import { useMediaQuery } from "react-responsive";
import { AppDispatch, RootState } from "../store/Store.ts";
import { CredentialResponse, GoogleLogin } from "@react-oauth/google";

interface LoginProps {
  isOpen: boolean;
  onClose: () => void;
}

function Login({ isOpen, onClose }: Readonly<LoginProps>) {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const isMobile = useMediaQuery({ maxWidth: 768 });
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector((state: RootState) => state.user.user);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await dispatch(loginUser(formData));
      console.log(user);
      onClose();
    } catch (error) {
      console.error(error);
      await Swal.fire({
        title: "Login Failed",
        text: "Invalid credentials. Please try again.",
        icon: "error",
        confirmButtonText: "Retry",
        confirmButtonColor: "#d33",
      });
    }
  };

  const handleGoogleLogin = async (credentialResponse: CredentialResponse) => {
    const token = credentialResponse.credential;
    if (token) {
      dispatch(googleAuth(token));
      onClose();
    }
  };

  const handleGoogleError = () => {
    Swal.fire({
      title: "Google Login Failed",
      text: "Something went wrong. Please try again.",
      icon: "error",
      confirmButtonText: "Retry",
      confirmButtonColor: "#d33",
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-1000">
      <motion.div
        className="absolute inset-0 bg-gray-500 opacity-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.5 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.1 }}
      ></motion.div>

      <motion.div
        initial={{ y: isMobile ? "100%" : "100vh", opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: isMobile ? "100%" : "100vh", opacity: 0 }}
        transition={{ type: "tween", duration: 0.1, ease: [0.33, 1, 0.68, 1] }}
        className={`bg-white rounded-t-3xl shadow-xl z-20 flex flex-col transition-all
             ${
               isMobile
                 ? "fixed bottom-0 left-0 right-0 h-[60vh] w-full overflow-y-auto"
                 : "rounded-4xl py-2 max-w-md w-full"
             }
            `}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <button onClick={onClose}>
            <IoClose className="cursor-pointer text-2xl text-gray-700" />
          </button>
          <h2 className="text-lg font-semibold flex-grow text-center">
            Sign In
          </h2>
          <div className="w-8"></div>
        </div>

        <div className="px-6 py-4 flex-1 overflow-y-auto">
          <h2 className="text-xl font-semibold text-center">Welcome Back</h2>
          <p className="text-gray-600 text-sm text-center mb-4">
            Sign in to your account
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <input
              type="email"
              name="email"
              placeholder="Email"
              className="border border-gray-700 p-3 rounded-lg"
              onChange={handleChange}
              required
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              className="border border-gray-700 p-3 rounded-lg"
              onChange={handleChange}
              required
            />
            <button
              type="submit"
              className="w-full bg-orange-600 text-white py-3 mt-2 rounded-lg font-semibold hover:bg-orange-700 transition"
            >
              Login
            </button>
          </form>

          <div className="relative text-center my-4">
            <div className="absolute text-gray-300 left-0 top-1/2 w-full border-t"></div>
            <span className="relative bg-white px-2 text-gray-500">or</span>
          </div>

          <div className="flex flex-col gap-3">
            <GoogleLogin
              onSuccess={handleGoogleLogin}
              onError={handleGoogleError}
              useOneTap
            />
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default Login;
