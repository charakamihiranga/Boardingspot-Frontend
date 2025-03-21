import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { IoClose } from "react-icons/io5";
import { ChevronDown } from "lucide-react";
import { useMediaQuery } from "react-responsive";
import { AppDispatch } from "../store/Store.ts";
import { useDispatch } from "react-redux";
import { googleAuth, registerUser } from "../reducers/UserSlice.ts";
import { User } from "../model/User.ts";
import Swal from "sweetalert2";
import { Gender } from "../model/enum/Gender.ts";
import { CredentialResponse, GoogleLogin } from "@react-oauth/google";
import {validateAuthForm} from "../util/validator.ts";

interface SignUpProps {
  isOpen: boolean;
  onClose: () => void;
}

function SignUp({ isOpen, onClose }: Readonly<SignUpProps>) {
  const [formData, setFormData] = useState<{
    fullName: string;
    email: string;
    dob: string;
    occupation: string;
    gender: Gender.MALE | Gender.FEMALE;
    password: string;
  }>({
    fullName: "",
    email: "",
    dob: "",
    occupation: "",
    gender: Gender.MALE,
    password: "",
  });
  const isMobile = useMediaQuery({ maxWidth: 768 });
  const dispatch = useDispatch<AppDispatch>();
  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
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

  useEffect(() => {
    if (isOpen) {
      setFormData({
        fullName: "",
        email: "",
        dob: "",
        occupation: "",
        gender: Gender.MALE,
        password: "",
      });
    }
  }, [isOpen]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validate form data
    const errors = validateAuthForm(formData);
    if (Object.keys(errors).length > 0) {
      await Swal.fire({
        title: "Validation Error",
        text: Object.values(errors).join("\n"),
        icon: "error",
        confirmButtonText: "Retry",
        confirmButtonColor: "#d33",
      });
      return;
    }

    const user: User = new User(
        formData.fullName,
        formData.email,
        new Date(formData.dob),
        formData.gender,
        "",
        formData.password
    );

    try {
      await dispatch(registerUser(user)).unwrap();
      onClose();
    } catch (error) {
      await Swal.fire({
        title: "Registration Failed",
        text: error as string,
        icon: "error",
        confirmButtonText: "Retry",
        confirmButtonColor: "#d33",
      });
    }
  };


  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-10">
      {/* Overlay */}
      <motion.div
        className="absolute inset-0 bg-gray-500 opacity-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.5 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.1 }}
      ></motion.div>

      {/* Main Modal */}
      <motion.div
        initial={{ y: isMobile ? "100%" : "100vh", opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: isMobile ? "100%" : "100vh", opacity: 0 }}
        transition={{
          type: "tween",
          duration: 0.1,
          ease: [0.33, 1, 0.68, 1],
        }}
        className={`bg-white rounded-t-3xl shadow-xl z-20 flex flex-col transition-all
             ${
               isMobile
                 ? "fixed bottom-0 left-0 right-0 h-[80vh] w-full overflow-y-auto"
                 : "rounded-4xl py-2 max-w-xl w-full"
             }
            `}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <button onClick={onClose}>
            <IoClose className="cursor-pointer text-2xl text-gray-700" />
          </button>
          <h2 className="text-lg font-semibold flex-grow text-center">
            Sign Up
          </h2>
          <div className="w-8"></div>
        </div>

        {/* Scrollable Content */}
        <div className="px-6 py-4 flex-1 overflow-y-auto">
          <h2 className="text-xl font-semibold text-center">
            Welcome to Boardingspot
          </h2>
          <p className="text-gray-600 text-sm text-center mb-4">
            Enter your details to sign up.
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <input
              type="text"
              name="fullName"
              placeholder="Full Name"
              className="border border-gray-700 p-3 rounded-lg"
              onChange={handleChange}
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              className="border p-3  border-gray-700 rounded-lg"
              onChange={handleChange}
              required
            />
            <input
              type="date"
              name="dob"
              className="border border-gray-700 p-3 rounded-lg"
              onChange={handleChange}
              required
            />
            <div className="relative">
              <select
                name="gender"
                className="border border-gray-700 p-3 pr-10 rounded-lg w-full appearance-none bg-white"
                onChange={handleChange}
                required
              >
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
              <div className="absolute inset-y-0 font-bold right-3 flex items-center pointer-events-none">
                <ChevronDown className="w-5 h-5 text-gray-700" />
              </div>
            </div>

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
              Continue
            </button>
          </form>

          {/* Separator */}
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

export default SignUp;
