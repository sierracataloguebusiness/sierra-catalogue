import React from "react";
import { useAuth } from "../../context/AuthContext.jsx";

const ProfilePage = () => {
  const { user } = useAuth(); // Pulls logged-in user data

  if (!user) {
    return <p className="p-4 text-gray-600">Loading profile...</p>;
  }

  return (
    <div className="p-6 bg-white shadow-md rounded-xl max-w-lg mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-gold">My Profile</h1>

      <div className="space-y-3">
        <p>
          <strong>Name:</strong> ${user.firstName || ""} $
          {user.otherNames || ""} ${user.lastName || ""}{" "}
        </p>

        <p>
          <strong>Email:</strong> {user.email}
        </p>

        <p>
          <strong>Phone:</strong> {user.tel || "N/A"}
        </p>

        <p>
          <strong>Address:</strong> {user.address || "N/A"}
        </p>

        <p>
          <strong>Account Type:</strong> {user.role || "Customer"}
        </p>
      </div>
    </div>
  );
};

export default ProfilePage;
