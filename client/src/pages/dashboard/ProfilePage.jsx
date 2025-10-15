import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext.jsx";
import { toast } from "react-toastify";
import axios from "axios";
import { HiPencilAlt } from "react-icons/hi";

const ProfilePage = () => {
  const { user, login } = useAuth();
  const [editingField, setEditingField] = useState(null);
  let [newValue, setNewValue] = useState("");

  if (!user) {
    return <p className="p-4 text-gray-400">Loading profile...</p>;
  }

  const handleEdit = (field, currentValue) => {
    setEditingField(field);
    setNewValue(currentValue || "");
  };

  const formatPhone = (input) => {
    const clean = input.trim();

    if (/^0\d{8}$/.test(clean)) {
      return "+232" + clean.slice(1);
    } else if (/^\+232\d{8}$/.test(clean)) {
      return clean;
    } else {
      throw new Error(
        "Invalid phone number format (099XXXXXX or +2329XXXXXXX)",
      );
    }
  };

  const handleSave = async () => {
    if (!newValue.trim()) {
      toast.error("Field cannot be empty");
      return;
    }

    let payload = {};

    try {
      if (editingField === "tel") {
        newValue = formatPhone(newValue);
      }

      payload[editingField] = newValue;

      const token = localStorage.getItem("token");
      const res = await axios.put(
        "https://sierra-catalogue.onrender.com/api/user/profile",
        payload,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      login(token, res.data.user);

      toast.success("Profile updated successfully!");
      setEditingField(null);
    } catch (err) {
      console.error(err);
      toast.error(
        err.response?.data?.message ||
          err.message ||
          "Failed to update profile",
      );
    }
  };

  const renderField = (label, field, value) => (
    <div className="flex items-center justify-between bg-gray-800 p-3 rounded-md">
      <div>
        <p className="text-gray-400 text-sm">{label}</p>
        <p className="text-white font-medium">{value || "N/A"}</p>
      </div>
      <button
        onClick={() => handleEdit(field, value)}
        className="text-yellow-400 hover:text-yellow-300 text-sm font-semibold"
      >
        <HiPencilAlt />️ Edit
      </button>
    </div>
  );

  return (
    <div className="p-6 bg-gray-900 shadow-md rounded-xl max-w-lg mx-auto text-white">
      <h1 className="text-2xl font-bold mb-6 text-yellow-400 text-center">
        My Profile
      </h1>

      <div className="space-y-4">
        {renderField("First Name", "firstName", user.firstName)}
        {renderField("Other Names", "otherNames", user.otherNames)}
        {renderField("Last Name", "lastName", user.lastName)}
        {renderField("Email", "email", user.email)}
        {renderField("Phone", "tel", user.tel)}
        {renderField("Address", "address", user.address)}
        {renderField("Account Type", "role", user.role || "Customer")}
      </div>

      {/* Edit Modal */}
      {editingField && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-xl p-6 w-80 shadow-lg">
            <h2 className="text-xl font-bold mb-4 text-yellow-400 capitalize">
              Edit {editingField}
            </h2>

            <input
              type="text"
              value={newValue}
              onChange={(e) => setNewValue(e.target.value)}
              className="w-full bg-gray-900 border border-gray-700 text-white p-3 rounded-md focus:outline-none focus:border-yellow-400"
            />

            <div className="flex justify-end gap-3 mt-4">
              <button
                onClick={() => setEditingField(null)}
                className="px-4 py-2 bg-gray-600 rounded-md hover:bg-gray-500"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-yellow-500 text-black rounded-md font-semibold hover:bg-yellow-400"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
