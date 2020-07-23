import { ProfileRoutingModule } from './profile-routing.module';
import { ProfileResolverService } from './profile-resolver.service';
import { SharedModule } from './../shared/shared.module';
import { ProfileComponent } from './profile.component';
import { NgModule } from '@angular/core';
import { ProfileArticlesComponent } from './profile-articles/profile-articles.component';
import { ProfileFavouritesComponent } from './profile-favourites/profile-favourites.component';

@NgModule({
  declarations: [
    ProfileComponent,
    ProfileArticlesComponent,
    ProfileFavouritesComponent
  ],
  imports: [SharedModule, ProfileRoutingModule],
  providers: [ProfileResolverService]
})
export class ProfileModule {}
