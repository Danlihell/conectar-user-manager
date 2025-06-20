import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import Button from '../components/Button';
import { useNavigate } from 'react-router-dom';

interface UserFromApi {
    id: string;
    name: string;
    email: string;
    role: 'admin' | 'user';
    createdAt: string;
    lastLoginAt: string | null;
}

export default function DashboardPage() {
    const { user, token, logout } = useAuth();
    const navigate = useNavigate();
    const [userList, setUserList] = useState<UserFromApi[]>([]);
    const [roleFilter, setRoleFilter] = useState('');
    const [sortOption, setSortOption] = useState('');

    useEffect(() => {
        if (user?.role === 'admin') {
            const fetchUsers = async () => {
                const params = new URLSearchParams();
                if (roleFilter) { params.append('role', roleFilter); }
                if (sortOption) {
                    const [sortBy, order] = sortOption.split('-');
                    params.append('sortBy', sortBy);
                    params.append('order', order);
                }
                const queryString = params.toString();
                const url = `http://localhost:3000/users${queryString ? `?${queryString}` : ''}`;
                try {
                    const response = await axios.get(url, {
                        headers: { Authorization: `Bearer ${token}` },
                    });
                    setUserList(response.data);
                } catch (error) {
                    console.error('Falha ao buscar usuários:', error);
                    navigate('/profile');
                }
            };
            fetchUsers();
        } else if (user?.role === 'user') {
            navigate('/profile');
        }
    }, [user, token, navigate, roleFilter, sortOption]);

    const getUserStatus = (lastLoginAt: string | null): { text: string; className: string } => {
        if (!lastLoginAt) return { text: 'Novo', className: 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200' };
        const lastLoginDate = new Date(lastLoginAt);
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        if (lastLoginDate > thirtyDaysAgo) return { text: 'Ativo', className: 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200' };
        return { text: 'Inativo', className: 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-300' };
    };

    const handleLogout = () => { logout(); navigate('/login'); };

    const handleDeleteUser = async (userId: string) => {
        if (user?.id === userId) { alert('Você não pode excluir sua própria conta.'); return; }
        if (window.confirm('Tem certeza que deseja excluir este usuário?')) {
            try {
                await axios.delete(`http://localhost:3000/users/${userId}`, { headers: { Authorization: `Bearer ${token}` } });
                setUserList(currentUsers => currentUsers.filter(u => u.id !== userId));
                alert('Usuário excluído com sucesso!');
            } catch (error) { console.error('Falha ao excluir usuário:', error); alert('Ocorreu um erro ao excluir o usuário.'); }
        }
    };

    if (user?.role !== 'admin') return <div className="min-h-screen bg-gray-100 dark:bg-slate-900 flex justify-center items-center text-white">Carregando...</div>;

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-slate-900 flex flex-col items-center p-4 sm:p-6 md:p-8 transition-colors duration-300">
            <div className="bg-white dark:bg-slate-800 p-6 sm:p-8 rounded-xl shadow-lg w-full max-w-6xl mt-16">
                <h1 className="text-3xl font-bold text-center text-gray-800 dark:text-gray-200 mb-2">Dashboard</h1>
                <h2 className="text-xl text-center text-gray-600 dark:text-gray-400 mb-6">Painel de Administração de Usuários</h2>
                <div className="flex flex-col sm:flex-row justify-end gap-4 mb-4">
                    <div>
                        <label htmlFor="role-filter" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Filtrar por Papel</label>
                        <select
                            id="role-filter"
                            className="mt-1 block w-full pl-3 pr-10 py-2 text-base bg-white dark:bg-slate-700 border-gray-300 dark:border-slate-600 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm rounded-md text-gray-900 dark:text-white"
                            value={roleFilter}
                            onChange={(e) => setRoleFilter(e.target.value)}
                        >
                            <option value="">Todos</option>
                            <option value="admin">Admin</option>
                            <option value="user">User</option>
                        </select>
                    </div>
                    <div>
                        <label htmlFor="sort-order" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Ordenar por</label>
                        <select
                            id="sort-order"
                            className="mt-1 block w-full pl-3 pr-10 py-2 text-base bg-white dark:bg-slate-700 border-gray-300 dark:border-slate-600 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm rounded-md text-gray-900 dark:text-white"
                            value={sortOption}
                            onChange={(e) => setSortOption(e.target.value)}
                        >
                            <option value="">Padrão</option>
                            <option value="name-asc">Nome (A-Z)</option>
                            <option value="name-desc">Nome (Z-A)</option>
                            <option value="createdAt-desc">Mais Recentes</option>
                            <option value="createdAt-asc">Mais Antigos</option>
                        </select>
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left table-auto">
                        <thead className="bg-slate-100 dark:bg-slate-900 text-gray-700 dark:text-gray-300">
                            <tr>
                                <th className="p-3 font-semibold">Nome</th>
                                <th className="p-3 font-semibold">Email</th>
                                <th className="p-3 font-semibold">Papel (Role)</th>
                                <th className="p-3 font-semibold">Status</th>
                                <th className="p-3 font-semibold">Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {userList.map((u) => {
                                const status = getUserStatus(u.lastLoginAt);
                                return (
                                    <tr key={u.id} className="border-b border-gray-200 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-700">
                                        <td className="p-3 text-gray-800 dark:text-gray-200">{u.name}</td>
                                        <td className="p-3 text-gray-800 dark:text-gray-200">{u.email}</td>
                                        <td className="p-3 text-gray-800 dark:text-gray-200">{u.role}</td>
                                        <td className="p-3">
                                            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${status.className}`}>
                                                {status.text}
                                            </span>
                                        </td>
                                        <td className="p-3">
                                            <button
                                                onClick={() => handleDeleteUser(u.id)}
                                                className="bg-red-600 hover:bg-red-700 text-white font-bold py-1 px-3 rounded text-sm transition-colors"
                                            >
                                                Excluir
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
                <div className="mt-8 w-48 mx-auto">
                    <Button onClick={handleLogout}>
                        Sair (Logout)
                    </Button>
                </div>
            </div>
        </div>
    );
}