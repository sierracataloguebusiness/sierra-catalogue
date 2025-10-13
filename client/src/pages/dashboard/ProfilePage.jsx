import React from "react";
import { useAuth } from "../../context/AuthContext.jsx";

const ProfilePage = () => {
  const { currentUser } = useAuth(); // or from Redux
  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">My Profile</h1>
      <p>
        <strong>Name:</strong> {currentUser?.firstName}{" "}
        {currentUser?.otherNames} {currentUser?.lastName}
      </p>
      <p>
        <strong>Email:</strong> {currentUser?.email}
      </p>
      <p>
        <strong>Role:</strong> {currentUser?.role}
      </p>{" "}
      <p>
        <strong>Role:</strong> {currentUser?.tel}
      </p>
      <p>
        <strong>Role:</strong> {currentUser?.address}
      </p>
    </div>
  );
};
export default ProfilePage;
