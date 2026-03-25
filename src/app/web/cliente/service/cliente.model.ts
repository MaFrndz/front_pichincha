export interface Cliente {
  clienteId: string;
  contrasena: string;
  estado: string;
  direccion: string;
  edad: number;
  genero: string;
  id: number;
  identificacion: string;
  nombre: string;
  telefono: string;
}

export type ClienteDraft = Omit<Cliente, 'id'>;
