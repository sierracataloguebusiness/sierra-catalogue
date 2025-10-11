import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../../../context/AuthContext.jsx";
import { toast } from "react-toastify";
import { FaTrash, FaEdit, FaCheckCircle, FaTimesCircle } from "react-icons/fa";

const AdminManageUsers = () => {
  const { token } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  /* Fetch users */
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        "https://sierra-catalogue.onrender.com/api/admin/users",
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      setUsers(res.data);
    } catch (err) {
      toast.error("Failed to load users");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchUsers();
  }, [token]);

  /* Update role or status */
  const handleUpdate = async (id, updates) => {
    try {
      const res = await axios.put(
        `https://sierra-catalogue.onrender.com/api/admin/users/${id}`,
        updates,
        { headers: { Authorization: `Bearer ${token}` } },
      );
      toast.success("User updated");
      fetchUsers();
    } catch (err) {
      toast.error("Failed to update user");
    }
  };

  /* Delete user */
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      await axios.delete(
        `https://sierra-catalogue.onrender.com/api/admin/users/${id}`,
        { headers: { Authorization: `Bearer ${token}` } },
      );
      toast.success("User deleted");
      fetchUsers();
    } catch (err) {
      toast.error("Failed to delete user");
    }
  };

  return (
    <div className="text-white">
      <h1 className="text-2xl font-bold text-primary-gold mb-6">
        Manage Users
      </h1>

      {loading ? (
        <p className="text-gray-400">Loading users...</p>
      ) : (
        <div className="overflow-x-auto bg-[#0d0d0d] border border-gray-800 rounded-2xl shadow-lg">
          <table className="min-w-full border-collapse">
            <thead className="bg-black text-yellow-400 text-sm">
              <tr>
                <th className="p-4 text-left">Name</th>
                <th className="p-4 text-left">Email</th>
                <th className="p-4 text-left">Tel</th>
                <th className="p-4 text-left">Role</th>
                <th className="p-4 text-left">Status</th>
                <th className="p-4 text-left">Joined</th>
                <th className="p-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.length > 0 ? (
                users.map((u) => (
                  <tr
                    key={u._id}
                    className="border-t border-gray-800 hover:bg-gray-900/60 transition"
                  >
                    <td className="p-4">
                      {[u.firstName, u.lastName, u.otherNames]
                        .filter(Boolean)
                        .join(" ")}
                    </td>
                    <td className="p-4">{u.email}</td>
                    <td className="p-4">{u.tel || "N/A"}</td>
                    <td className="p-4 capitalize">{u.role}</td>
                    <td className="p-4">
                      {u.isActive ? (
                        <FaCheckCircle className="text-green-400 inline" />
                      ) : (
                        <FaTimesCircle className="text-red-400 inline" />
                      )}
                    </td>
                    <td className="p-4 text-gray-400">
                      {new Date(u.createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-4 flex gap-3 justify-center">
                      <button
                        onClick={() =>
                          handleUpdate(u._id, {
                            role:
                              u.role === "customer"
                                ? "vendor"
                                : u.role === "vendor"
                                  ? "admin"
                                  : "customer",
                          })
                        }
                        className="text-yellow-400 hover:text-yellow-300"
                        title="Change Role"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() =>
                          handleUpdate(u._id, { isActive: !u.isActive })
                        }
                        className={`${
                          u.isActive
                            ? "text-green-400 hover:text-green-300"
                            : "text-gray-500 hover:text-gray-400"
                        }`}
                        title="Toggle Active"
                      >
                        {u.isActive ? <FaCheckCircle /> : <FaTimesCircle />}
                      </button>
                      <button
                        onClick={() => handleDelete(u._id)}
                        className="text-red-500 hover:text-red-400"
                        title="Delete"
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={7}
                    className="p-6 text-center text-gray-400 italic"
                  >
                    No users found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminManageUsers;
