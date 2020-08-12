import { Injectable } from '@angular/core';
import { EditorType, EditorCommand } from '../models';
import { Subject } from 'rxjs';
import { EditorDropdownComponent } from 'src/app/editor/editor-dropdown/editor-dropdown.component';

@Injectable({
  providedIn: 'root'
})
export class EditorControllerService {
  protected inlineActionMapping: any = {};

  protected commandsPipe = {
    default: new Subject<EditorCommand>()
  };

  protected enabledActions = {
    default: new Subject<any>()
  };

  protected actionMapping = {
    bold : {
      command: 'bold',
      name: 'Bold',
      detect: EditorType.BOLD
    },
    italic : {
      command: 'italic',
      name: 'Italic',
      detect: EditorType.ITALIC
    },
    underline : {
      command: 'underline',
      name: 'Underlined',
      detect: EditorType.UNDERLINE
    },
    strike : {
      command: 'strikeThrough',
      name: 'Strike Through',
      detect: EditorType.STRIKETHROUGH
    },
    subscript : {
      command: 'subscript',
      name: 'Subscript',
      label: 'sub',
      detect: EditorType.SUBSCRIPT
    },
    superscript : {
      command: 'superscript',
      name: 'Superscript',
      label: 'sup',
      detect: EditorType.SUPERSCRIPT
    },
    heading1 : {
      command: 'formatBlock',
      value: 'H1',
      name: '1st Header',
      label: 'h1',
      detect: EditorType.HEADER1
    },
    heading2 : {
      command: 'formatBlock',
      value: 'H2',
      name: '2nd Header',
      label: 'h2',
      detect: EditorType.HEADER2
    },
    heading3 : {
      command: 'formatBlock',
      value: 'H3',
      name: '3rd Header',
      label: 'h3',
      detect: EditorType.HEADER3
    },
    heading4 : {
      command: 'formatBlock',
      value: 'H4',
      name: '4th Header',
      label: 'h4',
      detect: EditorType.HEADER4
    },
    heading5 : {
      command: 'formatBlock',
      value: 'H5',
      name: '5th Header',
      label: 'h5',
      detect: EditorType.HEADER5
    },
    heading6 : {
      command: 'formatBlock',
      value: 'H6',
      name: '6th Header',
      label: 'h6',
      detect: EditorType.HEADER6
    },
    normal : {
      command: 'formatBlock',
      value: 'DIV',
      name: 'Normal',
      label: 'p',
    },
    indent : {
      command: 'indent',
      name: 'Indent',
    },
    outdent : {
      command: 'outdent',
      name: 'Outdent',
    },
    ordered : {
      command: 'insertOrderedList',
      name: 'Ordered List',
      detect: EditorType.ORDERED_LIST
    },
    unordered : {
      command: 'insertUnorderedList',
      name: 'Unorder List',
      detect: EditorType.UNORDERED_LIST
    },
    center : {
      command: 'justifyCenter',
      name: 'Center',
      detect: EditorType.ALIGN_CENTER
    },
    justify : {
      command: 'justifyFull',
      name: 'Justify',
      detect: EditorType.JUSTIFY
    },
    left : {
      command: 'justifyLeft',
      name: 'Left',
      detect: EditorType.ALIGN_LEFT
    },
    right : {
      command: 'justifyRight',
      name: 'Right',
      detect: EditorType.ALIGN_RIGHT
    },
    undo : {
      command: 'undo',
      name: 'Undo',
    },
    redo : {
      command: 'redo',
      name: 'Redo',
    },
    clean : {
      command: 'removeFormat',
      name: 'Remove Formating',
    },
    link : {
      command: 'createLink',
      undo: 'unlink',
      name: 'Link',
      detect: EditorType.LINK,
      dropdown: EditorDropdownComponent
    }
  };

  constructor() {}

  public registerAction(name: string, action: any) {
    if (this.actionMapping[name]) {
      throw new Error('An action with the name "' + name + '" already exists!');
    } else {
      this.actionMapping[name] = action;
    }
  }
  public getAction(actionName): boolean | any {
    return this.actionMapping[actionName] || false;
  }

  public registerInlineAction(name: string, action: any) {
    if (this.inlineActionMapping[name]) {
      throw new Error('An inline action with the name "' + name + '" already exists!');
    } else {
      this.inlineActionMapping[name] = action;
    }
  }
   public getInlineAction(context: string): boolean | any {
    for (const action of Object.keys(this.inlineActionMapping)) {
      const match = this.inlineActionMapping[action].regexp.exec(context);
      if (match) {
        this.inlineActionMapping[action].matched = match[1];
        return this.inlineActionMapping[action];
      }
    }
    return false;
  }


  public channel(channelId) {
    if (!this.commandsPipe[channelId]) {
      this.commandsPipe[channelId] = new Subject<EditorCommand>();
    }
    return this.commandsPipe[channelId];
  }

  public enabled(channelId) {
    if (!this.enabledActions[channelId]) {
      this.enabledActions[channelId] = new Subject<any>();
    }
    return this.enabledActions[channelId];
  }

  public enableActions(channelId, nodes) {
    const actions: Array<any> = [];
    for (const node of nodes) {
      for (const action in this.actionMapping) {
        if (this.actionMapping[action].detect && this.actionMapping[action].detect === node.type) {
          actions.push({action, value: node.value});
        } else if (this.actionMapping[action].detect && typeof this.actionMapping[action].detect === 'function') {
          const detected = this.actionMapping[action].detect(node);
          if (detected) {
            actions.push({action, value: detected.value});
          }
        }
      }
    }
    this.enabledActions[channelId].next(actions);
  }


  public do(channel, action, value?) {
    if (this.actionMapping[action].dropdown && !value) {
      if (this.actionMapping[action].undo) {
        this.commandsPipe[channel].next({name: this.actionMapping[action].undo, value: this.actionMapping[action].value || value});
      } else {
        throw new Error('Action "' + action + '"doesn\'t have a undo command');
      }
    } else {
      if (this.actionMapping[action].value && (typeof this.actionMapping[action].value === 'function')) {
        this.commandsPipe[channel].next({name: this.actionMapping[action].command, value: this.actionMapping[action].value(value)});
      } else {
        this.commandsPipe[channel].next({name: this.actionMapping[action].command, value: this.actionMapping[action].value || value});
      }
    }
  }

  public doInline(channel, action, value?) {
    if (action.dropdown && !value) {
      if (action.undo) {
        this.commandsPipe[channel].next({name: action.undo, value: action.value || value});
      } else {
        throw new Error('Action "' + action + '"doesn\'t have a undo command');
      }
    } else {
      if (action.value && (typeof action.value === 'function')) {
        this.commandsPipe[channel].next({name: action.command, value: action.value(value)});
      } else {
        this.commandsPipe[channel].next({name: action.command, value: action.value || value});
      }
    }
  }

  public undo(channel, action, value?) {
    const mapping = this.actionMapping[action].undo;
    // TODO
  }
}
