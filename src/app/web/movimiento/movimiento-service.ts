import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import { Movimiento } from './movimiento-model';

@Injectable({
  providedIn: 'root'
})
export class MovimientoService {
  private readonly http = inject(HttpClient);
  private readonly endpoint = environment.apiUrl + '/movimientos';

  getMovimientos(): Observable<Movimiento[]> {
    return this.http.get<Movimiento[]>(this.endpoint);
  }
}
