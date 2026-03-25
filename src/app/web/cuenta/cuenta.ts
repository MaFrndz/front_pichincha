import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { CurrencyPipe } from '@angular/common';

import { Cuenta } from './cuenta-model';
import { CuentaService } from './cuenta-service';

@Component({
  selector: 'app-cuenta',
  imports: [CurrencyPipe],
  templateUrl: './cuenta.html',
  styleUrl: './cuenta.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CuentaComponent {
  protected readonly cuentas = signal<Cuenta[]>([]);
  protected readonly loading = signal(true);
  protected readonly error = signal<string | null>(null);

  private readonly cuentaService: CuentaService = inject(CuentaService);

  constructor() {
    this.loadCuentas();
  }

  private loadCuentas(): void {
    this.loading.set(true);
    this.error.set(null);

    this.cuentaService.getCuentas().subscribe({
      next: (cuentas: Cuenta[]) => {
        this.cuentas.set(cuentas);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('No se pudo cargar la lista de cuentas.');
        this.loading.set(false);
      }
    });
  }
}
