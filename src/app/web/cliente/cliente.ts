import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';

import { Cliente } from './service/cliente.model';
import { ClienteService } from './service/cliente.service';

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
  protected readonly deletingId = signal<number | null>(null);
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
  private readonly router = inject(Router);

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

  protected goToCreateCliente(): void {
    void this.router.navigate(['/clientes/nuevo']);
  }

  protected goToEditCliente(id: number): void {
    void this.router.navigate(['/clientes/editar', id]);
  }

  protected deleteCliente(id: number): void {
    const confirmed = window.confirm('Deseas eliminar este cliente?');

    if (!confirmed) {
      return;
    }

    this.deletingId.set(id);
    this.error.set(null);

    this.clienteService.deleteCliente(id).subscribe({
      next: () => {
        this.clientes.update((clientes) => clientes.filter((cliente) => cliente.id !== id));
        this.deletingId.set(null);
      },
      error: () => {
        this.error.set('No se pudo eliminar el cliente.');
        this.deletingId.set(null);
      }
    });
  }
}
