export interface Client {
  id: number;
  name: string;
  email: string;
  phone: string;
  address: string;
}

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  categoryId: number;
  stock: number;
}

export interface Category {
  id: number;
  name: string;
  description: string;
}

export interface Invoice {
  id: number;
  clientId: number;
  date: Date;
  total: number;
  status: 'PAID' | 'UNPAID';
  items: InvoiceItem[];
}

export interface InvoiceItem {
  id: number;
  invoiceId: number;
  productId: number;
  quantity: number;
  price: number;
}

export interface Payment {
  id: number;
  invoiceId: number;
  amount: number;
  date: Date;
  currency: string;
}

export interface Currency {
  code: string;
  name: string;
  symbol: string;
  isDefault: boolean;
}
// models/entities.model.ts
export interface Dashboard {
  revenue?: {
    total: number;
    byYear: Array<{
      year: number;
      amount: number;
    }>;
  };
  topClients?: Array<{
    id: number;
    name: string;
    totalPurchases: number;
    unpaidAmount: number;
  }>;
  topProducts?: Array<{
    id: number;
    name: string;
    quantity: number;
    revenue: number;
  }>;
  lowStock?: Array<{
    id: number;
    name: string;
    stock: number;
  }>;
  paidInvoices?: Array<{
    id: number;
    invoiceNumber: string;
    clientName: string;
    amount: number;
    paymentDate: Date;
  }>;
  unpaidInvoices?: Array<{
    id: number;
    invoiceNumber: string;
    clientName: string;
    amount: number;
    dueDate: Date;
  }>;
  clientDebts?: Array<{
    clientId: number;
    clientName: string;
    debtAmount: number;
  }>;
}