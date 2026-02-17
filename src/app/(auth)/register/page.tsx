"use client";

import { Button } from "@/components/custom-ui/Button";
import { Input } from "@/components/custom-ui/Input";
import { useAuth } from "@/hooks/useAuth";
import api from "@/lib/axios";
import PublicRoute from "@/routes/PublicRoute";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa6";

type FormValues = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  securityCode: string;
};

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showSec, setShowSec] = useState(false);
  const [loading, setLoading] = useState(false);

  const { setUser, setRole } = useAuth();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>();

  const onSubmit = async (admin: FormValues) => {
    try {
      setLoading(true);

      const res = await api.post("/api/auth/register", admin);

      if (res.data.accessToken) {
        localStorage.setItem("accessToken", res.data.accessToken);

        const me = await api.get("/api/auth/me");

        setUser(me.data);
        setRole(me.data.role); 

        toast.success("Account created successfully!");
        router.replace("/dashboard");
      }
    } catch (error: any) {
      console.log(error);

      const message = error.response?.data?.message || "Something went wrong";

      if (message === "Invalid security code.") {
        toast.error("Security Code Invalid!");
      } else {
        toast.error(message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <PublicRoute>
      <div className="relative bg-[#3c3c3c] min-h-screen">
        {/* TOP HALF */}
        <div className="relative h-[50vh] bg-[#181516] overflow-hidden">
          <div
            className="absolute inset-0 opacity-40 bg-cover bg-center"
            style={{
              backgroundImage:
                'url("https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1600&q=80")',
            }}
          />
          <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-[0]">
            <svg
              viewBox="0 0 1440 320"
              preserveAspectRatio="none"
              className="block w-full h-[140px]"
            >
              <path
                fill="#3c3c3c"
                d="M0,0 L720,320 L1440,0 L1440,320 L0,320 Z"
              />
            </svg>
          </div>
        </div>

        <div className="h-[50vh] " />

        <div className="absolute inset-0 flex items-center justify-center px-4">
          <div className="w-full max-w-[700px] bg-primary rounded-md shadow-xl p-8">
            <h2 className="text-2xl text-white font-semibold text-center">
              Register Super Admin
            </h2>
            <p className="text-base text-gray-400 text-center mb-6 mt-1">
              This registration is restricted to platform administrators.
            </p>

            <form onSubmit={handleSubmit(onSubmit)} noValidate>
              <div className="md:grid grid-cols-2 gap-4 space-y-4 md:space-y-0">
                {/* First Name */}
                <div>
                  <Input
                    label="First Name"
                    placeholder="Enter your first name"
                    className={errors.firstName ? "border-red-500" : ""}
                    {...register("firstName", {
                      required: "First name is required",
                    })}
                  />
                  {errors.firstName && (
                    <p className="text-xs text-red-500 mt-1">
                      {errors.firstName.message}
                    </p>
                  )}
                </div>

                {/* Last Name */}
                <div>
                  <Input
                    label="Last Name"
                    placeholder="Enter your last name"
                    className={errors.lastName ? "border-red-500" : ""}
                    {...register("lastName", {
                      required: "Last name is required",
                    })}
                  />
                  {errors.lastName && (
                    <p className="text-xs text-red-500 mt-1">
                      {errors.lastName.message}
                    </p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <Input
                    label="Email"
                    type="email"
                    placeholder="Enter your email"
                    className={errors.email ? "border-red-500" : ""}
                    {...register("email", {
                      required: "Email is required",
                      pattern: {
                        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                        message: "Invalid email address",
                      },
                    })}
                  />
                  {errors.email && (
                    <p className="text-xs text-red-500 mt-1">
                      {errors.email.message}
                    </p>
                  )}
                </div>

                {/* Password */}
                <div>
                  <div className="relative">
                    <Input
                      label="Password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      className={`pr-10 ${errors.password ? "border-red-500" : ""}`}
                      {...register("password", {
                        required: "Password is required",
                        pattern: {
                          value:
                            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/,
                          message:
                            "Min 8 chars, uppercase, lowercase, number & special char",
                        },
                      })}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 top-6 right-3 flex items-center text-gray-500"
                    >
                      {showPassword ? <FaRegEyeSlash /> : <FaRegEye />}
                    </button>
                  </div>

                  {errors.password && (
                    <p className="text-xs text-red-500 mt-1">
                      {errors.password.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Security Code */}
              <div className="mt-4">
                <div className="relative">
                  <Input
                    label="Security Code"
                    type={showSec ? "text" : "password"}
                    placeholder="Enter security code"
                    className={`pr-10 ${errors.securityCode ? "border-red-500" : ""}`}
                    {...register("securityCode", {
                      required: "Security code is required",
                    })}
                  />
                  <button
                    type="button"
                    onClick={() => setShowSec(!showSec)}
                    className="absolute inset-y-0 top-6 right-3 flex items-center text-gray-500"
                  >
                    {showSec ? <FaRegEyeSlash /> : <FaRegEye />}
                  </button>
                </div>
                {errors.securityCode && (
                  <p className="text-xs text-red-500 mt-1">
                    {errors.securityCode.message}
                  </p>
                )}
              </div>

              <Button
                loading={loading && true}
                type="submit"
                className="w-full mt-6"
              >
                Sign Up
              </Button>
            </form>

            <p className="text-base text-gray-400 text-center mt-4">
              Already have an account?
              <Link href={"/login"}>
                <Button variant="link">login</Button>
              </Link>
            </p>
          </div>
        </div>
      </div>
    </PublicRoute>
  );
};

export default Register;
