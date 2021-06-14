import {AfterViewInit, Component, OnDestroy, ViewChild} from '@angular/core';
import {Gideon} from '../../lib/gideon';

@Component({
  template: ''
})
export abstract class TrackedComponent implements AfterViewInit, OnDestroy {

  @ViewChild('container') container;

  protected constructor(private gideon: Gideon) {
  }

  ngAfterViewInit(): void {
    console.log(this.container)
    this.gideon.registerElement(this.container.nativeElement);
  }

  ngOnDestroy(): void {
    this.gideon.stopReplay();
  }

}
