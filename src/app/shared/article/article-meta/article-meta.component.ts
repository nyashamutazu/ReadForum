import { Article } from 'src/app/core';
import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-article-meta',
  templateUrl: './article-meta.component.html',
  styleUrls: ['./article-meta.component.scss']
})
export class ArticleMetaComponent implements OnInit {
  @Input() article: Article;
  toggler: boolean;

  constructor() { }

  ngOnInit(): void {
  }

  onToggleFollowing(event: boolean) {}

}
