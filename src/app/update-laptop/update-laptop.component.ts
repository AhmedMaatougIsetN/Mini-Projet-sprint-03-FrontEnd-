import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { laptop } from '../model/laptop.model';
import { Type } from '../model/type.model';
import { laptopservice } from '../services/laptop.service';

@Component({
  selector: 'app-update-laptop',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './update-laptop.component.html'
})
export class UpdatelaptopComponent implements OnInit {
  currentlaptop = new laptop();
  types: Type[] = [];
  updatedTypeId: number | null = null;
  message = '';

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private laptopservice: laptopservice,
    private changeDetector: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    const id = Number(this.activatedRoute.snapshot.params['id']);
    this.laptopservice.listeTypes().subscribe({
      next: types => { this.types = types; this.changeDetector.detectChanges(); },
      error: () => { this.message = 'Impossible de charger les types.'; this.changeDetector.detectChanges(); }
    });
    this.laptopservice.consulterlaptop(id).subscribe({
      next: laptop => {
        this.currentlaptop = laptop;
        this.updatedTypeId = laptop.type?.idType ?? null;
        this.changeDetector.detectChanges();
      },
      error: () => { this.message = 'Laptop introuvable.'; this.changeDetector.detectChanges(); }
    });
  }

  updatelaptop(): void {
    if (this.updatedTypeId === null) { this.message = 'Choisissez un type.'; return; }
    this.currentlaptop.type = { idType: Number(this.updatedTypeId) } as Type;
    this.laptopservice.updatelaptop(this.currentlaptop).subscribe({
      next: () => this.router.navigate(['/laptops']),
      error: () => { this.message = 'La modification du laptop a échoué.'; this.changeDetector.detectChanges(); }
    });
  }
}
