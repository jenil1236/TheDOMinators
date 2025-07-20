// src/context/AuthContext.jsx
import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [isAdmin, setIsAdmin] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetch("/api/auth/me", {
            credentials: "include",
        })
            .then((res) => {
                if (!res.ok) throw new Error("Not logged in");
                return res.json();
            })
            .then((data) => {
                console.log("auth", data);
                setCurrentUser(data.user);
                setIsAdmin(data.isAdmin);
            })
            .catch(() => {
                setCurrentUser(null);
                setIsAdmin(false);
            })
            .finally(() => setIsLoading(false));
    }, []);

    const logout = async () => {
        try {
            await fetch("/api/logout", {
                method: "POST",
                credentials: "include",
            });
            setCurrentUser(null);
            setIsAdmin(false);
        } catch (error) {
            console.error("Logout failed:", error);
        }
    };

    // ✅ Refetch user from backend session
    const refreshAuth = async () => {
        setIsLoading(true);
        try {
            const res = await fetch("/api/auth/me", {
                credentials: "include",
            });
            if (!res.ok) throw new Error("Not authenticated");
            const data = await res.json();
            setCurrentUser(data.user);
            setIsAdmin(data.isAdmin);
            // console.log(data.isAdmin)
        } catch {
            setCurrentUser(null);
            setIsAdmin(false);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <AuthContext.Provider value={{ currentUser, isAdmin, isLoading, logout,refreshAuth, setIsAdmin }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
