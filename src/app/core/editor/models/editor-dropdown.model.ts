import { EventEmitter } from '@angular/core';

export interface EditorDropdown {
  value: any;
  valueChange: EventEmitter<any>;
  selectNext: () => void;
  selecPrevious: () => void;
  confirmSelection: () => void;
}
