import {AfterViewInit, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Gideon} from '../../lib/gideon';

@Component({
  template: ''
})
export abstract class TrackedComponent implements OnInit, AfterViewInit, OnDestroy {

  @ViewChild('container') container;

  protected constructor(private gideon: Gideon) {
  }

  ngOnInit() {
    this.reset();
  }

  ngAfterViewInit(): void {
    this.gideon.registerElement(this.container.nativeElement);
  }

  ngOnDestroy(): void {
    this.gideon.stopReplay();
  }

  reset(): void {
    console.log('reset');
  }
}
