"use client";
import { useState, useEffect } from "react";
import api from "../../lib/apiService";

type SearchHistory = {
  id: number;
  createdAt: string;
  criteria: Array<{ key: string; value: any; priority: number }>;
  result: Array<{
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
  }>;
};

export default function History() {
  const [history, setHistory] = useState<SearchHistory[]>([]);
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null); // Para expandir detalhes

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
    <div className="bg-white shadow-md rounded p-6 overflow-y-scroll">
      <h1 className="text-2xl font-bold mb-4">Search History</h1>

      {history.length > 0 ? (
        <ul className="space-y-4">
          {history.map((search, index) => {
            const isExpanded = expandedIndex === index;

            return (
              <li key={search.id} className="border p-4 rounded">
                <div
                  className="cursor-pointer"
                  onClick={() => toggleDetails(index)}
                >
                  <p>
                    <strong>Search Date:</strong>{" "}
                    {new Date(search.createdAt).toLocaleString()}
                  </p>
                  <p>
                    <strong>Criteria:</strong>{" "}
                    {search.criteria
                      .map((c) => `${c.key} (Priority: ${c.priority})`)
                      .join(", ")}
                  </p>
                </div>

                {isExpanded && (
                  <div className="mt-4">
                    <h2 className="text-lg font-semibold mb-2">
                      Results Obtained:
                    </h2>
                    <ul className="space-y-2">
                      {search.result.map((res, idx) => (
                        <li
                          key={idx}
                          className="border p-2 rounded cursor-pointer bg-gray-50"
                        >
                          <strong>{res.park.name}</strong> -{" "}
                          {res.park.location} (€{res.park.cost}/mês)
                          <br />
                          <span>Score: {res.score.toFixed(2)}</span>
                          <div className="mt-2">
                            <p><strong>Details:</strong></p>
                            <ul className="list-disc ml-6">
                              <li>
                                Parking: {res.park.hasParking ? "Yes" : "No"}
                              </li>
                              <li>
                                Meeting Rooms:{" "}
                                {res.park.hasMeetingRooms ? "Yes" : "No"}
                              </li>
                              <li>
                                Office Furniture:{" "}
                                {res.park.hasOfficeFurniture ? "Yes" : "No"}
                              </li>
                              <li>
                                WiFi & Printer:{" "}
                                {res.park.hasWiFiAndPrinter ? "Yes" : "No"}
                              </li>
                              <li>
                                Transport & Canteen:{" "}
                                {res.park.hasTransportAndCanteen ? "Yes" : "No"}
                              </li>
                            </ul>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      ) : (
        <p className="text-gray-500">No history found.</p>
      )}
    </div>
  );
}