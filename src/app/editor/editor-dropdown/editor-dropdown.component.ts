import { Component, Input, Output, EventEmitter } from '@angular/core';
import { EditorDropdown } from 'src/app/core';

@Component({
  selector: 'app-editor-dropdown',
  templateUrl: './editor-dropdown.component.html',
  styleUrls: ['./editor-dropdown.component.scss']
})
export class EditorDropdownComponent implements EditorDropdown {

  @Input()
  public value: string;

  @Output()
  public valueChange = new EventEmitter<string>();

  public changeValue(value) {
    this.value = value;
    this.valueChange.emit(value);
  }

  public selectNext() {}
  public selecPrevious() {}
  public confirmSelection() {}
}
