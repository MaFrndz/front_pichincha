import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import { Cuenta } from './cuenta.model';

@Injectable({
  providedIn: 'root'
})
export class CuentaService {
  private readonly http = inject(HttpClient);
  private readonly endpoint = environment.apiUrl + '/cuentas';

  getCuentas(): Observable<Cuenta[]> {
    return this.http.get<Cuenta[]>(this.endpoint);
  }
}
