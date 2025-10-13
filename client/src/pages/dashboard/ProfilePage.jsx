import React from "react";
import { useAuth } from "../../context/AuthContext.jsx";

const ProfilePage = () => {
  const { user } = useAuth(); // Pulls logged-in user data

  if (!user) {
    return <p className="p-4 text-gray-600">Loading profile...</p>;
  }

  return (
    <div className="p-6 bg-gray-700 shadow-md rounded-xl max-w-lg">
      <h1 className="text-2xl font-bold mb-6 text-gold">My Profile</h1>

      <div className="space-y-3">
        <p>
          <strong className="text-primary-gold">Name:</strong>{" "}
          {`${user.firstName || ""} ${user.otherNames || ""} ${user.lastName || ""}`.trim() ||
            "N/A"}
        </p>

        <p>
          <strong className="text-primary-gold">Email:</strong> {user.email}
        </p>

        <p>
          <strong className="text-primary-gold">Phone:</strong>{" "}
          {user.tel || "N/A"}
        </p>

        <p>
          <strong className="text-primary-gold">Address:</strong>{" "}
          {user.address || "N/A"}
        </p>

        <p>
          <strong className="text-primary-gold">Account Type:</strong>{" "}
          {user.role || "Customer"}
        </p>
      </div>
    </div>
  );
};

export default ProfilePage;
