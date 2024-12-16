import React, { useState } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { Building2, Users, FileText, LogOut, UserCog, DollarSign, Key } from 'lucide-react';
import { ChangePasswordModal } from './users/ChangePasswordModal';

export function Layout() {
  const { user, logout, changePassword } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [isChangePasswordModalOpen, setIsChangePasswordModalOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  const handleChangePassword = async (currentPassword: string, newPassword: string) => {
    await changePassword(currentPassword, newPassword);
  };

  const isActive = (path: string) =>
    location.pathname === path
      ? 'border-indigo-500 text-gray-900'
      : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700';

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <Building2 className="h-8 w-8 text-indigo-600" />
                <span className="ml-2 text-xl font-bold text-gray-900">
                  Gestão de Comissões
                </span>
              </div>
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                {user?.role !== 'broker' && (
                  <>
                    <Link
                      to="/clients"
                      className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${isActive(
                        '/clients'
                      )}`}
                    >
                      <Users className="h-4 w-4 mr-1" />
                      Clientes
                    </Link>
                    <Link
                      to="/developments"
                      className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${isActive(
                        '/developments'
                      )}`}
                    >
                      <Building2 className="h-4 w-4 mr-1" />
                      Empreendimentos
                    </Link>
                    <Link
                      to="/sales"
                      className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${isActive(
                        '/sales'
                      )}`}
                    >
                      <FileText className="h-4 w-4 mr-1" />
                      Vendas
                    </Link>
                  </>
                )}
                {user?.role === 'broker' && (
                  <Link
                    to="/commissions"
                    className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${isActive(
                      '/commissions'
                    )}`}
                  >
                    <DollarSign className="h-4 w-4 mr-1" />
                    Comissões
                  </Link>
                )}
                {user?.role === 'admin' && (
                  <Link
                    to="/users"
                    className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${isActive(
                      '/users'
                    )}`}
                  >
                    <UserCog className="h-4 w-4 mr-1" />
                    Usuários
                  </Link>
                )}
              </div>
            </div>
             <div className="flex items-center space-x-4">
              <button
                onClick={() => setIsChangePasswordModalOpen(true)}
                className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <Key className="h-4 w-4 mr-1" />
                Alterar Senha
              </button>
              <span className="text-gray-700">{user?.name}</span>
              <button
                onClick={handleLogout}
                className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <LogOut className="h-4 w-4 mr-1" />
                Sair
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <Outlet />
      </main>

      <ChangePasswordModal
        isOpen={isChangePasswordModalOpen}
        onClose={() => setIsChangePasswordModalOpen(false)}
        onSubmit={handleChangePassword}
      />
    </div>
  );
}
