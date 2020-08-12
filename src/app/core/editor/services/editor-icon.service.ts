import { Injectable } from '@angular/core';
import { EditorIcon } from '../models';

@Injectable({
  providedIn: 'root'
})
export class EditorIconService implements EditorIcon {
  protected iconMapping: any = {
    bold: '<svg style="height: 15px; width: 15px" class="editor__icon"><use xlink:href="/assets/icon-editor.svg#icon-bold"></use></svg>',
    // tslint:disable-next-line:max-line-length
    italic: '<svg style="height: 15px; width: 15px" class="editor__icon"><use xlink:href="/assets/icon-editor.svg#icon-italic"></use></svg>',
    underline: '<svg style="height: 15px; width: 15px" class="editor__icon"><use xlink:href="/assets/icon-editor.svg#icon-underline"></use></svg>',
    strike: '<svg style="height: 15px; width: 15px" class="editor__icon"><use xlink:href="/assets/icon-editor.svg#icon-strikethrough"></use></svg>',
    subscript: '<svg style="height: 15px; width: 15px" class="editor__icon"><use xlink:href="/assets/icon-editor.svg#icon-subscript"></use></svg>',
    superscript: '<svg style="height: 15px; width: 15px" class="editor__icon"><use xlink:href="/assets/icon-editor.svg#icon-superscript"></use></svg>',
    // tslint:disable-next-line:max-line-length
    indent: '<svg style="height: 15px; width: 15px" class="editor__icon"><use xlink:href="/assets/icon-editor.svg#icon-indent"></use></svg>',
    outdent: '<svg style="height: 15px; width: 15px" class="editor__icon"><use xlink:href="/assets/icon-editor.svg#icon-dedent"></use></svg>',
    ordered: '<svg style="height: 15px; width: 15px" class="editor__icon"><use xlink:href="/assets/icon-editor.svg#icon-list-ol"></use></svg>',
    unordered: '<svg style="height: 15px; width: 15px" class="editor__icon"><use xlink:href="/assets/icon-editor.svg#icon-list-ul"></use></svg>',
    center: '<svg style="height: 15px; width: 15px" class="editor__icon"><use xlink:href="/assets/icon-editor.svg#icon-align-center"></use></svg>',
    justify: '<svg style="height: 15px; width: 15px" class="editor__icon"><use xlink:href="/assets/icon-editor.svg#icon-align-justify"></use></svg>',
    left: '<svg style="height: 15px; width: 15px" class="editor__icon"><use xlink:href="/assets/icon-editor.svg#icon-align-left"></use></svg>',
    right: '<svg style="height: 15px; width: 15px" class="editor__icon"><use xlink:href="/assets/icon-editor.svg#icon-align-right"></use></svg>',
    undo: '<svg style="height: 15px; width: 15px" class="editor__icon"><use xlink:href="/assets/icon-editor.svg#icon-rotate-left"></use></svg>',
    redo: '<svg style="height: 15px; width: 15px" class="editor__icon"><use xlink:href="/assets/icon-editor.svg#icon-repeat"></use></svg>',
    clean: '<svg style="height: 15px; width: 15px" class="editor__icon"><use xlink:href="/assets/icon-editor.svg#icon-eraser"></use></svg>',
    link: '<svg style="height: 15px; width: 15px" class="editor__icon"><use xlink:href="/assets/icon-editor.svg#icon-chain"></use></svg>',
    image: '<svg style="height: 15px; width: 15px" class="editor__icon"><use xlink:href="/assets/icon-editor.svg#icon-image"></use></svg>',
    video: '<svg style="height: 15px; width: 15px" class="editor__icon"><use xlink:href="/assets/icon-editor.svg#icon-film"></use></svg>',
    table: '<svg style="height: 15px; width: 15px" class="editor__icon"><use xlink:href="/assets/icon-editor.svg#icon-table"></use></svg>'
  };

  public getIcon(actionName) {
    return this.iconMapping[actionName] ? this.iconMapping[actionName] : null;
  }
}
