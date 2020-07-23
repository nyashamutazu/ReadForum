import { Errors } from './../../core/models/errors.model';
import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-list-errors',
  templateUrl: './list-errors.component.html',
  styleUrls: ['./list-errors.component.scss']
})
export class ListErrorsComponent implements OnInit {
  formattedErrors: Array<string> = [];

  @Input() set errors(errors: Errors) {
    this.formattedErrors = Object.keys(errors.error || {}).map(
      key => `${key} ${errors.error[key]}`
    );
  }

  constructor() {}

  ngOnInit(): void {}
}
