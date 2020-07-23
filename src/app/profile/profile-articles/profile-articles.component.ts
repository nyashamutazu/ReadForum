import { Subscription } from 'rxjs';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { ArticleListConfig } from './../../core/models/article-list-config.model';
import { Component, OnInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-profile-articles',
  templateUrl: './profile-articles.component.html',
  styleUrls: ['./profile-articles.component.scss']
})
export class ProfileArticlesComponent implements OnInit, OnDestroy {


  constructor(private route: ActivatedRoute) { }
  username: string;
  myListConfig: ArticleListConfig = {
    type: '',
    filters: {}
  };

  routeSub: Subscription;

  ngOnInit(): void {
    this.routeSub = this.route.paramMap.subscribe((paramMap: ParamMap) => {
      console.log("Changed in Profile Articles")

      this.username = paramMap.get('username');
      this.myListConfig.filters.author = this.username;
      console.log('Changed route');
    });
  }

  ngOnDestroy(): void {
    this.routeSub.unsubscribe();
  }
}
