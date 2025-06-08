import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, switchMap } from 'rxjs';

export interface Produit {
  id: number;
  name: string;
  price: number;
  quantity: number;
  imageUrl: string; 
  description: string; 
}

@Injectable({
  providedIn: 'root'
})
export class ProduitService {
  private apiUrl = 'http://localhost:8888/produit-service/produits';
  private uploadUrl = 'http://localhost:8888/produit-service/api/images/upload';

  constructor(private http: HttpClient) {}

  getProduits(): Observable<Produit[]> {
    return this.http.get<Produit[]>(this.apiUrl);
  }

  addProduit(produit: Omit<Produit, 'id'>): Observable<Produit> {
    return this.http.post<Produit>(this.apiUrl, produit);
  }

  updateProduit(id: number, produit: Produit): Observable<Produit> {
    return this.http.put<Produit>(`${this.apiUrl}/${id}`, produit);
  }

  deleteProduit(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  uploadImage(file: File): Observable<string> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post(this.uploadUrl, formData, { responseType: 'text' });
  }

addProduitWithImage(produit: Omit<Produit, 'id'>, imageFile: File): Observable<Produit> {
  const formData = new FormData();
  formData.append('product', JSON.stringify(produit));
  formData.append('imageFile', imageFile);
  
  return this.http.post<Produit>(this.apiUrl, formData);
}

updateProduitWithImage(id: number, produit: Produit, imageFile: File): Observable<Produit> {
  const formData = new FormData();
  formData.append('product', JSON.stringify(produit));
  formData.append('imageFile', imageFile);
  
  return this.http.put<Produit>(`${this.apiUrl}/${id}`, formData);
}
}