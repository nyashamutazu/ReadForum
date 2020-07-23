import { UserService } from 'src/app/core/services/user.service';
import { Comment } from 'src/app/core';
import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';

@Component({
  selector: 'app-article-comment',
  templateUrl: './article-comment.component.html',
  styleUrls: ['./article-comment.component.scss']
})
export class ArticleCommentComponent implements OnInit {
  constructor(private userService: UserService) {}
  toggler: boolean;

  @Input() comment: Comment;
  @Output() deleteComment = new EventEmitter<boolean>();

  usersComment = false;

  ngOnInit(): void {
    this.userService.currentUserListner.subscribe(user => {
      if (user && user.username === this.comment.author.username) {
        this.usersComment = true;
      }
    });
  }

  deleteCommentClicked() {
    this.deleteComment.emit(true);
  }

  showFollow() {

  }
}
