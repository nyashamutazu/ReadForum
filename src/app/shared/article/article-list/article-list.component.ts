import { Subscription } from 'rxjs';

import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { Article, ArticlesService, ArticleListConfig } from 'src/app/core';

@Component({
  selector: 'app-article-list',
  templateUrl: './article-list.component.html',
  styleUrls: ['./article-list.component.scss']
})
export class ArticleListComponent {
  constructor(private articleService: ArticlesService) {}

  querySub: Subscription;


  @Input() limit: number;
  @Input() set listConfig(config: ArticleListConfig) {
    if (config) {
      this.query = config;
      this.currentPage = 1;
      this.searchQuery();
    }
  }

  query: ArticleListConfig;
  articles: Article[] = [];
  isLoading = false;
  currentPage = 1;
  totalPages: Array<number> = [1];


  // ngOnInit(): void {
  //   this.isLoading = true;

  //   this.querySub = this.articleService.query(this.query).subscribe(data => {
  //     this.articles = data.articles;
  //     this.isLoading = false;
  //   }, err => console.log('Error'));
  // }

  searchQuery() {
    console.log('Searching Query');

    this.isLoading = true;

    if (this.limit) {
      this.query.filters.limit = this.limit;
      this.query.filters.offset = (this.limit * (this.currentPage - 1));
    }

    this.articleService.query(this.query).subscribe(data => {
      console.log(data.articles);
      this.articles = data.articles;
      this.isLoading = false;
    }, err => console.log('Error'));
  }

  // ngOnDestroy(): void {
  //   this.querySub.unsubscribe();
  // }
}
