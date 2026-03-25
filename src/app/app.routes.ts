import { Routes } from '@angular/router';
import { ClienteComponent } from './web/cliente/cliente';
import { CuentaComponent } from './web/cuenta/cuenta';
import { MovimientoComponent } from './web/movimiento/movimiento';

export const routes: Routes = [
	{ path: '', pathMatch: 'full', redirectTo: 'clientes' },
	{ path: 'clientes', component: ClienteComponent },
	{ path: 'cuentas', component: CuentaComponent },
	{ path: 'movimientos', component: MovimientoComponent }
];
