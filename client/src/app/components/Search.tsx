"use client";
import { useState } from "react";
import api from "../../lib/apiService";

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
    hasOfficeFurniture: boolean;
    hasWiFiAndPrinter: boolean;
    hasTransportAndCanteen: boolean;
  };
  score: number;
};

export default function Search() {
  const [criteria, setCriteria] = useState<Criterion[]>([]);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null); // Index para detalhes do resultado
  const [checkedCriteria, setCheckedCriteria] = useState<Record<string, boolean>>({}); // Estado para checkboxes

  const handleAddCriterion = (key: string, value: any, priority: number) => {
    setCriteria((prev) => [
      ...prev.filter((criterion) => criterion.key !== key), // Remove duplicados
      { key, value, priority },
    ]);

    setCheckedCriteria((prev) => ({
        ...prev,
        [key]: true, // Marca a checkbox como marcada
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
  };

  const handleSearch = async () => {
    if (criteria.length === 0) {
      alert("Please select at least one criterion.");
      return;
    }

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

      setResults(filteredResults);
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

  const getBestResult = () => {
    return results.reduce((best, current) =>
      current.score > best.score ? current : best
    );
  };

  return (
    <div className="bg-white shadow-md rounded p-6 overflow-y-scroll">
      <h1 className="text-2xl font-bold mb-4">New Search</h1>

      <div className="space-y-4">
        {/* Critério: Custo */}
        <div>
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={checkedCriteria["cost"] || false}
              onChange={(e) =>
                e.target.checked
                  ? handleAddCriterion("cost", "", 1)
                  : handleRemoveCriterion("cost")
              }
            />
            <span>Custo (€/mês)</span>
          </label>
          {criteria.find((criterion) => criterion.key === "cost") && (
            <div className="mt-2 space-y-2">
              <input
                type="number"
                placeholder="Max Cost"
                onChange={(e) =>
                  handleAddCriterion(
                    "cost",
                    parseInt(e.target.value) || 0,
                    criteria.find((c) => c.key === "cost")?.priority || 1
                  )
                }
                className="border p-2 w-full"
              />
              <input
                type="number"
                placeholder="Priority (1-9)"
                onChange={(e) =>
                  handleAddCriterion(
                    "cost",
                    criteria.find((c) => c.key === "cost")?.value || "",
                    parseInt(e.target.value) || 1
                  )
                }
                className="border p-2 w-full"
              />
            </div>
          )}
        </div>

        {/* Critério: Localização */}
        <div>
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={checkedCriteria["location"] || false}
              onChange={(e) =>
                e.target.checked
                  ? handleAddCriterion("location", "", 1)
                  : handleRemoveCriterion("location")
              }
            />
            <span>Localização</span>
          </label>
          {criteria.find((criterion) => criterion.key === "location") && (
            <div className="mt-2 space-y-2">
              <input
                type="text"
                placeholder="City or Area"
                onChange={(e) =>
                  handleAddCriterion(
                    "location",
                    e.target.value,
                    criteria.find((c) => c.key === "location")?.priority || 1
                  )
                }
                className="border p-2 w-full"
              />
              <input
                type="number"
                placeholder="Priority (1-9)"
                onChange={(e) =>
                  handleAddCriterion(
                    "location",
                    criteria.find((c) => c.key === "location")?.value || "",
                    parseInt(e.target.value) || 1
                  )
                }
                className="border p-2 w-full"
              />
            </div>
          )}
        </div>

        {/* Outros Critérios */}
        {[
          "hasParking",
          "hasMeetingRooms",
          "hasOfficeFurniture",
          "hasWiFiAndPrinter",
          "hasTransportAndCanteen",
        ].map((key) => (
          <div key={key}>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={checkedCriteria[key] || false}
                onChange={(e) =>
                  e.target.checked
                    ? handleAddCriterion(key, true, 1)
                    : handleRemoveCriterion(key)
                }
              />
              <span>{key.replace(/([A-Z])/g, " $1")}</span>
            </label>
            {criteria.find((criterion) => criterion.key === key) && (
              <div className="mt-2">
                <input
                  type="number"
                  placeholder="Priority (1-9)"
                  onChange={(e) =>
                    handleAddCriterion(
                      key,
                      true,
                      parseInt(e.target.value) || 1
                    )
                  }
                  className="border p-2 w-full"
                />
              </div>
            )}
          </div>
        ))}

        {/* Botões */}
        <div className="flex space-x-4">
          <button
            onClick={handleSearch}
            className="bg-teal-700 text-white px-4 py-2 rounded"
            disabled={loading}
          >
            {loading ? "Searching..." : "Search"}
          </button>
          <button
            onClick={handleReset}
            className="bg-gray-500 text-white px-4 py-2 rounded"
          >
            Reset
          </button>
        </div>

        {/* Resultados */}
        {results.length > 0 ? (
          <div className="mt-4">
            <h2 className="text-xl font-bold mb-2">Results:</h2>
            <ul className="space-y-2">
              {results.map((result, index) => {
                const isBest = result === getBestResult();
                const isExpanded = expandedIndex === index;

                return (
                  <li
                    key={index}
                    className={`border p-2 rounded cursor-pointer ${
                      isBest ? "bg-green-100 border-green-500" : "bg-white"
                    }`}
                    onClick={() => toggleDetails(index)}
                  >
                    {isBest && (
                      <span className="text-green-700 font-bold">Best result <br /></span>
                    )}
                    <strong>{result.park.name}</strong> - {result.park.location} (€{result.park.cost}/mês)
                    <br />
                    <span>Score: {result.score.toFixed(2)}</span>

                    {isExpanded && (
                      <div className="mt-2">
                        <p><strong>Details:</strong></p>
                        <ul className="list-disc ml-6">
                          <li>Parking: {result.park.hasParking ? "Yes" : "No"}</li>
                          <li>Meeting Rooms: {result.park.hasMeetingRooms ? "Yes" : "No"}</li>
                          <li>Office Furniture: {result.park.hasOfficeFurniture ? "Yes" : "No"}</li>
                          <li>WiFi & Printer: {result.park.hasWiFiAndPrinter ? "Yes" : "No"}</li>
                          <li>Transport & Canteen: {result.park.hasTransportAndCanteen ? "Yes" : "No"}</li>
                        </ul>
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        ) : null}
      </div>
    </div>
  );
}