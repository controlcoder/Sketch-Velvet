import { createContext, useContext } from "react";
import { useQuery } from "@tanstack/react-query";
import { authApi } from "../api/auth.api";

interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  checkAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const {
    data: authResponse,
    isError,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["auth", "me"],
    queryFn: authApi.me,
    retry: false,
  });

  const user = isError ? null : (authResponse?.data?.user ?? null);

  async function checkAuth() {
    await refetch();
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading: isLoading,
        checkAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
}
