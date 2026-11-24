import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { laptop } from '../model/laptop.model';
import { Type } from '../model/type.model';
import { laptopservice } from '../services/laptop.service';

@Component({
  selector: 'app-add-laptop',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-laptop.component.html'
})
export class AddlaptopComponent implements OnInit {
  newlaptop = new laptop();
  types: Type[] = [];
  newIdType: number | null = null;
  message = '';

  constructor(
    private laptopservice: laptopservice,
    private router: Router,
    private changeDetector: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.laptopservice.listeTypes().subscribe({
      next: types => { this.types = types; this.changeDetector.detectChanges(); },
      error: () => { this.message = 'Impossible de charger les types.'; this.changeDetector.detectChanges(); }
    });
  }

  addlaptop(): void {
    if (this.newIdType === null) { this.message = 'Choisissez un type.'; return; }
    this.newlaptop.type = { idType: Number(this.newIdType) } as Type;
    this.laptopservice.ajouterlaptop(this.newlaptop).subscribe({
      next: () => this.router.navigate(['/laptops']),
      error: () => { this.message = 'L’ajout du laptop a échoué.'; this.changeDetector.detectChanges(); }
    });
  }
}
