import { Component, OnInit, Input, Output } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from 'src/app/core/services/user.service';
import { EventEmitter } from '@angular/core';
import { Article, ArticlesService } from 'src/app/core';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-favourite-buttons',
  templateUrl: './favourite-buttons.component.html',
  styleUrls: ['./favourite-buttons.component.scss']
})
export class FavouriteButtonsComponent implements OnInit {
  constructor(
    private articlesService: ArticlesService,
    private router: Router,
    private userService: UserService
  ) {}

  @Input() article: Article;
  @Output() toggle = new EventEmitter<boolean>();
  isSubmitting = false;
  isUser = false;
  userSub: Subscription;

  ngOnInit(): void {
    this.userService.currentUserListner.subscribe(user => {
      this.isUser = (user.username !== this.article.author.username);
    });
  }

  onToggleLiked() {
    this.isSubmitting = true;
    this.userService.currentUserListner.subscribe(
      user => {
        if (this.article.liked) {
          this.article.liked = false;

          this.articlesService.unlike(this.article.slug).subscribe(
            response => {
              this.article.liked = false;
              this.isSubmitting = false;
            },
            err => {
              this.article.liked = true;
              this.isSubmitting = false;
            }
          );
        } else {
          this.article.liked = true;

          this.articlesService.like(this.article.slug).subscribe(
            response => {
              this.article.liked = true;
              this.isSubmitting = false;
            },
            err => {
              this.article.liked = false;
              this.isSubmitting = false;
            }
          );
        }
      },
      err => {
        console.log('Error', err);
      }
    );
  }
}
