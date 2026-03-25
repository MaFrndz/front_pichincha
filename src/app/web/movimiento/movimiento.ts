import { CurrencyPipe, DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';

import { Movimiento } from './movimiento-model';
import { MovimientoService } from './movimiento-service';

@Component({
  selector: 'app-movimiento',
  imports: [CurrencyPipe, DatePipe],
  templateUrl: './movimiento.html',
  styleUrl: './movimiento.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MovimientoComponent {
  protected readonly movimientos = signal<Movimiento[]>([]);
  protected readonly loading = signal(true);
  protected readonly error = signal<string | null>(null);

  private readonly movimientoService = inject(MovimientoService);

  constructor() {
    this.loadMovimientos();
  }

  private loadMovimientos(): void {
    this.loading.set(true);
    this.error.set(null);

    this.movimientoService.getMovimientos().subscribe({
      next: (movimientos) => {
        this.movimientos.set(movimientos);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('No se pudo cargar la lista de movimientos.');
        this.loading.set(false);
      }
    });
  }
}
