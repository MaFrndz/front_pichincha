export interface Movimiento {
  id: number;
  cuentaId: number;
  tipo: string;
  monto: number;
  fecha: string;
  nombreCliente: string;
  numeroCuenta: string;
  tipoCuenta: string;
  saldoInicial: number;
  estado: string;
  saldoDisponible: number;
}
