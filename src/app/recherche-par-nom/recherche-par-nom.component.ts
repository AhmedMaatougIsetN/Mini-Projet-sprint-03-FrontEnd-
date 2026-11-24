import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { laptop } from '../model/laptop.model';
import { laptopservice } from '../services/laptop.service';

@Component({
  selector: 'app-recherche-par-nom',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './recherche-par-nom.component.html'
})
export class RechercheParNomComponent implements OnInit {
  laptops: laptop[] = [];
  searchTerm = '';
  constructor(private laptopservice: laptopservice, private changeDetector: ChangeDetectorRef) {}
  ngOnInit(): void { this.chargerLaptops(); }
  chargerLaptops(): void {
    const term = this.searchTerm.trim();
    const request = term ? this.laptopservice.chercherlaptopsParNom(term) : this.laptopservice.listelaptops();
    request.subscribe(laptops => {
      this.laptops = laptops;
      this.changeDetector.detectChanges();
    });
  }
  get laptopsFiltres(): laptop[] { return this.laptops; }
}
