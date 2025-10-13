import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../../../context/AuthContext.jsx";
import { toast } from "react-toastify";

const AdminSettings = () => {
  const { token } = useAuth();
  const [profile, setProfile] = useState({});
  const [logs, setLogs] = useState([]);
  const [timeout, setTimeoutValue] = useState("1h");
  const [passwords, setPasswords] = useState({
    oldPassword: "",
    newPassword: "",
  });

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [profileRes, securityRes] = await Promise.all([
          axios.get(
            "https://sierra-catalogue.onrender.com/api/admin/settings/profile",
            {
              headers: { Authorization: `Bearer ${token}` },
            },
          ),
          axios.get(
            "https://sierra-catalogue.onrender.com/api/admin/settings/security",
            {
              headers: { Authorization: `Bearer ${token}` },
            },
          ),
        ]);
        setProfile(profileRes.data);
        setLogs(securityRes.data.logs);
        setTimeoutValue(securityRes.data.timeout);
      } catch (err) {
        toast.error("Error loading admin settings");
      }
    };
    fetchAll();
  }, [token]);

  const updateProfile = async () => {
    try {
      await axios.put(
        "https://sierra-catalogue.onrender.com/api/admin/settings/profile/update",
        profile,
        { headers: { Authorization: `Bearer ${token}` } },
      );
      toast.success("Profile updated!");
    } catch {
      toast.error("Failed to update profile");
    }
  };

  const updatePassword = async () => {
    try {
      await axios.put(
        "https://sierra-catalogue.onrender.com/api/admin/settings/password",
        passwords,
        { headers: { Authorization: `Bearer ${token}` } },
      );
      setPasswords({ oldPassword: "", newPassword: "" });
      toast.success("Password changed successfully");
    } catch {
      toast.error("Error changing password");
    }
  };

  const updateTimeout = async () => {
    try {
      await axios.post(
        "https://sierra-catalogue.onrender.com/api/admin/settings/security/timeout",
        { timeout },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      toast.success("Session timeout updated");
    } catch {
      toast.error("Failed to update timeout");
    }
  };

  const logoutAll = async () => {
    try {
      await axios.post(
        "https://sierra-catalogue.onrender.com/api/admin/settings/logout-all",
        {},
        { headers: { Authorization: `Bearer ${token}` } },
      );
      toast.success("All sessions logged out");
    } catch {
      toast.error("Error logging out sessions");
    }
  };

  return (
    <div className="text-white space-y-10">
      <h1 className="text-3xl font-bold text-primary-gold">Admin Settings</h1>

      {/* Profile Section */}
      <section className="bg-[#111] border border-gray-800 rounded-2xl p-6">
        <h2 className="text-xl text-yellow-400 mb-4">Personal Information</h2>
        {["firstName", "lastName", "email", "tel"].map((key) => (
          <input
            key={key}
            value={profile[key] || ""}
            onChange={(e) => setProfile({ ...profile, [key]: e.target.value })}
            placeholder={key.replace(/^\w/, (c) => c.toUpperCase())}
            className="bg-black border border-gray-700 p-2 rounded w-full mb-3"
          />
        ))}
        <button
          onClick={updateProfile}
          className="bg-yellow-500 hover:bg-yellow-600 text-black py-2 px-4 rounded-lg"
        >
          Update Profile
        </button>
      </section>

      {/* Password Section */}
      <section className="bg-[#111] border border-gray-800 rounded-2xl p-6">
        <h2 className="text-xl text-yellow-400 mb-4">Change Password</h2>
        <input
          type="password"
          placeholder="Old Password"
          value={passwords.oldPassword}
          onChange={(e) =>
            setPasswords({ ...passwords, oldPassword: e.target.value })
          }
          className="bg-black border border-gray-700 p-2 rounded w-full mb-3"
        />
        <input
          type="password"
          placeholder="New Password"
          value={passwords.newPassword}
          onChange={(e) =>
            setPasswords({ ...passwords, newPassword: e.target.value })
          }
          className="bg-black border border-gray-700 p-2 rounded w-full mb-4"
        />
        <button
          onClick={updatePassword}
          className="bg-yellow-500 hover:bg-yellow-600 text-black py-2 px-4 rounded-lg"
        >
          Change Password
        </button>
      </section>

      {/* Security Section */}
      <section className="bg-[#111] border border-gray-800 rounded-2xl p-6">
        <h2 className="text-xl text-yellow-400 mb-4">Security Settings</h2>
        <label>Session Timeout</label>
        <select
          value={timeout}
          onChange={(e) => setTimeoutValue(e.target.value)}
          className="bg-black border border-gray-700 p-2 rounded w-full my-2"
        >
          <option value="30m">30 minutes</option>
          <option value="1h">1 hour</option>
          <option value="2h">2 hours</option>
          <option value="4h">4 hours</option>
        </select>
        <button
          onClick={updateTimeout}
          className="bg-yellow-500 hover:bg-yellow-600 text-black py-2 px-4 rounded-lg"
        >
          Update Timeout
        </button>

        <div className="mt-8">
          <h3 className="text-yellow-400 mb-3">Recent Admin Logins</h3>
          <ul className="text-sm text-gray-400 space-y-1">
            {logs.map((log, i) => (
              <li key={i}>
                {log.action} — {new Date(log.createdAt).toLocaleString()}
              </li>
            ))}
          </ul>
        </div>

        <button
          onClick={logoutAll}
          className="mt-6 bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg"
        >
          Logout All Active Sessions
        </button>
      </section>
    </div>
  );
};

export default AdminSettings;
