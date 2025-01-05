"use client";
import { useEffect, useState } from "react";
import api from "../../lib/apiService";
import { InformationCircleIcon, XMarkIcon, CurrencyEuroIcon, MapPinIcon, MapIcon, WifiIcon, ArchiveBoxIcon, ArrowUpIcon, ArrowDownIcon } from "@heroicons/react/24/solid";
import { PresentationChartBarIcon, StarIcon, TruckIcon } from "@heroicons/react/20/solid";
import { useRef } from "react"; // Import useRef

type Criterion = {
  key: string;
  value: any;
  priority: number;
};

type SearchResult = {
  park: {
    name: string;
    location: string;
    cost: number;
    hasParking: boolean;
    hasMeetingRooms: boolean;
    hasOfficeWithFurniture: boolean;
    hasTransport: boolean;
    hasCanteen: boolean;
  };
  score: number; // Normalizado de 0 a 1
  contributions: Record<string, number>; // Percentual de contribuição por critério
};

export default function Search() {
  const [criteria, setCriteria] = useState<Criterion[]>([]);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null); // Index para detalhes do resultado
  const [checkedCriteria, setCheckedCriteria] = useState<Record<string, boolean>>({}); // Estado para checkboxes
  const [infoVisible, setInfoVisible] = useState(false); // Controla o modal de informações
  const [locationSuggestions, setLocationSuggestions] = useState<string[]>([]);
  const [filteredSuggestions, setFilteredSuggestions] = useState<string[]>([]);
  const [isFocused, setIsFocused] = useState(false); // Para controlar o estado de foco do input
  const resultsRef = useRef<HTMLDivElement | null>(null); // Ref for results section
  const [sortBy, setSortBy] = useState<"score" | "cost">("score"); // Sorting key
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc"); // Sorting order
  const [searchTriggered, setSearchTriggered] = useState(false);
  const [showError, setShowError] = useState(false);

  useEffect(() => {
    // Busca as localizações únicas da base de dados
    const fetchLocations = async () => {
      try {
        const response = await api.get("/parks/locations");
        setLocationSuggestions(response.data.locations || []);
      } catch (error) {
        console.error("Error fetching locations:", error);
      }
    };
    fetchLocations();
  }, []);

  const handleSort = (key: "score" | "cost") => {
    let newSortOrder: "asc" | "desc" = "desc";
  
    if (sortBy === key) {
      // Alterna a ordem se já está ordenando pela mesma chave
      newSortOrder = sortOrder === "asc" ? "desc" : "asc";
    }
  
    // Atualiza o estado
    setSortBy(key);
    setSortOrder(newSortOrder);
  
    // Ordena os resultados
    const sortedResults = [...results].sort((a, b) => {
      const valA = key === "score" ? a.score : a.park.cost;
      const valB = key === "score" ? b.score : b.park.cost;
  
      if (newSortOrder === "asc") {
        return valA - valB;
      } else {
        return valB - valA;
      }
    });
  
    setResults(sortedResults);
  };
  

  const handleAddCriterion = (key: string, value: any = true, priority: number = 1) => {
    setCriteria((prev) => [
      ...prev.filter((criterion) => criterion.key !== key), // Remove duplicados
      { key, value, priority },
    ]);
  
    setCheckedCriteria((prev) => ({
      ...prev,
      [key]: true, // Marca a checkbox como selecionada
    }));
  };
  
  const handleRemoveCriterion = (key: string) => {
    setCriteria((prev) => prev.filter((criterion) => criterion.key !== key));
    setCheckedCriteria((prev) => ({
      ...prev,
      [key]: false, // Desmarca a checkbox
    }));
  };  

  const handleReset = () => {
    setCriteria([]); // Limpar critérios
    setResults([]); // Limpar resultados
    setExpandedIndex(null); // Fechar detalhes
    setCheckedCriteria({}); // Resetar checkboxes
    setFilteredSuggestions([]); // Esconde as sugestões
    setSearchTriggered(false); // Resetar flag de pesquisa
    setShowError(false); // Ocultar mensagem de erro
  };

  const handleSearch = async () => {
    
    if (criteria.length === 0) {
      setShowError(true);
      return;
    }

    // Verificar se o Max Cost e Location estão preenchidos, caso selecionados, senão colocar respetivos inputs a vermelho
    const costCriterion = criteria.find((c) => c.key === "cost");
    const locationCriterion = criteria.find((c) => c.key === "location");
    if (costCriterion?.value == "" || locationCriterion?.value == "") {
    
      if (costCriterion?.value == "") {
        const costInput = document.querySelector('input[placeholder="Max Cost"]');
        costInput?.classList.add("border-2");
        costInput?.classList.add("border-red-500");
      }
      if (locationCriterion?.value == "") {
        const locationInput = document.querySelector('input[placeholder="City or Area"]');
        locationInput?.classList.add("border-2");
        locationInput?.classList.add("border-red-500");
      }

      return;
    }

    // Resetar inputs a branco
    const costInput = document.querySelector('input[placeholder="Max Cost"]');
    costInput?.classList.remove("border-2");
    costInput?.classList.remove("border-red-500");
    const locationInput = document.querySelector('input[placeholder="City or Area"]');
    locationInput?.classList.remove("border-2");
    locationInput?.classList.remove("border-red-500");

    setShowError(false);
    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token found. Please log in again.");

      const response = await api.post(
        "/search",
        { criteria },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Filtrar resultados com score > 0
      const filteredResults = (response.data.result || []).filter(
        (result: SearchResult) => result.score > 0
      );

      // Ordenar resultados por score em ordem decrescente
      const sortedResults = filteredResults.sort((a: SearchResult, b: SearchResult) => b.score - a.score);

      setResults(sortedResults); // Atualiza o estado com os resultados ordenados
      setSearchTriggered(true); // Marcar que a pesquisa foi realizada
      // Smooth scroll to results
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 100);

    } catch (error: any) {
      console.error("Error performing search:", error);
      alert(error.message || "An error occurred while performing the search.");
    } finally {
      setLoading(false);
    }
  };

  const toggleDetails = (index: number) => {
    setExpandedIndex((prev) => (prev === index ? null : index));
  };

  const getBestResults = () => {
    const bestScore = Math.max(...results.map((result) => result.score));
    return results.filter((result) => result.score === bestScore);
  };

  const handleLocationChange = (value: string) => {
    handleAddCriterion("location", value, criteria.find((c) => c.key === "location")?.priority || 1);
    if (value) {
      const filtered = locationSuggestions.filter((location) =>
        location.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredSuggestions(filtered);
    } else {
      setFilteredSuggestions([]);
    }
  };

  const handleLocationSelect = (value: string) => {
    handleAddCriterion("location", value, criteria.find((c) => c.key === "location")?.priority || 1);
    setFilteredSuggestions([]); // Esconde as sugestões ao selecionar
  };

  const handleInputFocus = () => {
    setIsFocused(true);
    if (!criteria.find((c) => c.key === "location")?.value) {
      // Mostra todas as localizações quando o input estiver vazio ao focar
      setFilteredSuggestions(locationSuggestions);
    }
  };

  const handleInputBlur = () => {
    setTimeout(() => {
      setIsFocused(false);
      setFilteredSuggestions([]); // Esconde as sugestões ao perder o foco
    }, 200); // Delay para permitir clicar nas sugestões antes de esconder
  };

  return (
    <><div className="bg-white shadow-md rounded p-6 overflow-y-scroll">
      <div className="flex justify-between items-center mb-6">
        <button
          onClick={() => setInfoVisible(true)}
          className="bg-teal-700 text-white p-2 rounded hover:bg-teal-600 transition"
        >
          <InformationCircleIcon className="w-5 h-5" />
        </button>
        <h1 className="text-3xl font-bold text-right text-teal-700">
          New Search
        </h1>
        
      </div>
      <hr className="mb-4 border-2 rounded" />

      {/* Modal de Informações */}
      {infoVisible && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded shadow-lg w-11/12 max-w-lg relative">
            <button
              onClick={() => setInfoVisible(false)}
              className="absolute top-4 right-4 bg-red-500 text-white p-2 rounded hover:bg-red-600 transition"
            >
              <XMarkIcon className="w-5 h-5" />
            </button>
            <h2 className="text-xl font-bold mb-4">How to Search</h2>
            <p className="mb-4 text-gray-600">
              To perform a search, you can enable one or more criteria, define their values, and set priorities (1-9). Higher priority means more importance in the final result.
            </p>
            <h3 className="text-lg font-semibold mb-2">Criteria Information:</h3>
            <ul className="list-disc ml-6 space-y-2">
              <li>
                <strong>Cost:</strong> Maximum budget per month (€).
              </li>
              <li>
                <strong>Location:</strong> Desired city or area.
              </li>
              <li>
                <strong>Parking:</strong> Availability of parking spaces.
              </li>
              <li>
                <strong>Meeting Rooms:</strong> Availability of meeting rooms.
              </li>
              <li>
                <strong>Office With Furniture:</strong> Offices equipped with furniture.
              </li>
              <li>
                <strong>Transport:</strong> Accessibility to public transport.
              </li>
              <li>
                <strong>Canteen:</strong> Availability of on-site dining facilities.
              </li>
            </ul>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {/* Critérios Gerais */}
        
        <h2 className="text-gray-400 italic">Select Criterias:</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { key: "cost", icon: <CurrencyEuroIcon className="w-5"/>, label: "Cost (€/per month)", extraFields: true },
            { key: "location", icon: <MapPinIcon className="w-5"/>, label: "Location", extraFields: true },
            { key: "hasParking", icon: <TruckIcon className="w-5"/>, label: "Parking", extraFields: false },
            { key: "hasMeetingRooms", icon: <PresentationChartBarIcon className="w-5"/>, label: "Meeting Rooms", extraFields: false },
            { key: "hasOfficeWithFurniture", icon: <WifiIcon className="w-5"/>, label: "Office With Furniture", extraFields: false },
            { key: "hasTransport", icon: <MapIcon className="w-5"/>, label: "Transport", extraFields: false },
            { key: "hasCanteen", icon: <ArchiveBoxIcon className="w-5"/>, label: "Canteen", extraFields: false },
          ].map(({ key, icon, label, extraFields }) => {
            const isSelected = checkedCriteria[key] || false;
            const currentCriterion = criteria.find((c) => c.key === key);
          
            return (
              <div
                key={key}
                className={`p-4 border-2 rounded-lg cursor-pointer transition ${isSelected ? "bg-teal-700 border-teal-700" : "border-teal-700 bg-transparent hover:bg-slate-200"}`}
                onClick={() => isSelected
                  ? handleRemoveCriterion(key)
                  : handleAddCriterion(key, extraFields ? "" : true, 1)} // Aqui verifica se deve ser booleano ou string
              >
                <div className="flex justify-between items-center">
                  <span className={`font-bold flex ${isSelected ? "text-white" : "text-teal-700"}`}>{icon}&nbsp;{label}</span>
                  {isSelected && (
                    <select
                      className="border rounded p-2 text-sm bg-white"
                      value={currentCriterion?.priority || 1}
                      onChange={(e) => handleAddCriterion(
                        key,
                        currentCriterion?.value || "",
                        parseInt(e.target.value, 10)
                      )}
                      onClick={(e) => e.stopPropagation()} // Evita fechar ao clicar
                    >
                      {[...Array(9)].map((_, i) => (
                        <option key={i} value={i + 1}>
                          Priority {i + 1}
                        </option>
                      ))}
                    </select>
                  )}
                </div>
                {/* Campos extras */}
                {isSelected && extraFields && (
                  <div className="mt-2 space-y-2" onClick={(e) => e.stopPropagation()}>
                    {key === "cost" && (
                      <input
                        type="number"
                        placeholder="Max Cost"
                        min={0}
                        className="border p-2 w-full rounded"
                        value={currentCriterion?.value || ""}
                        onChange={(e) => handleAddCriterion(
                          key,
                          parseInt(e.target.value, 10) || 0,
                          currentCriterion?.priority || 1
                        )} />
                    )}
                    {key === "location" && (
                      <div className="relative">
                        <input
                          type="text"
                          placeholder="City or Area"
                          className="border p-2 w-full rounded"
                          value={currentCriterion?.value || ""}
                          onChange={(e) => handleLocationChange(e.target.value)}
                          onFocus={handleInputFocus}
                          onBlur={handleInputBlur} />
                        {isFocused && filteredSuggestions.length > 0 && (
                          <ul className="absolute z-10 bg-white border w-full mt-1 rounded shadow-lg max-h-40 overflow-y-auto">
                            {filteredSuggestions.map((suggestion, index) => (
                              <li
                                key={index}
                                onClick={() => handleLocationSelect(suggestion)}
                                className="p-2 hover:bg-teal-100 cursor-pointer"
                              >
                                {suggestion}
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Botões */}
        <div className="space-x-4 flex">
          
          {showError && (
            <div className="text-red-600 font-bold text-sm content-center mr-auto">
              Please select at least one criterion before searching.
            </div>
          )}

          <div className="space-x-4 ml-auto">
          <button
            onClick={handleReset}
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition"
          >
            Reset
          </button>
          <button
            onClick={handleSearch}
            className="bg-teal-700 text-white px-4 py-2 rounded hover:bg-teal-600 transition"
            disabled={loading}
          >
            {loading ? "Searching..." : "Search"}
          </button>
          </div>

        </div>


      </div>
    </div>
    
      {/* Resultados */}
{searchTriggered && (
  <div className="bg-white shadow-lg rounded-lg p-6 overflow-y-scroll mt-6">
    <div className="mt-4">
      <div className="flex justify-between items-center mb-6">
        <h1 ref={resultsRef} className="text-3xl font-bold text-left text-teal-700">
          Results
        </h1>
        {results.length > 0 && (
          <div className="flex space-x-4">
            {/* Ordenar por Melhor Resultado */}
            <button
              onClick={() => handleSort("score")}
              className={`flex items-center bg-teal-700 text-white p-3 rounded-md hover:bg-teal-600 transition ${
                sortBy === "score" ? "ring-2 ring-teal-300" : ""
              }`}
            >
              <StarIcon className="w-5 h-5" />
              {sortBy === "score" && (
                sortOrder === "asc" ? (
                  <ArrowUpIcon className="w-5 h-5 ml-2" />
                ) : (
                  <ArrowDownIcon className="w-5 h-5 ml-2" />
                )
              )}
            </button>
            {/* Ordenar por Custo */}
            <button
              onClick={() => handleSort("cost")}
              className={`flex items-center bg-teal-700 text-white p-3 rounded-md hover:bg-teal-600 transition ${
                sortBy === "cost" ? "ring-2 ring-teal-300" : ""
              }`}
            >
              <CurrencyEuroIcon className="w-5 h-5" />
              {sortBy === "cost" && (
                sortOrder === "asc" ? (
                  <ArrowUpIcon className="w-5 h-5 ml-2" />
                ) : (
                  <ArrowDownIcon className="w-5 h-5 ml-2" />
                )
              )}
            </button>
          </div>
        )}
      </div>
      <hr className="mb-6 border-2 rounded" />
      {results.length > 0 ? (
        <ul className="space-y-4">
          {results.map((result, index) => {
            const bestResults = getBestResults();
            const isBest = bestResults.some((r) => r.park.name === result.park.name);
            const isExpanded = expandedIndex === index;

            return (
              <li
                key={index}
                className={`border p-4 rounded-lg shadow-sm transition ${
                  isBest ? "bg-green-50 border-green-500" : "bg-gray-50 border-gray-300"
                }`}
                onClick={() => toggleDetails(index)}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-lg font-semibold text-teal-700">
                      {result.park.name}
                    </h2>
                    <p className="text-gray-600">
                      {result.park.location} &bull; €{result.park.cost}/per month
                    </p>
                  </div>
                  {isBest && (
                    <div className="text-teal-700">
                      <StarIcon className="w-6 h-6" />
                    </div>
                  )}
                </div>
                <p className="text-sm text-gray-500 mt-2">
                  Score: <span className="font-medium text-teal-600">{(result.score * 100).toFixed(2)}%</span>
                </p>
                {isExpanded && (
                  <div className="mt-4 bg-white border rounded-lg p-4 shadow-inner">
                    <h3 className="font-bold text-teal-700 mb-3">Details:</h3>
                    <ul className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                      <li>
                        <span className="font-semibold">Parking:</span> {result.park.hasParking ? "Yes" : "No"}
                      </li>
                      <li>
                        <span className="font-semibold">Meeting Rooms:</span> {result.park.hasMeetingRooms ? "Yes" : "No"}
                      </li>
                      <li>
                        <span className="font-semibold">Office Furniture:</span> {result.park.hasOfficeWithFurniture ? "Yes" : "No"}
                      </li>
                      <li>
                        <span className="font-semibold">Transport:</span> {result.park.hasTransport ? "Yes" : "No"}
                      </li>
                      <li>
                        <span className="font-semibold">Canteen:</span> {result.park.hasCanteen ? "Yes" : "No"}
                      </li>
                    </ul>
                    <h4 className="font-bold text-teal-700 mt-4 mb-2">Criterion Contributions:</h4>
                    <table className="w-full border-collapse border border-gray-300 text-sm">
                      <thead className="bg-gray-100">
                        <tr>
                          <th className="border border-gray-300 px-4 py-2 text-left">Criterion</th>
                          <th className="border border-gray-300 px-4 py-2 text-left">Priority</th>
                          <th className="border border-gray-300 px-4 py-2 text-left">Contribution (%)</th>
                        </tr>
                      </thead>
                      <tbody>
                        {Object.entries(result.contributions).map(([key, value]) => {
                          const priority = criteria.find((criterion) => criterion.key === key)?.priority || "N/A";

                          return (
                            <tr key={key}>
                              <td className="border border-gray-300 px-4 py-2 capitalize">
                                {key.replace(/([A-Z])/g, " $1")}
                              </td>
                              <td className="border border-gray-300 px-4 py-2">{priority}</td>
                              <td className="border border-gray-300 px-4 py-2">
                                {(value * result.score * 100).toFixed(2)}%
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      ) : (
        <p className="text-gray-500 italic text-lg text-left">
          No results found, try a new search.
        </p>
      )}
    </div>
  </div>
)}


      </>
  );
}