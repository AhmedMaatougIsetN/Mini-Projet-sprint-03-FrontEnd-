import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { laptop } from '../model/laptop.model';
import { Type } from '../model/type.model';
import { laptopservice } from '../services/laptop.service';

@Component({
  selector: 'app-recherche-par-type',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './recherche-par-type.component.html'
})
export class RechercheParTypeComponent implements OnInit {
  laptops: laptop[] = [];
  types: Type[] = [];
  typeSelectionne: number | null = null;
  constructor(private laptopservice: laptopservice, private changeDetector: ChangeDetectorRef) {}
  ngOnInit(): void {
    this.laptopservice.listeTypes().subscribe(types => {
      this.types = types;
      this.changeDetector.detectChanges();
    });
    this.chargerLaptops();
  }
  chargerLaptops(): void {
    const request = this.typeSelectionne === null
      ? this.laptopservice.listelaptops()
      : this.laptopservice.chercherlaptopsParType(Number(this.typeSelectionne));
    request.subscribe(laptops => {
      this.laptops = laptops;
      this.changeDetector.detectChanges();
    });
  }
  get laptopsFiltres(): laptop[] { return this.laptops; }
}
