import { Navigate, Outlet } from "react-router-dom";
import { CircularProgress, Box } from "@mui/material";

import { useAuth } from "../../context/AuthContext";

export default function PublicRoute() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <Box
        sx={{
          height: "100vh",
          display: "grid",
          placeItems: "center",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return user ? <Navigate to="/dashboard" replace /> : <Outlet />;
}
