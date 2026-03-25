import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';

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
  protected readonly searchTerm = signal('');
  protected readonly filteredClientes = computed(() => {
    const term = this.searchTerm().trim().toLowerCase();

    if (!term) {
      return this.clientes();
    }

    return this.clientes().filter((cliente) =>
      cliente.nombre.toLowerCase().includes(term)
    );
  });

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

  protected updateSearchTerm(value: string): void {
    this.searchTerm.set(value);
  }
}
