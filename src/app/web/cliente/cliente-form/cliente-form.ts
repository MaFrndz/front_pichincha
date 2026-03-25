import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { Cliente, ClienteDraft } from '../cliente.model';
import { ClienteService } from '../cliente.service';

@Component({
  selector: 'app-cliente-form',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './cliente-form.html',
  styleUrl: './cliente-form.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ClienteFormComponent {
  protected readonly saving = signal(false);
  protected readonly loading = signal(false);
  protected readonly error = signal<string | null>(null);
  protected readonly isEditMode = signal(false);
  private currentClienteId: number | null = null;

  private readonly formBuilder = inject(FormBuilder);
  private readonly clienteService = inject(ClienteService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  protected readonly form = this.formBuilder.nonNullable.group({
    nombre: ['', [Validators.required]],
    genero: ['', [Validators.required]],
    edad: [18, [Validators.required, Validators.min(1)]],
    identificacion: ['', [Validators.required]],
    direccion: ['', [Validators.required]],
    telefono: ['', [Validators.required]],
    clienteId: ['', [Validators.required]],
    contrasena: ['', [Validators.required]],
    estado: ['', [Validators.required]]
  });

  constructor() {
    const idParam = this.route.snapshot.paramMap.get('id');

    if (idParam) {
      const id = Number(idParam);

      if (Number.isFinite(id)) {
        this.currentClienteId = id;
        this.isEditMode.set(true);
        this.loadCliente(id);
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

    const cliente = this.form.getRawValue() as ClienteDraft;
    if (this.isEditMode() && this.currentClienteId === null) {
      this.error.set('No se encontró el id del cliente para editar.');
      this.saving.set(false);
      return;
    }

    const request = this.isEditMode()
      ? this.clienteService.updateCliente(this.currentClienteId as number, cliente)
      : this.clienteService.createCliente(cliente);

    request.subscribe({
      next: () => {
        this.saving.set(false);
        void this.router.navigate(['/clientes']);
      },
      error: () => {
        this.error.set('No se pudo guardar el cliente.');
        this.saving.set(false);
      }
    });
  }

  protected fieldInvalid(fieldName: keyof ClienteDraft): boolean {
    const control = this.form.controls[fieldName];
    return control.invalid && (control.touched || control.dirty);
  }

  private loadCliente(id: number): void {
    this.loading.set(true);
    this.error.set(null);

    this.clienteService.getClienteById(id).subscribe({
      next: (cliente) => {
        if (!cliente) {
          this.error.set('No se encontró el cliente.');
          this.loading.set(false);
          return;
        }

        this.form.setValue({
          nombre: cliente.nombre,
          genero: cliente.genero,
          edad: cliente.edad,
          identificacion: cliente.identificacion,
          direccion: cliente.direccion,
          telefono: cliente.telefono,
          clienteId: cliente.clienteId,
          contrasena: cliente.contrasena,
          estado: cliente.estado
        });
        this.loading.set(false);
      },
      error: () => {
        this.error.set('No se pudo cargar el cliente.');
        this.loading.set(false);
      }
    });
  }
}