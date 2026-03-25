export interface Cuenta {
  id: number;
  numeroCuenta: string;
  clienteId: number;
  saldo: number;
  tipoCuenta: string;
  estado: string;
}

export type CuentaDraft = Omit<Cuenta, 'id'>;
