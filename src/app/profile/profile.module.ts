import { ProfileRoutingModule } from './profile-routing.module';
import { SharedModule } from './../shared/shared.module';
import { ProfileComponent } from './profile.component';
import { NgModule } from '@angular/core';
import { ProfileArticlesComponent } from './profile-articles/profile-articles.component';
import { ProfileListsComponent } from './profile-lists/profile-lists.component';
import { ProfileMutliPurposeComponent } from './profile-mutli-purpose/profile-mutli-purpose.component';
import { ProfileFollowersComponent } from './profile-followers/profile-followers.component';

@NgModule({
  declarations: [
    ProfileComponent,
    ProfileArticlesComponent,
    ProfileListsComponent,
    ProfileMutliPurposeComponent,
    ProfileFollowersComponent
  ],
  imports: [SharedModule, ProfileRoutingModule],
  providers: []
})
export class ProfileModule {}
