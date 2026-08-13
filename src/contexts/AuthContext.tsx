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

          // Background sync profile
          try {
            const res = await api.get("/user/me");
            if (res?.data) {
              setUserState(res.data);
              localStorage.setItem("user", JSON.stringify(res.data));
            }
          } catch (error) {
            console.error("Failed to fetch user profile:", error);
            setTokenState(null);
            setUserState(null);
            deleteCookie("accessToken");
            deleteCookie("token");
            deleteCookie("user");
            localStorage.removeItem("token");
            localStorage.removeItem("user");
          }
        } else {
          setTokenState(null);
          setUserState(null);
          deleteCookie("accessToken");
          deleteCookie("token");
          deleteCookie("user");
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          setIsLoading(false);
        }
      } catch (err) {
        console.error("Auth init error:", err);
        setTokenState(null);
        setUserState(null);
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  const setToken = (newToken: string | null) => {
    if (newToken) {
      setCookie("accessToken", newToken);
      setCookie("token", newToken);
      localStorage.setItem("token", newToken);
    } else {
      deleteCookie("accessToken");
      deleteCookie("token");
      localStorage.removeItem("token");
    }
    setTokenState(newToken);
  };

  const setUser = (newUser: any) => {
    if (newUser) {
      const userStr = typeof newUser === "string" ? newUser : JSON.stringify(newUser);
      setCookie("user", userStr);
      localStorage.setItem("user", userStr);
      try {
        setUserState(typeof newUser === "string" ? JSON.parse(newUser) : newUser);
      } catch {
        setUserState(newUser);
      }
    } else {
      deleteCookie("user");
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
