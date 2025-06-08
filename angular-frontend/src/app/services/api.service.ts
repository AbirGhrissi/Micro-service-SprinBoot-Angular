import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  Client,
  Product,
  Category,
  Invoice,
  Payment,
  Currency,
  Dashboard
} from '../models/entities.model';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private readonly API_URL = 'http://localhost:8888';

  constructor(private http: HttpClient) {}

  // Clients
  getClients(): Observable<Client[]> {
    return this.http.get<Client[]>(`${this.API_URL}/clients`);
  }

  getClient(id: number): Observable<Client> {
    return this.http.get<Client>(`${this.API_URL}/clients/${id}`);
  }

  createClient(client: Omit<Client, 'id'>): Observable<Client> {
    return this.http.post<Client>(`${this.API_URL}/clients`, client);
  }

  updateClient(id: number, client: Partial<Client>): Observable<Client> {
    return this.http.put<Client>(`${this.API_URL}/clients/${id}`, client);
  }

  deleteClient(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/clients/${id}`);
  }

  // Products
  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.API_URL}/products`);
  }

  getProduct(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.API_URL}/products/${id}`);
  }

  createProduct(product: Omit<Product, 'id'>): Observable<Product> {
    return this.http.post<Product>(`${this.API_URL}/products`, product);
  }

  updateProduct(id: number, product: Partial<Product>): Observable<Product> {
    return this.http.put<Product>(`${this.API_URL}/products/${id}`, product);
  }

  deleteProduct(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/products/${id}`);
  }

  // Categories
  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(`${this.API_URL}/categories`);
  }

  // Invoices
  getInvoices(): Observable<Invoice[]> {
    return this.http.get<Invoice[]>(`${this.API_URL}/invoices`);
  }

  getInvoice(id: number): Observable<Invoice> {
    return this.http.get<Invoice>(`${this.API_URL}/invoices/${id}`);
  }

  getClientInvoices(clientId: number): Observable<Invoice[]> {
    return this.http.get<Invoice[]>(`${this.API_URL}/clients/${clientId}/invoices`);
  }

  // Payments
  getPayments(invoiceId: number): Observable<Payment[]> {
    return this.http.get<Payment[]>(`${this.API_URL}/invoices/${invoiceId}/payments`);
  }

  createPayment(payment: Omit<Payment, 'id'>): Observable<Payment> {
    return this.http.post<Payment>(`${this.API_URL}/payments`, payment);
  }

  // Currencies
  getCurrencies(): Observable<Currency[]> {
    return this.http.get<Currency[]>(`${this.API_URL}/currencies`);
  }

  setDefaultCurrency(code: string): Observable<void> {
    return this.http.put<void>(`${this.API_URL}/currencies/${code}/default`, {});
  }

  // Dashboard
  getDashboardData(): Observable<Dashboard> {
    return this.http.get<Dashboard>(`${this.API_URL}/dashboard`);
  }
}