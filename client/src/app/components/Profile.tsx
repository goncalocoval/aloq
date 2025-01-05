import { useState, useEffect } from "react";
import { CheckIcon, XMarkIcon } from "@heroicons/react/20/solid";
import api from "../../lib/apiService";

export default function Profile() {
  const [user, setUser] = useState<any>(null);
  const [error, setError] = useState("");
  const [details, setDetails] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState(false); // Mensagem de sucesso para password

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("No token found. Please login again.");

        const res = await api.get("/client/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setUser(res.data);
        setDetails(res.data.details || "Add your details here...");
      } catch (err) {
        setError("Failed to fetch user data. Please try again.");
      }
    };

    fetchUserData();
  }, []);

  const handleSaveDetails = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token found. Please login again.");

      await api.patch(
        "/client/update-details",
        { details },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setIsEditing(false);
    } catch (err) {
      setError("Failed to update details. Please try again.");
    }
  };

  const handleChangePassword = async () => {
    // Validação manual do password
    if (!newPassword) {
      setPasswordError("Password is required.");
      return;
    }
    if (newPassword.length < 6) {
      setPasswordError("Password must be at least 6 characters long.");
      return;
    }
    if (newPassword.length > 20) {
      setPasswordError("Password must not exceed 20 characters.");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token found. Please login again.");

      await api.patch(
        "/client/change-password",
        { newPassword },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setNewPassword("");
      setPasswordError(""); // Limpa mensagens de erro
      setPasswordSuccess(true); // Define mensagem de sucesso
      setTimeout(() => setPasswordSuccess(false), 5000); // Esconde mensagem após 5 segundos
    } catch (err) {
      setError("Failed to change password. Please try again.");
    }
  };

  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="bg-white w-100 shadow-md rounded p-6 overflow-y-scroll mx-auto">
      <h1 className="text-3xl font-bold text-right text-teal-700 mb-6">
        Client Profile
      </h1>
      <hr className="mb-4 rounded border-2" />
      <div className="bg-gray-100 shadow-sm rounded-md p-4 mb-6">
        <div className="flex items-center gap-4 mb-4">
          <div className="h-16 w-16 rounded-full bg-teal-500 text-white flex items-center justify-center font-bold text-xl">
            {user?.name?.[0] || "U"}
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-800">{user?.name || "Loading..."}</h2>
            <p className="text-gray-500">{user?.email || "Loading..."}</p>
          </div>
        </div>
        <p>
          <strong>Registration Date:</strong>{" "}
          {user?.createdAt
            ? new Date(user.createdAt).toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "long",
                year: "numeric",
              })
            : "Loading..."}
        </p>
        <p className="flex items-center">
          <strong>Email Verified:</strong>
          {user?.isVerified ? (
            <CheckIcon className="w-6 h-6 text-green-500 ml-1" />
          ) : (
            <XMarkIcon className="w-6 h-6 text-red-500 ml-1" />
          )}
        </p>
      </div>

      {/* Details Section */}
      <div className="bg-gray-100 shadow-sm rounded-md p-4 mb-6">
        <h2 className="font-semibold text-lg mb-2 text-gray-800">Details:</h2>
        {isEditing ? (
          <textarea
            value={details}
            onChange={(e) => setDetails(e.target.value)}
            className="w-full border rounded p-2 focus:outline-teal-500"
          />
        ) : (
          <p className="text-gray-700">{details}</p>
        )}
        <button
          className="mt-2 text-teal-700 hover:underline"
          onClick={() => (isEditing ? handleSaveDetails() : setIsEditing(true))}
        >
          {isEditing ? "Save" : "Edit Details"}
        </button>
      </div>

      {/* Change Password */}
      <div className="bg-gray-100 shadow-sm rounded-md p-4">
        <h2 className="font-semibold text-lg mb-2 text-gray-800">Change Password:</h2>
        <input
          type="password"
          placeholder="New Password"
          className={`border rounded p-2 w-full focus:outline-teal-500 ${
            passwordError ? "border-red-500" : ""
          }`}
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          minLength={6}
          maxLength={20}
          required
        />
        {passwordError && <p className="text-red-500 text-sm mt-2">{passwordError}</p>}
        {passwordSuccess && (
          <p className="text-green-500 text-sm mt-2">Password updated successfully!</p>
        )}
        <button
          className="mt-4 bg-teal-700 text-white px-4 py-2 rounded hover:bg-teal-800 transition"
          onClick={handleChangePassword}
        >
          Update Password
        </button>
      </div>
    </div>
  );
}
