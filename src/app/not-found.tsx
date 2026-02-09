"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Home, ArrowLeft, Search, AlertCircle } from "lucide-react";
import { Button } from "@/components/custom-ui/Button";

export default function NotFound() {
  const router = useRouter();
  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  useEffect(() => {
    setIsLoaded(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleGoBack = () => {
    router.back();
  };

  const handleGoHome = () => {
    router.push("/");
  };

  return (
    <div className="h-dvh bg-slate-50 flex flex-col items-center justify-center font-sans overflow-hidden">
      <div
        className={`max-w-2xl w-full text-center transition-all duration-1000 transform ${
          isLoaded ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
        }`}
      >
        {/* Illustration */}
        <div className="relative mb-8 flex justify-center">
          <div className="absolute inset-0 bg-blue-100 rounded-full blur-3xl opacity-30 animate-pulse scale-150" />

          <div className="relative flex items-center justify-center space-x-2">
            <span className="text-8xl font-black text-primary tracking-tighter">
              4
            </span>

            <div className="relative group">
              <div className="w-20 h-20 bg-primary rounded-2xl rotate-12 flex items-center justify-center shadow-xl transition-transform duration-500 group-hover:rotate-0">
                <Search className="w-10 h-10 text-white -rotate-12 group-hover:rotate-0 transition-transform duration-500" />
              </div>

              <div className="absolute -top-4 -right-4">
                <AlertCircle className="w-8 h-8 text-rose-500 fill-rose-50" />
              </div>
            </div>

            <span className="text-8xl font-black text-primary tracking-tighter">
              4
            </span>
          </div>
        </div>

        {/* Text */}
        <h1 className="text-xl text-gray-600 font-bold  mb-4 tracking-tight">
          Oops! Page not found.
        </h1>

        {/* Actions */}
        <div className="flex flex-row items-center justify-center gap-4">
          <Button onClick={handleGoBack} variant="outline">
            <ArrowLeft size={16} />
            Go Back
          </Button>

          <Button onClick={handleGoHome}>
            <Home size={16} />
            Back to Home
          </Button>
        </div>
      </div>
    </div>
  );
}
