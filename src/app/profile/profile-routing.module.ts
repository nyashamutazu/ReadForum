import { ProfileFollowersComponent } from './profile-followers/profile-followers.component';
import { ProfileMutliPurposeComponent } from './profile-mutli-purpose/profile-mutli-purpose.component';
import { ProfileListsComponent } from './profile-lists/profile-lists.component';
import { ProfileArticlesComponent } from './profile-articles/profile-articles.component';
import { ProfileComponent } from './profile.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: ':username',
    component: ProfileComponent,
    children: [
      { path: '', component: ProfileArticlesComponent },
      { path: 'liked', component: ProfileMutliPurposeComponent },
      { path: 'readLater', component: ProfileMutliPurposeComponent },
      { path: 'archived', component: ProfileMutliPurposeComponent },
      { path: 'lists', component: ProfileListsComponent },
      { path: 'followers', component: ProfileFollowersComponent },
      { path: 'following', component: ProfileFollowersComponent },

    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProfileRoutingModule {}
