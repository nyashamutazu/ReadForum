import { SafeHtml, DomSanitizer } from '@angular/platform-browser';
import {
  Component,
  SimpleChanges,
  Input,
  ViewRef,
  ElementRef,
  ComponentFactoryResolver,
  HostListener,
  ViewChild,
  ViewContainerRef,
  OnChanges,
  AfterViewInit,
  OnInit
} from '@angular/core';

import { Subscription } from 'rxjs';
import { EditorControllerService, EditorParserService, EditorIconService, EditorLegacyBrowserService, defaultButtons } from 'src/app/core';

@Component({
  selector: 'app-editor-view',
  templateUrl: './editor-view.component.html',
  styleUrls: ['./editor-view.component.scss']
})
export class EditorViewComponent implements OnChanges, AfterViewInit {
  constructor(
    protected el: ElementRef,
    public editorControllerService: EditorControllerService,
    public editorParserService: EditorParserService,
    public icon: EditorIconService,
    public sanitizer: DomSanitizer,
    protected factoryResolver: ComponentFactoryResolver,
    protected editorLegacyBrowserService: EditorLegacyBrowserService,
  ) {}

  @Input() buttons: Array<string> = defaultButtons;
  editorButtons: SafeHtml[];

  @Input() public uiId = 'default';

  public enabled: any = {};
  public dropdownAction: boolean | string = false;
  public dropdownValue: string;
  protected dropdownComponent: ViewRef;
  protected inputSubscription: Subscription;

  @ViewChild('dropdown', { read: ViewContainerRef, static: true })
  viewContainerRef: ViewContainerRef;

  @HostListener('mousedown', ['$event'])
  public mouseDown(event) {
    if (
      !this.editorLegacyBrowserService.findParent(
        event.target,
        '.editor__dropdown'
      )
    ) {
      event.preventDefault();
    }
  }

  @HostListener('keyup', ['$event'])
  public keyUp(event) {
    if (event.key === 'Enter') {
      const name = event.target.name;
      if (name) {
        this.do(event, name);
      }
    }
  }

  // ngOnInit(): void {
  //   this.buttons = defaultButtons;
  // }

  public do(event, action) {
    event.preventDefault();

    event.stopPropagation();

    if (this.editorControllerService.getAction(action).dropdown) {
      if (action === this.dropdownAction) {
        this.dropdownAction = false;
      } else {
        let button = event.target;
        if (!button.classList.contains('editor__button')) {
          button = this.editorLegacyBrowserService.findParent(
            button,
            '.editor__button'
          );
        }
        if (!button) {
          return;
        }

        const dropdown = this.el.nativeElement.querySelector(
          '.editor__dropdown'
        );

        // Enable the dropdown

        this.dropdownValue = this.enabled[action];
        // console.log('action has value', button, dropdown, this.dropdownValue);
        this.initDropdown(
          this.editorControllerService.getAction(action).dropdown,
          this.dropdownValue
        );

        // Postion the dropdown
        setTimeout(() => {
          const buttonSize = button.getBoundingClientRect();
          const dropdownSize = dropdown.getBoundingClientRect();
          let leftPosition =
            button.offsetLeft + buttonSize.width / 2 - dropdownSize.width / 2;
          // make sure the dropdown is not bleeding out of the viewport
          if (
            buttonSize.left +
              window.pageXOffset +
              buttonSize.width / 2 -
              dropdownSize.width / 2 <
            3
          ) {
            leftPosition =
              -buttonSize.left - window.pageXOffset + button.offsetLeft + 3;
          } else if (
            buttonSize.left +
              window.pageXOffset +
              buttonSize.width / 2 +
              dropdownSize.width / 2 >
            window.innerWidth - 3
          ) {
            leftPosition =
              window.innerWidth -
              buttonSize.left -
              window.pageXOffset +
              button.offsetLeft -
              dropdownSize.width -
              3;
          }
          const topPosition = button.offsetTop + buttonSize.height - 3;
          dropdown.style.left = leftPosition + 'px';
          dropdown.style.top = topPosition + 'px';
          // make the dropdown visible
          this.dropdownAction = action;
        }, 0);
      }
    } else {
      this.dropdownAction = false;
      this.editorControllerService.do(this.uiId, action);
    }
  }

  protected getOffset(element) {
    let top = 0;
    let left = 0;
    do {
      top += element.offsetTop || 0;
      left += element.offsetLeft || 0;
      element = element.offsetParent;
    } while (element);

    return {
      top,
      left
    };
  }

  protected initDropdown(actionComponent, value) {
    if (this.dropdownComponent) {
      this.dropdownComponent.destroy();
    }
    const factory = this.factoryResolver.resolveComponentFactory(
      actionComponent
    );
    const component: any = factory.create(this.viewContainerRef.parentInjector);
    if (component.instance.valueChange) {
      component.instance.value = value;
      component.instance.valueChange.subscribe(newValue => {
        this.dropdownValue = newValue;
        this.editorControllerService.do(
          this.uiId,
          this.dropdownAction,
          newValue
        );
      });
      this.dropdownComponent = this.viewContainerRef.insert(component.hostView);
    } else {
      console.log(
        'The component used as a dropdown doesn\'t contain a valueChange emmiter!'
      );
    }
  }

  public ngOnChanges(changes) {
    if (changes.uiId) {
      if (this.inputSubscription) {
        this.inputSubscription.unsubscribe();
      }
      this.inputSubscription = this.editorControllerService
        .enabled(this.uiId)
        .subscribe((actions: any) => {
          this.enabled = {};
          for (const action of actions) {
            this.enabled[action.action] = action.value || true;
          }
        });
    }
  }

  public ngAfterViewInit() {
    const handle = window.addEventListener('mousedown', event => {
      if (
        !this.editorLegacyBrowserService.findParent(
          (event.target as Element),
          '.editor__dropdown'
        )
      ) {
        this.dropdownAction = false;
      }
    });
  }
}
