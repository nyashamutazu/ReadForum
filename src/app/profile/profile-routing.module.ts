
import { ProfileFavouritesComponent } from './profile-favourites/profile-favourites.component';
import { ProfileArticlesComponent } from './profile-articles/profile-articles.component';
import { ProfileResolverService } from './profile-resolver.service';
import { ProfileComponent } from './profile.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: ':username',
    component: ProfileComponent,
    children: [
      { path: '', component: ProfileArticlesComponent },
      { path: 'likes', component: ProfileFavouritesComponent }
    ]
  }
];


// const routes: Routes = [
//   {
//     path: ':username',
//     component: ProfileComponent,
//     resolve: { profile: ProfileResolverService },
//     children: [
//       { path: '', component: ProfileArticlesComponent },
//       { path: 'favourites', component: ProfileFavouritesComponent }
//     ]
//   }
// ];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProfileRoutingModule {}
