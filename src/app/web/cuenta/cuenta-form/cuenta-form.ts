import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { Cuenta, CuentaDraft } from '../cuenta-model';
import { CuentaService } from '../cuenta-service';
import { Cliente } from '../../cliente/service/cliente.model';
import { ClienteService } from '../../cliente/service/cliente.service';

@Component({
  selector: 'app-cuenta-form',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './cuenta-form.html',
  styleUrl: './cuenta-form.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CuentaFormComponent {
  protected readonly saving = signal(false);
  protected readonly loading = signal(false);
  protected readonly error = signal<string | null>(null);
  protected readonly clientesError = signal<string | null>(null);
  protected readonly isEditMode = signal(false);
  protected readonly clientes = signal<Cliente[]>([]);

  private currentCuentaId: number | null = null;

  private readonly formBuilder = inject(FormBuilder);
  private readonly cuentaService = inject(CuentaService);
  private readonly clienteService = inject(ClienteService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  protected readonly form = this.formBuilder.nonNullable.group({
    numeroCuenta: ['', [Validators.required]],
    clienteId: [0, [Validators.required, Validators.min(1)]],
    saldo: [0, [Validators.required, Validators.min(0)]],
    tipoCuenta: ['', [Validators.required]],
    estado: ['', [Validators.required]]
  });

  constructor() {
    this.loadClientes();

    const idParam = this.route.snapshot.paramMap.get('id');

    if (idParam) {
      const id = Number(idParam);

      if (Number.isFinite(id)) {
        this.currentCuentaId = id;
        this.isEditMode.set(true);
        this.loadCuenta(id);
      }
    }
  }

  protected submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.saving.set(true);
    this.error.set(null);

    const cuenta = this.form.getRawValue() as CuentaDraft;

    if (this.isEditMode() && this.currentCuentaId === null) {
      this.error.set('No se encontró el id de la cuenta para editar.');
      this.saving.set(false);
      return;
    }

    const request = this.isEditMode()
      ? this.cuentaService.updateCuenta(this.currentCuentaId as number, cuenta)
      : this.cuentaService.createCuenta(cuenta);

    request.subscribe({
      next: () => {
        this.saving.set(false);
        void this.router.navigate(['/cuentas']);
      },
      error: () => {
        this.error.set('No se pudo guardar la cuenta.');
        this.saving.set(false);
      }
    });
  }

  protected fieldInvalid(fieldName: keyof CuentaDraft): boolean {
    const control = this.form.controls[fieldName];
    return control.invalid && (control.touched || control.dirty);
  }

  private loadCuenta(id: number): void {
    this.loading.set(true);
    this.error.set(null);

    this.cuentaService.getCuentaById(id).subscribe({
      next: (cuenta) => {
        if (!cuenta) {
          this.error.set('No se encontró la cuenta.');
          this.loading.set(false);
          return;
        }

        this.form.setValue({
          numeroCuenta: cuenta.numeroCuenta,
          clienteId: cuenta.clienteId,
          saldo: cuenta.saldo,
          tipoCuenta: cuenta.tipoCuenta,
          estado: cuenta.estado
        });
        this.loading.set(false);
      },
      error: () => {
        this.error.set('No se pudo cargar la cuenta.');
        this.loading.set(false);
      }
    });
  }

  private loadClientes(): void {
    this.clientesError.set(null);

    this.clienteService.getClientes().subscribe({
      next: (clientes) => {
        this.clientes.set(clientes);
      },
      error: () => {
        this.clientesError.set('No se pudo cargar la lista de clientes.');
      }
    });
  }
}
