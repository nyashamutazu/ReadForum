import { SearchedComponent } from './searched.component';
import { SearchedRoutingModule } from './searched-routing.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';



@NgModule({
  declarations: [SearchedComponent],
  imports: [
    SharedModule,
    SearchedRoutingModule
  ]
})
export class SearchedModule { }
