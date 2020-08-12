import { Component, OnInit, Input, HostListener, ElementRef, ComponentFactoryResolver } from '@angular/core';
import { EditorControllerService, EditorParserService, EditorIconService, defaultButtons } from 'src/app/core';

let instanceCounter = 0;

@Component({
  selector: 'app-text-editor',
  templateUrl: './text-editor.component.html',
  styleUrls: ['./text-editor.component.scss']
})

export class TextEditorComponent {
  @Input()
  row: number;

  @Input()
  placeholder: string;

  @Input()
  public buttons: Array<string> = defaultButtons;

  // implentation of ControlValueAccessor:
  protected changed = new Array<(value: string) => void>();
  protected clickOngoing = false;

  public passthrough: string;
  public uiId;
  public uiVisible;

  @HostListener('focusout', ['$event'])
  public blur(event: any) {
    if (!this.clickOngoing) {
      this.uiVisible = false;
    }
  }

  @HostListener('mousedown', ['$event'])
  public mousedown(event: any) {
    this.clickOngoing = true;
  }

  @HostListener('mouseup', ['$event'])
  public mouseup(event: any) {
    this.clickOngoing = false;
  }

  @HostListener('focusin', ['$event'])
  public focus(event: any) {
    this.uiVisible = true;
    // console.info('boostrap focus!');
  }

  constructor(
    el: ElementRef,
    controller: EditorControllerService,
    parser: EditorParserService,
    icon: EditorIconService,
    factoryResolver: ComponentFactoryResolver
  ) {
    this.uiId = 'editor-' + instanceCounter++;
  }

  public writeValue(value: string) {
    this.passthrough = value;
  }

  public registerOnChange(fn: (value: string) => void) {
    this.changed.push(fn);
  }

  public registerOnTouched(fn: () => void) {}

  // change callback
  public onChange(value) {
    this.passthrough = value;
    this.changed.forEach(f => f(value));
  }

}
