import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext.jsx";
import { toast } from "react-toastify";
import axios from "axios";
import { HiPencilAlt } from "react-icons/hi";

const ProfilePage = () => {
  const { user, login } = useAuth();
  const [editingField, setEditingField] = useState(null);
  const [newValue, setNewValue] = useState("");
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwords, setPasswords] = useState({
    newPassword: "",
    confirmPassword: "",
  });

  if (!user) {
    return (
      <div className="flex justify-center items-center min-h-screen text-gray-400">
        Loading profile...
      </div>
    );
  }

  const handleEdit = (field, currentValue) => {
    if (field === "role") return;
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
        "Invalid phone number format (099XXXXXXX or +2329XXXXXXX)",
      );
    }
  };

  const handleSave = async () => {
    if (!newValue.trim()) {
      toast.error("Field cannot be empty");
      return;
    }

    let payload = {};
    let formattedValue = newValue.trim();

    try {
      if (editingField === "tel") {
        formattedValue = formatPhone(formattedValue);
      }

      payload[editingField] = formattedValue;

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

  const renderField = (label, field, value, editable = true) => (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between bg-gray-800/80 border border-gray-700 p-3 sm:p-4 rounded-lg transition hover:border-yellow-500/40">
      <div className="flex-1">
        <p className="text-gray-400 text-xs sm:text-sm">{label}</p>
        <p className="text-white font-medium break-words">{value || "N/A"}</p>
      </div>
      {editable && (
        <button
          onClick={() => handleEdit(field, value)}
          className="mt-2 sm:mt-0 text-yellow-400 hover:text-yellow-300 text-sm font-semibold"
        >
          <HiPencilAlt className="size-4" />
        </button>
      )}
    </div>
  );

  const handleChangePassword = async () => {
    const { newPassword, confirmPassword } = passwords;

    if (!newPassword || !confirmPassword) {
      toast.error("Please fill in both fields");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const res = await axios.put(
        "https://sierra-catalogue.onrender.com/api/user/profile/password",
        { newPassword, confirmPassword },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      toast.success(res.data.message || "Password changed successfully!");
      setShowPasswordModal(false);
      setPasswords({ newPassword: "", confirmPassword: "" });
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Failed to change password. Try again.",
      );
    }
  };

  return (
    <div className="min-h-screen flex justify-left items-start py-10 px-4 sm:px-6">
      <div className="w-full max-w-2xl bg-gray-700 border border-gray-600 rounded-2xl p-6 sm:p-8 shadow-xl">
        <h1 className="text-2xl sm:text-3xl font-bold mb-8 text-yellow-400 text-center">
          My Profile
        </h1>

        <div className="flex flex-col gap-4">
          {renderField("First Name", "firstName", user.firstName)}
          {renderField("Other Names", "otherNames", user.otherNames)}
          {renderField("Last Name", "lastName", user.lastName)}
          {renderField("Email", "email", user.email)}
          {renderField("Phone", "tel", user.tel)}
          {renderField("Address", "address", user.address)}
          {renderField("Account Type", "role", user.role || "Customer", false)}
        </div>

        <div className="text-center mt-10">
          <button
            onClick={() => setShowPasswordModal(true)}
            className="px-6 py-3 bg-yellow-500 hover:bg-yellow-400 text-black font-semibold rounded-lg transition w-full sm:w-auto"
          >
            Change Password
          </button>
        </div>
      </div>

      {editingField && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-4">
          <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 w-full max-w-sm shadow-lg">
            <h2 className="text-xl sm:text-2xl font-bold mb-4 text-yellow-400 capitalize text-center">
              Edit {editingField}
            </h2>

            <input
              type="text"
              value={newValue}
              onChange={(e) => setNewValue(e.target.value)}
              className="w-full bg-gray-900 border border-gray-700 text-white p-3 rounded-md focus:outline-none focus:border-yellow-400"
            />

            <div className="flex flex-col sm:flex-row justify-end gap-3 mt-6">
              <button
                onClick={() => setEditingField(null)}
                className="w-full sm:w-auto px-4 py-2 bg-gray-600 rounded-md hover:bg-gray-500 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="w-full sm:w-auto px-4 py-2 bg-yellow-500 text-black rounded-md font-semibold hover:bg-yellow-400 transition"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {showPasswordModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-4">
          <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 w-full max-w-sm shadow-lg">
            <h2 className="text-xl sm:text-2xl font-bold mb-4 text-yellow-400 text-center">
              Change Password
            </h2>

            <div className="space-y-4">
              <input
                type="password"
                placeholder="New Password"
                value={passwords.newPassword}
                onChange={(e) =>
                  setPasswords({ ...passwords, newPassword: e.target.value })
                }
                className="w-full bg-gray-900 border border-gray-700 text-white p-3 rounded-md focus:outline-none focus:border-yellow-400"
              />
              <input
                type="password"
                placeholder="Confirm Password"
                value={passwords.confirmPassword}
                onChange={(e) =>
                  setPasswords({
                    ...passwords,
                    confirmPassword: e.target.value,
                  })
                }
                className="w-full bg-gray-900 border border-gray-700 text-white p-3 rounded-md focus:outline-none focus:border-yellow-400"
              />
            </div>

            <div className="flex flex-col sm:flex-row justify-end gap-3 mt-6">
              <button
                onClick={() => setShowPasswordModal(false)}
                className="w-full sm:w-auto px-4 py-2 bg-gray-600 rounded-md hover:bg-gray-500 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleChangePassword}
                className="w-full sm:w-auto px-4 py-2 bg-yellow-500 text-black rounded-md font-semibold hover:bg-yellow-400 transition"
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
