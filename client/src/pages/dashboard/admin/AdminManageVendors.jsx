import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../../../context/AuthContext.jsx";
import { toast } from "react-toastify";

const AdminManageVendors = () => {
  const { token } = useAuth();
  const [vendors, setVendors] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const fetchVendors = async () => {
    try {
      const res = await axios.get(
        `https://sierra-catalogue.onrender.com/api/admin/vendors?search=${search}&status=${statusFilter}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      setVendors(res.data);
    } catch (err) {
      toast.error("Failed to load vendors");
    }
  };

  useEffect(() => {
    if (token) fetchVendors();
  }, [token, search, statusFilter]);

  const toggleStatus = async (id) => {
    try {
      await axios.patch(
        `https://sierra-catalogue.onrender.com/api/admin/vendors/${id}/toggle`,
        {},
        { headers: { Authorization: `Bearer ${token}` } },
      );
      toast.success("Vendor status updated");
      fetchVendors();
    } catch (err) {
      toast.error("Failed to toggle vendor status");
    }
  };

  const changeRole = async (id, newRole) => {
    try {
      await axios.patch(
        `https://sierra-catalogue.onrender.com/api/admin/vendors/${id}/role`,
        { newRole },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      toast.success("Vendor role updated");
      fetchVendors();
    } catch (err) {
      toast.error("Failed to change role");
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-primary-gold mb-6">
        Manage Vendors
      </h1>

      <div className="flex flex-wrap gap-4 mb-6">
        <input
          type="text"
          placeholder="Search vendor..."
          className="bg-black border border-gray-700 text-white px-4 py-2 rounded-lg"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          className="bg-black border border-gray-700 text-white px-4 py-2 rounded-lg"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="">All</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-800 text-white">
          <thead className="bg-gray-900 text-yellow-400">
            <tr>
              <th className="px-4 py-2 text-left">Name</th>
              <th className="px-4 py-2 text-left">Email</th>
              <th className="px-4 py-2 text-left">Tel</th>
              <th className="px-4 py-2 text-left">Status</th>
              <th className="px-4 py-2 text-left">Role</th>
              <th className="px-4 py-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {vendors.map((vendor) => (
              <tr key={vendor._id} className="border-t border-gray-800">
                <td className="px-4 py-2">
                  {vendor.firstName} {vendor.otherNames} {vendor.lastName}
                </td>
                <td className="px-4 py-2">{vendor.email}</td>
                <td className="px-4 py-2">{vendor.tel}</td>
                <td className="px-4 py-2">
                  {vendor.isActive ? "Active" : "Inactive"}
                </td>
                <td className="px-4 py-2 capitalize">{vendor.role}</td>
                <td className="px-4 py-2 flex gap-2">
                  <button
                    onClick={() => toggleStatus(vendor._id)}
                    className="px-3 py-1 bg-yellow-500 text-black rounded-md hover:bg-yellow-400"
                  >
                    {vendor.isActive ? "Deactivate" : "Activate"}
                  </button>
                  <select
                    onChange={(e) => changeRole(vendor._id, e.target.value)}
                    defaultValue=""
                    className="bg-gray-800 text-white px-2 py-1 rounded-md"
                  >
                    <option value="" disabled>
                      Change Role
                    </option>
                    <option value="customer">Customer</option>
                    <option value="vendor">Vendor</option>
                    <option value="admin">Admin</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminManageVendors;
