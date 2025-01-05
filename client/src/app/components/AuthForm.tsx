"use client";

import { useState } from "react";
import Image from "next/image";
import "../styles/AuthForm.css";
import { ArrowRightEndOnRectangleIcon, UserPlusIcon } from "@heroicons/react/20/solid";
import { useRouter } from "next/navigation";
import api from "../../lib/apiService";
import ForgotPasswordModal from "./ForgotPasswordModal";

export default function AuthForm() {
  const [isLogin, setIsLogin] = useState(true); // Alternar entre login e registro
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState(""); // Mensagem de sucesso
  const [isSubmitting, setIsSubmitting] = useState(false); // Indica se o formulário está sendo enviado
  const router = useRouter();
  const [isForgotPasswordOpen, setIsForgotPasswordOpen] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); // Resetar erro anterior
    setSuccessMessage(""); // Resetar mensagem de sucesso anterior
    setIsSubmitting(true); // Iniciar estado de envio

    try {
      if (isLogin) {
        // Requisição de login
        const response = await api.post("/auth/login", {
          email: formData.email,
          password: formData.password,
        });

        // Salvar token no localStorage
        localStorage.setItem("token", response.data.token);

        // Redirecionar para o dashboard
        router.push("/dashboard");
      } else {
        // Requisição de registro
        await api.post("/auth/register", {
          name: formData.name,
          email: formData.email,
          password: formData.password,
        });

        // Após o registro bem-sucedido, exibir mensagem de sucesso
        setSuccessMessage("Account created successfully! Please check your email to verify your account.");

        // Manter email e password preenchidos para o login
        setFormData({
          name: "",
          email: formData.email, // Manter o email no campo
          password: formData.password, // Manter a senha no campo
        });

        // Alternar para o formulário de login
        setIsLogin(true);
      }
    } catch (err: any) {
      setError(err.response?.data["message"] || "Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false); // Encerrar estado de envio
    }
  };

  return (
    <div className="flex h-screen">
      {/* Logo / Left Section */}
      <div className="w-1/2 bg-white flex justify-center items-center">
        <div>
          <h1 className="text-7xl title-font font-bold tracking-widest text-teal-700">
            WELCOME <br />TO
          </h1>
          <div className="text-center mt-2">
            <Image
              src="/images/logo-nobg.png"
              alt="Aloq Logo"
              width={200}
              height={200}
              className="mx-auto float-right"
            />
          </div>
        </div>
      </div>

      {/* Form / Right Section */}
      <div className="w-1/2 bg-white flex flex-col justify-center items-center">
        {/* Toggle Buttons */}
        <div className="flex space-x-4 mb-4 transition">
          <button
            className={`p-2 rounded transition ${
              isLogin ? "bg-teal-700 text-white" : "bg-transparent text-teal-700 hover:bg-gray-200"
            }`}
            onClick={() => setIsLogin(true)}
            disabled={isSubmitting} // Desativa botão durante envio
          >
            <ArrowRightEndOnRectangleIcon className="w-5 h-5" />
          </button>
          <button
            className={`p-2 rounded transition ${
              !isLogin ? "bg-teal-700 text-white" : "bg-transparent text-teal-700 hover:bg-gray-200"
            }`}
            onClick={() => setIsLogin(false)}
            disabled={isSubmitting} // Desativa botão durante envio
          >
            <UserPlusIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Form Section */}
        <form onSubmit={handleSubmit} className="bg-teal-700 rounded p-8 shadow-lg w-80 transition">
          {isLogin ? (
            <>
              <h2 className="text-xl font-semibold mb-4 text-white">
                Login with your clients’ account
              </h2>
              <input
                type="email"
                name="email"
                placeholder="Email"
                className="w-full mb-4 p-2 border rounded"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
              <input
                type="password"
                name="password"
                placeholder="Password"
                className="w-full mb-4 p-2 border rounded"
                value={formData.password}
                onChange={handleInputChange}
                required
              />
              {error && <p className="text-red-500 text-sm mb-3">{error}</p>}
              {successMessage && <p className="text-green-500 text-sm mb-3">{successMessage}</p>}
              <div className="text-right mb-4">
                <button
                  type="button"
                  onClick={() => setIsForgotPasswordOpen(true)}
                  className="text-white hover:underline text-sm"
                  disabled={isSubmitting} // Desativa botão durante envio
                >
                  Forgot password?
                </button>
              </div>
              <button
                type="submit"
                className="w-full bg-white text-teal-700 p-2 rounded transition hover:bg-gray-200"
                disabled={isSubmitting} // Desativa botão durante envio
              >
                {isSubmitting ? "Logging In..." : "Login →"}
              </button>
            </>
          ) : (
            <>
              <h2 className="text-xl font-semibold mb-4 text-white">
                Create your clients’ account to use Aloq
              </h2>
              <input
                type="text"
                name="name"
                placeholder="Name"
                className="w-full mb-4 p-2 border rounded"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
              <input
                type="email"
                name="email"
                placeholder="Email"
                className="w-full mb-4 p-2 border rounded"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
              <input
                type="password"
                name="password"
                placeholder="Password"
                className="w-full mb-4 p-2 border rounded"
                value={formData.password}
                onChange={handleInputChange}
                minLength={6}
                maxLength={20}
                required
              />
              <label className="flex items-center text-white mb-4 text-sm">
                <input type="checkbox" className="mr-2" required />
                I agree with Terms & Conditions
              </label>
              {error && <p className="text-red-500 text-sm mb-3">{error}</p>}
              <button
                type="submit"
                className="w-full bg-white text-teal-700 p-2 rounded transition hover:bg-gray-200"
                disabled={isSubmitting} // Desativa botão durante envio
              >
                {isSubmitting ? "Signing Up..." : "Sign up →"}
              </button>
            </>
          )}
        </form>
      </div>

      {/* Forgot Password Modal */}
      <ForgotPasswordModal
        isOpen={isForgotPasswordOpen}
        onClose={() => setIsForgotPasswordOpen(false)}
      />
    </div>
  );
}
