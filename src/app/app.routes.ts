import { Routes } from '@angular/router';
import { ClienteComponent } from './web/cliente/cliente';
import { ClienteFormComponent } from './web/cliente/cliente-form/cliente-form';
import { CuentaComponent } from './web/cuenta/cuenta';
import { CuentaFormComponent } from './web/cuenta/cuenta-form/cuenta-form';
import { MovimientoComponent } from './web/movimiento/movimiento';

export const routes: Routes = [
	{ path: '', pathMatch: 'full', redirectTo: 'clientes' },
	{ path: 'clientes', component: ClienteComponent },
	{ path: 'clientes/nuevo', component: ClienteFormComponent },
	{ path: 'clientes/editar/:id', component: ClienteFormComponent },
	{ path: 'cuentas', component: CuentaComponent },
	{ path: 'cuentas/nuevo', component: CuentaFormComponent },
	{ path: 'cuentas/editar/:id', component: CuentaFormComponent },
	{ path: 'movimientos', component: MovimientoComponent }
];
