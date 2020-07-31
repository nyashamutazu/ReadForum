import { ProfileListConfig } from 'src/app/core/models/profile-list-config.model';
import {
  Article,
  UserService,
  ProfilesService,
  ArticleListConfig
} from 'src/app/core';
import { Profile } from './../core/models/profile.model';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';

@Component({
  selector: 'app-searched',
  templateUrl: './searched.component.html',
  styleUrls: ['./searched.component.scss']
})
export class SearchedComponent implements OnInit {
  constructor(
    private userService: UserService,
    private profileService: ProfilesService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  isLoading = true;
  articles: Article[] = [];
  profiles: Profile[] = [];
  searchType: string;

  profileConfig: ProfileListConfig = {
    type: '',
    filters: {}
  };

  articleConfig: ArticleListConfig = {
    type: '',
    filters: {}
  };

  ngOnInit(): void {
    this.isLoading = true;

    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      this.route.queryParams.subscribe(queryParams => {
        this.articleConfig = {
          type: '',
          filters: {}
        };

        this.profileConfig =  {
          type: '',
          filters: {}
        };

        const search = this.route.snapshot.queryParams.q;
        switch (this.route.snapshot.routeConfig.path) {
          case 'account':
            this.profileConfig.type = 'search';
            this.profileConfig.filters.username = search;
            break;
          case 'article':
            this.articleConfig.type = 'search';
            this.articleConfig.filters.title = search;
            break;
          case 'trending':
            this.articleConfig.type = '';
            this.articleConfig.filters.tag = search;
            break;
          default:
            this.router.navigate(['/']);
            break;
        }
        this.isLoading = false;
      });
    });
  }
}
