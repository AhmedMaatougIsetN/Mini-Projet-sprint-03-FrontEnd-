import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { laptop } from '../model/laptop.model';
import { Type } from '../model/type.model';

interface TypeCollection {
  _embedded?: { types?: Type[] };
}

@Injectable({ providedIn: 'root' })
export class laptopservice {
  private readonly apiUrl = 'http://localhost:8081/produits';

  constructor(private http: HttpClient) {}

  listelaptops(): Observable<laptop[]> {
    return this.http.get<laptop[]>(`${this.apiUrl}/api`);
  }

  chercherlaptopsParNom(nom: string): Observable<laptop[]> {
    const params = new HttpParams().set('nom', nom);
    return this.http.get<laptop[]>(`${this.apiUrl}/api/prodsnom`, { params });
  }

  chercherlaptopsParType(idType: number): Observable<laptop[]> {
    return this.http.get<laptop[]>(`${this.apiUrl}/api/prodscat/${idType}`);
  }

  ajouterlaptop(prod: laptop): Observable<laptop> {
    return this.http.post<laptop>(`${this.apiUrl}/api`, this.toApiPayload(prod));
  }

  supprimerlaptop(prod: laptop): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/api/${prod.idlaptop}`);
  }

  consulterlaptop(id: number): Observable<laptop> {
    return this.http.get<laptop>(`${this.apiUrl}/api/${id}`);
  }

  updatelaptop(prod: laptop): Observable<laptop> {
    return this.http.put<laptop>(`${this.apiUrl}/api/${prod.idlaptop}`, this.toApiPayload(prod));
  }

  listeTypes(): Observable<Type[]> {
    return this.http.get<TypeCollection>(`${this.apiUrl}/cat`).pipe(
      map(response => response._embedded?.types ?? [])
    );
  }

  private toApiPayload(prod: laptop) {
    return {
      nomlaptop: prod.nomlaptop,
      prixlaptop: prod.prixlaptop,
      dateCreation: prod.dateCreation,
      type: { idType: Number(prod.type?.idType) }
    };
  }
}
