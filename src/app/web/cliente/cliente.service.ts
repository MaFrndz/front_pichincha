import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Cliente } from './cliente.model';
import { environment } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class ClienteService {
  private readonly http = inject(HttpClient);
  private readonly endpoint = environment.apiUrl + '/clientes';

  getClientes(): Observable<Cliente[]> {
    return this.http.get<Cliente[]>(this.endpoint);
  }
}
