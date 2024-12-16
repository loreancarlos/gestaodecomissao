import React from "react";
import { Development, User } from "../../types";
import { SearchInput } from "../common/SearchInput";
import { Combobox } from "../common/Combobox";

interface SaleFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  selectedDevelopment: string;
  onDevelopmentChange: (value: string) => void;
  selectedBroker: string;
  onBrokerChange: (value: string) => void;
  selectedStatus: string;
  onStatusChange: (value: string) => void;
  developments: Development[];
  brokers: User[];
}

export function SaleFilters({
  searchTerm,
  onSearchChange,
  selectedDevelopment,
  onDevelopmentChange,
  selectedBroker,
  onBrokerChange,
  selectedStatus,
  onStatusChange,
  developments,
  brokers,
}: SaleFiltersProps) {
  const statusOptions = [
    { id: "", label: "Todos os status" },
    { id: "paid", label: "Pago" },
    { id: "canceled", label: "Cancelado" },
    { id: "waiting_contract", label: "Aguardando a Assinatura do Contrato" },
    { id: "waiting_down_payment", label: "Aguardando Pagamento da Entrada" },
    { id: "waiting_seven_days", label: "Aguardando Prazo de 07 dias" },
    { id: "waiting_invoice", label: "Aguardando a Emissão de Nota Fiscal" },
  ];

  const activeBrokers = brokers.filter(
    (broker) => broker.role === "broker" && broker.active
  );

  const developmentOptions = [
    { id: "", label: "Todos os empreendimentos" },
    ...developments.map((dev) => ({ id: dev.id, label: dev.name })),
  ];

  const brokerOptions = [
    { id: "", label: "Todos os corretores" },
    ...activeBrokers.map((broker) => ({ id: broker.id, label: broker.name })),
  ];

  return (
    <div className="space-y-4">
      <SearchInput
        value={searchTerm}
        onChange={onSearchChange}
        placeholder="Pesquisar por cliente, quadra ou lote..."
      />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Combobox
          options={developmentOptions}
          value={selectedDevelopment}
          onChange={onDevelopmentChange}
          placeholder="Todos os empreendimentos"
          label="Empreendimento"
          allowClear
        />

        <Combobox
          options={brokerOptions}
          value={selectedBroker}
          onChange={onBrokerChange}
          placeholder="Todos os corretores"
          label="Corretor"
          allowClear
        />

        <Combobox
          options={statusOptions}
          value={selectedStatus}
          onChange={onStatusChange}
          placeholder="Todos os status"
          label="Status"
          allowClear
        />
      </div>
    </div>
  );
}
