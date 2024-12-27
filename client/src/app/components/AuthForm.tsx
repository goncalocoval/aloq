"use client";

import { useState } from "react";
import Image from "next/image";
import "../styles/AuthForm.css";
import { ArrowRightEndOnRectangleIcon, UserPlusIcon } from "@heroicons/react/20/solid";
import { useRouter } from "next/navigation";
import api from "../../lib/apiService";

export default function AuthForm() {
  const [isLogin, setIsLogin] = useState(true); // true = login, false = register
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const router = useRouter();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); // Resetar erro anterior

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

        // Após o registro bem-sucedido, redirecionar para o login
        setIsLogin(true);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Something went wrong. Please try again.");
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
        <div className="flex space-x-4 mb-4">
          <button
            className={`p-2 rounded ${
              isLogin ? "bg-teal-700 text-white" : "bg-transparent text-teal-700"
            }`}
            onClick={() => setIsLogin(true)}
          >
            <ArrowRightEndOnRectangleIcon className="w-5 h-5" />
          </button>
          <button
            className={`p-2 rounded ${
              !isLogin ? "bg-teal-700 text-white" : "bg-transparent text-teal-700"
            }`}
            onClick={() => setIsLogin(false)}
          >
            <UserPlusIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Form Section */}
        <form onSubmit={handleSubmit} className="bg-teal-700 rounded p-8 shadow-lg w-80">
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
              />
              <input
                type="password"
                name="password"
                placeholder="Password"
                className="w-full mb-4 p-2 border rounded"
                value={formData.password}
                onChange={handleInputChange}
              />
              {error && <p className="text-red-500 text-sm">{error}</p>}
              <div className="text-right mb-4">
                <a href="/reset-password" className="text-white hover:underline text-sm">
                  Forgot password?
                </a>
              </div>
              <button className="w-full bg-white text-teal-700 p-2 rounded">
                Login &rarr;
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
              />
              <input
                type="email"
                name="email"
                placeholder="Email"
                className="w-full mb-4 p-2 border rounded"
                value={formData.email}
                onChange={handleInputChange}
              />
              <input
                type="password"
                name="password"
                placeholder="Password"
                className="w-full mb-4 p-2 border rounded"
                value={formData.password}
                onChange={handleInputChange}
              />
              <label className="flex items-center text-white mb-4">
                <input type="checkbox" className="mr-2" />
                I agree with the Terms & Conditions
              </label>
              {error && <p className="text-red-500 text-sm">{error}</p>}
              <button className="w-full bg-white text-teal-700 p-2 rounded">
                Sign up &rarr;
              </button>
            </>
          )}
        </form>
      </div>
    </div>
  );
}