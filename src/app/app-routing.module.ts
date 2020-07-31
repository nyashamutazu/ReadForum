import { CategoriesModule } from './categories/categories.module';
import { SettingsModule } from './settings/settings.module';
import { ProfileModule } from './profile/profile.module';
import { EditorModule } from './editor/editor.module';
import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';
import { ArticleModule } from './article/article.module';
import { SearchedModule } from './searched/searched.module';

const routes: Routes = [
  {
    path: 'article',
    loadChildren: () => ArticleModule,
  },
  {
    path: 'settings',
    loadChildren: () => SettingsModule,
  },
  {
    path: 'profile',
    loadChildren: () => ProfileModule,
  },
  {
    path: 'editor',
    loadChildren: () => EditorModule,
  },
  {
    path: 'trending',
    loadChildren: () => CategoriesModule,
  },
  {
    path: 'search',
    loadChildren: () => SearchedModule,
  }
];


@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules, scrollPositionRestoration: 'enabled'})
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}


