import { SearchedComponent } from './searched.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: 'account',
    component: SearchedComponent
  },
  {
    path: 'trending',
    component: SearchedComponent
  },
  {
    path: 'article',
    component: SearchedComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SearchedRoutingModule {}
