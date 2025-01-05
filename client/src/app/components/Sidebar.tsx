import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  UserIcon,
  PlusCircleIcon,
  ClockIcon,
  ArrowLeftEndOnRectangleIcon,
} from "@heroicons/react/20/solid";

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export default function Sidebar({ activeTab, setActiveTab }: SidebarProps) {
  const router = useRouter();
  const [showModal, setShowModal] = useState(false); // Controla a visibilidade do modal

  const handleLogout = () => {
    localStorage.removeItem("token"); // Remove o token
    router.push("/"); // Redireciona para a página inicial
  };

  return (
    <div className="w-20 h-full bg-teal-700 text-white flex flex-col items-center py-4">
      {/* Logo */}
      <button className="mb-10 bg-white p-2 rounded hover:shadow-xl transition" onClick={() => location.reload()}>
        <Image
          src="/images/logo-nobg.png"
          alt="App Logo"
          width={40}
          height={40}
          className="rounded"
        />
      </button>

      {/* Navigation Items */}
      <button
        className={`flex w-12 h-12 justify-center items-center mb-10 rounded transition  ${
          activeTab === "profile" ? "bg-white text-teal-700" : "bg-transparent text-white hover:bg-teal-600"
        }`}
        onClick={() => setActiveTab("profile")}
      >
        <UserIcon className="w-7" />
      </button>
      <button
        className={`flex w-12 h-12 justify-center items-center mb-10 rounded transition ${
          activeTab === "search" ? "bg-white text-teal-700" : "bg-transparent text-white hover:bg-teal-600"
        }`}
        onClick={() => setActiveTab("search")}
      >
        <PlusCircleIcon className="w-7" />
      </button>
      <button
        className={`flex w-12 h-12 justify-center items-center mb-10 rounded transition ${
          activeTab === "history" ? "bg-white text-teal-700" : "bg-transparent text-white hover:bg-teal-600"
        }`}
        onClick={() => setActiveTab("history")}
      >
        <ClockIcon className="w-7" />
      </button>

      {/* Logout */}
      <button className="mt-auto text-red-500 hover:bg-red-50 p-2 rounded transition" onClick={() => setShowModal(true)}>
        <ArrowLeftEndOnRectangleIcon className="w-7" />
      </button>

      {/* Modal de Confirmação */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded shadow-lg">
            <h2 className="text-xl text-black font-bold mb-4">Confirm Logout</h2>
            <p className="mb-4 text-black">Are you sure you want to log out?</p>
            <div className="flex space-x-4">
              <button
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
                onClick={handleLogout}
              >
                Yes, Logout
              </button>
              <button
                className="bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400 transition"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}