import {DragDropModule} from '@angular/cdk/drag-drop';
import {OverlayModule} from '@angular/cdk/overlay';
import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {FlexLayoutModule} from '@angular/flex-layout';
import {MatCardModule} from '@angular/material/card';
import {MatIconModule} from '@angular/material/icon';
import {MatListModule} from '@angular/material/list';
import {GdHistoryComponent} from './history/history.component';
import {GdTooltipComponent} from './tooltip/tooltip.component';
import {GdTooltipDirective} from './tooltip/tooltip.directive';


@NgModule({
  declarations: [GdHistoryComponent, GdTooltipComponent, GdTooltipDirective],
  imports: [
    CommonModule,
    DragDropModule,
    FlexLayoutModule,
    MatCardModule,
    MatIconModule,
    OverlayModule,
    MatListModule
  ],
  exports: [GdHistoryComponent]
})
export class GdHistoryModule {
}
