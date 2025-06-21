import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import Button from '../components/Button';
import Input from '../components/Input';
import logoConectar from '../assets/conectarhortifruti_logo.png';


export default function RegisterPage() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        if (password !== confirmPassword) {
            alert('As senhas não conferem. Por favor, verifique.');
            return;
        }
        try {
            // MUDANÇA AQUI:
            await axios.post(`${import.meta.env.VITE_API_URL}/users`, {
                name,
                email,
                password,
            });
            alert('Cadastro realizado com sucesso! Você será redirecionado para o login.');
            navigate('/login');
        } catch (error: any) {
            console.error('Erro no cadastro:', error);
            const message = error.response?.data?.message || 'Não foi possível realizar o cadastro.';
            alert(`Erro: ${message}`);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-slate-900 flex flex-col justify-center items-center p-4 transition-colors duration-300">
            <div className="absolute top-4 right-4">
            </div>
            <div className="bg-white dark:bg-slate-800 p-8 rounded-xl shadow-lg w-full max-w-md transition-colors duration-300">
                <img src={logoConectar} alt="Logo Conectar Hortifruti" className="w-48 mx-auto mb-6" />
                <h1 className="text-2xl font-bold text-center text-gray-800 dark:text-gray-200 mb-6">Criar Conta</h1>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <Input
                        label="Nome Completo"
                        type="text"
                        placeholder="Seu nome"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
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
                        placeholder="Mínimo 6 caracteres"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        minLength={6}
                        required
                    />
                    <Input
                        label="Confirmar Senha"
                        type="password"
                        placeholder="Repita a senha"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        minLength={6}
                        required
                    />
                    <Button
                        type="submit"
                        className="w-full bg-yellow-400 text-gray-900 font-bold py-2 px-4 rounded-md hover:bg-yellow-500 transition-colors"
                    >
                        Cadastrar
                    </Button>
                </form>
                <p className="mt-4 text-center text-sm text-gray-600 dark:text-gray-400">
                    Já tem uma conta?{' '}
                    <Link to="/login" className="font-semibold text-green-600 dark:text-green-400 hover:underline">
                        Entrar
                    </Link>
                </p>
            </div>
        </div>
    );
}