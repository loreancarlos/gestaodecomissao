import React, { useState, useEffect, useMemo } from "react";
import { useClientStore } from "../store/clientStore";
import { useDevelopmentStore } from "../store/developmentStore";
import { useAuthStore } from "../store/authStore";
import { useSaleStore } from "../store/saleStore";
import { Table } from "../components/common/Table";
import { LoadingSpinner } from "../components/common/LoadingSpinner";
import { ErrorMessage } from "../components/common/ErrorMessage";
import { CommissionFilters } from "../components/commissions/CommissionFilters";
import { CommissionSummary } from "../components/commissions/CommissionSummary";
import { getCommissionColumns } from "../components/commissions/CommissionColumns";
import { getCurrentYear, getYearFromDate } from "../utils/yearFilter";

export function Commissions() {
  const { user } = useAuthStore();
  const {
    sales,
    loading: salesLoading,
    error: salesError,
    fetchSales,
  } = useSaleStore();
  const { clients, loading: clientsLoading, fetchClients } = useClientStore();
  const {
    developments,
    loading: developmentsLoading,
    fetchDevelopments,
  } = useDevelopmentStore();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDevelopment, setSelectedDevelopment] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedYear, setSelectedYear] = useState(getCurrentYear().toString());

  useEffect(() => {
    fetchSales();
    fetchClients();
    fetchDevelopments();
  }, [fetchSales, fetchClients, fetchDevelopments]);

  // Obter o ano de criação do usuário
  const userCreationYear = useMemo(() => {
    if (user?.createdAt) {
      return new Date(user.createdAt).getFullYear();
    }
    return getCurrentYear();
  }, [user]);

  const myCommissions = useMemo(() => {
  if (!user || !sales.length || !clients.length || !developments.length)
    return [];

  return sales
    .filter((sale) => sale.brokerId === user.id)
    .map((sale) => {
      const client = clients.find((c) => c.id === sale.clientId);
      const development = developments.find(
        (d) => d.id === sale.developmentId
      );

      return {
        id: sale.id,
        clientName: client?.name || "Cliente não encontrado",
        developmentName: development?.name || "Empreendimento não encontrado",
        developmentId: sale.developmentId,
        blockNumber: sale.blockNumber,
        lotNumber: sale.lotNumber,
        totalValue: Number(sale.totalValue) || 0,
        commissionValue: Number(sale.commissionValue) || 0,
        status: sale.status,
        purchaseDate: sale.purchaseDate,
        updatedAt: sale.updatedAt,
      };
    });
}, [sales, clients, developments, user]);

  const filteredCommissions = useMemo(() => {
    return myCommissions.filter((commission) => {
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch =
        commission.clientName.toLowerCase().includes(searchLower) ||
        commission.blockNumber.toLowerCase().includes(searchLower) ||
        commission.lotNumber.toLowerCase().includes(searchLower);
      const matchesDevelopment =
        !selectedDevelopment ||
        commission.developmentId === selectedDevelopment;
      const matchesStatus =
        !selectedStatus || commission.status === selectedStatus;
      const matchesYear =
        !selectedYear ||
        getYearFromDate(commission.purchaseDate).toString() === selectedYear;

      return (
        matchesSearch && matchesDevelopment && matchesStatus && matchesYear
      );
    });
  }, [
    myCommissions,
    searchTerm,
    selectedDevelopment,
    selectedStatus,
    selectedYear,
  ]);

  const summaryData = useMemo(() => {
    return filteredCommissions.reduce(
      (acc, commission) => ({
        totalSales: acc.totalSales + (commission.totalValue || 0),
        totalCommissions:
          acc.totalCommissions + (commission.commissionValue || 0),
        numberOfSales: acc.numberOfSales + 1,
      }),
      { totalSales: 0, totalCommissions: 0, numberOfSales: 0 }
    );
  }, [filteredCommissions]);

  if (salesLoading || clientsLoading || developmentsLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Minhas Comissões</h1>
      </div>

      <CommissionFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        selectedDevelopment={selectedDevelopment}
        onDevelopmentChange={setSelectedDevelopment}
        selectedStatus={selectedStatus}
        onStatusChange={setSelectedStatus}
        selectedYear={selectedYear}
        onYearChange={setSelectedYear}
        developments={developments}
        userCreationYear={userCreationYear}
      />

      {salesError && <ErrorMessage message={salesError} />}

      {myCommissions.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          Nenhuma comissão encontrada.
        </div>
      ) : (
        <>
          <Table data={filteredCommissions} columns={getCommissionColumns()} />

          <CommissionSummary
            totalSales={summaryData.totalSales}
            totalCommissions={summaryData.totalCommissions}
            numberOfSales={summaryData.numberOfSales}
          />
        </>
      )}
    </div>
  );
}
