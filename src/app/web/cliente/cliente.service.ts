import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

import { Cliente, ClienteDraft } from './cliente.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ClienteService {
  private readonly http = inject(HttpClient);
  private readonly endpoint = environment.apiUrl + '/clientes';

  getClientes(): Observable<Cliente[]> {
    return this.http.get<Cliente[]>(this.endpoint);
  }

  getClienteById(id: number): Observable<Cliente | undefined> {
    return this.getClientes().pipe(
      map((clientes) => clientes.find((cliente) => cliente.id === id))
    );
  }

  createCliente(cliente: ClienteDraft): Observable<Cliente> {
    return this.http.post<Cliente>(this.endpoint, cliente);
  }

  updateCliente(id: number, cliente: ClienteDraft): Observable<Cliente> {
    return this.http.put<Cliente>(`${this.endpoint}/${id}`, cliente);
  }

  deleteCliente(id: number): Observable<void> {
    return this.http.delete<void>(`${this.endpoint}/${id}`);
  }
}
