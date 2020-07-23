import { UserService } from 'src/app/core/services/user.service';
import { CommentsService } from './../core/services/comments.service';
import { ArticlesService, Article } from 'src/app/core';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { User, Errors } from '../core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';

@Component({
  selector: 'app-article',
  templateUrl: './article.component.html',
  styleUrls: ['./article.component.scss']
})
export class ArticleComponent implements OnInit {
  constructor(
    private route: ActivatedRoute,
    private articleService: ArticlesService,
    private commentsService: CommentsService,
    private router: Router,
    private userService: UserService
  ) {}

  userMode = false;
  errors: Errors = { error: {} };

  liked: boolean;
  slug: string;

  isLoading = true;

  comments: Comment[];
  commentForm: FormGroup;
  commentFormErrors = {};

  article: Article;

  user: User;

  ngOnInit(): void {
    this.isLoading = true;
    this.commentForm = new FormGroup({
      comment: new FormControl(null, { validators: [Validators.required] })
    });

    this.route.paramMap.subscribe(
      (paramMap: ParamMap) => {
        if (paramMap.has('slug')) {
          this.slug = paramMap.get('slug');
          this.articleService.get(this.slug).subscribe(
            article => {
              this.userService.currentUserListner.subscribe(user => {
                this.commentsService.getAll(this.slug).subscribe(comments => {
                  this.comments = comments;
                  this.article = article;
                  this.user = user;

                  if (
                    (user && typeof user !== 'undefined' || user !== null) &&
                    user.username === this.article.author.username
                  ) {
                    this.userMode = true;
                    this.liked = this.article.liked;
                  }

                  this.isLoading = false;
                });
              });
            },

            err => {
              console.log('Failed to get article');
              this.router.navigate(['/404']);
            }
          );
        }
      },
      err => console.log('Failed to get param')
    );
  }

  onToggleFollowing(event: boolean) {
    this.article.author.following = event;
  }

  onToggleLiked(event: boolean) {
    this.article.liked = event;

    event ? this.article.likeCount++ : this.article.likeCount--;
  }

  deleteArticle() {
    this.isLoading = true;

    this.articleService.delete(this.article.slug).subscribe(response => {
      this.router.navigate(['/']);
      this.isLoading = false;
    });
  }

  addComment() {
    this.isLoading = true;
    this.commentFormErrors = {};

    if (this.commentForm.valid) {
      const comment = this.commentForm.get('comment').value;

      this.commentsService.add(this.slug, comment).subscribe(response => {
        this.commentsService.getAll(this.slug).subscribe(comments => {
          this.comments = comments;
          this.isLoading = false;
        });
      });
    }

    return;
  }

  onDeleteComment(comment: Comment) {
    this.isLoading = true;

    this.commentsService.destroy(comment.id, this.article.slug).subscribe(
      response => {
        this.comments = this.comments.filter(
          successResponse => comment !== comment
        );
        this.isLoading = false;
      },
      err => {
        this.isLoading = true;
        console.log('Failed to successfully');
      }
    );
  }
}
