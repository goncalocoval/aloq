"use client";
import { useState, useEffect } from "react";
import { CalendarIcon, ChevronDownIcon, CheckIcon, StarIcon } from "@heroicons/react/20/solid";
import api from "../../lib/apiService";
import { CurrencyEuroIcon, MapIcon, TruckIcon, PresentationChartBarIcon, WifiIcon, ArchiveBoxIcon } from "@heroicons/react/20/solid";

type SearchHistory = {
  id: number;
  createdAt: string;
  criteria: Array<{ key: string; value: any; priority: number }>;
  result: Array<{
    park: {
      name: string;
      location: string;
      cost: number;
    };
    score: number;
  }>;
};

// Tipos permitidos para as chaves
type CriteriaKey =
  | "cost"
  | "location"
  | "hasParking"
  | "hasMeetingRooms"
  | "hasOfficeWithFurniture"
  | "hasTransport"
  | "hasCanteen";

// Atualize a definição de criteriaMapping
const criteriaMapping: Record<CriteriaKey, { name: string; icon: JSX.Element }> = {
  cost: { name: "Cost", icon: <CurrencyEuroIcon className="w-5 h-5 text-teal-700 mr-2" /> },
  location: { name: "Location", icon: <MapIcon className="w-5 h-5 text-teal-700 mr-2" /> },
  hasParking: { name: "Parking", icon: <TruckIcon className="w-5 h-5 text-teal-700 mr-2" /> },
  hasMeetingRooms: { name: "Meeting Rooms", icon: <PresentationChartBarIcon className="w-5 h-5 text-teal-700 mr-2" /> },
  hasOfficeWithFurniture: { name: "Office With Furniture", icon: <WifiIcon className="w-5 h-5 text-teal-700 mr-2" /> },
  hasTransport: { name: "Transport", icon: <MapIcon className="w-5 h-5 text-teal-700 mr-2" /> },
  hasCanteen: { name: "Canteen", icon: <ArchiveBoxIcon className="w-5 h-5 text-teal-700 mr-2" /> },
};

export default function History() {
  const [history, setHistory] = useState<SearchHistory[]>([]);
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("No token found. Please log in again.");

        const response = await api.get("/search/history", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setHistory(response.data.history || []);
      } catch (error: any) {
        console.error("Error fetching history:", error);
        alert(error.message || "An error occurred while fetching the history.");
      }
    };

    fetchHistory();
  }, []);

  const toggleDetails = (index: number) => {
    setExpandedIndex((prev) => (prev === index ? null : index));
  };

  return (
    <div className="bg-white shadow-md rounded p-6">
      <h1 className="text-3xl font-bold text-teal-700 mb-6 text-right">
        Search History
      </h1>
      <hr className="mb-4 rounded border-2" />

      {history.length > 0 ? (
        <ul className="space-y-4">
          <h2 className="text-gray-400 italic">Last 5 Searches:</h2>
          {history.slice(0, 5).map((search, index) => {
            const isExpanded = expandedIndex === index;

            return (
              <li
                key={search.id}
                className="border p-4 rounded-lg shadow-sm bg-gray-50 hover:bg-gray-100 cursor-pointer transition"
                onClick={() => toggleDetails(index)}
              >
                <div className="flex justify-between items-center">
                  <p className="text-teal-700 font-bold flex items-center">
                    <CalendarIcon className="w-5 h-5 mr-3" />
                    {`${new Date(search.createdAt)
                    .toLocaleString("en-GB", {
                      day: "2-digit",
                      month: "long",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: false,
                    })
                    .replace(" at ", ", ")}h`}

                  </p>
                  <span
                    className={`ml-4 ${
                      isExpanded ? "rotate-180" : "rotate-0"
                    } transform transition`}
                  >
                    <ChevronDownIcon className="w-7 h-7 text-teal-700" />
                  </span>
                </div>

                {isExpanded && (
                  <div className="mt-4 bg-white border rounded-lg p-6 shadow-inner">
                    <h2 className="text-lg font-semibold text-teal-700 mb-6">
                      Search Details
                      <hr />
                    </h2>
                    
                    <h3 className="font-bold text-teal-700 mb-2">Criterias Selected:</h3>
                    <table className="w-full border-collapse border border-gray-300 text-sm mb-6">
                      <thead className="bg-gray-100">
                        <tr>
                          <th className="border border-gray-300 px-4 py-2 text-left">
                            Criteria
                          </th>
                          <th className="border border-gray-300 px-4 py-2 text-left">
                            Value
                          </th>
                          <th className="border border-gray-300 px-4 py-2 text-left">
                            Priority
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {search.criteria.map((c, idx) => {
                          const mapped = criteriaMapping[c.key as CriteriaKey] || { name: c.key, icon: null };

                          return (
                            <tr key={idx}>
                              {/* Nome do critério com ícone */}
                              <td className="border px-4 py-2 flex items-center">
                                {mapped.icon}
                                {mapped.name}
                              </td>
                              {/* Valor com check para booleanos */}
                              <td className="border border-gray-300 px-4 py-2">
                                {typeof c.value === "boolean" && c.value ? (
                                  <CheckIcon className="w-5 h-5 text-green-600" />
                                ) : (
                                  c.value
                                )}
                              </td>
                              {/* Prioridade */}
                              <td className="border border-gray-300 px-4 py-2">{c.priority}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>

                    <h3 className="font-bold text-teal-700 mb-2">Results Obtained:</h3>
                    {search.result.filter((res) => res.score > 0).length > 0 ? (
                      <ul className="space-y-2">
                        {search.result
                          .filter((res) => res.score > 0)
                          .sort((a, b) => b.score - a.score)
                          .map((res, idx, arr) => {
                            // Identificar o maior score para determinar os "best results"
                            const maxScore = arr[0].score;
                            const isBestResult = res.score === maxScore;

                            return (
                              <li
                                key={idx}
                                className={`border p-4 rounded-lg shadow transition ${
                                  isBestResult
                                    ? "border-green-500 bg-green-50"
                                    : "border-gray-300 bg-gray-50"
                                }`}
                              >
                                <div className="flex justify-between items-center">
                                  <div>
                                    <h2 className="text-md font-semibold text-teal-700">
                                      {res.park.name}
                                    </h2>
                                    <p className="text-gray-600">
                                      {res.park.location} &bull; €{res.park.cost}/month
                                    </p>
                                  </div>
                                  <div className="text-right">
                                    {isBestResult && (
                                      <StarIcon className="w-5 h-5 text-teal-700 ml-auto mb-2" />
                                    )}
                                    <p className="text-sm text-gray-500">
                                      Score:{" "}
                                      <span className="font-medium text-teal-600">
                                        {(res.score * 100).toFixed(2)}%
                                      </span>
                                    </p>
                                  </div>
                                </div>
                              </li>
                            );
                          })}
                      </ul>
                    ) : (
                      <p className="text-gray-500 italic">No results obtained.</p>
                    )}

                  </div>
                )}
              </li>
            );
          })}
        </ul>
      ) : (
        <p className="text-gray-500 italic">No history found.</p>
      )}
    </div>
  );
}
