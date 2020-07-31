import { SharedModule } from './../shared/shared.module';
import { CategoriesRoutingModule } from './categories-routing.module';
import { NgModule } from '@angular/core';
import { CategoriesComponent } from './categories.component';


@NgModule({
  declarations: [CategoriesComponent],
  imports: [
    SharedModule,
    CategoriesRoutingModule
  ]
})
export class CategoriesModule { }
