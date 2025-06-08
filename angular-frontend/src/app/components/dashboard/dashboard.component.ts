import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router'; 
import { AuthService } from '../../services/auth.service';
import { ProduitService } from './../../services/produit.service';
import { Produit } from '../../services/produit.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule, MatButtonModule, HttpClientModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  activeTab: string = 'stats';

  dashboardData = {
    revenue: 125000,
    activeClients: 3,
    productsInStock: 3,
    outOfStock: 2,
    growth: 12
  };

  revenueData = [
    { year: 2023, value: 125000 },
    { year: 2022, value: 98000 },
    { year: 2021, value: 75000 }
  ];

  topProducts = [
    { id: 1, name: 'PC Portable', quantity: 120, price: 899, imageUrl: 'assets/images/computer.jpg',
    description: 'Ordinateur portable haute performance' },
    { id: 2, name: 'Imprimante', quantity: 85, price: 249, imageUrl: 'assets/images/computer.jpg',
    description: 'Imprimante haute performance'  },
    { id: 3, name: 'Souris', quantity: 200, price: 29.99,imageUrl: 'assets/images/computer.jpg',
    description: 'Souris haute performance'  }
  ];

  topClients = [
    { id: 1, name: 'Entreprise A', revenue: 45000, unpaid: 5000 },
    { id: 2, name: 'Société B', revenue: 38000, unpaid: 2000 },
    { id: 3, name: 'Compagnie C', revenue: 32000, unpaid: 0 }
  ];

  showAddProductModal = false;

 newProduct = {
    name: '',
    quantity: 0,
    price: 0,
    imageUrl: '',
    description: ''
  };
  showEditProductModal = false;
 editedProduct = {
    id: 0,
    name: '',
    quantity: 0,
    price: 0,
    imageUrl: '',
    description: ''
  };

  selectedImage?: File;
  selectedEditImage?: File;

  errorMessage: string | null = null;

  constructor(private produitService: ProduitService,
    private authService: AuthService, 
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadProduits();
  }

  get maxRevenue() {
    return Math.max(...this.revenueData.map(item => item.value));
  }

  getSegmentColor(index: number): string {
    const colors = [
      'rgba(79, 70, 229, 0.8)',  // violet
      'rgba(245, 158, 11, 0.8)', // orange
      'rgba(16, 185, 129, 0.8)', // vert
      'rgba(239, 68, 68, 0.8)',  // rouge
      'rgba(139, 92, 246, 0.8)'  // violet clair
    ];
    return colors[index % colors.length];
  }

  getPercentage(index: number): string {
    const total = this.topProducts.reduce((sum, product) => sum + product.quantity, 0);
    const percentage = (this.topProducts[index].quantity / total) * 100;
    return percentage.toFixed(1) + '%';
  }

  setActiveTab(tab: string) {
    this.activeTab = tab;
  }

  switchTab(tab: string) {
    this.setActiveTab(tab === 'dashboard' ? 'stats' : tab);
  }

  openAddProductModal() {
    this.showAddProductModal = true;
  }

  closeAddProductModal() {
    this.showAddProductModal = false;
    this.resetNewProduct();
  }

   onFileSelected(event: any, isEdit: boolean = false) {
    const file: File = event.target.files[0];
    if (file) {
      if (isEdit) {
        this.selectedEditImage = file;
      } else {
        this.selectedImage = file;
      }
    }
  }

 addProduct(): void {
  if (this.selectedImage) {
    this.produitService.addProduitWithImage(this.newProduct, this.selectedImage)
      .subscribe({
        next: (produit) => {
          this.topProducts.push(produit);
          this.updateDashboardData();
          this.closeAddProductModal();
          this.selectedImage = undefined;
        },
        error: (err) => {
          this.errorMessage = 'Erreur lors de l\'ajout du produit';
          console.error(err);
        }
      });
  } else {
    // Fallback if no image is selected
    this.newProduct.imageUrl = 'assets/images/default-product.png';
    this.produitService.addProduit(this.newProduct)
      .subscribe({
        next: (produit) => {
          this.topProducts.push(produit);
          this.updateDashboardData();
          this.closeAddProductModal();
        },
        error: (err) => {
          this.errorMessage = 'Erreur lors de l\'ajout du produit';
          console.error(err);
        }
      });
  }
}
  resetNewProduct() {
    this.newProduct = {
      name: '',
      quantity: 0,
      price: 0,
      imageUrl: '',
      description: ''
    };
  }

loadProduits(): void {
  this.produitService.getProduits().subscribe({
    next: (produits: Produit[]) => { // Spécifiez le type Produit[]
      this.topProducts = produits.map(p => ({
        id: p.id,
        name: p.name,
        price: p.price,
        quantity: p.quantity,
        imageUrl: p.imageUrl || 'assets/default-product.png', // Valeur par défaut
        description: p.description || 'Pas de description' // Valeur par défaut
      }));
      this.updateDashboardData();
    },
    error: (err) => console.error('Erreur lors du chargement des produits', err)
  });
}


  updateDashboardData(): void {
    this.dashboardData.productsInStock = this.topProducts.length;
    this.dashboardData.outOfStock = this.topProducts.filter(p => p.quantity === 0).length;
  }

  openEditProductModal(product: any): void {
  this.editedProduct = { ...product };
  this.showEditProductModal = true;
}

closeEditProductModal(): void {
  this.showEditProductModal = false;
  this.errorMessage = null;
}

 updateProduct(): void {
  if (this.selectedEditImage) {
    this.produitService.updateProduitWithImage(
      this.editedProduct.id, 
      this.editedProduct, 
      this.selectedEditImage
    ).subscribe({
      next: (updatedProduct) => {
        const index = this.topProducts.findIndex(p => p.id === updatedProduct.id);
        if (index !== -1) {
          this.topProducts[index] = updatedProduct;
        }
        this.closeEditProductModal();
        this.updateDashboardData();
        this.selectedEditImage = undefined;
      },
      error: (err) => {
        this.errorMessage = 'Erreur lors de la modification du produit';
        console.error(err);
      }
    });
  } else {
    this.produitService.updateProduit(this.editedProduct.id, this.editedProduct)
      .subscribe({
        next: (updatedProduct) => {
          const index = this.topProducts.findIndex(p => p.id === updatedProduct.id);
          if (index !== -1) {
            this.topProducts[index] = updatedProduct;
          }
          this.closeEditProductModal();
          this.updateDashboardData();
        },
        error: (err) => {
          this.errorMessage = 'Erreur lors de la modification du produit';
          console.error(err);
        }
      });
  }
}
deleteProduct(id: number): void {
  if (confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) {
    this.produitService.deleteProduit(id).subscribe({
      next: () => {
        this.topProducts = this.topProducts.filter(p => p.id !== id);
        this.updateDashboardData();
      },
      error: (err) => {
        this.errorMessage = 'Erreur lors de la suppression du produit';
        console.error(err);
      }
    });
  }
}
 logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
