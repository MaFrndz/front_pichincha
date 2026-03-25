import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';

import { Cliente } from './cliente.model';
import { ClienteService } from './cliente.service';

@Component({
  selector: 'app-cliente',
  templateUrl: './cliente.html',
  styleUrl: './cliente.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ClienteComponent {
  protected readonly clientes = signal<Cliente[]>([]);
  protected readonly loading = signal(true);
  protected readonly error = signal<string | null>(null);

  private readonly clienteService = inject(ClienteService);

  constructor() {
    this.loadClientes();
  }

  private loadClientes(): void {
    this.loading.set(true);
    this.error.set(null);

    this.clienteService.getClientes().subscribe({
      next: (clientes) => {
        this.clientes.set(clientes);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('No se pudo cargar la lista de clientes.');
        this.loading.set(false);
      }
    });
  }
}
