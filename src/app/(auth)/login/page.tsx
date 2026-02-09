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
  email: string;
  password: string;
};

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { setUser, setRole } = useAuth();

  const { register, handleSubmit } = useForm<FormValues>();

  const onSubmit = async (data: FormValues) => {
    try {
      setLoading(true);

      const res = await api.post("/api/auth/login", data);

      if (res.data.accessToken) {
        localStorage.setItem("accessToken", res.data.accessToken);

        const me = await api.get("/api/auth/me");

        setUser(me.data);
        setRole(me.data.role);

        router.replace("/dashboard");
      }
    } catch {
      toast.error("Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <PublicRoute>
      <div className="relative min-h-screen ">
        {/* TOP HALF */}
        <div className="relative h-[50vh] bg-[#181516] overflow-hidden">
          {/* Background Image */}
          <div
            className="absolute inset-0 opacity-40 bg-cover bg-center"
            style={{
              backgroundImage:
                'url("https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1600&q=80")',
            }}
          />

          {/* Triangle */}
          <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-[0]">
            <svg
              viewBox="0 0 1440 320"
              preserveAspectRatio="none"
              className="block w-full h-[140px]"
            >
              <path
                fill="#f9fafb"
                d="M0,0 L720,320 L1440,0 L1440,320 L0,320 Z"
              />
            </svg>
          </div>
        </div>

        {/* BOTTOM HALF */}
        <div className="h-[50vh] bg-gray-50" />

        {/* CENTERED FORM (FULL PAGE) */}
        <div className="absolute inset-0 flex items-center justify-center px-4">
          <div className="w-full max-w-md bg-white rounded-md shadow-xl p-8">
            <h2 className="text-2xl font-semibold text-center">
              Welcome Back!
            </h2>
            <p className="text-base text-gray-600 text-center mb-6 mt-1">
              sign in to continue.
            </p>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <Input
                label="Email"
                type="email"
                placeholder="Enter your email"
                {...register("email")}
              />

              <div className="relative">
                <Input
                  className="pr-10"
                  label="Password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  {...register("password")}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 top-6 right-3 flex items-center text-gray-500"
                >
                  {showPassword ? <FaRegEyeSlash /> : <FaRegEye />}
                </button>
              </div>

              <Button loading={loading} type="submit" className="w-full">
                Login
              </Button>
            </form>
            <p className="text-base text-gray-800 text-center mt-4">
              Don&apos;t have an account?
              <Link href={"/register"}>
                <Button variant="link">sign-up</Button>
              </Link>
            </p>
          </div>
        </div>
      </div>
    </PublicRoute>
  );
};

export default Login;
