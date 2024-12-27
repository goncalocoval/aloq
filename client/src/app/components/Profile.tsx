import { useState, useEffect } from "react";
import api from "../../lib/apiService";

export default function Profile() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [details, setDetails] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [newPassword, setNewPassword] = useState("");

  // Fetch user data on component mount
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
      } finally {
        setLoading(false);
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
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token found. Please login again.");

      await api.patch(
        "/client/change-password",
        { newPassword },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setNewPassword("");
      alert("Password updated successfully!");
    } catch (err) {
      setError("Failed to change password. Please try again.");
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="bg-white shadow-md rounded p-6 overflow-y-scroll">
      <h1 className="text-2xl font-bold mb-4">Clients' Profile</h1>
      <p>
        <strong>Name:</strong> {user.name}
      </p>
      <p>
        <strong>Email:</strong> {user.email}
      </p>
      <p>
        <strong>Registration Date:</strong>{" "}
        {new Date(user.createdAt).toLocaleDateString()}
      </p>
      <p>
        <strong>Email Verified:</strong> {user.isVerified ? "Yes" : "No"}
      </p>

      {/* Details Section */}
      <div className="mt-4">
        <h2 className="font-semibold mb-2">Details:</h2>
        {isEditing ? (
          <textarea
            value={details}
            onChange={(e) => setDetails(e.target.value)}
            className="w-full border rounded p-2"
          />
        ) : (
          <p>{details}</p>
        )}
        <button
          className="mt-2 text-teal-700"
          onClick={() => (isEditing ? handleSaveDetails() : setIsEditing(true))}
        >
          {isEditing ? "Save" : "Edit Details"}
        </button>
      </div>

      {/* Change Password */}
      <div className="mt-4">
        <h2 className="font-semibold mb-2">Change Password:</h2>
        <input
          type="password"
          placeholder="New Password"
          className="border rounded p-2 w-full"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
        <button
          className="mt-2 bg-teal-700 text-white px-4 py-2 rounded"
          onClick={handleChangePassword}
        >
          Update Password
        </button>
      </div>
    </div>
  );
}
