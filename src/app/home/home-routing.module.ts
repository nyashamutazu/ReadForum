import { HomeAuthResolver } from './home-auth-resolver.service';
import { HomeComponent } from './home.component';
import { Routes, Router, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';

// const routes: Routes = [
//   {path: '', component: HomeComponent, resolve: {
//     isAuthenticaed: HomeAuthResolver
//   }}
// ];

const routes: Routes = [
  {path: '', component: HomeComponent}
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule { }
