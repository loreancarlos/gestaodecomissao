import React, { useState, useEffect } from 'react';
import { Plus, UserCheck, UserX, Clock, Edit2, Trash2, Key } from 'lucide-react';
import { useUserStore } from '../store/userStore';
import { Table } from '../components/common/Table';
import { Modal } from '../components/common/Modal';
import { ConfirmDialog } from '../components/common/ConfirmDialog';
import { UserForm } from '../components/users/UserForm';
import { AdminResetPasswordModal } from '../components/users/AdminResetPasswordModal';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { ErrorMessage } from '../components/common/ErrorMessage';
import { User } from '../types';
 
export function Users() {
  const { users, loading, error, fetchUsers, addUser, updateUser, deleteUser, toggleUserStatus, adminResetPassword } = useUserStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [selectedUserForPasswordReset, setSelectedUserForPasswordReset] = useState<User | null>(null);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [formData, setFormData] = useState<Partial<User>>({
    name: '',
    email: '',
    role: 'user',
    active: true,
  });
  const [operationError, setOperationError] = useState<string | null>(null);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingUser) {
        await updateUser(editingUser.id, formData);
      } else {
        await addUser(formData as Omit<User, 'id' | 'createdAt'>);
      }
      handleCloseModal();
    } catch (error) {
      setOperationError(error instanceof Error ? error.message : 'Erro ao salvar usuário');
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingUser(null);
    setFormData({
      name: '',
      email: '',
      role: 'user',
      active: true, 
    });
    setOperationError(null);
  };

  const handleEdit = (user: User) => {
    setEditingUser(user);
    setFormData(user);
    setIsModalOpen(true);
  };

  const handleDelete = (user: User) => {
    setUserToDelete(user);
    setIsConfirmOpen(true);
  };

  const handleToggleStatus = async (id: string) => {
    try {
      await toggleUserStatus(id);
    } catch (error) {
      setOperationError(error instanceof Error ? error.message : 'Erro ao alterar status');
    }
  };

  const handleResetPassword = async (userId: string, newPassword: string) => {
    try {
      await adminResetPassword(userId, newPassword);
    } catch (error) {
      setOperationError(error instanceof Error ? error.message : 'Erro ao redefinir senha');
    }
  };

  const confirmDelete = async () => {
    if (userToDelete) {
      try {
        await deleteUser(userToDelete.id);
        setUserToDelete(null);
        setIsConfirmOpen(false);
      } catch (error) {
        setOperationError(error instanceof Error ? error.message : 'Erro ao excluir usuário');
      }
    }
  };

  const formatDate = (date: string | undefined) => {
    if (!date) return 'Nunca';
    return new Date(date).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getRoleDisplay = (role: User['role']) => {
    switch (role) {
      case 'admin':
        return 'Administrador';
      case 'broker':
        return 'Corretor';
      default:
        return 'Usuário';
    }
  };

  const columns = [
    { header: 'Nome', accessor: 'name' as const },
    { header: 'Email', accessor: 'email' as const },
    {
      header: 'Perfil',
      accessor: 'role' as const,
      render: (value: User['role']) => getRoleDisplay(value),
    },
    {
      header: 'Status',
      accessor: 'active' as const,
      render: (value: boolean) => (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
          value ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
          {value ? 'Ativo' : 'Inativo'}
        </span>
      ),
    },
    {
      header: 'Último Acesso',
      accessor: 'lastLogin' as const,
      render: (value: string) => (
        <div className="flex items-center space-x-1">
          <Clock className="h-4 w-4 text-gray-400" />
          <span>{formatDate(value)}</span>
        </div>
      ),
    },
    {
      header: 'Criado em',
      accessor: 'createdAt' as const,
      render: (value: string) => formatDate(value),
    },
  ];

  const renderActions = (user: User) => (
    <div className="flex justify-end space-x-2">
      <button
        onClick={() => handleEdit(user)}
        className="text-indigo-600 hover:text-indigo-900"
        title="Editar usuário">
        <Edit2 className="h-4 w-4" />
      </button>
      <button
        onClick={() => handleToggleStatus(user.id)}
        className={`p-1 rounded-full ${
          user.active
            ? 'text-red-600 hover:text-red-900'
            : 'text-green-600 hover:text-green-900'
        }`}
        title={user.active ? 'Desativar usuário' : 'Ativar usuário'}>
        {user.active ? (
          <UserX className="h-4 w-4" />
        ) : (
          <UserCheck className="h-4 w-4" />
        )}
      </button>
      <button
        onClick={() => setSelectedUserForPasswordReset(user)}
        className="text-yellow-600 hover:text-yellow-900"
        title="Redefinir senha">
        <Key className="h-4 w-4" />
      </button>
      <button
        onClick={() => handleDelete(user)}
        className="text-red-600 hover:text-red-900"
        title="Excluir usuário">
        <Trash2 className="h-4 w-4" />
      </button>
    </div>
  );

  if (loading && !users.length) {
    return <LoadingSpinner />;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Usuários</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700">
          <Plus className="h-4 w-4 mr-2" />
          Novo Usuário
        </button>
      </div>

      {(error || operationError) && (
        <ErrorMessage
          message={error || operationError || ""}
          onDismiss={() => {
            if (error) fetchUsers();
            setOperationError(null);
          }}
        />
      )}

      <Table
        data={users}
        columns={columns}
        renderActions={renderActions}
      />

      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingUser ? 'Editar Usuário' : 'Novo Usuário'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <UserForm
            formData={formData}
            setFormData={setFormData}
            isEditing={!!editingUser}
          />
          {operationError && (
            <ErrorMessage message={operationError} />
          )}
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={handleCloseModal}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700">
              {editingUser ? 'Salvar' : 'Criar'}
            </button>
          </div>
        </form>
      </Modal>

      <AdminResetPasswordModal
        isOpen={!!selectedUserForPasswordReset}
        onClose={() => setSelectedUserForPasswordReset(null)}
        onSubmit={handleResetPassword}
        userName={selectedUserForPasswordReset?.name || ''}
        userId={selectedUserForPasswordReset?.id || ''}
      />

      <ConfirmDialog
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={confirmDelete}
        title="Excluir Usuário"
        message="Tem certeza que deseja excluir este usuário? Esta ação não pode ser desfeita."
      />
    </div>
  );
}
