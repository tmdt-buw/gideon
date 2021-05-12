import {AfterViewInit, Component, ElementRef} from '@angular/core';
import {Gideon} from '../../lib/gideon';

@Component({
  template: ''
})
export abstract class TrackedComponent implements AfterViewInit {

  protected constructor(private gideon: Gideon, private elementRef: ElementRef) {
  }

  ngAfterViewInit(): void {
    this.gideon.registerElement(this.elementRef.nativeElement);
  }

}
