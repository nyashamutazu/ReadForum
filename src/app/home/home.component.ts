import { Subscription } from 'rxjs';
import { ArticleListConfig } from './../core/models/article-list-config.model';
import { UserService } from './../core/services/user.service';
import { TagsService } from './../core/services/tags.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  constructor(
    private router: Router,
    private tagsService: TagsService,
    private userService: UserService
  ) {}

  isAuthenticated = false;
  authSub: Subscription;

  listConfig: ArticleListConfig = {
    type: '',
    filters: {}
  };

  trendingConfig: ArticleListConfig = {
    type: 'trending',
    filters: {}
  };

  postsTitle = 'Trending';

  trending: string[];

  tagsLoaded = false;

  ngOnInit(): void {
    // After authentication
    this.authSub = this.userService.isAuthenticatedListner.subscribe(
      isAuthed => {
        this.tagsService.getAll().subscribe(tags => {
          this.trending = tags;
          this.isAuthenticated = isAuthed;
          this.postsTitle = isAuthed ? 'My Feed' : 'Trending';
          isAuthed ? this.setViewTo('feed') : this.setViewTo('');
        });

      }
    );

    // HTML - <app-article-list [limit]="10" [config]="listConfig"></app-article-list
  }

  setViewTo(value: string = '', filters: object = {}) {
    // if (value === 'feed' && !this.isAuthenticated) {
    //   this.router.navigate(['/sign-in']);
    //   return;
    // }
    console.log('Value changing to', value);

    this.listConfig = {
      type: value,
      filters
    };
  }
}
