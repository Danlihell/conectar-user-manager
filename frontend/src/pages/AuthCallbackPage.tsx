import { useEffect, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function AuthCallbackPage() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { login, isLoggedIn, user } = useAuth();
    const hasProcessed = useRef(false);


    useEffect(() => {
        const token = searchParams.get('token');
        if (token && !hasProcessed.current) {
            hasProcessed.current = true;
            login(token);
        }
    }, [searchParams, login]);


    useEffect(() => {
        if (isLoggedIn && user && hasProcessed.current) {
            if (user.role === 'admin') {
                navigate('/dashboard', { replace: true });
            } else {
                navigate('/profile', { replace: true });
            }
        }
    }, [isLoggedIn, user, navigate]);

    return (
        <div className="w-full h-screen flex justify-center items-center bg-slate-900">
            <h1 className="text-white text-2xl">Autenticando...</h1>
        </div>
    );
}