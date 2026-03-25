import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

import { environment } from '../../../environments/environment';
import { Cuenta, CuentaDraft } from './cuenta-model';

@Injectable({
  providedIn: 'root'
})
export class CuentaService {
  private readonly http = inject(HttpClient);
  private readonly endpoint = environment.apiUrl + '/cuentas';

  getCuentas(): Observable<Cuenta[]> {
    return this.http.get<Cuenta[]>(this.endpoint);
  }

  getCuentaById(id: number): Observable<Cuenta | undefined> {
    return this.getCuentas().pipe(
      map((cuentas) => cuentas.find((cuenta) => cuenta.id === id))
    );
  }

  createCuenta(cuenta: CuentaDraft): Observable<Cuenta> {
    return this.http.post<Cuenta>(this.endpoint, cuenta);
  }

  updateCuenta(id: number, cuenta: CuentaDraft): Observable<Cuenta> {
    return this.http.put<Cuenta>(`${this.endpoint}/${id}`, cuenta);
  }

  deleteCuenta(id: number): Observable<void> {
    return this.http.delete<void>(`${this.endpoint}/${id}`);
  }
}
