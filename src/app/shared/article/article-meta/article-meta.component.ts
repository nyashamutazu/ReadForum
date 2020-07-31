import { UserService } from 'src/app/core/services/user.service';
import { Article } from 'src/app/core';
import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-article-meta',
  templateUrl: './article-meta.component.html',
  styleUrls: ['./article-meta.component.scss']
})
export class ArticleMetaComponent implements OnInit {
  @Input() article: Article;
  isAuthed: boolean;

  constructor(private userService: UserService) { }

  ngOnInit(): void {
    this.userService.isAuthenticatedListner.subscribe(isAuthed => {
      this.isAuthed = isAuthed;
    });
  }

}
