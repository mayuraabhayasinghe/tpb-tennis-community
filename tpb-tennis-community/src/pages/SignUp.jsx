"use client";

import React, { useEffect, useState } from "react";
import { Navbar } from "../components/Navbar";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../services/createClient";
import { UserAuth } from "../context/AuthContext";
import AnimatedLogo from "../components/AnimatedLogo";

const MailIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
    <polyline points="22,6 12,13 2,6"></polyline>
  </svg>
);
const LockIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
    <circle cx="12" cy="16" r="1"></circle>
    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
  </svg>
);
const EyeIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
    <circle cx="12" cy="12" r="3"></circle>
  </svg>
);
const EyeOffIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
    <line x1="1" y1="1" x2="23" y2="23"></line>
  </svg>
);

const PhoneIcon = () => (
  <svg
    fill="#99A1AF"
    stroke="currentColor"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M3,4.5 L3,6.50657781 C3,14.5147067 9.49187113,21.0065778 17.5,21.0065778 L19.5,21.0065778 C20.3284271,21.0065778 21,20.3350049 21,19.5065778 L21,16.9415184 C21,16.2958728 20.5868549,15.7226646 19.9743416,15.5184935 L16.7910868,14.4574086 C16.1493722,14.2435037 15.4438837,14.4855623 15.0686697,15.0483832 L14.3397029,16.1418335 C13.9644889,16.7046545 13.2590004,16.9467131 12.6172858,16.7328082 L11.0918861,16.2243416 C9.52761302,15.7029173 8.32743167,14.4342085 7.89358037,12.8434204 L7.26652359,10.5442122 C7.05705568,9.7761632 7.48408037,8.97826027 8.23932768,8.72651116 L8.84188612,8.52565835 C9.4722734,8.31552926 9.85610633,7.67801925 9.74686542,7.02257376 L9.28533671,4.25340152 C9.16478972,3.53011956 8.53900455,3 7.80574582,3 L4.5,3 C3.67157288,3 3,3.67157288 3,4.5 Z M2,4.5 C2,3.11928813 3.11928813,2 4.5,2 L7.80574582,2 C9.02784371,2 10.070819,2.88353261 10.2717306,4.08900253 L10.7332593,6.85817477 C10.9233967,7.99899864 10.2553231,9.10860523 9.15811388,9.47434165 L8.55555544,9.67519446 C8.30380634,9.75911083 8.16146478,10.0250785 8.23128742,10.2810948 L8.85834419,12.580303 C9.20422134,13.8485192 10.1610361,14.8599657 11.4081139,15.2756584 L12.9335135,15.7841249 C13.1474184,15.8554265 13.3825812,15.7747403 13.5076526,15.5871333 L14.2366194,14.493683 C14.861976,13.5556481 16.0377903,13.1522171 17.1073146,13.5087253 L20.2905694,14.5698102 C21.3114248,14.9100953 22,15.8654424 22,16.9415184 L22,19.5065778 C22,20.8872897 20.8807119,22.0065778 19.5,22.0065778 L17.5,22.0065778 C8.93958638,22.0065778 2,15.0669914 2,6.50657781 L2,4.5 Z" />
  </svg>
);

const NameIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 48 48"
    fill="none"
    stroke="currentColor"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle
      cx="24"
      cy="11"
      r="7"
      fill="none"
      stroke="currentColor"
      strokeWidth="4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M4 41C4 32.1634 12.0589 25 22 25"
      stroke="currentColor"
      strokeWidth="5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M31 42L41 32L37 28L27 38V42H31Z"
      fill="none"
      stroke="currentColor"
      strokeWidth="4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const GoogleIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
  >
    <path
      fill="#4285F4"
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
    />
    <path
      fill="#34A853"
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
    />
    <path
      fill="#FBBC05"
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
    />
    <path
      fill="#EA4335"
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
    />
  </svg>
);
const SignUp = () => {
  const { signUp } = UserAuth();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [contactNo, setContactNo] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setconfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [checked, setChecked] = useState(false);
  const [validation, setValidation] = useState(false);

  const navigate = useNavigate();

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleCheckClick = () => {
    setChecked(!checked);
  };

  // const handleSignUpWithPassword = async function () {
  //   try {
  //     // Clear any previous error messages
  //     setErrorMessage("");

  //     const result = await signUp(email, password);

  //     if (result.success) {
  //       navigate("/create-profile");
  //       console.log("Signup successful:", result.data);
  //     } else if (!result.success) {
  //       setErrorMessage(result.error);
  //       console.error("Signup error:", result.error);
  //       return;
  //     }
  //   } catch (err) {
  //     console.error("Unexpected error during signup:", err);
  //     setErrorMessage("An unexpected error occurred. Please try again.");
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const handleSubmission = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    try {
      setLoading(true);

      const result = await signUp(email, password);
      if (result.success) {
        console.log("Signup successful:", result.data);
      } else if (!result.success) {
        setErrorMessage(result.error);
        console.error("Signup error:", result.error);
        return;
      }

      const user = result.data.user;

      //Update profile table
      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .update({
          first_name: firstName,
          last_name: lastName,
          contact_no: contactNo,
          isProfileComplete: true,
        })
        .eq("id", user.id);

      if (profileError) {
        console.log("Error updating profile: ", profileError.message);
        setErrorMessage(profileError.message);
        return;
      }
      navigate("/");
    } catch (error) {
      console.error("An unexpected error occurred: ", error);
    } finally {
      setLoading(false);
    }
  };

  //The function to sign up with Google OAuth
  // const handleSignUpWithGoogle = async () => {
  //   try {
  //     setErrorMessage("");
  //     const { data, error } = await supabase.auth.signInWithOAuth({
  //       provider: "google",
  //       options: {
  //         redirectTo: `${window.location.origin}/create-profile`,
  //       },
  //     });

  //     if (error) {
  //       setErrorMessage(error.message);
  //       console.error("Google signup error:", error);
  //     }
  //   } catch (err) {
  //     console.error("Unexpected error during Google signup:", err);
  //     setErrorMessage("An unexpected error occurred with Google sign in.");
  //   }
  // };

  useEffect(() => {
    const handleValidation = () => {
      if (
        firstName &&
        lastName &&
        email &&
        password &&
        confirmPassword &&
        checked
      ) {
        setValidation(true);
        // console.log(validation);
      } else {
        setValidation(false);
      }
    };

    handleValidation();
  }, [email, password, checked]);
  return (
    <>
      <Navbar />
      <div className="mt-20 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {loading ? (
            <div className="flex -mt-20 h-screen justify-center items-center">
              <AnimatedLogo type="bounce" size="default" />
            </div>
          ) : (
            <div className="bg-white dark:bg-black border border-gray-200 dark:border-gray-800 rounded-lg p-8 shadow-sm">
              {}
              <form className="space-y-6" onSubmit={handleSubmission}>
                {}
                <div className="space-y-2 text-center font-bold text-black text-lg">
                  <h1>Create your account</h1>
                </div>
                {errorMessage && (
                  <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                    {errorMessage}
                  </div>
                )}

                {/* First Name */}
                <div className="space-y-2">
                  <label
                    htmlFor="firstname"
                    className="text-sm font-medium text-gray-900 dark:text-gray-100"
                  >
                    First Name
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 dark:text-gray-500">
                      <NameIcon />
                    </div>
                    <input
                      id="firstname"
                      type="text"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      placeholder="Jhone"
                      className="flex h-10 w-full rounded-md border border-gray-200 focus:border-none dark:border-gray-800 bg-white dark:bg-black px-3 py-2 pl-10 text-sm text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-green-400 dark:focus:ring-gray-300 focus:ring-offset-1 focus:ring-offset-white dark:focus:ring-offset-black disabled:cursor-not-allowed disabled:opacity-50"
                    />
                  </div>
                </div>

                {/* Last Name */}
                <div className="space-y-2">
                  <label
                    htmlFor="lastname"
                    className="text-sm font-medium text-gray-900 dark:text-gray-100"
                  >
                    Last Name
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 dark:text-gray-500">
                      <NameIcon />
                    </div>
                    <input
                      id="lastname"
                      type="text"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      placeholder="Doe"
                      className="flex h-10 w-full rounded-md border border-gray-200 focus:border-none dark:border-gray-800 bg-white dark:bg-black px-3 py-2 pl-10 text-sm text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-green-400 dark:focus:ring-gray-300 focus:ring-offset-1 focus:ring-offset-white dark:focus:ring-offset-black disabled:cursor-not-allowed disabled:opacity-50"
                    />
                  </div>
                </div>

                {/* Phone Number */}
                <div className="space-y-2">
                  <label
                    htmlFor="phonenumber"
                    className="text-sm font-medium text-gray-900 dark:text-gray-100"
                  >
                    Phone Number
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 dark:text-gray-500">
                      <PhoneIcon />
                    </div>
                    <input
                      id="phonenumber"
                      type="text"
                      value={contactNo}
                      onChange={(e) => setContactNo(e.target.value)}
                      placeholder="077-XXX-XXXX"
                      className="flex h-10 w-full rounded-md border border-gray-200 focus:border-none dark:border-gray-800 bg-white dark:bg-black px-3 py-2 pl-10 text-sm text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-green-400 dark:focus:ring-gray-300 focus:ring-offset-1 focus:ring-offset-white dark:focus:ring-offset-black disabled:cursor-not-allowed disabled:opacity-50"
                    />
                  </div>
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <label
                    htmlFor="email"
                    className="text-sm font-medium text-gray-900 dark:text-gray-100"
                  >
                    Email
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 dark:text-gray-500">
                      <MailIcon />
                    </div>
                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@example.com"
                      className="flex h-10 w-full rounded-md border border-gray-200 focus:border-none dark:border-gray-800 bg-white dark:bg-black px-3 py-2 pl-10 text-sm text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-green-400 dark:focus:ring-gray-300 focus:ring-offset-1 focus:ring-offset-white dark:focus:ring-offset-black disabled:cursor-not-allowed disabled:opacity-50"
                    />
                  </div>
                </div>

                {/* Password */}
                <div className="space-y-2">
                  <label
                    htmlFor="password"
                    className="text-sm font-medium text-gray-900 dark:text-gray-100"
                  >
                    Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 dark:text-gray-500">
                      <LockIcon />
                    </div>
                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      className="flex h-10 w-full rounded-md border border-gray-200 focus:border-none dark:border-gray-800 bg-white dark:bg-black px-3 py-2 pl-10 pr-10 text-sm text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-green-400 dark:focus:ring-gray-300 focus:ring-offset-1 focus:ring-offset-white dark:focus:ring-offset-black disabled:cursor-not-allowed disabled:opacity-50"
                    />
                    <button
                      type="button"
                      onClick={togglePasswordVisibility}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                    >
                      {showPassword ? <EyeIcon /> : <EyeOffIcon />}
                    </button>
                  </div>
                </div>

                {/* Confirm Password */}
                <div className="space-y-2">
                  <label
                    htmlFor="confirmpassword"
                    className="text-sm font-medium text-gray-900 dark:text-gray-100"
                  >
                    Confirm Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 dark:text-gray-500">
                      <LockIcon />
                    </div>
                    <input
                      id="confirmpassword"
                      type={showPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setconfirmPassword(e.target.value)}
                      placeholder="Confirm your password"
                      className="flex h-10 w-full rounded-md border border-gray-200 focus:border-none dark:border-gray-800 bg-white dark:bg-black px-3 py-2 pl-10 pr-10 text-sm text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-green-400 dark:focus:ring-gray-300 focus:ring-offset-1 focus:ring-offset-white dark:focus:ring-offset-black disabled:cursor-not-allowed disabled:opacity-50"
                    />
                    <button
                      type="button"
                      onClick={togglePasswordVisibility}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                    >
                      {showPassword ? <EyeIcon /> : <EyeOffIcon />}
                    </button>
                  </div>
                </div>

                {}
                <div className="flex items-start space-x-3">
                  <input
                    id="terms"
                    type="checkbox"
                    onClick={handleCheckClick}
                    className="h-4 w-4 rounded border-gray-300 dark:border-gray-700 text-gray-900 dark:text-gray-100 dark:focus:ring-gray-300  focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-black"
                  />
                  <label
                    htmlFor="terms"
                    className="text-sm text-gray-600 dark:text-gray-400 leading-5"
                  >
                    I agree to the{" "}
                    <a
                      href="#"
                      className="font-medium text-gray-900 dark:text-gray-100 underline underline-offset-4 hover:no-underline"
                    >
                      Terms of Service
                    </a>{" "}
                    and{" "}
                    <a
                      href="#"
                      className="font-medium text-gray-900 dark:text-gray-100 underline underline-offset-4 hover:no-underline"
                    >
                      Privacy Policy
                    </a>
                  </label>
                </div>

                {}
                <button
                  type="submit"
                  disabled={!validation}
                  className=" inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-white dark:ring-offset-black transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-950 dark:focus-visible:ring-gray-300 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-green-600 text-white hover:bg-green-700 h-10 px-4 py-2 w-full"
                >
                  Create account
                </button>
              </form>

              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-gray-200 dark:border-gray-800" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white dark:bg-black px-2 text-gray-500 dark:text-gray-400">
                    Or continue with
                  </span>
                </div>
              </div>

              
              <div className="w-full">
                <button
                  type="button"
                  // onClick={handleSignUpWithGoogle}
                  className="w-full inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-white dark:ring-offset-black transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-950 dark:focus-visible:ring-gray-300 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-gray-200 dark:border-gray-800 bg-white dark:bg-black hover:bg-gray-50 dark:hover:bg-gray-950 hover:text-gray-900 dark:hover:text-gray-50 h-10 px-4 py-2"
                >
                  <GoogleIcon />
                  <span className="ml-2">Google</span>
                </button>
              </div>

              {}
              <div className="text-center mt-6">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Already have an account?{" "}
                  <Link
                    to="/login"
                    className="font-medium text-gray-900 dark:text-gray-100 underline underline-offset-4 hover:no-underline"
                  >
                    Log in
                  </Link>
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};
export default SignUp;
