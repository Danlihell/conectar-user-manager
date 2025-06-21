import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import Button from '../components/Button';
import Input from '../components/Input';
import { useAuth } from '../context/AuthContext';
import { jwtDecode } from 'jwt-decode';
import logoConectar from '../assets/conectarhortifruti_logo.png';


export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        try {

            const response = await axios.post(`${import.meta.env.VITE_API_URL}/auth/login`, {
                email,
                password,
            });
            const token = response.data.access_token;
            const decoded: { role: 'admin' | 'user' } = jwtDecode(token);
            login(token);
            if (decoded.role === 'admin') {
                navigate('/dashboard');
            } else {
                navigate('/profile');
            }
        } catch (error) {
            console.error('Erro no login:', error);
            alert('Email ou senha inválidos. Tente novamente.');
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-slate-900 flex flex-col justify-center items-center p-4 transition-colors duration-300">
            <div className="absolute top-4 right-4">
            </div>
            <div className="bg-white dark:bg-slate-800 p-8 rounded-xl shadow-lg w-full max-w-md transition-colors duration-300">
                <img src={logoConectar} alt="Logo Conectar Hortifruti" className="w-48 mx-auto mb-6" />
                <h1 className="text-2xl font-bold text-center text-gray-800 dark:text-gray-200 mb-6">
                    Acesse sua conta
                </h1>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <Input
                        label="Email"
                        type="email"
                        placeholder="seuemail@exemplo.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <Input
                        label="Senha"
                        type="password"
                        placeholder="********"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <Button
                        type="submit"
                        className="w-full bg-yellow-400 text-gray-900 font-bold py-2 px-4 rounded-md hover:bg-yellow-500 transition-colors"
                    >
                        Entrar
                    </Button>
                </form>
                <div className="my-4 flex items-center before:flex-1 before:border-t before:border-gray-300 dark:before:border-gray-600 after:flex-1 after:border-t after:border-gray-300 dark:after:border-gray-600">
                    <p className="mx-4 text-center text-xs text-gray-500 dark:text-gray-400">OU</p>
                </div>
                { }
                <a
                    href={`${import.meta.env.VITE_API_URL}/auth/google`}
                    className="w-full flex items-center justify-center gap-2 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold py-2 px-4 rounded-md hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 0 24 24" width="20px" fill="currentColor"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" /><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" /><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.82-2.22H5.84z" fill="#FBBC05" /><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" /><path d="M1 1h22v22H1z" fill="none" /></svg>
                    Entrar com Google
                </a>
            </div>
            <p className="text-center text-sm text-gray-600 dark:text-gray-400 mt-6">
                Não tem uma conta?{' '}
                <Link to="/register" className="font-semibold text-green-600 dark:text-green-400 hover:underline">
                    Cadastre-se
                </Link>
            </p>
        </div>
    );
}