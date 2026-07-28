import { Routes, Route } from "react-router-dom";
import Landing from "../pages/Landing/Landing";
import Login from "../pages/Login/Login";
import Signup from "../pages/Signup/Signup";
import Dashboard from "../pages/Dashboard/Dashboard";
import Board from "../pages/Board/Board";
import { CssBaseline } from "@mui/material";
import ProtectedRoute from "../components/Routes/ProtectedRoute";
import PublicRoute from "../components/Routes/PublicRoute";

export default function AppRouter() {
  return (
    <>
      <CssBaseline />
      <Routes>
        <Route path="/" element={<Landing />} />

        <Route element={<PublicRoute />}>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Route>

        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/board/:id" element={<Board />} />
        </Route>

        <Route path="*" element={<h1>404 Not Found</h1>} />
      </Routes>
    </>
  );
}
