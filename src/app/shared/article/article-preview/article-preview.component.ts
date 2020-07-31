

import { Component, OnInit, Input } from '@angular/core';
import { Article, UserService } from 'src/app/core';

@Component({
  selector: 'app-article-preview',
  templateUrl: './article-preview.component.html',
  styleUrls: ['./article-preview.component.scss']
})
export class ArticlePreviewComponent implements OnInit {
  @Input() article: Article;
  isUser = false;

  constructor(private userService: UserService) { }

  ngOnInit(): void {
    this.userService.currentUserListner.subscribe(user => {
      if (user && user.username !== this.article.author.username) {
        this.isUser = (user.username !== this.article.author.username);
      }
    });
  }

  onToggleLiked(liked: boolean) {
    console.log(`Like is now ${liked}`);
  }

}
