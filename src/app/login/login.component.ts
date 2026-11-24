import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { User } from '../model/user.model';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.component.html'
})
export class LoginComponent {
  user = new User();
  erreur = 0;

  constructor(private authService: AuthService, private router: Router) {}

  onLoggedin(): void {
    this.erreur = 0;
    this.authService.signIn(this.user).subscribe({
      next: () => this.router.navigate(['/laptops']),
      error: () => this.erreur = 1
    });
  }
}
