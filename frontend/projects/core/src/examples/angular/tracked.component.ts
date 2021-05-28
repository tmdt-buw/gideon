import {Component, ElementRef, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Gideon} from '../../lib/gideon';

@Component({
  template: ''
})
export abstract class TrackedComponent implements OnInit, OnDestroy {

  protected constructor(private gideon: Gideon, private elementRef: ElementRef, private route: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {

    });
    this.gideon.registerElement(this.elementRef.nativeElement);
  }

  ngOnDestroy(): void {
    this.gideon.stopReplay();
  }

}
