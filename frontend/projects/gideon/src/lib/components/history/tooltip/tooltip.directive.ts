import {Overlay, OverlayPositionBuilder, OverlayRef} from '@angular/cdk/overlay';
import {ComponentPortal} from '@angular/cdk/portal';
import {ComponentRef, Directive, ElementRef, HostListener, Input, OnDestroy, OnInit} from '@angular/core';
import {GdTooltipComponent} from './tooltip.component';

@Directive({
  selector: '[gdTooltip]'
})
export class GdTooltipDirective implements OnInit, OnDestroy {

  @Input('gdTooltip') img = '';
  private overlayRef: OverlayRef;

  constructor(private overlay: Overlay,
              private overlayPositionBuilder: OverlayPositionBuilder,
              private elementRef: ElementRef) {
  }

  ngOnInit(): void {
    const positionStrategy = this.overlayPositionBuilder
        .flexibleConnectedTo(this.elementRef)
        .withPositions([{
          originX: 'end',
          originY: 'center',
          overlayX: 'start',
          overlayY: 'center',
          offsetX: +8,
        }]);

    this.overlayRef = this.overlay.create({positionStrategy});
  }

  ngOnDestroy(): void {
    this.overlayRef.detach();
  }

  @HostListener('mouseenter')
  show(): void {
    const tooltipRef: ComponentRef<GdTooltipComponent> = this.overlayRef.attach(new ComponentPortal(GdTooltipComponent));
    tooltipRef.instance.img = this.img;
  }

  @HostListener('mouseout')
  hide(): void {
    this.overlayRef.detach();
  }

}
