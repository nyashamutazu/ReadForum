import { AuthRoutingModule } from './auth-routing.module';
import { AuthComponent } from './auth.component';
import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { NoAuthGuard } from './no-auth.guard';

@NgModule({
  declarations: [AuthComponent],
  imports: [SharedModule, AuthRoutingModule],
  providers: [NoAuthGuard]
})
export class AuthModule {}
