"use client";
import { useRouter } from 'next/navigation';
import AuthForm from './components/AuthForm';
import { useEffect, useState } from 'react';

export default function Home() {
  const router = useRouter();
  const [loading, setLoading] = useState(true); // Estado para controlar o carregamento

  useEffect(() => {
    const checkSession = async () => {
      const token = localStorage.getItem('token'); // Obtém o token do localStorage

      if (token) {
        // Se o token existir, redireciona para a dashboard
        router.push('/dashboard');
      } else {
        // Se não existir sessão, remove o estado de carregamento
        setLoading(false);
      }
    };

    checkSession(); // Verifica a sessão ao carregar a página
  }, [router]);

  if (loading) {
    // Exibe o estado de carregamento
    return <div>Loading...</div>;
  }

  // Renderiza o AuthForm quando não há sessão
  return (
    <main>
      <AuthForm />
    </main>
  );
}