import React, { useState, useEffect, useMemo } from "react";
import { Plus } from "lucide-react";
import { useClientStore } from "../store/clientStore";
import { Table } from "../components/common/Table";
import { Modal } from "../components/common/Modal";
import { ConfirmDialog } from "../components/common/ConfirmDialog";
import { SearchInput } from "../components/common/SearchInput";
import { MaskedInput } from "../components/common/MaskedInput";
import { LoadingSpinner } from "../components/common/LoadingSpinner";
import { ErrorMessage } from "../components/common/ErrorMessage";
import {
  cpfMask,
  phoneMask,
  unmaskValue,
  formatCPF,
  formatPhone,
} from "../utils/masks";
import { getDeleteUserErrorMessage } from "../utils/userValidations";
import { Client } from "../types";

export function Clients() {
  const {
    clients,
    loading,
    error,
    fetchClients,
    addClient,
    updateClient,
    deleteClient,
  } = useClientStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [operationError, setOperationError] = useState<string | null>(null);
  const [clientToDelete, setClientToDelete] = useState<Client | null>(null);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    cpf: "",
    phone: "",
    address: "",
  });

  useEffect(() => {
    fetchClients();
  }, [fetchClients]);

  const columns = [
    { header: "Nome", accessor: "name" as const},
    { header: "Email", accessor: "email" as const },
    {
      header: "CPF",
      accessor: "cpf" as const,
      render: (value: string) => formatCPF(value),
    },
    {
      header: "Telefone",
      accessor: "phone" as const,
      render: (value: string) => formatPhone(value),
    },
  ];

  const filteredClients = useMemo(() => {
    const searchTermLower = searchTerm.toLowerCase();
    return clients.filter(
      (client) =>
        client.name.toLowerCase().includes(searchTermLower) ||
        client.email.toLowerCase().includes(searchTermLower) ||
        client.cpf.includes(searchTerm) ||
        client.phone.includes(searchTerm)
    );
  }, [clients, searchTerm]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const clientData = {
        ...formData,
        cpf: unmaskValue(formData.cpf),
        phone: unmaskValue(formData.phone),
      };

      if (editingClient) {
        await updateClient(editingClient.id, clientData);
      } else {
        await addClient(clientData);
      }
      handleCloseModal();
    } catch (error) {
      setOperationError(
        error instanceof Error ? error.message : "Erro ao salvar cliente"
      );
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingClient(null);
    setFormData({ name: "", email: "", cpf: "", phone: "", address: "" });
    setOperationError(null);
  };

  const handleEdit = (client: Client) => {
    setEditingClient(client);
    setFormData({
      ...client,
      cpf: formatCPF(client.cpf),
      phone: formatPhone(client.phone),
    });
    setIsModalOpen(true);
  };

  const handleDelete = (client: Client) => {
    const errorMessage = getDeleteUserErrorMessage(client.id);
    if (errorMessage) {
      setOperationError(errorMessage);
      return;
    }
    setClientToDelete(client);
    setIsConfirmOpen(true);
  };

  const confirmDelete = async () => {
    if (clientToDelete) {
      try {
        await deleteClient(clientToDelete.id);
        setClientToDelete(null);
        setIsConfirmOpen(false);
      } catch (error) {
        setOperationError(
          error instanceof Error ? error.message : "Erro ao excluir cliente"
        );
      }
    }
  };

  if (loading && !clients.length) {
    return <LoadingSpinner />;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Clientes</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700">
          <Plus className="h-4 w-4 mr-2" />
          Novo Cliente
        </button>
      </div>

      <div className="max-w-md">
        <SearchInput
          value={searchTerm}
          onChange={setSearchTerm}
          placeholder="Pesquisar por nome, email, CPF ou telefone..."
        />
      </div>

      {(error || operationError) && (
        <ErrorMessage
          message={error || operationError || ""}
          onDismiss={() => {
            if (error) fetchClients();
            setOperationError(null);
          }}
        />
      )}

      <Table
        data={filteredClients}
        columns={columns}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingClient ? "Editar Cliente" : "Novo Cliente"}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Nome
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              CPF
            </label>
            <MaskedInput
              mask={cpfMask}
              value={formData.cpf}
              onChange={(value) => setFormData({ ...formData, cpf: value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Telefone
            </label>
            <MaskedInput
              mask={phoneMask}
              value={formData.phone}
              onChange={(value) => setFormData({ ...formData, phone: value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Endereço
            </label>
            <input
              type="text"
              value={formData.address}
              onChange={(e) =>
                setFormData({ ...formData, address: e.target.value })
              }
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              required
            />
          </div>

          {operationError && <ErrorMessage message={operationError} />}

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
              {editingClient ? "Salvar" : "Criar"}
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={confirmDelete}
        title="Excluir Cliente"
        message="Tem certeza que deseja excluir este cliente? Esta ação não pode ser desfeita."
      />
    </div>
  );
}
