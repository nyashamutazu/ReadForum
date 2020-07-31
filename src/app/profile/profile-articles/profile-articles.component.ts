import { Subscription } from 'rxjs';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { ArticleListConfig } from './../../core/models/article-list-config.model';
import { Component, OnInit, Input } from '@angular/core';
import { ProfilesService } from 'src/app/core';

@Component({
  selector: 'app-profile-articles',
  templateUrl: './profile-articles.component.html',
  styleUrls: ['./profile-articles.component.scss']
})
export class ProfileArticlesComponent implements OnInit {


  constructor(private route: ActivatedRoute, private profileService: ProfilesService) { }

  title: string;
  myListConfig: ArticleListConfig = {
    type: '',
    filters: {}
  };

  routeSub: Subscription;

  ngOnInit(): void {
    this.route.paramMap.subscribe((paramMap: ParamMap) => {

      this.myListConfig = {
        type: '',
        filters: {}
      };
      this.myListConfig.filters.author = paramMap.get('username');
    });
  }
}

