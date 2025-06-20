import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import Input from '../components/Input';
import Button from '../components/Button';
import { useNavigate, Link } from 'react-router-dom';


interface ProfileData {
    id: string;
    name: string;
    email: string;
    role: 'admin' | 'user';
    createdAt: string;
    provider: 'local' | 'google';
}

export default function ProfilePage() {
    const { user, token, logout } = useAuth();
    const navigate = useNavigate();
    const [profileData, setProfileData] = useState<ProfileData | null>(null);
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    useEffect(() => {
        const fetchProfile = async () => {
            if (token) {
                try {
                    const response = await axios.get('http://localhost:3000/users/me', {
                        headers: { Authorization: `Bearer ${token}` },
                    });
                    setProfileData(response.data);
                    setName(response.data.name);
                } catch (error) {
                    console.error('Falha ao buscar dados do perfil', error);
                }
            }
        };
        fetchProfile();
    }, [token]);

    const handleUpdateProfile = async (event: React.FormEvent) => {
        event.preventDefault();
        if (password && password !== confirmPassword) {
            alert('As senhas não conferem. Por favor, verifique.');
            return;
        }
        try {
            const updateData: { name?: string; password?: string } = {};
            if (name && name !== profileData?.name) updateData.name = name;
            if (password) updateData.password = password;
            if (Object.keys(updateData).length === 0) {
                alert('Nenhuma alteração para salvar.');
                return;
            }
            const response = await axios.patch('http://localhost:3000/users/me', updateData, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setProfileData(response.data);
            setPassword('');
            setConfirmPassword('');
            alert('Perfil atualizado com sucesso!');
        } catch (error) {
            console.error('Falha ao atualizar perfil', error);
            alert('Não foi possível atualizar o perfil.');
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    if (!profileData) {
        return <div className="min-h-screen bg-gray-100 dark:bg-slate-900 flex justify-center items-center text-white">Carregando...</div>;
    }

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-slate-900 flex flex-col items-center p-4 transition-colors duration-300">
            <nav className="absolute top-4 right-4 flex gap-4">
                { }
                {user?.role === 'admin' && <Link to="/dashboard" className="font-semibold text-green-600 dark:text-green-400 hover:underline">Admin</Link>}
            </nav>

            <div className="bg-white dark:bg-slate-800 p-8 rounded-xl shadow-lg w-full max-w-2xl mt-20">
                <h1 className="text-3xl font-bold text-center text-gray-800 dark:text-gray-200 mb-6">Meu Perfil</h1>
                <div className="bg-slate-100 dark:bg-slate-700 p-6 rounded-lg mb-8">
                    <p className="mb-2 text-gray-700 dark:text-gray-300"><span className="font-bold">Nome:</span> {profileData.name}</p>
                    <p className="mb-2 text-gray-700 dark:text-gray-300"><span className="font-bold">Email:</span> {profileData.email}</p>
                    <p className="text-gray-700 dark:text-gray-300"><span className="font-bold">Membro desde:</span> {new Date(profileData.createdAt).toLocaleDateString('pt-BR')}</p>
                </div>

                { }
                {profileData.provider === 'local' ? (
                    <>
                        <h2 className="text-2xl font-bold text-center text-gray-800 dark:text-gray-200 mt-8 mb-4">Atualizar Informações</h2>
                        <form onSubmit={handleUpdateProfile} className="space-y-4">
                            <Input
                                label="Nome"
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                            <Input
                                label="Nova Senha (deixe em branco para não alterar)"
                                type="password"
                                placeholder="Mínimo 6 caracteres"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            <Input
                                label="Confirmar Nova Senha"
                                type="password"
                                placeholder="Repita a nova senha"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                            />
                            <Button
                                type="submit"
                                className="w-full bg-yellow-400 text-gray-900 font-bold py-2 px-4 rounded-md hover:bg-yellow-500 transition-colors"
                            >
                                Salvar Alterações
                            </Button>
                        </form>
                    </>
                ) : (
                    <div className="text-center text-gray-600 dark:text-gray-400 mt-8 p-4 bg-slate-100 dark:bg-slate-700 rounded-lg">
                        <p>Sua conta está conectada com o Google. A alteração de dados é gerenciada pela sua conta do Google.</p>
                    </div>
                )}

                <div className="mt-8 border-t border-gray-200 dark:border-slate-700 pt-6">
                    <Button
                        onClick={handleLogout}
                        className="w-full bg-slate-600 dark:bg-slate-700 text-white font-bold py-2 px-4 rounded-md hover:bg-slate-700 dark:hover:bg-slate-600 transition-colors"
                    >
                        Sair (Logout)
                    </Button>
                </div>
            </div>
        </div>
    );
}