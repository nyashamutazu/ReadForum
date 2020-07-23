import { Subscription } from 'rxjs';
import {
  Directive,
  TemplateRef,
  ViewContainerRef,
  OnInit,
  Input,
  OnDestroy
} from '@angular/core';

import { UserService } from '../core';

@Directive({
  selector: '[appShowAuthed]'
})
export class ShowAuthedDirective implements OnInit, OnDestroy {
  constructor(
    private templeRef: TemplateRef<any>,
    private userService: UserService,
    private viewContainer: ViewContainerRef,
  ) {}

  condition: boolean;
  userSub: Subscription;

  ngOnInit() {
    // const isAuthenticated = this.userService.getIsAuthenticated();
    // this.authenticate(isAuthenticated);
    this.userSub = this.userService.isAuthenticatedListner.subscribe(isAuthed => {
      this.authenticate(isAuthed);
    });
  }

  @Input() set appShowAuthed(condition: boolean) {
    this.condition = condition;
  }

  ngOnDestroy(): void {
    this.userSub.unsubscribe();
  }

  private authenticate(isAuthenticated) {
    if (
      (isAuthenticated && this.condition) ||
      (!isAuthenticated && !this.condition)
    ) {
      this.viewContainer.clear();
      this.viewContainer.createEmbeddedView(this.templeRef);
    } else {
      this.viewContainer.clear();
    }
  }
}
