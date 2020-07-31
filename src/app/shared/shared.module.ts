import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


import { ListErrorsComponent } from './list-errors/list-errors.component';
import { ArticleListComponent, ArticleMetaComponent, ArticlePreviewComponent } from './article';
import { FavouriteButtonsComponent, FollowButtonsComponent } from './buttons';
import { SidebarComponent } from './layout/sidebar/sidebar.component';
import { ShowAuthedDirective } from './directives';
import { OnClickComponent } from './on-click/on-click.component';
import { ProfileListComponent } from './profile/profile-list/profile-list.component';
import { ProfileMetaComponent } from './profile/profile-meta/profile-meta.component';
import { ProfilePreviewComponent } from './profile/profile-preview/profile-preview.component';


@NgModule({
  declarations: [
    ArticleListComponent,
    ArticleMetaComponent,
    ArticlePreviewComponent,
    FavouriteButtonsComponent,
    FollowButtonsComponent,
    ListErrorsComponent,
    ShowAuthedDirective,
    OnClickComponent,
    ProfileListComponent,
    ProfileMetaComponent,
    ProfilePreviewComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    RouterModule
  ],
  exports: [
    ArticleListComponent,
    ArticleMetaComponent,
    ArticlePreviewComponent,
    CommonModule,
    FavouriteButtonsComponent,
    FollowButtonsComponent,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    ListErrorsComponent,
    RouterModule,
    ShowAuthedDirective,
    OnClickComponent,
    ProfileListComponent,
    ProfileMetaComponent,
    ProfilePreviewComponent,
  ]
})

export class SharedModule {}
