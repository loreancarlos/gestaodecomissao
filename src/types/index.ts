export interface User {
  id: string;
  name: string;
  email: string;
  role: "admin" | "user" | "broker";
  active: boolean;
  createdAt: string;
  lastLogin?: string;
}

export interface Client {
  id: string;
  name: string;
  email: string;
  cpf: string;
  phone: string;
  address: string;
}

export interface Development {
  id: string;
  name: string;
  location: string;
  description: string;
}

export interface Sale {
  id: string;
  clientId: string;
  secondBuyerId: string | null;
  developmentId: string;
  brokerId: string;
  blockNumber: string;
  lotNumber: string;
  totalValue: number;
  downPaymentInstallments: string;
  purchaseDate: string;
  commissionValue: number;
  status:
    | "paid"
    | "canceled"
    | "waiting_contract"
    | "waiting_down_payment"
    | "waiting_seven_days"
    | "waiting_invoice";
}

export interface CalendarCharge {
  clientId: string;
  clientName: string;
  developmentId: string;
  developmentName: string;
  value: number;
  dueDate: Date;
  installmentNumber: number;
  totalInstallments: number;
}
