import { Component, OnInit, ElementRef, HostListener } from '@angular/core';

@Component({
  selector: 'app-on-click',
  templateUrl: './on-click.component.html',
  styleUrls: ['./on-click.component.scss']
})
export class OnClickComponent implements OnInit {
  shower = false;
  constructor(private elementRef: ElementRef) { }

  ngOnInit(): void {
  }

  @HostListener('document:click', ['$event.target'])

  public onClick(target) {
    const clickedInside = this.elementRef.nativeElement.contains(target);
    if (clickedInside) {
      this.shower = true;
    } else {
      this.shower = false;
    }
  }
}
