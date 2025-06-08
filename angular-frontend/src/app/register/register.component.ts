import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="auth-container">
      <div class="auth-card">
        <h2 class="title">Créer un compte</h2>
        <form (ngSubmit)="onSubmit()" novalidate>
          <div class="form-group">
            <label for="username">Nom d'utilisateur</label>
            <input
              type="text"
              id="username"
              [(ngModel)]="username"
              name="username"
              required
              placeholder="Choisissez un nom d'utilisateur"
              autocomplete="username"
            />
          </div>
          <div class="form-group">
            <label for="password">Mot de passe</label>
            <input
              type="password"
              id="password"
              [(ngModel)]="password"
              name="password"
              required
              placeholder="Choisissez un mot de passe"
              autocomplete="new-password"
            />
          </div>
          <button type="submit" [disabled]="isLoading">
  {{ isLoading ? "Inscription..." : "S'inscrire" }}
</button>


          <p class="error-message" *ngIf="error">{{ error }}</p>

          <p class="login-link">
            Vous avez déjà un compte ?
            <a routerLink="/login">Connectez-vous ici</a>
          </p>
        </form>
      </div>
    </div>
  `,
  styles: [`
    /* Conteneur centré avec un joli dégradé */
    .auth-container {
      min-height: 100vh;
      display: flex;
      justify-content: center;
      align-items: center;
      background: linear-gradient(135deg, #667eea, #764ba2);
      padding: 1rem;
    }

    /* Carte blanche avec ombre portée et coins arrondis */
    .auth-card {
      background: #fff;
      padding: 2.5rem 3rem;
      border-radius: 12px;
      box-shadow: 0 16px 30px rgba(0,0,0,0.15);
      width: 100%;
      max-width: 400px;
      box-sizing: border-box;
      transition: transform 0.3s ease;
    }
    .auth-card:hover {
      transform: translateY(-5px);
    }

    /* Titre centré et stylisé */
    .title {
      font-weight: 700;
      font-size: 1.8rem;
      color: #333;
      margin-bottom: 2rem;
      text-align: center;
      letter-spacing: 1.2px;
    }

    /* Espacement entre les champs */
    .form-group {
      margin-bottom: 1.5rem;
    }

    /* Label clair et lisible */
    label {
      display: block;
      margin-bottom: 0.5rem;
      font-weight: 600;
      color: #555;
      font-size: 0.95rem;
    }

    /* Input moderne avec focus bleu */
    input {
      width: 100%;
      padding: 0.75rem 1rem;
      border: 1.5px solid #ddd;
      border-radius: 8px;
      font-size: 1rem;
      transition: border-color 0.3s ease, box-shadow 0.3s ease;
      outline-offset: 2px;
    }
    input:focus {
      border-color: #667eea;
      box-shadow: 0 0 8px rgba(102,126,234, 0.4);
      outline: none;
    }
    input::placeholder {
      color: #aaa;
      font-style: italic;
    }

    /* Bouton violet avec effet hover */
    button {
      width: 100%;
      background-color: #667eea;
      color: white;
      padding: 0.75rem 1rem;
      font-weight: 700;
      font-size: 1rem;
      border: none;
      border-radius: 8px;
      cursor: pointer;
      transition: background-color 0.3s ease;
      box-shadow: 0 6px 15px rgba(102,126,234, 0.4);
    }
    button:hover:not(:disabled) {
      background-color: #5563c1;
      box-shadow: 0 8px 20px rgba(85, 99, 193, 0.6);
    }
    button:disabled {
      background-color: #a3a3a3;
      cursor: not-allowed;
      box-shadow: none;
    }

    /* Message d'erreur rouge */
    .error-message {
      color: #e53e3e;
      margin-top: 1rem;
      font-weight: 600;
      text-align: center;
      user-select: none;
    }

    /* Lien connexion sous le formulaire */
    .login-link {
      margin-top: 1.8rem;
      text-align: center;
      font-size: 0.9rem;
      color: #555;
    }
    .login-link a {
      color: #667eea;
      text-decoration: none;
      font-weight: 600;
      transition: color 0.3s ease;
    }
    .login-link a:hover {
      color: #5563c1;
      text-decoration: underline;
    }

    /* Responsive sur petits écrans */
    @media (max-width: 480px) {
      .auth-card {
        padding: 2rem 1.5rem;
        margin: 0 1rem;
      }
    }
  `]
})
export class RegisterComponent {
  username = '';
  password = '';
  error = '';
  isLoading = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  onSubmit() {
    this.error = '';
    this.isLoading = true;

    this.authService.register(this.username, this.password).subscribe({
      next: (response) => {
        if (response) {
          this.router.navigate(['/login']);
        } else {
          this.error = 'Échec de l\'inscription';
        }
      },
      error: (err) => {
        this.error = err.error?.message || 'Une erreur est survenue lors de l\'inscription';
        this.isLoading = false;
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }
}
