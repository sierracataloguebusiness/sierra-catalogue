import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useAuth } from "../../../context/AuthContext.jsx";
import { FaUserAlt, FaTrash, FaLock, FaUnlock, FaSearch } from "react-icons/fa";
import { IoChevronBack, IoChevronForward } from "react-icons/io5";

const AdminManageUsers = () => {
  const { token } = useAuth();
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [filterRole, setFilterRole] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 10;

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
    } catch {
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (id, role) => {
    try {
      await axios.patch(
        `https://sierra-catalogue.onrender.com/api/admin/users/${id}/role`,
        { role },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      toast.success("User role updated");
      fetchUsers();
    } catch {
      toast.error("Role update failed");
    }
  };

  const handleDeactivate = async (id) => {
    try {
      await axios.patch(
        `https://sierra-catalogue.onrender.com/api/admin/users/${id}/deactivate`,
        {},
        { headers: { Authorization: `Bearer ${token}` } },
      );
      toast.info("User deactivated");
      fetchUsers();
    } catch {
      toast.error("Action failed");
    }
  };

  const handleActivate = async (id) => {
    try {
      await axios.patch(
        `https://sierra-catalogue.onrender.com/api/admin/users/${id}/activate`,
        {},
        { headers: { Authorization: `Bearer ${token}` } },
      );
      toast.success("User activated");
      fetchUsers();
    } catch {
      toast.error("Action failed");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      await axios.delete(
        `https://sierra-catalogue.onrender.com/api/admin/users/${id}`,
        { headers: { Authorization: `Bearer ${token}` } },
      );
      toast.success("User deleted");
      fetchUsers();
    } catch {
      toast.error("Delete failed");
    }
  };

  useEffect(() => {
    if (token) fetchUsers();
  }, [token]);

  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.firstName?.toLowerCase().includes(search.toLowerCase()) ||
      u.lastName?.toLowerCase().includes(search.toLowerCase()) ||
      u.email?.toLowerCase().includes(search.toLowerCase()) ||
      u.tel?.includes(search);

    const matchesRole = filterRole === "all" || u.role === filterRole;
    const matchesStatus =
      filterStatus === "all" ||
      (filterStatus === "active" && u.isActive) ||
      (filterStatus === "inactive" && !u.isActive);

    return matchesSearch && matchesRole && matchesStatus;
  });

  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * usersPerPage,
    currentPage * usersPerPage,
  );

  return (
    <div className="p-6 bg-black min-h-screen text-white">
      <h1 className="text-2xl font-bold text-yellow-500 mb-6">Manage Users</h1>

      {/* Search & Filter Bar */}
      <div className="flex flex-wrap gap-3 mb-6 items-center">
        <div className="flex items-center bg-[#111] border border-gray-700 rounded-xl px-3 py-2">
          <FaSearch className="text-gray-400 mr-2" />
          <input
            type="text"
            placeholder="Search name, email, or phone..."
            className="bg-transparent outline-none text-gray-300 w-48 sm:w-64"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>

        <select
          value={filterRole}
          onChange={(e) => {
            setFilterRole(e.target.value);
            setCurrentPage(1);
          }}
          className="bg-[#111] border border-gray-700 rounded-xl px-3 py-2 text-gray-300"
        >
          <option value="all">All Roles</option>
          <option value="admin">Admin</option>
          <option value="vendor">Vendor</option>
          <option value="customer">Customer</option>
        </select>

        <select
          value={filterStatus}
          onChange={(e) => {
            setFilterStatus(e.target.value);
            setCurrentPage(1);
          }}
          className="bg-[#111] border border-gray-700 rounded-xl px-3 py-2 text-gray-300"
        >
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>

      {/* Table */}
      {loading ? (
        <div className="text-center py-20 text-yellow-400 animate-pulse">
          Loading users...
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-800 rounded-2xl overflow-hidden">
            <thead className="bg-[#111] text-yellow-400">
              <tr>
                <th className="p-3 text-left">Name</th>
                <th className="p-3 text-left">Email</th>
                <th className="p-3 text-left">Tel</th>
                <th className="p-3 text-left">Role</th>
                <th className="p-3 text-left">Status</th>
                <th className="p-3 text-left">Action</th>
              </tr>
            </thead>
            <tbody>
              {paginatedUsers.map((u) => (
                <tr
                  key={u._id}
                  className="border-t border-gray-800 hover:bg-[#1a1a1a] transition"
                >
                  <td className="p-3 flex items-center gap-2">
                    <FaUserAlt className="text-yellow-500" />
                    {u.firstName} {u.otherNames} {u.lastName}
                  </td>
                  <td className="p-3">{u.email}</td>
                  <td className="p-3">{u.tel}</td>
                  <td className="p-3 capitalize">
                    <select
                      value={u.role}
                      onChange={(e) => handleRoleChange(u._id, e.target.value)}
                      className="bg-black border border-gray-700 rounded-lg px-2 py-1 text-yellow-400"
                    >
                      <option value="customer">Customer</option>
                      <option value="vendor">Vendor</option>
                      <option value="admin">Admin</option>
                    </select>
                  </td>
                  <td className="p-3">
                    <span
                      className={`px-2 py-1 text-sm rounded-lg ${
                        u.isActive
                          ? "bg-green-600/20 text-green-400"
                          : "bg-red-600/20 text-red-400"
                      }`}
                    >
                      {u.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="p-3 flex gap-3">
                    {u.isActive ? (
                      <button
                        onClick={() => handleDeactivate(u._id)}
                        className="text-red-400 hover:text-red-300"
                        title="Deactivate"
                      >
                        <FaLock />
                      </button>
                    ) : (
                      <button
                        onClick={() => handleActivate(u._id)}
                        className="text-green-400 hover:text-green-300"
                        title="Activate"
                      >
                        <FaUnlock />
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(u._id)}
                      className="text-gray-400 hover:text-yellow-400"
                      title="Delete User"
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredUsers.length === 0 && (
            <p className="text-center text-gray-500 mt-6">
              No users match your criteria.
            </p>
          )}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 mt-6">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((prev) => prev - 1)}
            className="p-2 rounded-full bg-[#111] text-yellow-400 disabled:opacity-50"
          >
            <IoChevronBack />
          </button>
          <span className="text-gray-400">
            Page {currentPage} of {totalPages}
          </span>
          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((prev) => prev + 1)}
            className="p-2 rounded-full bg-[#111] text-yellow-400 disabled:opacity-50"
          >
            <IoChevronForward />
          </button>
        </div>
      )}
    </div>
  );
};

export default AdminManageUsers;
