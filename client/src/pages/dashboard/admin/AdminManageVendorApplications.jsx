import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../../../context/AuthContext.jsx";
import { toast } from "react-toastify";

const AdminManageVendorApplications = () => {
  const { token } = useAuth();
  const [applications, setApplications] = useState([]);
  const [statusFilter, setStatusFilter] = useState("pending");

  const fetchApplications = async () => {
    try {
      const res = await axios.get(
        `https://sierra-catalogue.onrender.com/api/vendorApplication?status=${statusFilter}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      setApplications(res.data);
    } catch (err) {
      console.error("Error fetching applications:", err);
      toast.error("Failed to fetch applications");
    }
  };

  useEffect(() => {
    if (token) fetchApplications();
  }, [token, statusFilter]);

  const approveVendor = async (id) => {
    try {
      await axios.patch(
        `https://sierra-catalogue.onrender.com/api/vendorApplication/${id}/approve`,
        {},
        { headers: { Authorization: `Bearer ${token}` } },
      );
      toast.success("Vendor approved successfully");
      fetchApplications();
    } catch (err) {
      console.error("Error approving vendor:", err);
      toast.error("Failed to approve vendor");
    }
  };

  const rejectVendor = async (id) => {
    try {
      await axios.patch(
        `https://sierra-catalogue.onrender.com/api/vendorApplication/${id}/reject`,
        {},
        { headers: { Authorization: `Bearer ${token}` } },
      );
      toast.success("Vendor rejected");
      fetchApplications();
    } catch (err) {
      console.error("Error rejecting vendor:", err);
      toast.error("Failed to reject vendor");
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-primary-gold mb-6">
        Vendor Applications
      </h1>

      <div className="mb-4">
        <select
          className="bg-black border border-gray-700 text-white px-4 py-2 rounded-lg"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-800 text-white">
          <thead className="bg-gray-900 text-yellow-400">
            <tr>
              <th className="px-4 py-2 text-left">Name</th>
              <th className="px-4 py-2 text-left">Email</th>
              <th className="px-4 py-2 text-left">Shop</th>
              <th className="px-4 py-2 text-left">Status</th>
              <th className="px-4 py-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {applications.map((app) => (
              <tr key={app._id} className="border-t border-gray-800">
                <td className="px-4 py-2">{app.name}</td>
                <td className="px-4 py-2">{app.email}</td>
                <td className="px-4 py-2">{app.shopName}</td>
                <td className="px-4 py-2 capitalize">{app.status}</td>
                <td className="px-4 py-2 flex gap-2">
                  {app.status === "pending" && (
                    <>
                      <button
                        onClick={() => approveVendor(app._id)}
                        className="px-3 py-1 bg-green-500 text-black rounded-md hover:bg-green-400"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => rejectVendor(app._id)}
                        className="px-3 py-1 bg-red-500 text-black rounded-md hover:bg-red-400"
                      >
                        Reject
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminManageVendorApplications;
