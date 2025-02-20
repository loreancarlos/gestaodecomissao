import React from "react";
import { Development } from "../../types";
import { SearchInput } from "../common/SearchInput";
import { Combobox } from "../common/Combobox";
import { getCurrentYear, generateYearOptions } from "../../utils/yearFilter";

interface CommissionFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  selectedDevelopment: string;
  onDevelopmentChange: (value: string) => void;
  selectedStatus: string;
  onStatusChange: (value: string) => void;
  selectedYear: string;
  onYearChange: (value: string) => void;
  developments: Development[];
  userCreationYear: number; 
}

export function CommissionFilters({
  searchTerm,
  onSearchChange,
  selectedDevelopment,
  onDevelopmentChange,
  selectedStatus,
  onStatusChange,
  selectedYear,
  onYearChange,
  developments,
  userCreationYear,
}: CommissionFiltersProps) {
  const statusOptions = [
    { value: "", label: "Todos os status" },
    { value: "paid", label: "Pago" },
    { value: "canceled", label: "Cancelado" },
    { value: "waiting_contract", label: "Aguardando a Assinatura do Contrato" },
    { value: "waiting_down_payment", label: "Aguardando Pagamento da Entrada" },
    { value: "waiting_seven_days", label: "Aguardando Prazo de 07 dias" },
    { value: "waiting_invoice", label: "Aguardando a Emissão de Nota Fiscal" },
  ];

  const developmentOptions = [
    { id: "", label: "" },
    ...developments.map((dev) => ({ id: dev.id, label: dev.name })),
  ];

  // Gerar opções de ano começando do ano de criação do usuário
  const yearOptions = [
    { value: "", label: "Todos os anos" },
    ...generateYearOptions(userCreationYear).map((year) => ({
      value: year.id,
      label: year.label,
    })),
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

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Status
          </label>
          <select
            value={selectedStatus}
            onChange={(e) => onStatusChange(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm">
            {statusOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Ano
          </label>
          <select
            value={selectedYear}
            onChange={(e) => onYearChange(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm">
            {yearOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
