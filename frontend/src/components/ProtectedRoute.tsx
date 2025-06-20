import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
    const { isLoggedIn, isLoading } = useAuth();


    if (isLoading) {
        return <div className="text-white">Carregando...</div>;
    }


    if (!isLoggedIn) {
        return <Navigate to="/login" replace />;
    }


    return <>{children}</>;
}