import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatBadgeModule } from '@angular/material/badge';
import { ProduitService } from '../services/produit.service';
import { AuthService } from '../services/auth.service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatBadgeModule,
    RouterModule
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  produits: any[] = [];
  panier: any[] = [];
  total = 0;
  searchTerm = '';

  constructor(
    private produitService: ProduitService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.chargerProduits();
  }

  chargerProduits(): void {
    this.produitService.getProduits().subscribe({
      next: (produits) => {
        this.produits = produits;
      },
      error: (err) => console.error('Erreur lors du chargement des produits', err)
    });
  }

  ajouterAuPanier(produit: any): void {
    const existant = this.panier.find(p => p.id === produit.id);
    if (existant) {
      existant.quantite++;
    } else {
      this.panier.push({...produit, quantite: 1});
    }
    this.calculerTotal();
  }

  retirerDuPanier(produitId: number): void {
    const index = this.panier.findIndex(p => p.id === produitId);
    if (index !== -1) {
      if (this.panier[index].quantite > 1) {
        this.panier[index].quantite--;
      } else {
        this.panier.splice(index, 1);
      }
      this.calculerTotal();
    }
  }

  calculerTotal(): void {
    this.total = this.panier.reduce((sum, item) => sum + (item.price * item.quantite), 0);
  }

  viderPanier(): void {
    this.panier = [];
    this.total = 0;
  }

  logout(): void {
    this.authService.logout();
  }

  get produitsFiltres() {
    return this.produits.filter(produit =>
      produit.name.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }
}