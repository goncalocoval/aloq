"use client";
import { useRouter } from "next/navigation";
import AuthForm from "./components/AuthForm";
import { useEffect, useState } from "react";
import Image from "next/image";
import Loader from "./components/Loader";
import { ArrowDownIcon, ArrowUpIcon } from "@heroicons/react/20/solid";
import "./styles/Home.css";

export default function Home() {
  const router = useRouter();
  const [loading, setLoading] = useState(true); // Estado para controlar o carregamento
  const [infoVisible, setInfoVisible] = useState(false); // Estado para mostrar/esconder informações

  useEffect(() => {
    const checkSession = async () => {
      const token = localStorage.getItem("token"); // Obtém o token do localStorage

      if (token) {
        // Se o token existir, redireciona para a dashboard
        router.push("/dashboard");
      } else {
        // Se não existir sessão, remove o estado de carregamento
        setLoading(false);
      }
    };

    checkSession(); // Verifica a sessão ao carregar a página
  }, [router]);

  if (loading) {
    // Exibe o estado de carregamento
    return <Loader />;
  }

  const toggleInfo = () => {
    setInfoVisible((prev) => !prev); // Alterna a visibilidade das informações
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50 relative">
      {/* Login/Register Form */}
      <div
        className={`flex-grow transition-opacity duration-500 ${
          infoVisible ? "opacity-0 pointer-events-none" : "opacity-100"
        }`}
      >
        <AuthForm />
      </div>

      {/* Botão para abrir informações */}
      {!infoVisible && (
        <div className="absolute bottom-6 w-full flex justify-center">
          <button
            onClick={toggleInfo}
            className="bg-teal-700 text-white p-2 rounded-full shadow-lg hover:bg-teal-600 transition"
          >
            <ArrowDownIcon className="h-6 w-6" />
          </button>
        </div>
      )}

      {/* Informações da aplicação */}
<div
  className={`fixed top-0 left-0 w-full h-screen bg-white shadow-lg overflow-hidden transition-transform duration-500 ${
    infoVisible ? "transform translate-y-0" : "transform -translate-y-full"
  }`}
>
  {/* Botão para fechar */}
  <div className="flex justify-center">
    <button
      onClick={toggleInfo}
      className="bg-teal-700 text-white p-2 rounded-full shadow-lg hover:bg-teal-600 transition absolute top-4"
    >
      <ArrowUpIcon className="h-6 w-6" />
    </button>
  </div>

  {/* Conteúdo com Scroll Snap */}
  <div className="h-full overflow-y-scroll scroll-snap snap-y snap-mandatory">
    {/* Ponto 1 */}
    <div className="h-screen snap-start flex flex-col items-center justify-center px-12 text-center">
      <h2 className="text-6xl font-bold text-teal-700 mb-4">Welcome to Aloq</h2>
      <Image
        src="/images/logo-nobg.png"
        alt="Aloq Logo"
        width={200}
        height={200}
        className="mx-auto mb-4"
      />
      <p className="text-gray-600 leading-relaxed">
        On the journey of startup growth, finding the ideal space is crucial for success. Aloq simplifies this choice by combining advanced technology with the AHP (Analytic Hierarchy Process) method to help businesses select the perfect location based on their criteria and needs. Whether it’s cost, location, or office amenities, Aloq does the hard work for you. Optimize your decision and find the right place to scale your business!
      </p>
    </div>

    {/* Ponto 2 */}
    <div className="h-screen snap-start flex flex-col lg:flex-row lg:space-x-6 px-12">
      {/* Esquerda */}
      <div className="lg:w-1/2 flex flex-col justify-center">
        <h2 className="text-xl font-bold text-teal-700 mb-4">What is Aloq?</h2>
        <p className="text-gray-600 leading-relaxed">
          Aloq is an innovative platform designed to help startups and businesses choose between incubators and tech parks. With so many options available, selecting the best alternative can be challenging. We use a smart, criteria-based approach to make the process quick, easy, and accurate. From cost analysis to public transportation accessibility, our platform guides you through every step of the decision-making process.
        </p>
      </div>

      {/* Direita */}
      <div className="lg:w-1/2 flex flex-col justify-center">
        {/* Parte 1 */}
        <div className="mb-4">
          <h2 className="text-lg font-bold text-teal-700 mb-2">The Logo</h2>
          <p className="text-gray-600 leading-relaxed">
            As simple as it seems, this is not only the name of our platform, but also a call to new users (A and L) to get in (O), becoming a part of Aloq (Q).
          </p>
        </div>
        {/* Parte 2 */}
        <div>
          <h2 className="text-lg font-bold text-teal-700 mb-2">Why Us?</h2>
          <p className="text-gray-600 leading-relaxed">
            Aloq simplifies choosing the perfect workspace by using smart, criteria-based analysis to deliver tailored recommendations, helping your business grow in the right environment.
          </p>
        </div>
      </div>
    </div>

    {/* Ponto 3 */}
    <div className="h-screen snap-start flex flex-col justify-center px-12">
      <h2 className="text-xl font-bold text-teal-700 mb-4">How Aloq Works?</h2>
      <p className="text-gray-600 leading-relaxed mb-4">
        Aloq uses the AHP (Analytic Hierarchy Process) method to help businesses compare incubators and tech parks based on seven key criteria - cost, location, parking, meeting rooms, office amenities (furniture, Wi-Fi, printing/copying equipment), public transportation, and on-site dining facilities. The platform makes decision-making quick and intuitive:
      </p>
      <ul className="list-disc pl-6 text-gray-600 space-y-2">
        <li>
          <strong>Define your criteria:</strong> Choose the factors that matter most to your company, such as cost, office amenities, or location.
        </li>
        <li>
          <strong>Compare options:</strong> See how each option stacks up against your priorities based on our scoring system.
        </li>
        <li>
          <strong>Make the best decision:</strong> Aloq calculates and recommends the top choice tailored to your needs.
        </li>
      </ul>
      <p className="text-gray-600 mt-4">
        With an easy-to-use interface and a powerful decision-making engine, Aloq helps you find the best space to grow your business.
      </p>
    </div>

    {/* Ponto 4 - Nossa Equipa */}
<div className="h-screen snap-start flex flex-col lg:flex-row lg:space-x-12 px-12 items-center justify-center">
  {/* Texto - À Esquerda */}
  <div className="lg:w-1/2">
    <h2 className="text-xl font-bold text-teal-700 mb-4">Our Team</h2>
    <p className="text-gray-600 leading-relaxed">
      The Aloq team is made up of experts in technology, innovation, and business strategy. 
      Our team brings together experience in software development, decision-making methodologies, 
      and a deep understanding of the needs of startups. Together, we’ve created a platform that 
      not only solves a problem but also understands the growing pains of a company and the opportunities 
      of a well-chosen workspace.
    </p>
  </div>

  {/* Fotos de Perfil - À Direita */}
  <div className="lg:w-1/2 grid grid-cols-2 gap-8 md:grid-cols-3">
    {/* Perfil 1 */}
    <div className="flex flex-col items-center text-center">
      <div className="w-24 h-24 rounded-full bg-gray-300 overflow-hidden">
        {/* Substitua o src pela imagem de cada pessoa */}
        <img src="https://aloq-web.pages.dev/img/pic.jpg" alt="Profile 1" className="object-cover w-full h-full" />
      </div>
      <h3 className="mt-2 font-semibold text-teal-700">Gonçalo Coval</h3>
      <p className="text-gray-600 text-sm">Founder & Lead Developer</p>
    </div>

    {/* Perfil 2 */}
    <div className="flex flex-col items-center text-center">
      <div className="w-24 h-24 rounded-full bg-gray-300 overflow-hidden">
        <img src="https://aloq-web.pages.dev/img/tiago.jpg" alt="Profile 2" className="object-cover w-full h-full" />
      </div>
      <h3 className="mt-2 font-semibold text-teal-700">Tiago Dias</h3>
      <p className="text-gray-600 text-sm">Startup Strategy Specialist</p>
    </div>

    {/* Perfil 3 */}
    <div className="flex flex-col items-center text-center">
      <div className="w-24 h-24 rounded-full bg-gray-300 overflow-hidden">
        <img src="https://aloq-web.pages.dev/img/curralo.jpg" alt="Profile 3" className="object-cover w-full h-full" />
      </div>
      <h3 className="mt-2 font-semibold text-teal-700">Diogo Curralo</h3>
      <p className="text-gray-600 text-sm">Technology Solutions Architect</p>
    </div>

    {/* Perfil 4 */}
    <div className="flex flex-col items-center text-center">
      <div className="w-24 h-24 rounded-full bg-gray-300 overflow-hidden">
        <img src="https://aloq-web.pages.dev/img/tako.jpg" alt="Profile 4" className="object-cover w-full h-full" />
      </div>
      <h3 className="mt-2 font-semibold text-teal-700">Gonçalo Silva</h3>
      <p className="text-gray-600 text-sm">Marketing and Growth Director</p>
    </div>

    {/* Perfil 5 */}
    <div className="flex flex-col items-center text-center col-span-2 md:col-span-1">
      <div className="w-24 h-24 rounded-full bg-gray-300 overflow-hidden">
        <img src="https://aloq-web.pages.dev/img/rafael.jpeg" alt="Profile 5" className="object-cover w-full h-full" />
      </div>
      <h3 className="mt-2 font-semibold text-teal-700">Rafael Santos</h3>
      <p className="text-gray-600 text-sm">User Experience (UX) Designer</p>
    </div>
  </div>
</div>

  </div>
</div>

    </div>
  );
}
