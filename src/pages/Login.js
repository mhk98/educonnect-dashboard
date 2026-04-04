import React from "react";
import { Link, useHistory } from "react-router-dom";
import ImageLight from "../assets/img/login-office.jpeg";
import ImageDark from "../assets/img/login-office-dark.jpeg";
import { Input, Button } from "@windmill/react-ui";
import toast from "react-hot-toast";
import { useUserLoginMutation } from "../features/auth/auth";
import { useForm } from "react-hook-form";

function Login() {
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm();

  const [userLogin] = useUserLoginMutation();
  const history = useHistory();

  const onFormSubmit = async (data) => {
    try {
      const res = await userLogin(data);

      console.log("userData", res);
      if (res?.data?.success) {
        const { accessToken, user } = res.data.data;
        localStorage.setItem("FirstName", user.FirstName);
        localStorage.setItem("LastName", user.LastName);
        localStorage.setItem("role", user.Role);
        localStorage.setItem("userId", user.id);
        localStorage.setItem("image", user.image);
        localStorage.setItem("token", accessToken);
        if (user.Branch) {
          localStorage.setItem("branch", user.Branch);
        } else {
          localStorage.removeItem("branch"); // 🔥 MOST IMPORTANT
        }

        toast.success(res.data.message);
        history.push("/app");
      } else {
        toast.error(
          res?.error?.data?.message || "Login failed. Please try again.",
        );
      }
    } catch (error) {
      toast.error("An unexpected error occurred.");
    }
  };

  return (
    <div className="flex items-center min-h-screen p-6 bg-gray-50 dark:bg-gray-900">
      <div className="flex-1 h-full max-w-4xl mx-auto overflow-hidden bg-white rounded-lg shadow-xl dark:bg-gray-800">
        <div className="flex flex-col overflow-y-auto md:flex-row">
          {/* Left Image */}
          <div className="h-32 md:h-auto md:w-1/2">
            <img
              aria-hidden="true"
              className="object-cover w-full h-full dark:hidden"
              src={ImageLight}
              alt="Office"
            />
            <img
              aria-hidden="true"
              className="hidden object-cover w-full h-full dark:block"
              src={ImageDark}
              alt="Office"
            />
          </div>

          {/* Right Form */}
          <main className="flex items-center justify-center p-6 sm:p-12 md:w-1/2">
            <div className="w-full">
              <h1 className="mb-4 text-xl font-semibold text-gray-700 dark:text-gray-200">
                Login
              </h1>

              <form onSubmit={handleSubmit(onFormSubmit)}>
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="block text-sm mb-1 text-gray-700 dark:text-gray-300">
                      Email
                    </label>
                    <Input
                      type="email"
                      {...register("Email", { required: "Email is required" })}
                      className="shadow-md p-3"
                    />
                    {errors.Email && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.Email.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm mb-1 text-gray-700 dark:text-gray-300">
                      Password
                    </label>
                    <Input
                      type="password"
                      {...register("Password", {
                        required: "Password is required",
                      })}
                      className="shadow-md p-3"
                    />
                    {errors.Password && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.Password.message}
                      </p>
                    )}
                  </div>

                  <Button
                    type="submit"
                    block
                    className="mt-4"
                    style={{ backgroundColor: "#C71320" }}
                  >
                    Login
                  </Button>
                </div>

                <div className="grid grid-cols-2 items-center mt-4 text-sm">
                  <Link
                    className="text-purple-600 dark:text-purple-400 hover:underline"
                    to="/forgot-password"
                  >
                    Forgot your password?
                  </Link>
                  <Link
                    className="text-right text-purple-600 dark:text-purple-400 hover:underline"
                    to="/create-account"
                  >
                    Create account
                  </Link>
                </div>
              </form>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

export default Login;
