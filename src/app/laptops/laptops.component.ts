import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { laptop } from '../model/laptop.model';
import { laptopservice } from '../services/laptop.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-laptops',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './laptops.component.html'
})
export class laptopsComponent implements OnInit {
  laptops: laptop[] = [];
  erreur = '';
  constructor(
    private laptopservice: laptopservice,
    public authService: AuthService,
    private changeDetector: ChangeDetectorRef
  ) {}

  ngOnInit(): void { this.chargerLaptops(); }

  chargerLaptops(): void {
    this.laptopservice.listelaptops().subscribe({
      next: laptops => {
        this.laptops = laptops;
        this.erreur = '';
        this.changeDetector.detectChanges();
      },
      error: error => {
        this.laptops = [];
        this.erreur = error.status === 401 || error.status === 403
          ? 'Votre session a expiré ou les droits d’accès sont insuffisants. Reconnectez-vous.'
          : 'Impossible de charger les laptops. Vérifiez que Spring Boot et MySQL sont démarrés.';
        this.changeDetector.detectChanges();
      }
    });
  }

  supprimerlaptop(prod: laptop): void {
    if (!confirm('Etes-vous sûr ?')) return;
    this.laptopservice.supprimerlaptop(prod).subscribe({
      next: () => this.chargerLaptops(),
      error: () => {
        this.erreur = 'La suppression a échoué.';
        this.changeDetector.detectChanges();
      }
    });
  }
}
