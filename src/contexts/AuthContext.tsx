"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { setCookie, deleteCookie, getCookie } from "cookies-next";
import { api } from "@/lib/api";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export interface User {
  _id?: string;
  name?: string;
  email?: string;
  role?: string;
  status?: string;
  image?: string;
  phoneNumber?: string;
  address?: string;
  verified?: boolean;
  [key: string]: any;
}

interface AuthContextType {
  token: any;
  setToken: (token: string | null) => void;
  user: any;
  setUser: (user: any) => void;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  updateUser: (updatedUser: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({
  children,
  initialToken = null,
  initialUser = null,
}: {
  children: ReactNode;
  initialToken?: string | null;
  initialUser?: any;
}) {
  const [token, setTokenState] = useState<string | null>(initialToken);
  const [user, setUserState] = useState<any>(initialUser);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const isValidToken = (t: any) => typeof t === "string" && t.trim() !== "" && t !== "undefined" && t !== "null";

  useEffect(() => {
    const initAuth = async () => {
      try {
        const rawToken =
          (getCookie("accessToken") as string) ||
          (getCookie("token") as string) ||
          localStorage.getItem("token");
        const storedUser = localStorage.getItem("user");

        const storedToken = isValidToken(rawToken) ? rawToken : null;

        if (storedToken) {
          setTokenState(storedToken);
          if (storedUser && storedUser !== "undefined" && storedUser !== "null") {
            try {
              setUserState(JSON.parse(storedUser));
            } catch {
              setUserState(storedUser);
            }
          }
          setIsLoading(false);

          // Background sync profile (non-blocking, non-destructive on error)
          try {
            const res = await api.get("/user/me");
            const profileData = res?.data?.data || res?.data || res?.user;
            if (profileData && typeof profileData === "object") {
              setUserState(profileData);
              const userStr = JSON.stringify(profileData);
              localStorage.setItem("user", userStr);
              setCookie("user", userStr, { path: "/", maxAge: 30 * 24 * 60 * 60 });
            }
          } catch (error) {
            // Keep existing valid token & stored user session on background sync failure
            console.warn("Background user profile sync warning:", error);
          }
        } else {
          setTokenState(null);
          setUserState(null);
          deleteCookie("accessToken", { path: "/" });
          deleteCookie("token", { path: "/" });
          deleteCookie("user", { path: "/" });
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          setIsLoading(false);
        }
      } catch (err) {
        console.error("Auth init error:", err);
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  const setToken = (newToken: string | null) => {
    if (newToken) {
      setCookie("accessToken", newToken, { path: "/", maxAge: 30 * 24 * 60 * 60 });
      setCookie("token", newToken, { path: "/", maxAge: 30 * 24 * 60 * 60 });
      localStorage.setItem("token", newToken);
    } else {
      deleteCookie("accessToken", { path: "/" });
      deleteCookie("token", { path: "/" });
      localStorage.removeItem("token");
    }
    setTokenState(newToken);
  };

  const setUser = (newUser: any) => {
    if (newUser) {
      const userStr = typeof newUser === "string" ? newUser : JSON.stringify(newUser);
      setCookie("user", userStr, { path: "/", maxAge: 30 * 24 * 60 * 60 });
      localStorage.setItem("user", userStr);
      try {
        setUserState(typeof newUser === "string" ? JSON.parse(newUser) : newUser);
      } catch {
        setUserState(newUser);
      }
    } else {
      deleteCookie("user", { path: "/" });
      localStorage.removeItem("user");
      setUserState(null);
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const res = await api.post("/auth/admin-login", { email, password });
      
      const accessToken = res?.data?.accessToken || res?.accessToken || res?.data?.token;
      const userData = res?.data?.user || res?.data || res?.user;

      if (accessToken) {
        setToken(accessToken);
        if (userData) {
          setUser(userData);
        }

        toast.success(res?.message || "Login successful! Welcome back.");
        if (typeof window !== "undefined") {
          window.location.replace("/");
        }
        return true;
      } else {
        toast.error("No access token returned from server.");
        return false;
      }
    } catch (error: any) {
      toast.error(error?.message || "Login failed. Please check your credentials.");
      return false;
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    toast.success("Logged out successfully");
    if (typeof window !== "undefined") {
      window.location.replace("/login");
    }
  };

  const updateUser = (updatedUser: Partial<User>) => {
    if (user && typeof user === "object") {
      const newUser = { ...user, ...updatedUser };
      setUser(newUser);
    }
  };

  return (
    <AuthContext.Provider value={{ token, setToken, user, setUser, isLoading, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

export const useAuthContext = useAuth;
