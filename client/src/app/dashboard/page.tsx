"use client"
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

import Sidebar from '../components/Sidebar';
import Profile from '../components/Profile';
import Search from '../components/Search';
import History from '../components/History';
import Loader from '../components/Loader';

export default function Dashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true); // Estado para controlar o carregamento
  const [activeTab, setActiveTab] = useState("profile"); // Tabs: profile, search, history

  useEffect(() => {
    const checkSession = async () => {
      const token = localStorage.getItem('token'); // Obtém o token do localStorage

      if (!token) {
        // Se o token existir, redireciona para a dashboard
        router.push('/');
      } else {
        // Se existir sessão, remove o estado de carregamento
        setLoading(false);
      }
    };

    checkSession(); // Verifica a sessão ao carregar a página
  }, [router]);

  if (loading) {
    // Exibe o estado de carregamento
    return <Loader />;
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Content */}
      <div className="flex-grow bg-gray-100 p-8 overflow-y-scroll">
        {activeTab === "profile" && <Profile />}
        {activeTab === "search" && <Search />}
        {activeTab === "history" && <History />}
      </div>
    </div>
  );
}
