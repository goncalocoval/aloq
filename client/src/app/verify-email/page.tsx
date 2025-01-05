"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "../../lib/apiService";

export default function VerifyEmailPage() {
  const router = useRouter();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    // Extrai o token da URL
    const urlParams = new URLSearchParams(window.location.search);
    const tokenParam = urlParams.get("token");

    if (tokenParam) {
      setToken(tokenParam);
    } else {
      setStatus("error");
    }
  }, []);

  useEffect(() => {
    const verifyEmail = async () => {
      if (!token) return;

      try {
        await api.post("/auth/verify-email", { token });
        setStatus("success");
      } catch (error: any) {
        console.error("Error verifying email:", error.message);
        setStatus("error");
      }
    };

    if (token) {
      verifyEmail();
    }
  }, [token]);

  useEffect(() => {
    if (status === "success" || status === "error") {
      const timeout = setTimeout(() => {
        router.push("/");
      }, 5000);

      return () => clearTimeout(timeout); // Cleanup timeout on unmount
    }
  }, [status, router]);

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100 text-center">
      {status === "loading" && (
        <div className="text-teal-700 text-xl font-semibold">
          Verifying your email, please wait...
        </div>
      )}

      {status === "success" && (
        <div className="text-green-700 text-xl font-semibold">
          Your email has been verified successfully! 🎉<br />
          You will be redirected to the homepage shortly.
        </div>
      )}

      {status === "error" && (
        <div className="text-red-700 text-xl font-semibold">
          Invalid or expired token. Please check your verification email from Aloq.<br />
          Redirecting to the homepage...
        </div>
      )}
    </div>
  );
}
