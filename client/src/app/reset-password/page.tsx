"use client";

import { Suspense, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import api from "../../lib/apiService";

function ResetPasswordContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [validationError, setValidationError] = useState<string | null>(null); // Para mensagens de erro de validação

  const token = searchParams.get("token"); // Obtém o token dos parâmetros da URL

  const handleSubmit = async () => {
    setMessage("");
    setError("");
    setValidationError(null);

    if (!token) {
      setError("Invalid or missing token.");
      return;
    }

    // Validação dos campos
    if (!password || !confirmPassword) {
      setValidationError("Both fields are required.");
      return;
    }

    if (password.length < 6 || password.length > 20) {
      setValidationError("Password must be between 6 and 20 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setValidationError("Passwords do not match.");
      return;
    }

    try {
      // Enviar token e nova password ao backend
      await api.post("/auth/reset-password", { token, password });
      setMessage("Password updated successfully. Redirecting...");
      setTimeout(() => router.push("/"), 3000); // Redireciona para a página inicial após 3 segundos
    } catch (err: any) {
      setError(err.response?.data?.message || "An error occurred. Please try again.");
    }
  };

  if (!token) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <div className="bg-white p-6 rounded shadow-lg w-96">
          <p className="text-red-500">Invalid or missing token. Please request a new reset link.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="bg-white p-6 rounded shadow-lg w-96">
        <h1 className="text-2xl font-bold mb-4">Reset Password</h1>
        {message && <p className="text-green-500 mb-4">{message}</p>}
        {error && <p className="text-red-500 mb-4">{error}</p>}
        {validationError && <p className="text-red-500 mb-4">{validationError}</p>}
        <div className="mb-4">
          <input
            type="password"
            placeholder="New Password"
            className={`w-full border p-2 rounded ${
              validationError && !password ? "border-red-500" : "border-gray-300"
            }`}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {!password && validationError && (
            <p className="text-red-500 text-sm mt-1">Password is required.</p>
          )}
        </div>
        <div className="mb-4">
          <input
            type="password"
            placeholder="Confirm Password"
            className={`w-full border p-2 rounded ${
              validationError && !confirmPassword ? "border-red-500" : "border-gray-300"
            }`}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          {!confirmPassword && validationError && (
            <p className="text-red-500 text-sm mt-1">Confirm Password is required.</p>
          )}
        </div>
        <button
          onClick={handleSubmit}
          className="bg-teal-700 text-white px-4 py-2 w-full rounded hover:bg-teal-600 transition"
        >
          Reset Password
        </button>
      </div>
    </div>
  );
}

export default function ResetPassword() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ResetPasswordContent />
    </Suspense>
  );
}