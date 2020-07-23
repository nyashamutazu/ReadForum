import { NoAuthGuard } from './no-auth.guard';
import { AuthComponent } from './auth.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule, Router } from '@angular/router';

// const routes: Routes = [
//   {
//     path: 'sign-in',
//     component: AuthComponent
//   },
//   { path: 'sign-up', component: AuthComponent }
// ];

const routes: Routes = [
  {
    path: 'sign-in',
    component: AuthComponent,
    canActivate: [NoAuthGuard]
  },
  { path: 'sign-up', component: AuthComponent, canActivate: [NoAuthGuard] }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule {}
