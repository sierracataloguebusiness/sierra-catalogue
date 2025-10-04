import { useEffect } from "react";
import { useAuth } from "../../context/AuthContext.jsx";

const Dashboard = () => {
  const { user, logout, login } = useAuth();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      login(token);
    }
  }, []);

  return (
    <>
      <h1>Welcome, {user?.firstName}</h1>
      <button onClick={logout}>Logout</button>
      {user?.role === "customer" && <h1>{user?.role}</h1>}
    </>
  );
};

export default Dashboard;
